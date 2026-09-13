#!/usr/bin/env node
/**
 * AniList → public.entities, with cross-catalog facts computed on the way in.
 *
 *   node scripts/ingest-anilist.mjs --dry-run --limit=200
 *   node scripts/ingest-anilist.mjs --limit=5000
 *   node scripts/ingest-anilist.mjs            # everything AniList will page
 *
 * Why this exists alongside ingest-catalog.mjs (Jikan + FreeToGame):
 *
 *   1. Jikan serves one title per request and is capped near 3 req/sec, so
 *      pulling characters, studios, tags and relations for a thousand titles
 *      is thousands of requests. AniList is GraphQL: this query returns 50
 *      titles WITH their studios, tags, relations and characters in a single
 *      request. Same data, two orders of magnitude fewer calls.
 *
 *   2. It is what makes a non-duplicate page possible. An imported synopsis
 *      is the same synopsis everyone else imported. The tags (with AniList's
 *      rank percentages), the relation graph and the character roles are the
 *      raw material scripts/derive-facts.mjs turns into statements that are
 *      true, specific to one page, and computed from a collection only this
 *      site holds.
 *
 * The repository already had src/anilist-importer.ts, which queries AniList
 * from the Worker and writes raw payloads to `source_records` — a table the
 * site never reads. That path is left alone; this one targets `entities`,
 * which is what the catalog routes actually render.
 *
 * Quality gate: the shared one in catalog-quality-gate.mjs, unchanged. A row
 * that fails it is written 'incomplete' and stays invisible to visitors and
 * to Googlebot under the existing RLS policy. Nothing is invented to fill a
 * gap.
 *
 * Needs the metadata column from
 * supabase/migrations/20260913120000_entities_metadata_jsonb.sql. Without it
 * the script still runs and still writes rows — it just cannot store the
 * extras, and says so.
 */

import { readFileSync } from "node:fs";
import { incompletenessReasons } from "./catalog-quality-gate.mjs";
import { resolveMetadataColumn } from "./metadata-column.mjs";
import { annotate } from "./derive-facts.mjs";
import { writeMatrixIndex } from "./write-matrix-index.mjs";
import { buildFacetIndex, buildComparisonIndex } from "./facet-index.mjs";

if (!globalThis.fetch) {
  console.error(`\nNeeds Node 18+ for global fetch (running ${process.version}).\n`);
  process.exit(1);
}

let createClient;
try {
  ({ createClient } = await import("@supabase/supabase-js"));
} catch (error) {
  if (error?.code === "ERR_MODULE_NOT_FOUND") {
    console.error("\nRun `npm install` from the repository root first.\n");
    process.exit(1);
  }
  throw error;
}

/* ----------------------------------------------------------- configuration */

const TABLE = "entities";
// Overridable so the whole pipeline — paging, the quality gate, the derived
// block — can be exercised against a local stub without network access.
const ANILIST_URL = process.env.ANILIST_URL || "https://graphql.anilist.co";
const PER_PAGE = 50; // AniList's documented maximum
const CONFLICT_TARGET = process.env.INGEST_CONFLICT_TARGET || "entity_type,slug";
const CHUNK_SIZE = 250; // smaller than the Jikan ingester: rows carry metadata

/**
 * AniList publishes a 90 requests/minute limit. 1.4s between calls stays
 * comfortably inside it while still paging 50 titles per request — about
 * 2,100 titles a minute, so a full catalog is minutes, not hours.
 */
const REQUEST_DELAY_MS = Number(process.env.ANILIST_DELAY_MS ?? 1400);

/** Trimmed so 20,000 rows fit in memory: the aggregate pass needs them all. */
const MAX_TAGS = 20;
const MAX_CHARACTERS = 12;
const MAX_RELATIONS = 20;

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const DRY_RUN = args.has("dry-run");
/** Refuse to write thin rows. Used in CI, where a silent degrade to rows
 *  without extras would quietly produce exactly the thin pages this
 *  pipeline exists to stop. */
