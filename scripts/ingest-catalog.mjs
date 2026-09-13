#!/usr/bin/env node
/**
 * Chunked catalog ingestion: Jikan (anime) and FreeToGame (games) into
 * Supabase, with a hard quality gate.
 *
 *   node scripts/ingest-catalog.mjs --source=all --dry-run
 *   node scripts/ingest-catalog.mjs --source=anime --limit=500
 *   node scripts/ingest-catalog.mjs --source=games --resume
 *
 * Configuration is read from the environment, falling back to a .env file
 * in the repo root (gitignored; see .env.example).
 *
 *   SUPABASE_URL              optional — defaults to the project URL already
 *                             committed in src/integrations/supabase/client.ts
 *   SUPABASE_SERVICE_ROLE_KEY required for LIVE runs only. public.entities has
 *                             RLS with only a SELECT policy, so the publishable
 *                             key cannot insert; there is no safe default.
 *
 * A dry run needs no credentials at all — its job is to answer "does the
 * upstream data clear the quality gate?", which is a question about the APIs,
 * not the database. Supply a service role key to a dry run and it will also
 * probe the column mapping with one sentinel row that it deletes immediately.
 *
 * Quality gate — a record is only written with status 'active' when it has
 * all of: slug, name, a summary of at least MIN_SUMMARY_CHARS, an image URL,
 * and at least one category. Anything short of that is written with status
 * 'incomplete', which the existing active_catalog_read policy already hides
 * from the public client — so partial records are invisible to visitors and
 * to Googlebot without needing a separate noindex flag. Nothing is invented
 * to fill a gap; a missing summary stays missing and the record stays
 * incomplete.
 *
 * Written against documented API shapes and the columns granted in
 * supabase/migrations/20260901204040_allow_active_catalog_read.sql. The live
 * path could not be executed in the environment it was authored in (no
 * outbound network), so always start with --dry-run.
 */

/*
 * Dependencies are loaded dynamically so a missing install produces an
 * actionable message rather than a raw ERR_MODULE_NOT_FOUND stack. Note
 * that bare specifiers resolve relative to THIS FILE, not the working
 * directory, so running the script by absolute path from anywhere works —
 * what does not work is a relative path from outside the repo, since then
 * Node cannot find the script file itself.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { incompletenessReasons } from "./catalog-quality-gate.mjs";

if (!globalThis.fetch) {
  console.error(
    `\nThis script needs Node 18 or newer for global fetch (running ${process.version}).\n`,
  );
  process.exit(1);
}

let createClient;
try {
  ({ createClient } = await import("@supabase/supabase-js"));
} catch (error) {
  if (error?.code === "ERR_MODULE_NOT_FOUND") {
    console.error(
      "\nCannot load @supabase/supabase-js.\n\n" +
        "  Install dependencies from the repository root:\n" +
        "      npm install\n\n" +
        "  Then run it via the npm script, which always executes from the repo root:\n" +
        "      npm run ingest:catalog -- --dry-run\n\n" +
        "  (Invoking `node ./scripts/ingest-catalog.mjs` from any other directory fails\n" +
        "   the same way, because the relative path no longer points at the script.)\n",
    );
    process.exit(1);
  }
  throw error;
}

/* ----------------------------------------------------------- configuration */

const TABLE = "entities";

/**
 * Target columns. If your schema differs, change these — the preflight
 * probe reports the exact column PostgREST rejects, so a mismatch fails
 * fast and legibly instead of corrupting a batch.
 */
const COLUMNS = {
  slug: "slug",
  name: "name",
  description: "description",
  imageUrl: "image_url",
  entityType: "entity_type",
  status: "status",
  sourceName: "source_name",
  sourceUrl: "source_url",
};

/**
 * Natural key for upserts. entities keys on `id`, and slug alone is not
 * safe: slugs are `{sourceId}-{title}` and both Jikan and FreeToGame use
 * small integer ids, so the same slug can arise from either source. The
 * pair is unambiguous and matches the type-scoped catalog routes.
 */
const CONFLICT_TARGET = process.env.INGEST_CONFLICT_TARGET || "entity_type,slug";

/** Optional columns, written only if the preflight finds them present. */
const OPTIONAL_COLUMNS = { categories: "categories", updatedAt: "updated_at" };

