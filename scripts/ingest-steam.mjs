#!/usr/bin/env node
/**
 * Steam → public.entities, with the same computed-facts treatment as anime.
 *
 *   node scripts/ingest-steam.mjs --dry-run --limit=50
 *   node scripts/ingest-steam.mjs --limit=2000
 *   node scripts/ingest-steam.mjs --resume --limit=2000
 *
 * Why Steam: FreeToGame publishes roughly 400 games in total, so the games
 * half of the catalog was capped at 400 no matter how often it ran. Steam's
 * app list is over 100,000 entries and needs no API key at all.
 *
 * Two endpoints, with very different costs:
 *
 *   ISteamApps/GetAppList   one request, the whole list of {appid, name}.
 *                           Cheap, and mostly noise — DLC, soundtracks,
 *                           videos, demos, server tools and test apps all
 *                           share the namespace with actual games.
 *   store/api/appdetails    the real record, and ONE APP PER REQUEST. Steam
 *                           throttles this to roughly 200 requests per five
 *                           minutes per IP.
 *
 * That second limit is the whole design constraint. 100,000 apps at 200 per
 * five minutes is about 42 hours, so this script is built to be resumable and
 * run repeatedly rather than to finish in one pass: it records the last appid
 * it reached in automation_state and --resume picks up from there. Ingesting
 * the catalog is a background job measured in nights, not a deploy step.
 *
 * Quality gate: the shared one, unchanged. Steam's short_description is
 * frequently under the minimum, and those rows are written 'incomplete' and
 * stay invisible rather than being padded to pass.
 *
 * Needs the metadata column from
 * supabase/migrations/20260913120000_entities_metadata_jsonb.sql.
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
const STATE_TABLE = "automation_state";
const STATE_KEY = "catalog_ingest:steam";
const CONFLICT_TARGET = process.env.INGEST_CONFLICT_TARGET || "entity_type,slug";
const CHUNK_SIZE = Number(process.env.INGEST_CHUNK_SIZE ?? 50);

/** Written only when the table actually has them; see metadata-column.mjs. */
const OPTIONAL_COLUMNS = ["categories", "updated_at"];

const STEAM_API = process.env.STEAM_API_URL || "https://api.steampowered.com";
const STEAM_STORE = process.env.STEAM_STORE_URL || "https://store.steampowered.com";

/**
 * ~200 requests per 5 minutes is 1.5s apart. 1600ms leaves headroom, because
 * being throttled costs far more than the margin does: Steam answers a
 * throttled request with a 429 or an empty 200, and an empty 200 is the one
 * that silently corrupts a run.
 */
const REQUEST_DELAY_MS = Number(process.env.STEAM_DELAY_MS ?? 1600);

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
const RESUME = args.has("resume");
const LIMIT = Number(args.get("limit") ?? 0) || 500;

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

/* ------------------------------------------------------------------- steam */

/**
 * Names that are never a game, matched before a single appdetails request is
 * spent on them. The list endpoint gives no type, so this is the only filter
 * available up front — and at 1.6s per lookup, every skipped soundtrack is
 * 1.6 seconds not wasted. appdetails still confirms the type afterwards.
 */
const NON_GAME_NAME =
  /\b(soundtrack|ost|demo|beta|playtest|dedicated server|server|sdk|trailer|teaser|artbook|art book|wallpaper|dlc|season pass|upgrade|bundle|pack)\b|^\s*test\b/i;

/**
 * Spellings of the app-list endpoint, tried in order.
 *
 * The documented one answered 404 from a GitHub Actions runner. Steam has
 * shipped this method under several version strings over the years and is
 * known to refuse requests from data-centre IP ranges, which is what an
 * Actions runner is — so a single hard-coded URL makes an upstream quirk look
 * like a broken script. Trying the known spellings costs three requests in
 * the worst case and one in the normal one.
 */
