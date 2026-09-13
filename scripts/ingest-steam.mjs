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
import { resolveMetadataColumn } from "./metadata-column.mjs";
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

async function getAppList() {
  const res = await fetch(`${STEAM_API}/ISteamApps/GetAppList/v2/`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`GetAppList HTTP ${res.status}`);
  const json = await res.json();
  const apps = json?.applist?.apps;
  if (!Array.isArray(apps)) throw new Error("GetAppList returned an unexpected shape.");
  return apps.filter((a) => a?.appid && a?.name && !NON_GAME_NAME.test(a.name));
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
  if (withMetadata) {
    await writeMatrixIndex(supabase, all, "game", log);
  } else {
    log("Matrix index skipped — it needs the metadata column to query its facets.");
  }
  await writeCursor(supabase, lastAppId);

  log(`\nDone. ${written} rows upserted, ${active} active. Cursor at appid ${lastAppId}.`);
  log(`Run again with --resume to continue from there.\n`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
