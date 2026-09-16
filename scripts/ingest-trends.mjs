#!/usr/bin/env node
/**
 * Trend signals → public.trend_observations → public.trend_terms.
 *
 *   node scripts/ingest-trends.mjs --dry-run
 *   node scripts/ingest-trends.mjs --geos=US,GB,SA,AE
 *   node scripts/ingest-trends.mjs --report-only
 *
 * What this does, and just as importantly what it does not.
 *
 * DOES: collect what people are searching for and watching in this site's
 * subject areas, store each day's snapshot, measure growth across those
 * snapshots, and say which of the fast-growing terms the catalog can already
 * answer and which it cannot.
 *
 * DOES NOT: publish a page per trending keyword. That was the shape of the
 * original plan, and it is the specific pattern Google's spam policy names as
 * scaled content abuse - mass-produced pages built around keywords rather than
 * around anything the site knows, carrying affiliate links. This repository
 * already paid for that lesson once: the generated catalog pages were thin
 * enough to be worth deleting, which is why catalog-quality-gate.mjs exists.
 * Doing it again at trend speed, on commercial pages, is how a domain earns a
 * manual action rather than traffic.
 *
 * So the output is two queues:
 *
 *   matched   The term names a catalog row that already exists. There is a
 *             real page for this demand today; it gets refreshed and
 *             resubmitted to IndexNow, which is a legitimate, immediate signal.
 *
 *   gaps      The term is on-topic and rising, and the site has nothing. This
 *             is written to trend_terms and printed as a ranked build queue -
 *             for a person to decide on, and for the existing ingest scripts
 *             to fill with real catalog data, which then passes the quality
 *             gate on its own merits.
 *
 * On the Google Indexing API, which the plan asked for: Google documents it as
 * supporting JobPosting and BroadcastEvent only. Calling it for catalog pages
 * is off-policy and is not what gets them crawled. The honest levers are the
 * ones already wired here - an accurate sitemap with real lastmod, internal
 * links, and IndexNow for Bing, Yandex and Naver, which genuinely is
 * near-immediate. scripts/ping-search.ts already does that and is reused
 * rather than reimplemented.
 */

import { readFileSync } from "node:fs";
import { assertCredentials } from "./supabase-preflight.mjs";
import { upsertAll, dedupeByKey } from "./resilient-upsert.mjs";
import {
  fetchGoogleTrends,
  fetchYouTubePopular,
  fetchYouTubeSearch,
  YOUTUBE_CATEGORIES,
  YOUTUBE_SEED_KEYWORDS,
  YOUTUBE_FALLBACK_SEEDS,
  YOUTUBE_SEARCH_BUDGET,
  FRANCHISE_SEEDS_PER_RUN,
  franchiseSeedsForDay,
  normalizeTerm,
} from "./trends/sources.mjs";
import { classifyTerm, buildCatalogMatcher, extractEntity } from "./trends/classify.mjs";
import {
  summarizeByTerm,
  BREAKOUT_VELOCITY,
  CURRENT_WINDOW_DAYS,
  BASELINE_WINDOW_DAYS,
} from "./trends/velocity.mjs";

if (!globalThis.fetch) {
  console.error(`\nNeeds Node 18+ for global fetch (running ${process.version}).\n`);
  process.exit(1);
}

const log = console.log;
const arg = (name, fallback = null) => {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const DRY_RUN = flag("dry-run");
const REPORT_ONLY = flag("report-only");
const GEOS = arg("geos", process.env.TREND_GEOS || "US,GB,SA,AE,EG,DE,BR,ID")
  .split(",")
  .map((g) => g.trim())
  .filter(Boolean);
const OBSERVATIONS_TABLE = "trend_observations";
const TERMS_TABLE = "trend_terms";
const ENTITIES_TABLE = "entities";
const HISTORY_DAYS = CURRENT_WINDOW_DAYS + BASELINE_WINDOW_DAYS;

function loadDotEnv() {
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
    return true;
  } catch {
    return false;
  }
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

function client() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "\nSUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.\n" +
        "  Locally: put them in .env\n" +
        "  In CI:   Settings → Secrets and variables → Actions\n",
    );
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/* ------------------------------------------------------------- collection */

