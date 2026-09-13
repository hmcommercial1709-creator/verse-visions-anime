#!/usr/bin/env node
/**
 * Manga → public.entities, from Jikan and Kitsu. Both keyless.
 *
 *   node scripts/ingest-manga.mjs --dry-run --limit=200
 *   node scripts/ingest-manga.mjs --limit=5000
 *
 * Why manga and not "more anime from more sources".
 *
 * Kitsu and Jikan both serve anime, and so does AniList, which this catalog
 * already ingests. Pulling the same titles from a second source would not
 * grow the catalog — it would create a SECOND page for every series under a
 * different slug, which is duplicate content we would be manufacturing
 * ourselves after spending this whole pipeline avoiding it. Manga is a
 * different entity type with no overlap at all, so it is real growth.
 *
 * Jikan leads because one request returns 25 entries WITH their genres,
 * themes, demographics, authors and serializations. Kitsu then supplements
 * with entries Jikan's ranked list does not reach. Both feed one dedupe, so a
 * title present in both is stored once.
 *
 * Everything downstream is shared with the anime and game pipelines: the same
 * quality gate, the same optional-column probe, the same adaptive batching
 * that converges on a batch size the database will accept, the same derived
 * cross-catalog facts, and the same matrix index. Nothing here re-implements
 * any of it.
 */

import { readFileSync } from "node:fs";
import { incompletenessReasons } from "./catalog-quality-gate.mjs";
import {
  resolveMetadataColumn,
  resolveOptionalColumns,
  stripAbsentColumns,
} from "./metadata-column.mjs";
import { assertCredentials } from "./supabase-preflight.mjs";
import { upsertAll } from "./resilient-upsert.mjs";
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
const ENTITY_TYPE = "manga";
const CONFLICT_TARGET = process.env.INGEST_CONFLICT_TARGET || "entity_type,slug";
const CHUNK_SIZE = Number(process.env.INGEST_CHUNK_SIZE ?? 25);
const OPTIONAL_COLUMNS = ["categories", "updated_at"];

const JIKAN_URL = process.env.JIKAN_URL || "https://api.jikan.moe/v4";
const KITSU_URL = process.env.KITSU_URL || "https://kitsu.io/api/edge";

/** Jikan documents ~3 requests/second; 400ms stays inside it. */
const JIKAN_DELAY_MS = Number(process.env.JIKAN_DELAY_MS ?? 400);
/** Kitsu is more generous but undocumented; 300ms is polite. */
const KITSU_DELAY_MS = Number(process.env.KITSU_DELAY_MS ?? 300);

const JIKAN_PAGE = 25;
const KITSU_PAGE = 20;

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const DRY_RUN = args.has("dry-run");
const REQUIRE_METADATA = args.has("require-metadata");
const LIMIT = Number(args.get("limit") ?? 0) || 1000;
/** Share of the target taken from Kitsu once Jikan's ranked list is exhausted. */
const KITSU_SHARE = Number(args.get("kitsu-share") ?? 0.25);

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

/* -------------------------------------------------------------- utilities */

const slugify = (value, id) =>
  `${id}-${String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)}`;