const APP_LIST_PATHS = [
  "/ISteamApps/GetAppList/v2/?format=json",
  "/ISteamApps/GetAppList/v2/",
  "/ISteamApps/GetAppList/v0002/?format=json",
  "/ISteamApps/GetAppList/v1/",
];

async function getAppList() {
  const failures = [];

  for (const path of APP_LIST_PATHS) {
    const url = `${STEAM_API}${path}`;
    let res;
    try {
      res = await fetch(url, {
        headers: {
          accept: "application/json",
          // Steam serves an HTML error page to some default agents; a named
          // one is both politer and more likely to be answered.
          "user-agent": "GameCastle/1.0 (+https://gamecastle.store)",
        },
        signal: AbortSignal.timeout(60000),
      });
    } catch (error) {
      failures.push(`${path} → ${error.message}`);
      continue;
    }

    if (!res.ok) {
      // The body is the diagnosis: an HTML error page and a JSON error mean
      // very different things, and "HTTP 404" alone told us neither.
      const body = (await res.text().catch(() => "")).slice(0, 120).replace(/\s+/g, " ");
      failures.push(`${path} → HTTP ${res.status}${body ? ` — ${body}` : ""}`);
      continue;
    }

    let json;
    try {
      json = await res.json();
    } catch {
      failures.push(`${path} → 200 but the body was not JSON`);
      continue;
    }

    const apps = json?.applist?.apps;
    if (!Array.isArray(apps)) {
      failures.push(`${path} → 200 but no applist.apps array`);
      continue;
    }

    log(`  app list from ${path} — ${apps.length.toLocaleString()} apps before filtering`);
    return apps.filter((a) => a?.appid && a?.name && !NON_GAME_NAME.test(a.name));
  }

  log("  the ISteamApps app list is unavailable:");
  for (const f of failures) log(`    ${f}`);
  log("  falling back to the store search, which needs no key either.");

  const fromStore = await getAppListFromStore();
  if (fromStore.length > 0) return fromStore;

  throw new Error(
    `Steam's app list could not be fetched from any source. Tried ${APP_LIST_PATHS.length} ` +
      `app-list endpoints and the store search:\n` +
      failures.map((f) => `  ${f}`).join("\n"),
  );
}

/**
 * The store's own search, used when the app-list method is not available.
 *
 * Steam answered every app-list spelling with "Method 'GetAppList' not found
 * in interface 'ISteamApps'", which is not a rate limit or an IP block — it is
 * the method being gone. The documented replacement, IStoreService/GetAppList,
 * requires a publisher API key, which this pipeline deliberately does not have.
 *
 * The store search behind store.steampowered.com/search needs no key, pages
 * cleanly, and has one real advantage over the raw app list: filtering by
 * category 998 returns GAMES, so the soundtracks, demos and server tools that
 * made up most of the app list never arrive. Fewer entries, but almost all of
 * them worth a lookup — and appdetails, at one request each, is the expensive
 * part of this pipeline.
 *
 * It is a store endpoint rather than a documented Web API one, so its shape is
 * read defensively: an appid may arrive as a field or only inside an image URL.
 */