/**
 * Every feed, every region. Failures are counted, not thrown: a day with three
 * of four sources is still a useful day of history, and losing it because one
 * endpoint was down would leave a hole in exactly the series velocity depends
 * on.
 */
async function collect(catalogSeeds = []) {
  const rows = [];
  const health = [];
  for (const geo of GEOS) {
    const trends = await fetchGoogleTrends(geo, { log });
    health.push({
      source: "google-trends",
      geo,
      ok: trends.ok,
      count: trends.rows.length,
      reason: trends.reason,
    });
    rows.push(...trends.rows.map((row) => ({ ...row, listSize: trends.rows.length })));

    for (const category of YOUTUBE_CATEGORIES) {
      const youtube = await fetchYouTubePopular(geo, category, { log });
      health.push({
        source: `youtube-${category}`,
        geo,
        ok: youtube.ok,
        count: youtube.rows.length,
        reason: youtube.reason,
      });
      rows.push(...youtube.rows.map((row) => ({ ...row, listSize: youtube.rows.length })));
    }
  }

  // The seeded pass. The chart above answers "what is this country watching";
  // this asks "what is our field publishing today", which is the question the
  // site actually needs. search.list costs 100 units against videos.list's 1,
  // so the budget is a hard stop rather than a target.
  let spent = 0;
  const runSeeds = async (seeds, label) => {
    let produced = 0;
    for (const seed of seeds) {
      if (spent >= YOUTUBE_SEARCH_BUDGET) {
        log(`  search budget spent (${YOUTUBE_SEARCH_BUDGET} calls); remaining seeds skipped.`);
        break;
      }
      spent += 1;
      const found = await fetchYouTubeSearch(seed, { log });
      health.push({
        source: `${label}-${seed.lang}-${seed.category}`,
        geo: seed.lang.toUpperCase(),
        ok: found.ok,
        count: found.rows.length,
        reason: found.reason,
      });
      produced += found.rows.length;
      rows.push(...found.rows.map((row) => ({ ...row, listSize: found.rows.length })));
    }
    return produced;
  };

  // Generic seeds find what is rising that nobody named. Franchise seeds ask
  // about the titles the site exists to cover, which is where the useful
  // answer usually is: "anime trailer" returns whatever the algorithm favours
  // today, while "Kaiju No. 8" returns what happened to Kaiju No. 8 today.
  //
  // The franchise list is walked a slice at a time — all 207 in one pass would
  // cost 20,700 quota units against a 10,000 budget — so the cycle completes
  // over several days and repeats.
  const generic = await runSeeds(YOUTUBE_SEED_KEYWORDS, "youtube-seed");
  const franchises = franchiseSeedsForDay(FRANCHISE_SEEDS_PER_RUN);
  log(
    `\n  Asking about ${franchises.length} franchise(s) this run: ` +
      `${franchises.slice(0, 4).map((f) => f.q).join(", ")}…`,
  );
  const named = await runSeeds(franchises, "youtube-franchise");

  // And a slice of the catalog itself. The curated list is a few hundred names
  // somebody typed; the catalog is everything the site ingests from AniList
  // and Steam and grows every night, which is the only seed source that keeps
  // up with a field where new titles appear weekly. Curated seeds have the
  // higher hit rate, so they go first and the catalog spends what is left.
  const fromCatalog = await runSeeds(catalogSeeds, "youtube-catalog");
  const seeded = generic + named + fromCatalog;

  // An empty seeded pass leaves a hole in the day's history, and velocity is
  // meaningless across a gap. The fallback seeds are broader on purpose, and
  // the run says it used them so a week of fallback-only data is visible
  // rather than passing for ordinary collection.
  if (seeded === 0) {
    log("\n  No seed returned a video. Falling back to the broad seeds.");
    const rescued = await runSeeds(YOUTUBE_FALLBACK_SEEDS, "youtube-fallback");
    if (rescued === 0) log("  The fallback seeds returned nothing either.");
  }

  return { rows, health };
}

/* ---------------------------------------------------------------- catalog */