const REQUIRE_METADATA = args.has("require-metadata");
const LIMIT = Number(args.get("limit") ?? 0) || Infinity;
const START_PAGE = Number(args.get("page") ?? 1) || 1;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...m) => console.log(...m);

function loadDotEnv() {
  let text;
  try {
    text = readFileSync(new URL("../.env", import.meta.url), "utf8");
  } catch {
    return false;
  }
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    let value = match[2].trim().replace(/\s+#.*$/, "");
    if (/^(".*"|'.*')$/s.test(value)) value = value.slice(1, -1);
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
  return true;
}

const chunk = (items, size) => {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

/* --------------------------------------------------------------- the query */

const QUERY = `
query ($page: Int!, $perPage: Int!) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { currentPage hasNextPage lastPage total }
    media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
      id
      idMal
      format
      status
      season
      seasonYear
      episodes
      duration
      countryOfOrigin
      averageScore
      popularity
      favourites
      siteUrl
      title { romaji english native }
      description(asHtml: false)
      startDate { year month day }
      genres
      coverImage { extraLarge large }
      bannerImage
      studios { edges { isMain node { id name isAnimationStudio } } }
      tags { name rank category isGeneralSpoiler }
      relations { edges { relationType node { id type format title { romaji english } } } }
      characters(perPage: ${MAX_CHARACTERS}, sort: FAVOURITES_DESC) {
        edges { role node { id name { full native } image { large } } }
      }
    }
  }
}`;

async function anilist(page, attempt = 1) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "user-agent": "GameCastle/1.0 (+https://gamecastle.store)",
    },
    body: JSON.stringify({ query: QUERY, variables: { page, perPage: PER_PAGE } }),
    signal: AbortSignal.timeout(30000),
  });

  if (res.status === 429 && attempt <= 5) {
    // AniList sends Retry-After in seconds; trust it over a guess.
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 1000;
    log(`  rate limited on page ${page}, waiting ${wait}ms`);
    await sleep(wait);
    return anilist(page, attempt + 1);
  }
  if (!res.ok) throw new Error(`AniList HTTP ${res.status} on page ${page}`);

  const json = await res.json();
  // GraphQL answers 200 with an errors array, so a failed query looks like a
  // success to anything that only checks the status code.
  if (json.errors?.length) {
    throw new Error(`AniList: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json.data.Page;
}

/* -------------------------------------------------------------- conversion */

const slugify = (value, id) =>
  `${id}-${String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)}`;

/**
 * AniList descriptions carry a little HTML (<br>, <i>, the occasional <b>)
 * even with asHtml: false. Stripped rather than rendered: the field is used
 * as a meta description and as page text, and escaped tags in a <meta> is
 * exactly the kind of detail that reads as a broken page.
 */
const plainText = (html) =>
  String(html ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(
      /&(nbsp|amp|lt|gt|quot|#39);/g,
      (_, e) => ({ nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e] ?? " ",
    )
    .replace(/\s+/g, " ")
    .trim();

function toRecord(media) {
  const title = media.title?.english?.trim() || media.title?.romaji?.trim() || "";
  if (!title || !media.id) return null;

  const studios = (media.studios?.edges ?? [])
    .map((e) => ({
      id: e.node?.id,
      name: e.node?.name,
      isAnimationStudio: Boolean(e.node?.isAnimationStudio),
      isMain: Boolean(e.isMain),
    }))
    .filter((s) => s.name);

  return {
    slug: slugify(title, media.id),
    name: title,
    description: plainText(media.description),
    image_url: media.coverImage?.extraLarge || media.coverImage?.large || null,
    entity_type: "anime",
    source_name: "AniList",
    source_url: media.siteUrl || `https://anilist.co/anime/${media.id}`,
    categories: Array.isArray(media.genres) ? media.genres.filter(Boolean) : [],
    meta: {
      anilistId: media.id,
      malId: media.idMal ?? null,
      format: media.format ?? null,
      status: media.status ?? null,
      season: media.season ?? null,
      seasonYear: media.seasonYear ?? null,
      episodes: media.episodes ?? null,
      duration: media.duration ?? null,
      countryOfOrigin: media.countryOfOrigin ?? null,
      averageScore: media.averageScore ?? null,
      popularity: media.popularity ?? null,
      favourites: media.favourites ?? null,
      startYear: media.startDate?.year ?? null,
      banner: media.bannerImage ?? null,
      titles: {
        romaji: media.title?.romaji ?? null,
        english: media.title?.english ?? null,
        native: media.title?.native ?? null,
      },
      studios,
      // The generic fields scripts/derive-facts.mjs reads, so anime and games
      // share one aggregate engine. The anime-shaped fields above stay for
      // display; these are what the arithmetic runs on.
      sourceId: media.id,
      score: media.averageScore ?? null,
      makers: studios.map((s) => ({
        id: s.id,
        name: s.name,
        primary: s.isMain || s.isAnimationStudio,
      })),
      cohort:
        media.season && media.seasonYear
          ? {
              key: `${media.season} ${media.seasonYear}`,
              label: `${media.season} ${media.seasonYear}`,
            }
          : null,
      size: media.episodes ? { value: media.episodes, unit: "episodes" } : null,
      // Spoiler tags are dropped outright. A page that spoils the work it is
      // describing is worse than a page missing a tag.
      tags: (media.tags ?? [])
        .filter((t) => t?.name && !t.isGeneralSpoiler)
        .slice(0, MAX_TAGS)
        .map((t) => ({ name: t.name, rank: t.rank ?? null, category: t.category ?? null })),
      relations: (media.relations?.edges ?? [])
        .filter((e) => e?.node?.type === "ANIME" && e.node.id)
        .slice(0, MAX_RELATIONS)
        .map((e) => ({
          relationType: e.relationType,
          id: e.node.id,
          format: e.node.format ?? null,
          title: e.node.title?.english?.trim() || e.node.title?.romaji?.trim() || "",
        })),
      characters: (media.characters?.edges ?? [])
        .filter((e) => e?.node?.name?.full)
        .map((e) => ({
          id: e.node.id,
          name: e.node.name.full,
          native: e.node.name.native ?? null,
          role: e.role ?? null,
          image: e.node.image?.large ?? null,
        })),
    },
  };
}