async function getAppListFromStore() {
  const PAGE = 100;
  // Enough candidates to satisfy --limit even after appdetails rejects some.
  const wanted = Math.min(Math.max(LIMIT * 3, 300), 5000);
  const apps = [];
  const seen = new Set();

  for (let start = 0; apps.length < wanted; start += PAGE) {
    const url =
      `${STEAM_STORE}/search/results/?json=1&start=${start}&count=${PAGE}` +
      `&category1=998&cc=us&l=en&sort_by=Released_DESC`;

    let json;
    try {
      const res = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "GameCastle/1.0 (+https://gamecastle.store)",
        },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) {
        log(`    store search HTTP ${res.status} at start=${start}`);
        break;
      }
      json = await res.json();
    } catch (error) {
      log(`    store search failed at start=${start}: ${error.message}`);
      break;
    }

    const items = Array.isArray(json?.items) ? json.items : [];
    if (items.length === 0) break;

    for (const item of items) {
      // The id is sometimes a field and sometimes only in the capsule image
      // path (…/steam/apps/<appid>/capsule…). Both are accepted; neither is
      // assumed.
      const fromField = Number(item?.id);
      const fromLogo = Number(String(item?.logo ?? "").match(/\/apps\/(\d+)\//)?.[1]);
      const appid = Number.isInteger(fromField) && fromField > 0 ? fromField : fromLogo;
      const name = String(item?.name ?? "").trim();
      if (!Number.isInteger(appid) || appid <= 0 || !name) continue;
      if (seen.has(appid)) continue;
      if (NON_GAME_NAME.test(name)) continue;
      seen.add(appid);
      apps.push({ appid, name });
    }

    if (items.length < PAGE) break;
    await sleep(500);
  }

  if (apps.length > 0) {
    log(`  store search — ${apps.length.toLocaleString()} game entries`);
  }
  return apps;
}

/**
 * One app's store record. Returns null for anything that is not a game, and
 * for the throttled/absent cases — a null here means "skip", never "retry
 * forever", because Steam returns success:false for delisted and region-locked
 * apps too and those never become available.
 */
async function getAppDetails(appid, attempt = 1) {
  const url = `${STEAM_STORE}/api/appdetails?appids=${appid}&cc=us&l=en`;
  let res;
  try {
    res = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "GameCastle/1.0 (+https://gamecastle.store)",
      },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    return null;
  }

  if (res.status === 429 || res.status === 403) {
    if (attempt > 4) return null;
    const wait = 2 ** attempt * 5000;
    log(`  throttled on ${appid}, backing off ${wait / 1000}s`);
    await sleep(wait);
    return getAppDetails(appid, attempt + 1);
  }
  if (!res.ok) return null;

  let json;
  try {
    json = await res.json();
  } catch {
    // Steam answers a throttled request with an empty body often enough that
    // this is a normal path, not an exceptional one.
    return null;
  }

  const entry = json?.[String(appid)];
  if (!entry?.success || !entry.data) return null;
  if (entry.data.type !== "game") return null;
  return entry.data;
}

/* -------------------------------------------------------------- conversion */

const slugify = (value, id) =>
  `${id}-${String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)}`;