/**
 * A rotating slice of the catalog, asked about by name.
 *
 * The curated franchise lists are a few hundred titles. The catalog is every
 * anime and game the site ingests, and it grows every night — which is the
 * only seed source that keeps pace with a field where new titles appear
 * weekly. Walked the same way as the curated lists so the whole catalog is
 * covered over time rather than the first page being asked about forever.
 *
 * Sorted by name so the window is stable between runs: rows come back from the
 * database in no guaranteed order, and an unstable sort would re-ask about the
 * same arbitrary handful every day while never reaching the rest.
 */
const CATALOG_SEEDS_PER_RUN = 6;

function catalogSeedsForDay(catalog, count, date = new Date()) {
  const names = catalog
    .filter((row) => (row?.name ?? "").trim().length >= 4)
    .map((row) => ({ name: String(row.name).trim(), type: row.entity_type ?? row.entityType }))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!names.length || count <= 0) return [];
  const day = Math.floor(date.getTime() / 86400000);
  const start = (((day * count) % names.length) + names.length) % names.length;
  const picked = [];
  for (let i = 0; i < Math.min(count, names.length); i += 1) {
    const row = names[(start + i) % names.length];
    picked.push({ q: row.name, lang: "en", category: row.type === "game" ? "20" : "1" });
  }
  return picked;
}

