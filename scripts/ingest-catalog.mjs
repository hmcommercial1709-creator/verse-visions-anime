#!/usr/bin/env node
/**
 * Chunked catalog ingestion: Jikan (anime) and FreeToGame (games) into
 * Supabase, with a hard quality gate.
 *
 *   node scripts/ingest-catalog.mjs --source=all --dry-run
 *   node scripts/ingest-catalog.mjs --source=anime --limit=500
 *   node scripts/ingest-catalog.mjs --source=games --resume
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. The service role is
 * mandatory, not a convenience: public.entities has RLS enabled with only a
 * SELECT policy (active_catalog_read), so writes with the publishable key
 * are rejected outright. The script refuses to start without it rather than
 * failing halfway through a batch.
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
 * supabase/migrations/20260901204040_allow_active_catalog_read.sql. It could
 * not be executed here (no outbound network in the build environment), so
 * run --dry-run first: that exercises fetching, validation and batching, and
 * performs a preflight write probe, without committing rows.
 */

import { createClient } from "@supabase/supabase-js";

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

/** Optional columns, written only if the preflight finds them present. */
const OPTIONAL_COLUMNS = { categories: "categories", updatedAt: "updated_at" };

const CHUNK_SIZE = 500;
const MIN_SUMMARY_CHARS = 120;
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

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function getJson(url, attempt = 1) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "GameCastle/1.0 (+https://gamecastle.store)" },
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

/**
 * The gate. Returns the reasons a record is not publishable; an empty array
 * means it qualifies for status 'active'.
 */
function incompletenessReasons(record) {
  const reasons = [];
  if (!record.slug) reasons.push("missing slug");
  if (!record.name?.trim()) reasons.push("missing name");
  if (!record.description || record.description.trim().length < MIN_SUMMARY_CHARS) {
    reasons.push(`summary under ${MIN_SUMMARY_CHARS} chars`);
  }
  if (!record.image_url || !/^https?:\/\//i.test(record.image_url)) reasons.push("missing image");
  if (!Array.isArray(record.categories) || record.categories.length === 0) reasons.push("no categories");
  return reasons;
}

const slugify = (value, id) =>
  `${id}-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)}`;

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
          a.images?.webp?.large_image_url || a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "",
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

function makeClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("SUPABASE_URL is not set");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. public.entities has RLS enabled with only a SELECT " +
        "policy, so the publishable key cannot write. Use the service role key (sb_secret_… or the " +
        "legacy service_role JWT) from your Supabase project's API settings.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
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

  const { error: writeError } = await supabase.from(TABLE).upsert(probe, { onConflict: COLUMNS.slug });
  if (writeError) {
    throw new Error(
      `Preflight write to ${TABLE} failed: ${writeError.message}\n` +
        `Adjust the COLUMNS map at the top of this script to match your schema.`,
    );
  }
  await supabase.from(TABLE).delete().eq(COLUMNS.slug, probeSlug);

  return optional;
}

async function loadCursor(supabase, source) {
  const { data } = await supabase
    .from(STATE_TABLE)
    .select("value")
    .eq("key", `${STATE_KEY_PREFIX}${source}`)
    .maybeSingle();
  return data?.value?.page ?? 1;
}

async function saveCursor(supabase, source, page) {
  await supabase
    .from(STATE_TABLE)
    .upsert({ key: `${STATE_KEY_PREFIX}${source}`, value: { page }, updated_at: new Date().toISOString() },
      { onConflict: "key" });
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
  const stats = { fetched: 0, active: 0, incomplete: 0, written: 0 };
  const reasonCounts = new Map();
  let buffer = [];
  let chunkNo = 0;

  const flush = async () => {
    if (buffer.length === 0) return;
    chunkNo++;
    if (DRY_RUN) {
      log(`  [dry-run] chunk ${chunkNo} — ${buffer.length} rows (not written)`);
    } else {
      const { error } = await supabase.from(TABLE).upsert(buffer, { onConflict: COLUMNS.slug });
      if (error) throw new Error(`Chunk ${chunkNo} failed after ${stats.written} rows: ${error.message}`);
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
    buffer.push(toRow(raw, optional, stats, reasonCounts));
    if (buffer.length >= CHUNK_SIZE) await flush();
  }
  await flush();

  log(`  fetched ${stats.fetched} · publishable ${stats.active} · held back ${stats.incomplete}`);
  for (const [reason, count] of [...reasonCounts].sort((a, b) => b[1] - a[1])) {
    log(`    held back — ${reason}: ${count}`);
  }

  return stats;
}

const supabase = makeClient();
log(
  DRY_RUN
    ? "Dry run — no catalog rows will be written. (Preflight still writes and deletes one\nsentinel row, since probing the column mapping is the point of it.)\n"
    : "Live run — rows will be upserted.\n",
);

const optional = await preflight(supabase);
log(`Preflight OK. Optional columns present: ${
  Object.entries(optional).filter(([, v]) => v).map(([k]) => k).join(", ") || "none"
}`);

const sources = SOURCE === "all" ? ["anime", "games"] : [SOURCE];
const totals = { fetched: 0, active: 0, incomplete: 0, written: 0 };

for (const source of sources) {
  if (!["anime", "games"].includes(source)) throw new Error(`Unknown source: ${source}`);
  const stats = await ingest(source, supabase, optional);
  for (const k of Object.keys(totals)) totals[k] += stats[k];
}

log(
  `\nDone. fetched ${totals.fetched} · publishable ${totals.active} · held back ${totals.incomplete}` +
    `${DRY_RUN ? " · nothing written (dry run)" : ` · upserted ${totals.written}`}`,
);
log("Records marked 'incomplete' stay hidden from the public client by the active_catalog_read policy.");