/** Comparison key for cross-source identity — punctuation and case removed. */
const titleKey = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const plainText = (html) =>
  String(html ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(
      /&(nbsp|amp|lt|gt|quot|#39);/g,
      (_, e) => ({ nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e] ?? " ",
    )
    // Jikan synopses end with this boilerplate on a large share of entries.
    .replace(/\[Written by MAL Rewrite\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

async function getJson(url, { attempt = 1, delay = 0 } = {}) {
  if (delay) await sleep(delay);
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "GameCastle/1.0 (+https://gamecastle.store)",
    },
    signal: AbortSignal.timeout(30000),
  });
  if (res.status === 429 && attempt <= 5) {
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 1000;
    log(`  rate limited, waiting ${wait}ms`);
    await sleep(wait);
    return getJson(url, { attempt: attempt + 1 });
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/* ------------------------------------------------------------------ jikan */

/** Jikan's manga record → the shared row shape. */
function fromJikan(m) {
  const title = m?.title_english?.trim() || m?.title?.trim() || "";
  if (!title || !m?.mal_id) return null;

  const genres = [...(m.genres ?? []), ...(m.themes ?? []), ...(m.demographics ?? [])]
    .map((g) => g?.name)
    .filter(Boolean);

  const authors = (m.authors ?? []).map((a) => a?.name).filter(Boolean);
  const year = Number(String(m.published?.from ?? "").slice(0, 4)) || null;

  return {
    slug: slugify(title, `mal${m.mal_id}`),
    name: title,
    description: plainText(m.synopsis),
    image_url: m.images?.webp?.large_image_url || m.images?.jpg?.large_image_url || null,
    entity_type: ENTITY_TYPE,
    source_name: "MyAnimeList (Jikan)",
    source_url: m.url || `https://myanimelist.net/manga/${m.mal_id}`,
    categories: [...new Set(genres)],
    meta: {
      provider: "jikan",
      malId: m.mal_id,
      titles: {
        romaji: m.title ?? null,
        english: m.title_english ?? null,
        native: m.title_japanese ?? null,
      },
      chapters: m.chapters ?? null,
      volumes: m.volumes ?? null,
      status: m.status ?? null,
      publishing: Boolean(m.publishing),
      publishedFrom: m.published?.from ?? null,
      publishedTo: m.published?.to ?? null,
      malScore: m.score ?? null,
      scoredBy: m.scored_by ?? null,
      rank: m.rank ?? null,
      popularity: m.popularity ?? null,
      authors,
      serializations: (m.serializations ?? []).map((s) => s?.name).filter(Boolean),
      demographics: (m.demographics ?? []).map((d) => d?.name).filter(Boolean),

      // The generic fields derive-facts.mjs computes over. A manga's maker is
      // its author and its cohort is its first year of publication; its "size"
      // is chapters, which is the direct analogue of an anime's episodes.
      sourceId: m.mal_id,
      score: typeof m.score === "number" ? Math.round(m.score * 10) : null,
      makers: authors.map((name, i) => ({ id: i, name, primary: i === 0 })),
      cohort: year ? { key: String(year), label: String(year) } : null,
      size: m.chapters ? { value: m.chapters, unit: "chapters" } : null,
      tags: [...new Set(genres)].map((name) => ({ name, rank: null, category: "Genre" })),
      relations: [],
    },
  };
}

async function* fetchJikan(target) {
  let page = 1;
  let yielded = 0;
  while (yielded < target) {
    const json = await getJson(`${JIKAN_URL}/top/manga?page=${page}&limit=${JIKAN_PAGE}`, {
      delay: page === 1 ? 0 : JIKAN_DELAY_MS,
    });
    const rows = Array.isArray(json?.data) ? json.data : [];
    if (rows.length === 0) return;
    for (const raw of rows) {
      const record = fromJikan(raw);
      if (record) {
        yield record;
        yielded += 1;
        if (yielded >= target) return;
      }
    }
    if (!json?.pagination?.has_next_page) return;
    page += 1;
  }
}

/* ------------------------------------------------------------------ kitsu */

function fromKitsu(entry) {
  const a = entry?.attributes ?? {};
  const title = a.titles?.en?.trim() || a.titles?.en_jp?.trim() || a.canonicalTitle?.trim() || "";
  if (!title || !entry?.id) return null;

  const year = Number(String(a.startDate ?? "").slice(0, 4)) || null;
  const rating = Number(a.averageRating);

  return {
    slug: slugify(title, `ks${entry.id}`),
    name: title,
    description: plainText(a.synopsis || a.description),
    image_url: a.posterImage?.large || a.posterImage?.medium || a.posterImage?.original || null,
    entity_type: ENTITY_TYPE,
    source_name: "Kitsu",
    source_url: `https://kitsu.io/manga/${a.slug ?? entry.id}`,
    // Kitsu keeps categories behind a second request per title, which at one
    // request each is the whole rate budget. Its mangaType (manga, manhwa,
    // manhua, novel, oneshot) is a real, useful classification that arrives
    // free with the listing, so that is what the row carries.
    categories: a.mangaType ? [String(a.mangaType).replace(/^\w/, (c) => c.toUpperCase())] : [],
    meta: {
      provider: "kitsu",
      kitsuId: entry.id,
      titles: {
        romaji: a.titles?.en_jp ?? null,
        english: a.titles?.en ?? null,
        native: a.titles?.ja_jp ?? null,
      },
      chapters: a.chapterCount ?? null,
      volumes: a.volumeCount ?? null,
      status: a.status ?? null,
      publishedFrom: a.startDate ?? null,
      publishedTo: a.endDate ?? null,
      mangaType: a.mangaType ?? null,
      ageRating: a.ageRating ?? null,

      sourceId: Number(entry.id),
      score: Number.isFinite(rating) ? Math.round(rating) : null,
      makers: [],
      cohort: year ? { key: String(year), label: String(year) } : null,
      size: a.chapterCount ? { value: a.chapterCount, unit: "chapters" } : null,
      tags: a.mangaType ? [{ name: a.mangaType, rank: null, category: "Format" }] : [],
      relations: [],
    },
  };
}

async function* fetchKitsu(target) {
  let offset = 0;
  let yielded = 0;
  while (yielded < target) {
    const url =
      `${KITSU_URL}/manga?page[limit]=${KITSU_PAGE}&page[offset]=${offset}` +
      `&sort=-userCount&fields[manga]=slug,titles,canonicalTitle,synopsis,description,` +
      `averageRating,chapterCount,volumeCount,status,startDate,endDate,posterImage,mangaType,ageRating`;
    let json;
    try {
      json = await getJson(url, { delay: offset === 0 ? 0 : KITSU_DELAY_MS });
    } catch (error) {
      log(`  Kitsu stopped at offset ${offset}: ${error.message}`);
      return;
    }
    const rows = Array.isArray(json?.data) ? json.data : [];
    if (rows.length === 0) return;
    for (const raw of rows) {
      const record = fromKitsu(raw);
      if (record) {
        yield record;
        yielded += 1;
        if (yielded >= target) return;
      }
    }
    offset += KITSU_PAGE;
  }
}

/* ---------------------------------------------------------------- database */

function makeClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("SUPABASE_URL is not set.");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for a live run.\n" +
        "Use --dry-run to exercise the sources and the quality gate without credentials.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Every manga row already stored, so facts are computed catalog-wide. */
async function loadExisting(supabase) {
  const out = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("slug, name, categories, metadata")
      .eq("entity_type", ENTITY_TYPE)
      .order("slug", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error || !data?.length) break;
    for (const row of data) {
      out.push({
        slug: row.slug,
        name: row.name,
        categories: row.categories ?? [],
        meta: row.metadata ?? {},
      });
    }
    if (data.length < PAGE) break;
  }
  return out;
}

/* -------------------------------------------------------------------- main */

async function main() {
  const loadedEnv = loadDotEnv();
  log(`Manga → ${TABLE}${DRY_RUN ? "  (dry run — nothing is written)" : ""}`);
  log(`Config: ${loadedEnv ? ".env loaded" : "no .env file"}\n`);

  let supabase = null;
  let withMetadata = false;
  let optionalColumns = new Set(OPTIONAL_COLUMNS);

  if (!DRY_RUN) {
    supabase = makeClient();
    await assertCredentials(supabase, TABLE, { log });
    withMetadata = await resolveMetadataColumn(supabase, TABLE, {
      requireMetadata: REQUIRE_METADATA,
      log,
    });
    ({ present: optionalColumns } = await resolveOptionalColumns(
      supabase,
      TABLE,
      OPTIONAL_COLUMNS,
      { log },
    ));
    log("");
  }

  /* ------------------------------------------------------------- 1. fetch */

  const records = [];
  /** Cross-source identity: a title from both sources is stored once. */
  const seenTitles = new Set();
  const seenMal = new Set();

  const accept = (record) => {
    const key = titleKey(record.name);
    if (!key || seenTitles.has(key)) return false;
    if (record.meta.malId && seenMal.has(record.meta.malId)) return false;
    seenTitles.add(key);
    if (record.meta.malId) seenMal.add(record.meta.malId);
    records.push(record);
    return true;
  };

  const jikanTarget = Math.max(0, Math.round(LIMIT * (1 - KITSU_SHARE)));
  log(`Jikan: up to ${jikanTarget.toLocaleString()} titles…`);
  try {
    for await (const record of fetchJikan(jikanTarget)) {
      accept(record);
      if (records.length % 250 === 0 && records.length > 0) {
        log(`  ${records.length.toLocaleString()} collected`);
      }
    }
  } catch (error) {
    // One source failing must not discard the other's work.
    log(`  Jikan stopped: ${error.message}`);
  }
  const afterJikan = records.length;
  log(`  ${afterJikan.toLocaleString()} from Jikan.\n`);

  const kitsuTarget = Math.max(0, LIMIT - afterJikan);
  if (kitsuTarget > 0) {
    log(`Kitsu: up to ${kitsuTarget.toLocaleString()} more…`);
    let considered = 0;
    for await (const record of fetchKitsu(kitsuTarget * 2)) {
      considered += 1;
      accept(record);
      if (records.length - afterJikan >= kitsuTarget) break;
    }
    log(
      `  ${(records.length - afterJikan).toLocaleString()} new from Kitsu ` +
        `(${considered.toLocaleString()} considered, the rest already held from Jikan).\n`,
    );
  }

  if (records.length === 0) {
    log("No records fetched. Nothing to do.\n");
    return;
  }

  /* ------------------------------------------- 2. derived facts, catalog-wide */

  const existing = DRY_RUN ? [] : await loadExisting(supabase);
  const bySlug = new Map(existing.map((r) => [r.slug, r]));
  for (const r of records) bySlug.set(r.slug, r);
  const all = [...bySlug.values()];

  annotate(all);
  log(`Derived facts computed across ${all.length.toLocaleString()} manga.`);
  const withLinks = records.filter((r) => r.meta.derived?.similar?.length).length;
  log(`  ${withLinks}/${records.length} of this run's titles carry internal links.`);

  /* -------------------------------------------------------- 3. quality gate */

  let active = 0;
  const reasonCounts = new Map();
  const rows = records.map((r) => {
    const reasons = incompletenessReasons(r);
    if (reasons.length === 0) active += 1;
    for (const reason of reasons) reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
    const { meta, ...columns } = r;
    const row = { ...columns, status: reasons.length === 0 ? "active" : "incomplete" };
    return withMetadata || DRY_RUN ? { ...row, metadata: meta } : row;
  });

  log(`\nQuality gate: ${active} active, ${rows.length - active} incomplete.`);
  for (const [reason, count] of [...reasonCounts].sort((a, b) => b[1] - a[1])) {
    log(`  ${count} × ${reason}`);
  }

  if (DRY_RUN) {
    const facets = buildFacetIndex(all, ENTITY_TYPE);
    const comparisons = buildComparisonIndex(all, ENTITY_TYPE);
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
        ).slice(0, 1800),
      );
    }
    log("\nDry run complete — nothing written.\n");
    return;
  }

  /* -------------------------------------------------------------- 4. write */

  stripAbsentColumns(rows, OPTIONAL_COLUMNS, optionalColumns);

  const { written, failed, total, aborted } = await upsertAll(supabase, TABLE, rows, {
    conflictTarget: CONFLICT_TARGET,
    chunkSize: CHUNK_SIZE,
    log,
  });

  if (failed.length) {
    log(`\n${failed.length} row(s) could not be written:`);
    for (const f of failed.slice(0, 10)) log(`  ${f.slug}: ${f.reason}`);
    if (failed.length > 10) log(`  … and ${failed.length - 10} more`);
  }
  const failureRate = total === 0 ? 0 : failed.length / total;
  if (aborted || failureRate > 0.1) {
    throw new Error(
      `${failed.length} of ${total} rows failed to write` +
        (aborted ? " (stopped early)" : ` (${Math.round(failureRate * 100)}%)`) +
        `. Too many to treat as transient — see the reasons above.`,
    );
  }

  if (withMetadata && optionalColumns.has("categories")) {
    await writeMatrixIndex(supabase, all, ENTITY_TYPE, log);
  } else {
    log("Matrix index skipped — it needs the metadata and categories columns.");
  }

  log(`\nDone. ${written} rows upserted, ${active} of them active.\n`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