/** Every slug and name the site can already land a visitor on. */
async function loadCatalog(supabase) {
  const all = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(ENTITIES_TABLE)
      .select("entity_type,slug,name")
      .eq("status", "active")
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Reading ${ENTITIES_TABLE}: ${error.message}`);
    if (!data?.length) break;
    all.push(...data);
    if (data.length < pageSize) break;
  }
  return all;
}

/* ----------------------------------------------------------------- report */

const pct = (value) =>
  value === null ? "—" : `${value >= 0 ? "+" : ""}${(value * 100).toFixed(0)}%`;

function printQueue(title, rows, limit = 25) {
  log(`\n${title}  (${rows.length})`);
  if (!rows.length) {
    log("  none");
    return;
  }
  for (const row of rows.slice(0, limit)) {
    const where = row.matched_entity_slug
      ? `/${row.matched_entity_type}/${row.matched_entity_slug}`
      : "no page yet";
    log(
      `  ${pct(row.velocity).padStart(7)}  ${String(row.domain).padEnd(11)} ` +
        `${row.display_term.slice(0, 58).padEnd(58)} ${where}`,
    );
  }
  if (rows.length > limit) log(`  … and ${rows.length - limit} more`);
}

/* ------------------------------------------------------------------- main */

async function main() {
  const loadedEnv = loadDotEnv();
  log(
    `Trend signals → ${OBSERVATIONS_TABLE} → ${TERMS_TABLE}${DRY_RUN ? "  (dry run — nothing is written)" : ""}`,
  );
  log(`Config: ${loadedEnv ? ".env loaded" : "no .env file"}   regions: ${GEOS.join(", ")}\n`);

  const supabase = client();
  await assertCredentials(supabase, OBSERVATIONS_TABLE, { log, column: "term" });

  log("Collecting:");
  // Loaded before collection, because the catalog is both what the seeded pass
  // asks about and what the classifier recognises. It used to load after both,
  // which made the hand-written vocabulary a whitelist over a catalog that
  // already knew more than it did.
  const catalog = await loadCatalog(supabase);
  const matchCatalog = buildCatalogMatcher(catalog);
  log(`  ${catalog.length} catalog row(s) loaded.`);

  const { rows: raw, health } = await collect(catalogSeedsForDay(catalog, CATALOG_SEEDS_PER_RUN));
  const live = health.filter((h) => h.ok).length;
  log(`\n  ${live}/${health.length} feed(s) responded, ${raw.length} raw term(s).`);
  if (!live) {
    console.error(
      "\nEvery feed failed. Not writing an empty day — that would read as a genuine drop to zero.\n",
    );
    process.exit(1);
  }

  // Classify, then reduce to the thing the term is ABOUT.
  //
  // A feed row is a video title, and a title is not a subject. Storing the
  // title made every row unique, so twelve videos about one game became twelve
  // "terms" and none of them was searchable. Extracting the entity collapses
  // them onto the name a person would actually type, which is also the name a
  // page can be written about.
  //
  // On-topic without an extractable entity is a real state, not a failure:
  // "best anime of the season" is ours and names nothing to write about. It is
  // counted separately so the log distinguishes "not our field" from "our
  // field, nothing to build".
  //
  // The CATALOG is tried before the hand-written vocabulary, and that order is
  // the whole point. The vocabulary is a few hundred names somebody typed; the
  // catalog is every anime, manga and game the site ingests from AniList,
  // Jikan and Steam, refreshed nightly. Running the vocabulary first made it a
  // whitelist — a series that premiered this week was dropped before the
  // catalog, which already knew it, was ever consulted.
  //
  // So: catalog first for reach, vocabulary second for the things a catalog
  // has no row for (a studio, a platform, a storefront currency).
  const DOMAIN_OF_ENTITY = { anime: "anime", manga: "anime", game: "games", games: "games" };

  const classified = [];
  let topicalWithoutEntity = 0;
  let fromCatalog = 0;
  for (const row of raw) {
    const subject = row.originalTitle ?? row.rawTerm;

    const known = matchCatalog(subject);
    if (known) {
      fromCatalog += 1;
      classified.push({
        ...row,
        term: normalizeTerm(known.name),
        rawTerm: known.name,
        sourceTitle: row.rawTerm,
        domain: DOMAIN_OF_ENTITY[known.entityType] ?? "anime",
        matchedWord: known.name,
      });
      continue;
    }

    const domain = classifyTerm(subject);
    if (!domain) continue;
    const entity = extractEntity(subject);
    if (!entity) {
      topicalWithoutEntity += 1;
      continue;
    }
    classified.push({
      ...row,
      term: normalizeTerm(entity.entity),
      rawTerm: entity.entity,
      sourceTitle: row.rawTerm,
      domain: entity.domain,
      matchedWord: entity.entity,
    });
  }
  log(
    `  ${classified.length} term(s) carry an entity ` +
      `(${fromCatalog} from the catalog, ${classified.length - fromCatalog} from the vocabulary; ` +
      `${topicalWithoutEntity} on-topic but name nothing, ` +
      `${raw.length - classified.length - topicalWithoutEntity} off-topic).`,
  );

  const observations = dedupeByKey(
    classified.map((row) => ({
      source: row.source,
      geo: row.geo,
      term: row.term,
      raw_term: row.rawTerm,
      rank: row.rank,
      list_size: row.listSize,
      weight: row.weight,
    })),
    (row) => `${row.source}::${row.geo}::${row.term}`,
  );

  if (DRY_RUN || REPORT_ONLY) {
    log(`\n  (dry run) would write ${observations.length} observation(s).`);
  } else {
    log(`\nWriting ${observations.length} observation(s):`);
    await upsertAll(supabase, OBSERVATIONS_TABLE, observations, {
      conflictTarget: "source,geo,term,observed_on",
      keyOf: (row) => `${row.source}::${row.geo}::${row.term}`,
      log,
    });
  }

  // Read the window back rather than scoring what was just collected: the
  // point is growth against the days already stored, which this process has
  // never seen.
  const since = new Date(Date.now() - HISTORY_DAYS * 86400000).toISOString().slice(0, 10);
  const { data: history, error: historyError } = await supabase
    .from(OBSERVATIONS_TABLE)
    .select("term,raw_term,source,rank,list_size,weight,observed_on")
    .gte("observed_on", since);
  if (historyError) throw new Error(`Reading ${OBSERVATIONS_TABLE}: ${historyError.message}`);

  log(`\nScoring ${history.length} observation(s) since ${since}:`);

  // Re-extract on read, not only on write.
  //
  // Rows written before extraction existed hold the raw video title as their
  // term, and the history window is six days — so a queue built straight from
  // storage keeps showing "ELE ESTA TE OBSERVANDO NO MINECRAFT" next to the
  // clean entities for most of a week, and the two never merge into one
  // signal. Normalising here repairs the stored past instead of waiting it
  // out, and it is idempotent: a row already reduced to its entity extracts to
  // the same entity again.
  let repaired = 0;
  const normalizedHistory = [];
  for (const row of history) {
    const subject = row.raw_term ?? row.term;
    const hit = matchCatalog(subject);
    const entity = hit ? hit.name : (extractEntity(subject)?.entity ?? null);
    if (!entity) continue;
    const term = normalizeTerm(entity);
    if (term !== row.term) repaired += 1;
    normalizedHistory.push({ ...row, term, raw_term: entity });
  }
  if (repaired) {
    log(`  ${repaired} stored row(s) predate extraction and were reduced on read.`);
  }
  const dropped = history.length - normalizedHistory.length;
  if (dropped) {
    log(`  ${dropped} stored row(s) name nothing extractable and are not scored.`);
  }

  const summaries = summarizeByTerm(normalizedHistory, { asOf: new Date() });

  const display = new Map();
  const domains = new Map();
  for (const row of normalizedHistory) {
    if (!display.has(row.term)) display.set(row.term, row.raw_term);
    if (!domains.has(row.term)) domains.set(row.term, classifyTerm(row.raw_term)?.domain ?? null);
  }

  const terms = [];
  for (const [term, summary] of summaries) {
    const domain = domains.get(term);
    if (!domain) continue;
    const match = matchCatalog(display.get(term) ?? term);
    terms.push({
      term,
      display_term: display.get(term) ?? term,
      domain,
      matched_entity_type: match?.entityType ?? null,
      matched_entity_slug: match?.slug ?? null,
      first_seen_at: summary.firstSeen
        ? `${summary.firstSeen}T00:00:00Z`
        : new Date().toISOString(),
      last_seen_at: summary.lastSeen ? `${summary.lastSeen}T00:00:00Z` : new Date().toISOString(),
      observation_count: summary.observationCount,
      source_count: summary.sourceCount,
      current_score: summary.currentScore,
      baseline_score: summary.baselineScore,
      velocity: summary.velocity,
      updated_at: new Date().toISOString(),
    });
  }

  const measured = terms.filter((t) => t.velocity !== null);
  const establishing = terms.length - measured.length;
  log(
    `  ${terms.length} term(s) summarized: ${measured.length} measurable, ${establishing} still establishing a baseline.`,
  );
  if (!measured.length) {
    log(
      `\n  No velocity yet. That is expected until ${HISTORY_DAYS} days of history exist —\n` +
        `  growth needs two windows, and inventing one would be a made-up number.`,
    );
  }

  if (!DRY_RUN && !REPORT_ONLY && terms.length) {
    log(`\nWriting ${terms.length} term summar(ies):`);
    await upsertAll(supabase, TERMS_TABLE, terms, {
      conflictTarget: "term",
      keyOf: (row) => row.term,
      log,
    });
  }

  const breakouts = measured
    .filter((t) => t.velocity >= BREAKOUT_VELOCITY)
    .sort((a, b) => b.velocity - a.velocity);

  printQueue(
    `Rising, and the catalog already answers it — refresh these`,
    breakouts.filter((t) => t.matched_entity_slug),
  );
  printQueue(
    `Rising, and nothing on the site covers it — build queue`,
    breakouts.filter((t) => !t.matched_entity_slug),
  );

  // Velocity compares two windows, so both lists above are empty for the first
  // six days of history — and stay empty for any term that is merely steady
  // rather than accelerating. Coverage needs no velocity: whether the site has
  // a page for a term is known the moment the term is collected. Withholding
  // it until velocity exists is why the queue printed "none" on a day when 152
  // on-topic terms had just been written, which reads as "nothing to do" when
  // the truth was "the answer is not being shown".
  const uncovered = terms
    .filter((t) => !t.matched_entity_slug)
    .sort((a, b) => (b.current_score ?? 0) - (a.current_score ?? 0));

  printQueue(
    `Trending today, nothing on the site covers it — velocity not yet known`,
    uncovered,
    40,
  );

  log(
    `\nThe build queue is a list of decisions, not a publish list. Fill a gap by\n` +
      `ingesting real catalog data for it; the quality gate then judges the page on\n` +
      `what it actually holds, exactly as it does for every other row.\n`,
  );

  const refreshable = breakouts.filter((t) => t.matched_entity_slug);
  if (refreshable.length) {
    log(`${refreshable.length} existing page(s) have rising demand. Submit them with:`);
    log(`  npx tsx scripts/ping-search.ts\n`);
  }
}

main().catch((error) => {
  console.error(`\n${error.stack || error.message}\n`);
  process.exit(1);
});