/* ---------------------------------------------------------------- database */

function makeClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("SUPABASE_URL is not set.");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for a live run.\n" +
        "public.entities has RLS with only a SELECT policy, so the publishable key cannot write.\n" +
        "Use --dry-run to exercise the API and the quality gate without any credentials.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * The same guard the Jikan ingester needs: two rows with one key inside a
 * single upsert is Postgres error 21000, "ON CONFLICT DO UPDATE command
 * cannot affect row a second time". AniList paging can repeat a title across
 * pages when the underlying list shifts between requests, so this is not
 * hypothetical. Last occurrence wins, matching upsert semantics.
 */
function dedupeByKey(rows) {
  const seen = new Map();
  for (const row of rows) seen.set(`${row.entity_type}::${row.slug}`, row);
  return [...seen.values()];
}

async function upsertRows(supabase, rows) {
  const { error } = await supabase
    .from(TABLE)
    .upsert(dedupeByKey(rows), { onConflict: CONFLICT_TARGET });
  if (error) throw new Error(`${error.message}${error.code ? ` (${error.code})` : ""}`);
}

/* -------------------------------------------------------------------- main */

async function main() {
  const loadedEnv = loadDotEnv();
  log(`AniList → ${TABLE}${DRY_RUN ? "  (dry run — nothing is written)" : ""}`);
  log(`Config: ${loadedEnv ? ".env loaded" : "no .env file"}\n`);

  let supabase = null;
  let withMetadata = false;
  if (!DRY_RUN) {
    supabase = makeClient();
    withMetadata = await resolveMetadataColumn(supabase, TABLE, {
      requireMetadata: REQUIRE_METADATA,
      log,
    });
    log("");
  }

  /* ------------------------------------------------------------- 1. fetch */

  const records = [];
  let page = START_PAGE;
  let hasNext = true;
  let reportedTotal = null;

  while (hasNext && records.length < LIMIT) {
    const data = await anilist(page);
    reportedTotal ??= data.pageInfo?.total ?? null;

    for (const media of data.media ?? []) {
      const record = toRecord(media);
      if (record) records.push(record);
      if (records.length >= LIMIT) break;
    }

    hasNext = Boolean(data.pageInfo?.hasNextPage);
    if (page % 10 === 0 || !hasNext) {
      log(`  page ${page}: ${records.length} titles collected`);
    }
    page += 1;
    if (hasNext && records.length < LIMIT) await sleep(REQUEST_DELAY_MS);
  }

  log(
    `\nFetched ${records.length} titles in ${page - START_PAGE} request(s)` +
      (reportedTotal ? ` (AniList reports ${reportedTotal} total)` : ""),
  );

  /* ------------------------------------------- 2. compute the derived block */

  // Over the whole set, not per page: a title's placement among its genre is
  // meaningless if it is only compared against the 50 titles it arrived with.
  annotate(records);
  const withFacts = records.filter((r) => Object.keys(r.meta.derived).length > 0).length;
  const withLinks = records.filter(
    (r) => r.meta.derived.similar?.length || r.meta.derived.franchise?.length,
  ).length;
  log(`Derived facts computed for ${withFacts}/${records.length} titles.`);
  log(`  ${withLinks} carry internal links (franchise chain or shared-tag neighbours).`);

  /* -------------------------------------------------------- 3. quality gate */

  let active = 0;
  const reasonCounts = new Map();
  const rows = records.map((r) => {
    const reasons = incompletenessReasons(r);
    if (reasons.length === 0) active += 1;
    for (const reason of reasons) {
      reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
    }

    const { meta, ...columns } = r;
    const row = { ...columns, status: reasons.length === 0 ? "active" : "incomplete" };
    // metadata is only sent when the column exists; PostgREST rejects the
    // whole batch for one unknown column rather than ignoring it.
    return withMetadata || DRY_RUN ? { ...row, metadata: meta } : row;
  });

  log(`\nQuality gate: ${active} active, ${rows.length - active} incomplete.`);
  for (const [reason, count] of [...reasonCounts].sort((a, b) => b[1] - a[1])) {
    log(`  ${count} × ${reason}`);
  }

  if (DRY_RUN) {
    // The matrix is reported in a dry run too: how many intersection pages a
    // catalog this size supports is the number worth knowing BEFORE writing.
    const facets = buildFacetIndex(records, "anime");
    const comparisons = buildComparisonIndex(records, "anime");
    log(
      `\nMatrix preview: ${Object.keys(facets.facets).length} facet pages ` +
        `(${facets.dropped} intersections dropped below the inventory threshold), ` +
        `${comparisons.pairs.length} comparison pages.`,
    );

    const sample = rows.find((r) => r.status === "active");
    if (sample) {
      log(`\nSample active row (${sample.slug}):`);
      log(
        JSON.stringify(
          { ...sample, description: `${(sample.description ?? "").slice(0, 90)}…` },
          null,
          1,
        ).slice(0, 2400),
      );
    }
    log("\nDry run complete — nothing written.\n");
    return;
  }

  /* -------------------------------------------------------------- 4. write */

  const batches = chunk(rows, CHUNK_SIZE);
  let written = 0;
  for (const [i, batch] of batches.entries()) {
    await upsertRows(supabase, batch);
    written += batch.length;
    log(`  chunk ${i + 1}/${batches.length} — ${written}/${rows.length} rows`);
  }

  // Built from the rows just written. Facet counts are only meaningful over
  // the whole catalog, so a partial run (--limit) produces a partial index;
  // that is why the nightly job runs without one.
  //
  // Skipped entirely without the metadata column: every facet dimension but
  // genre is queried out of metadata, so an index written now would publish
  // URLs whose row lookup cannot succeed. They would 404 rather than break,
  // but advertising pages that cannot render is worse than not having them.
  if (withMetadata) {
    await writeMatrixIndex(supabase, records, "anime", log);
  } else {
    log("Matrix index skipped — it needs the metadata column to query its facets.");
  }

  log(`\nDone. ${written} rows upserted, ${active} of them active.\n`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