const plainText = (html) =>
  String(html ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(
      /&(nbsp|amp|lt|gt|quot|#39);/g,
      (_, e) => ({ nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e] ?? " ",
    )
    .replace(/\s+/g, " ")
    .trim();

/** "12 Nov, 2020" and "2020" both appear; only a 4-digit year is trusted. */
const releaseYear = (data) => {
  const match = String(data?.release_date?.date ?? "").match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
};

function toRecord(data) {
  const name = String(data.name ?? "").trim();
  if (!name || !data.steam_appid) return null;

  const genres = (data.genres ?? []).map((g) => g?.description).filter(Boolean);
  const features = (data.categories ?? []).map((c) => c?.description).filter(Boolean);
  const developers = (data.developers ?? []).filter(Boolean);
  const publishers = (data.publishers ?? []).filter(Boolean);
  const year = releaseYear(data);

  // The long description is the one with substance; the short one is a
  // one-liner that usually falls under the gate's minimum.
  const description =
    plainText(data.short_description).length >= 200
      ? plainText(data.short_description)
      : plainText(data.detailed_description || data.about_the_game || data.short_description);

  return {
    slug: slugify(name, data.steam_appid),
    name,
    description,
    image_url: data.header_image ?? null,
    entity_type: "game",
    source_name: "Steam",
    source_url: `https://store.steampowered.com/app/${data.steam_appid}/`,
    categories: genres,
    meta: {
      steamAppId: data.steam_appid,
      developers,
      publishers,
      platforms: Object.entries(data.platforms ?? {})
        .filter(([, on]) => on)
        .map(([os]) => os),
      releaseDate: data.release_date?.date ?? null,
      releaseYear: year,
      comingSoon: Boolean(data.release_date?.coming_soon),
      metacritic: data.metacritic?.score ?? null,
      isFree: Boolean(data.is_free),
      price: data.price_overview
        ? {
            final: data.price_overview.final_formatted ?? null,
            discount: data.price_overview.discount_percent ?? 0,
          }
        : null,
      achievements: data.achievements?.total ?? null,
      website: data.website ?? null,
      screenshots: (data.screenshots ?? [])
        .slice(0, 6)
        .map((s) => s?.path_thumbnail)
        .filter(Boolean),
      features,

      // The generic fields derive-facts.mjs computes over. A game's maker is
      // its developer and its cohort is its release year, which is the same
      // arithmetic the anime side runs on studios and broadcast seasons.
      sourceId: data.steam_appid,
      score: typeof data.metacritic?.score === "number" ? data.metacritic.score : null,
      makers: developers.map((n, i) => ({ id: i, name: n, primary: i === 0 })),
      cohort: year ? { key: String(year), label: String(year) } : null,
      // Deliberately no `size`: a game has no equivalent of an episode count,
      // and achievement totals say more about the developer than the game.
      size: null,
      tags: features.slice(0, 20).map((f) => ({ name: f, rank: null, category: "Features" })),
      relations: [],
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
        "Use --dry-run to exercise Steam and the quality gate without credentials.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function readCursor(supabase) {
  const { data, error } = await supabase
    .from(STATE_TABLE)
    .select("value")
    .eq("key", STATE_KEY)
    .maybeSingle();
  if (error || !data) return 0;
  const value = Number(data.value?.lastAppId ?? 0);
  return Number.isFinite(value) ? value : 0;
}

async function writeCursor(supabase, lastAppId) {
  const { error } = await supabase
    .from(STATE_TABLE)
    .upsert(
      { key: STATE_KEY, value: { lastAppId, updatedAt: new Date().toISOString() } },
      { onConflict: "key" },
    );
  // A lost cursor costs a repeated pass, not corruption, so it must never
  // fail a run that has already written rows successfully.
  if (error) log(`  (could not save resume cursor: ${error.message})`);
}

/**
 * Every game row already stored, so the derived facts are computed against
 * the whole games catalog rather than only this run's slice. A title's rank
 * among 200 Action games is a different number from its rank among 40.
 */
async function loadExistingGames(supabase) {
  const out = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("slug, name, categories, metadata")
      .eq("entity_type", "game")
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
  log(`Steam → ${TABLE}${DRY_RUN ? "  (dry run — nothing is written)" : ""}`);
  log(`Config: ${loadedEnv ? ".env loaded" : "no .env file"}\n`);

  let supabase = null;
  let withMetadata = false;
  let optionalColumns = new Set(OPTIONAL_COLUMNS);
  let cursor = 0;

  if (!DRY_RUN) {
    supabase = makeClient();
    // Credentials first. An unusable key makes every column probe fail, so a
    // schema conclusion drawn before this passes would be meaningless — which
    // is exactly how a rotated key spent several runs masquerading as a
    // missing migration.
    await assertCredentials(supabase, TABLE, { log });
    withMetadata = await resolveMetadataColumn(supabase, TABLE, {
      requireMetadata: REQUIRE_METADATA,
      log,
    });
    // categories and updated_at have always been optional in this schema —
    // ingest-catalog.mjs probes for them. This script assumed they existed
    // and lost a whole 5,000-title run to one absent column, because
    // PostgREST rejects the entire request for a single unknown key.
    ({ present: optionalColumns } = await resolveOptionalColumns(
      supabase,
      TABLE,
      OPTIONAL_COLUMNS,
      { log },
    ));
    if (!optionalColumns.has("categories")) {
      log("");
      log("NOTE: without a categories column, genre pages and the genre facet of");
      log("the matrix cannot be served. To enable them:");
      log("    alter table public.entities add column if not exists categories text[];");
      log("    grant select (categories) on public.entities to anon, authenticated;");
      log("    notify pgrst, 'reload schema';");
      log("");
    }
    if (RESUME) {
      cursor = await readCursor(supabase);
      log(`Resuming after appid ${cursor}.`);
    }
    log("");
  }

  /* ------------------------------------------------------- 1. the app list */

  log("Fetching the Steam app list (one request)…");
  const apps = (await getAppList())
    .filter((a) => a.appid > cursor)
    .sort((a, b) => a.appid - b.appid);
  log(`  ${apps.length.toLocaleString()} candidate apps after name filtering.\n`);

  /* ------------------------------------------- 2. details, one app at a time */

  const records = [];
  let looked = 0;
  let lastAppId = cursor;
  const started = Date.now();

  for (const app of apps) {
    if (records.length >= LIMIT) break;
    looked += 1;
    lastAppId = app.appid;

    const data = await getAppDetails(app.appid);
    if (data) {
      const record = toRecord(data);
      if (record) records.push(record);
    }

    if (looked % 25 === 0) {
      const rate = looked / ((Date.now() - started) / 60000);
      log(
        `  ${looked.toLocaleString()} looked up · ${records.length} games kept · ` +
          `${rate.toFixed(0)}/min · at appid ${app.appid}`,
      );
    }
    if (records.length < LIMIT) await sleep(REQUEST_DELAY_MS);
  }

  log(`\nKept ${records.length} games from ${looked.toLocaleString()} lookups.`);
  if (records.length === 0) {
    log("Nothing to write.\n");
    return;
  }

  /* -------------------------------------------- 3. derived facts, catalog-wide */

  const existing = DRY_RUN ? [] : await loadExistingGames(supabase);
  const bySlug = new Map(existing.map((r) => [r.slug, r]));
  for (const r of records) bySlug.set(r.slug, r);
  const all = [...bySlug.values()];

  annotate(all);
  log(`Derived facts computed across ${all.length.toLocaleString()} games.`);
  const withLinks = records.filter((r) => r.meta.derived?.similar?.length).length;
  log(`  ${withLinks}/${records.length} of this run's games carry internal links.`);

  /* -------------------------------------------------------- 4. quality gate */

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
    const facets = buildFacetIndex(all, "game");
    const comparisons = buildComparisonIndex(all, "game");
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
        ).slice(0, 2200),
      );
    }
    log("\nDry run complete — nothing written.\n");
    return;
  }

  /* -------------------------------------------------------------- 5. write */

  stripAbsentColumns(rows, OPTIONAL_COLUMNS, optionalColumns);

  const { written, failed, total, aborted } = await upsertAll(supabase, TABLE, rows, {
    conflictTarget: CONFLICT_TARGET,
    chunkSize: CHUNK_SIZE,
    log,
  });

  // A handful of bad rows should not discard thousands of good ones, but a
  // write that mostly failed is a real failure and must not report success.
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
  // Over `all`, not just this run's slice: Steam is ingested a few hundred
  // games a night, and a facet index built from one night's rows would drop
  // every intersection the rest of the catalog already satisfies.
  //
  // Skipped without the metadata column, for the same reason as the anime
  // side: the facet queries read platform, year and developer out of it.
  // Also needs categories: `genre` appears in nearly every allowed
  // combination, and loadFacetRows queries it with .contains("categories").
  // Publishing those URLs without the column would advertise pages whose row
  // lookup cannot succeed — the same mistake as advertising a sitemap before
  // its data exists.
  if (withMetadata && optionalColumns.has("categories")) {
    await writeMatrixIndex(supabase, all, "game", log);
  } else {
    log("Matrix index skipped — it needs the metadata and categories columns to query its facets.");
  }
  await writeCursor(supabase, lastAppId);

  log(`\nDone. ${written} rows upserted, ${active} active. Cursor at appid ${lastAppId}.`);
  log(`Run again with --resume to continue from there.\n`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