const CHUNK_SIZE = 500;
const JIKAN_DELAY_MS = 400; // ~2.5 req/sec, inside Jikan's ~3/sec limit
const STATE_TABLE = "automation_state";
const STATE_KEY_PREFIX = "catalog_ingest:";

/* ------------------------------------------------------------------- utils */

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const DRY_RUN = args.has("dry-run");
const RESUME = args.has("resume");
const SOURCE = String(args.get("source") ?? "all");
const LIMIT = Number(args.get("limit") ?? 0) || Infinity;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...m) => console.log(...m);

/**
 * Minimal .env loader. Resolved relative to this file rather than the
 * working directory, so it finds the repo's .env no matter where the
 * script is invoked from. Existing environment variables always win, so
 * CI and shell exports are never clobbered by a stale local file.
 */
function loadDotEnv() {
  const envPath = new URL("../.env", import.meta.url);
  let text;
  try {
    text = readFileSync(envPath, "utf8");
  } catch {
    return false;
  }
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim().replace(/\s+#.*$/, "");
    if (/^(".*"|'.*')$/s.test(value)) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return true;
}

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function getJson(url, attempt = 1) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "GameCastle/1.0 (+https://gamecastle.store)",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (res.status === 429 && attempt <= 5) {
    const wait = 2 ** attempt * 1000;
    log(`  rate limited, backing off ${wait}ms`);
    await sleep(wait);
    return getJson(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/* -------------------------------------------------------------- validation */

const slugify = (value, id) =>
  `${id}-${String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)}`;

/* ----------------------------------------------------------------- sources */

async function* fetchAnime(startPage = 1) {
  let page = startPage;
  let yielded = 0;
  while (yielded < LIMIT) {
    const json = await getJson(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
    const rows = Array.isArray(json?.data) ? json.data : [];
    if (rows.length === 0) return;

    for (const a of rows) {
      yield {
        [COLUMNS.slug]: slugify(a.title ?? "", a.mal_id),
        [COLUMNS.name]: a.title_english?.trim() || a.title || "",
        [COLUMNS.description]: (a.synopsis ?? "").trim(),
        [COLUMNS.imageUrl]:
          a.images?.webp?.large_image_url ||
          a.images?.jpg?.large_image_url ||
          a.images?.jpg?.image_url ||
          "",
        [COLUMNS.entityType]: "anime",
        [COLUMNS.sourceName]: "MyAnimeList (Jikan)",
        [COLUMNS.sourceUrl]: a.url ?? "",
        categories: [...(a.genres ?? []), ...(a.themes ?? [])].map((g) => g.name).filter(Boolean),
      };
      yielded++;
      if (yielded >= LIMIT) break;
    }

    if (json?.pagination?.has_next_page === false) return;
    page++;
    await sleep(JIKAN_DELAY_MS);
  }
}

async function* fetchGames() {
  const rows = await getJson("https://www.freetogame.com/api/games");
  let yielded = 0;
  for (const g of Array.isArray(rows) ? rows : []) {
    if (yielded >= LIMIT) return;
    yield {
      [COLUMNS.slug]: slugify(g.title ?? "", g.id),
      [COLUMNS.name]: g.title ?? "",
      [COLUMNS.description]: (g.short_description ?? "").trim(),
      [COLUMNS.imageUrl]: g.thumbnail ?? "",
      [COLUMNS.entityType]: "game",
      [COLUMNS.sourceName]: "FreeToGame",
      [COLUMNS.sourceUrl]: g.freetogame_profile_url ?? g.game_url ?? "",
      categories: [g.genre, g.platform].filter(Boolean),
    };
    yielded++;
  }
}

/* -------------------------------------------------------------- supabase io */

/**
 * The project URL is not a secret — it is already committed in
 * src/integrations/supabase/client.ts and ships in the browser bundle — so
 * defaulting to it is safe and saves configuring the obvious. The service
 * role key has no safe default and never gets one.
 */
const DEFAULT_SUPABASE_URL = "https://saddhtpsomxtazrgeyed.supabase.co";

function resolveUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

function makeClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set.\n\n" +
        "  public.entities has RLS enabled with only a SELECT policy, so the publishable key\n" +
        "  cannot insert — there is no safe default for this one. Copy .env.example to .env and\n" +
        "  set it from Supabase dashboard > Project Settings > API (.env is gitignored).\n\n" +
        "  To exercise fetching, validation and batching without any credentials, run:\n" +
        "      npm run ingest:catalog -- --dry-run",
    );
  }
  return createClient(resolveUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Set false the first time Postgres tells us the conflict target has no index. */
let conflictTargetUsable = true;

/** Composite identity of a row, matching CONFLICT_TARGET. */
const rowKey = (row) => `${row[COLUMNS.entityType]}::${row[COLUMNS.slug]}`;

/**
 * Collapses rows sharing a conflict key, keeping the last occurrence.
 *
 * Postgres rejects an INSERT ... ON CONFLICT DO UPDATE whose VALUES list
 * contains the same key twice (21000, "cannot affect row a second time"),
 * because it will not update one row twice in a single command. Upstream
 * genuinely produces repeats — Jikan's paginated /top/anime can return the
 * same mal_id on more than one page as the ranking shifts between requests
 * — so the batch is collapsed immediately before every write. The
 * read-then-write fallback needs this too: it would otherwise try to insert
 * the same key twice, or issue two updates for one row.
 */
function dedupeByKey(rows) {
  const byKey = new Map();
  for (const row of rows) byKey.set(rowKey(row), row);
  return [...byKey.values()];
}

/**
 * Writes rows, preferring a real ON CONFLICT upsert.
 *
 * public.entities keys on `id`; slug carries no unique constraint, so
 * ON CONFLICT has nothing to match and Postgres raises 42P10. Where the
 * index is missing we fall back to reading the existing keys and splitting
 * the batch into inserts and updates. That is correct but chattier — one
 * request per existing row — so the index is still the right fix and the
 * warning says so once.
 */
async function upsertRows(supabase, unsafeRows) {
  // Deduped here rather than only at the call site, so every path into a
  // write — chunk flush, preflight probe, fallback — is covered.
  const rows = dedupeByKey(unsafeRows);
  if (rows.length === 0) return;

  if (conflictTargetUsable) {
    const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: CONFLICT_TARGET });
    if (!error) return;
    // 42P10 — the conflict target has no matching unique/exclusion constraint.
    if (error.code !== "42P10" && !/no unique or exclusion constraint/i.test(error.message)) {
      throw new Error(error.message);
    }
    conflictTargetUsable = false;
    log(
      `\n  ! No unique index matches (${CONFLICT_TARGET}), so upsert is falling back to\n` +
        `    read-then-write. This works, but it is slower and races if two ingests run at\n` +
        `    once. Apply the migration to fix it properly:\n` +
        `        supabase/migrations/20260913000000_entities_unique_type_slug.sql\n` +
        `    or run: create unique index concurrently entities_entity_type_slug_key\n` +
        `              on public.entities (${COLUMNS.entityType}, ${COLUMNS.slug});\n`,
    );
  }

  await readThenWrite(supabase, rows);
}

/** Fallback path: partition the batch against existing keys, then write. */
async function readThenWrite(supabase, rows) {
  const slugs = rows.map((r) => r[COLUMNS.slug]);
  const { data: existing, error: readError } = await supabase
    .from(TABLE)
    .select(`${COLUMNS.slug},${COLUMNS.entityType}`)
    .in(COLUMNS.slug, slugs);
  if (readError) throw new Error(readError.message);

  // Existing rows come back with the same column names, so rowKey reads both
  // sides identically and the two halves can never disagree on key shape.
  const seen = new Set((existing ?? []).map(rowKey));
  const inserts = [];
  const updates = [];
  for (const row of rows) {
    (seen.has(rowKey(row)) ? updates : inserts).push(row);
  }

  if (inserts.length) {
    const { error } = await supabase.from(TABLE).insert(inserts);
    if (error) throw new Error(error.message);
  }

  // Updates have to go one row at a time; bounded concurrency keeps it from
  // opening hundreds of sockets at once.
  const CONCURRENCY = 8;
  for (let i = 0; i < updates.length; i += CONCURRENCY) {
    const slice = updates.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      slice.map((row) =>
        supabase
          .from(TABLE)
          .update(row)
          .eq(COLUMNS.slug, row[COLUMNS.slug])
          .eq(COLUMNS.entityType, row[COLUMNS.entityType]),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed) throw new Error(failed.error.message);
  }
}

/**
 * Confirms the table is reachable and that our column mapping is accepted,
 * before any real rows are written. Uses a rolled-back-style probe: a single
 * upsert of a sentinel row, deleted immediately afterwards.
 */
async function preflight(supabase) {
  const { error: readError } = await supabase.from(TABLE).select(COLUMNS.slug).limit(1);
  if (readError) throw new Error(`Cannot read ${TABLE}: ${readError.message}`);

  const probeSlug = "__ingest_preflight__";
  const probe = {
    [COLUMNS.slug]: probeSlug,
    [COLUMNS.name]: "preflight probe",
    [COLUMNS.description]: "preflight probe",
    [COLUMNS.imageUrl]: "https://example.com/probe.png",
    [COLUMNS.entityType]: "probe",
    [COLUMNS.status]: "incomplete",
    [COLUMNS.sourceName]: "preflight",
    [COLUMNS.sourceUrl]: "https://example.com",
  };

  const optional = {};
  for (const [key, column] of Object.entries(OPTIONAL_COLUMNS)) {
    const { error } = await supabase.from(TABLE).select(column).limit(1);
    optional[key] = !error;
  }

  try {
    await upsertRows(supabase, [probe]);
  } catch (error) {
    throw new Error(
      `Preflight write to ${TABLE} failed: ${error.message}\n` +
        `Adjust the COLUMNS map at the top of this script to match your schema.`,
    );
  }
  await supabase.from(TABLE).delete().eq(COLUMNS.slug, probeSlug).eq(COLUMNS.entityType, "probe");

  return optional;
}

async function loadCursor(supabase, source) {
  if (!supabase) return 1;
  const { data } = await supabase
    .from(STATE_TABLE)
    .select("value")
    .eq("key", `${STATE_KEY_PREFIX}${source}`)
    .maybeSingle();
  return data?.value?.page ?? 1;
}

async function saveCursor(supabase, source, page) {
  await supabase.from(STATE_TABLE).upsert(
    {
      key: `${STATE_KEY_PREFIX}${source}`,
      value: { page },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
}

/* -------------------------------------------------------------------- main */

/** Builds the row to upsert, applying the quality gate. */
function toRow(raw, optional, stats, reasonCounts) {
  const categories = raw.categories ?? [];
  const reasons = incompletenessReasons({
    slug: raw[COLUMNS.slug],
    name: raw[COLUMNS.name],
    description: raw[COLUMNS.description],
    image_url: raw[COLUMNS.imageUrl],
    categories,
  });

  if (reasons.length === 0) stats.active++;
  else {
    stats.incomplete++;
    for (const r of reasons) reasonCounts.set(r, (reasonCounts.get(r) ?? 0) + 1);
  }

  const row = { ...raw, [COLUMNS.status]: reasons.length === 0 ? "active" : "incomplete" };
  // `categories` is only a staging field; it is written solely when the
  // schema actually has a column for it, and removed otherwise so PostgREST
  // never sees an unknown key.
  delete row.categories;
  if (optional.categories) row[OPTIONAL_COLUMNS.categories] = categories;
  if (optional.updatedAt) row[OPTIONAL_COLUMNS.updatedAt] = new Date().toISOString();
  return row;
}

/**
 * Streams from the source and flushes a chunk whenever the buffer fills, so
 * memory stays bounded and the resume cursor reflects work actually
 * committed rather than merely fetched.
 */
async function ingest(source, supabase, optional) {
  log(`\n▸ ${source}`);
  const startPage = RESUME && source === "anime" ? await loadCursor(supabase, source) : 1;
  if (startPage > 1) log(`  resuming from page ${startPage}`);

  const generator = source === "anime" ? fetchAnime(startPage) : fetchGames();
  const stats = { fetched: 0, active: 0, incomplete: 0, written: 0, duplicates: 0 };
  const reasonCounts = new Map();
  let buffer = [];
  let chunkNo = 0;
  // Run-level identity set. Per-batch dedupe alone would miss a repeat
  // that straddles two chunks, which then costs a redundant write.
  const seenKeys = new Set();

  const flush = async () => {
    if (buffer.length === 0) return;
    chunkNo++;
    if (DRY_RUN) {
      log(`  [dry-run] chunk ${chunkNo} — ${buffer.length} rows (not written)`);
    } else {
      try {
        await upsertRows(supabase, buffer);
      } catch (error) {
        throw new Error(`Chunk ${chunkNo} failed after ${stats.written} rows: ${error.message}`);
      }
      stats.written += buffer.length;
      log(`  chunk ${chunkNo} — ${buffer.length} rows upserted`);
      if (source === "anime") {
        // 25 records per Jikan page; resume just past what is now committed.
        await saveCursor(supabase, source, startPage + Math.floor(stats.written / 25));
      }
    }
    buffer = [];
  };

  for await (const raw of generator) {
    stats.fetched++;
    // Checked before toRow: it is toRow that tallies publishable/held-back,
    // so screening afterwards would count a discarded row against the
    // quality gate and leave the summary line not adding up.
    const key = rowKey(raw);
    if (seenKeys.has(key)) {
      stats.duplicates++;
      continue;
    }
    seenKeys.add(key);
    buffer.push(toRow(raw, optional, stats, reasonCounts));
    if (buffer.length >= CHUNK_SIZE) await flush();
  }
  await flush();

  log(
    `  fetched ${stats.fetched} · publishable ${stats.active} · held back ${stats.incomplete}` +
      (stats.duplicates ? ` · ${stats.duplicates} duplicate(s) collapsed` : ""),
  );
  for (const [reason, count] of [...reasonCounts].sort((a, b) => b[1] - a[1])) {
    log(`    held back — ${reason}: ${count}`);
  }

  return stats;
}

async function main() {
  const loadedEnv = loadDotEnv();
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  log(`Config: ${loadedEnv ? ".env loaded" : "no .env file"} · url ${resolveUrl()}`);

  // A dry run exists to answer "does the upstream data clear the quality
  // gate?", which needs no database at all. Without a service role key it
  // runs fully offline from Supabase's perspective; with one, it also
  // probes the column mapping.
  let supabase = null;
  let optional = { categories: false, updatedAt: false };

  if (!DRY_RUN) {
    supabase = makeClient();
    log("Live run — rows will be upserted.\n");
    optional = await preflight(supabase);
    log(
      `Preflight OK. Optional columns present: ${
        Object.entries(optional)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(", ") || "none"
      }`,
    );
  } else if (hasKey) {
    supabase = makeClient();
    log(
      "Dry run — no catalog rows will be written. Service role key present, so the column\n" +
        "mapping is probed too (one sentinel row is written and immediately deleted).\n",
    );
    optional = await preflight(supabase);
    log(
      `Preflight OK. Optional columns present: ${
        Object.entries(optional)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(", ") || "none"
      }`,
    );
  } else {
    log(
      "Dry run — no credentials found, so the database is not contacted at all.\n" +
        "Fetching, validation and batching are still exercised in full. Set\n" +
        "SUPABASE_SERVICE_ROLE_KEY to additionally verify the column mapping.\n",
    );
  }

  const sources = SOURCE === "all" ? ["anime", "games"] : [SOURCE];
  const totals = { fetched: 0, active: 0, incomplete: 0, written: 0, duplicates: 0 };

  for (const source of sources) {
    if (!["anime", "games"].includes(source)) throw new Error(`Unknown source: ${source}`);
    const stats = await ingest(source, supabase, optional);
    for (const k of Object.keys(totals)) totals[k] += stats[k];
  }

  log(
    `\nDone. fetched ${totals.fetched} · publishable ${totals.active} · held back ${totals.incomplete}` +
      (totals.duplicates ? ` · ${totals.duplicates} duplicate(s) collapsed` : "") +
      `${DRY_RUN ? " · nothing written (dry run)" : ` · upserted ${totals.written}`}`,
  );
  log(
    "Records marked 'incomplete' stay hidden from the public client by the active_catalog_read policy.",
  );
}

// Exported so scripts/check-ingest-dedupe.mjs exercises the shipped functions
// rather than a copy that could drift out of step with them.
export { rowKey, dedupeByKey };

// Only run when invoked directly; importing this module for the checks above
// must not start an ingestion.
const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

try {
  if (invokedDirectly) await main();
} catch (error) {
  // Operational failures (unreachable host, wrong key, schema mismatch) are
  // expected states, not bugs — report them legibly instead of dumping a
  // stack. Set INGEST_DEBUG=1 when the stack is actually wanted.
  console.error(`\n${error?.message ?? error}\n`);
  if (process.env.INGEST_DEBUG) console.error(error);
  process.exit(1);
}
