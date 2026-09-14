#!/usr/bin/env node
/**
 * Search Console → search_page_stats / search_query_stats → search_actions.
 *
 *   node scripts/ingest-gsc.mjs --dry-run
 *   node scripts/ingest-gsc.mjs --days=28
 *   node scripts/ingest-gsc.mjs --limit=15
 *
 * The feedback half of the growth engine. Everything upstream — trend feeds,
 * opportunity scores — is a prediction about what might work. This is the only
 * component that learns what did.
 *
 * It answers one question per page: what is the single most valuable thing to
 * do to this page, and what number says so. The queue it produces is ordered by
 * projected clicks gained, so a page at position 8 with twelve thousand
 * impressions outranks a page at position 6 with two hundred — which is the
 * ordering a person doing this by hand would struggle to hold in their head
 * across a few thousand URLs.
 *
 * It publishes nothing and edits nothing. Choosing to act on a queued page is
 * a separate, deliberate step; this script's job is to make that choice
 * informed and explainable.
 *
 * Requires GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY — already configured for
 * scripts/ping-gsc.js, same service account, same scope. Without them the run
 * exits cleanly and says what is missing rather than substituting estimates.
 */

import { readFileSync } from "node:fs";
import { assertCredentials } from "./supabase-preflight.mjs";
import { upsertAll } from "./resilient-upsert.mjs";
import {
  searchConsoleClient,
  queryAnalytics,
  comparisonWindows,
  toRecord,
  LAG_DAYS,
} from "./gsc/client.mjs";
import { classifyPage, unexpectedQueries, rankActions } from "./gsc/actions.mjs";

const log = console.log;
const arg = (name, fallback = null) => {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const DRY_RUN = flag("dry-run");
const WINDOW_DAYS = Number(arg("days", process.env.GSC_WINDOW_DAYS || 14));
const SHOW_LIMIT = Number(arg("limit", 15));
const SITE_URL = process.env.GSC_SITE_URL || "https://gamecastle.store/";
const PAGE_TABLE = "search_page_stats";
const QUERY_TABLE = "search_query_stats";
const ACTIONS_TABLE = "search_actions";

function loadDotEnv() {
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
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

function supabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("\nSUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.\n");
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

const aggregate = (rows, keyOf) => {
  const out = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    const existing = out.get(key);
    if (existing) {
      // Weight position by impressions: a plain mean would let a single
      // impression at position 90 drag a page's average off a cliff.
      existing.positionWeight += (row.position ?? 0) * (row.impressions ?? 0);
      existing.clicks += row.clicks;
      existing.impressions += row.impressions;
    } else {
      out.set(key, {
        key,
        clicks: row.clicks,
        impressions: row.impressions,
        positionWeight: (row.position ?? 0) * (row.impressions ?? 0),
      });
    }
  }
  for (const value of out.values()) {
    value.position = value.impressions ? value.positionWeight / value.impressions : null;
    value.ctr = value.impressions ? value.clicks / value.impressions : null;
  }
  return out;
};

const heading = (title) => log(`\n${title}\n${"─".repeat(title.length)}`);

function printQueue(title, rows, limit) {
  heading(`${title}  (${rows.length})`);
  if (!rows.length) {
    log("  none");
    return;
  }
  for (const row of rows.slice(0, limit)) {
    log(`  ${row.page}`);
    log(`     ${row.reason}`);
    if (row.bestQuery) log(`     top query: "${row.bestQuery}"`);
  }
  if (rows.length > limit) log(`  … and ${rows.length - limit} more`);
}

async function main() {
  const loadedEnv = loadDotEnv();
  log(`Search Console → ${ACTIONS_TABLE}${DRY_RUN ? "  (dry run — nothing is written)" : ""}`);
  log(`Config: ${loadedEnv ? ".env loaded" : "no .env file"}   property: ${SITE_URL}\n`);

  const searchconsole = await searchConsoleClient({ log });
  if (!searchconsole) process.exit(0);

  const windows = comparisonWindows(WINDOW_DAYS);
  log(
    `Windows (ending ${LAG_DAYS} days back, because Search Analytics is still\n` +
      `filling in more recent days and a partial day reads as a collapse):\n` +
      `  current  ${windows.currentStart} → ${windows.currentEnd}\n` +
      `  previous ${windows.baselineStart} → ${windows.baselineEnd}\n`,
  );

  const fetchWindow = async (startDate, endDate, dimensions) => {
    const rows = await queryAnalytics(searchconsole, { siteUrl: SITE_URL, startDate, endDate, dimensions, log });
    return rows.map((row) => toRecord(row, dimensions));
  };

  log("Reading performance:");
  const currentPages = await fetchWindow(windows.currentStart, windows.currentEnd, ["page"]);
  log(`  current window:  ${currentPages.length} page(s)`);
  const baselinePages = await fetchWindow(windows.baselineStart, windows.baselineEnd, ["page"]);
  log(`  previous window: ${baselinePages.length} page(s)`);
  const currentQueries = await fetchWindow(windows.currentStart, windows.currentEnd, ["page", "query"]);
  log(`  current window:  ${currentQueries.length} page+query row(s)`);

  if (!currentPages.length) {
    log(
      `\nNo rows for this window. Either the property has no impressions yet, or\n` +
        `GSC_SITE_URL does not match the property exactly — a domain property is\n` +
        `"sc-domain:gamecastle.store"; a URL-prefix property keeps its trailing slash.\n`,
    );
    process.exit(0);
  }

  const supabase = supabaseClient();
  await assertCredentials(supabase, PAGE_TABLE, { log, column: "page" });

  // Stored against the window's END date: that is the day the figures describe
  // up to, and it keeps a re-run of the same window idempotent.
  const observedOn = windows.currentEnd;
  const pageRows = currentPages.map((row) => ({
    page: row.page,
    observed_on: observedOn,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
  const queryRows = currentQueries.map((row) => ({
    page: row.page,
    query: row.query,
    observed_on: observedOn,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));

  if (DRY_RUN) {
    log(`\n  (dry run) would store ${pageRows.length} page row(s) and ${queryRows.length} query row(s).`);
  } else {
    log(`\nStoring ${pageRows.length} page row(s):`);
    await upsertAll(supabase, PAGE_TABLE, pageRows, {
      conflictTarget: "page,observed_on",
      keyOf: (row) => `${row.page}::${row.observed_on}`,
      log,
    });
    log(`Storing ${queryRows.length} query row(s):`);
    await upsertAll(supabase, QUERY_TABLE, queryRows, {
      conflictTarget: "page,query,observed_on",
      keyOf: (row) => `${row.page}::${row.query}::${row.observed_on}`,
      log,
    });
  }

  const baselineByPage = aggregate(baselinePages, (row) => row.page);
  const queriesByPage = new Map();
  for (const row of currentQueries) {
    const list = queriesByPage.get(row.page);
    if (list) list.push(row);
    else queriesByPage.set(row.page, [row]);
  }

  const classified = currentPages.map((row) =>
    classifyPage(
      { ...row, page: row.page },
      baselineByPage.get(row.page) ?? null,
      queriesByPage.get(row.page) ?? [],
    ),
  );
  const queue = rankActions(classified);

  log(`\nClassified ${classified.length} page(s): ${queue.length} queued for action.`);

  if (!DRY_RUN && queue.length) {
    const actionRows = queue.map((row) => ({
      page: row.page,
      action: row.action,
      reason: row.reason,
      best_query: row.bestQuery,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      position_delta: row.positionDelta,
      impressions_delta: row.impressionsDelta,
      priority: row.priority,
      window_days: WINDOW_DAYS,
      updated_at: new Date().toISOString(),
    }));
    log(`Storing ${actionRows.length} action(s):`);
    await upsertAll(supabase, ACTIONS_TABLE, actionRows, {
      conflictTarget: "page",
      keyOf: (row) => row.page,
      log,
    });
  }

  const of = (action) => queue.filter((row) => row.action === action);
  printQueue("Closest to page one — work these first", of("striking_distance"), SHOW_LIMIT);
  printQueue("Ranks well, few clicks — rewrite title and description", of("ctr_gap"), SHOW_LIMIT);
  printQueue("Gaining impressions — expand while it moves", of("rising"), SHOW_LIMIT);
  printQueue("Losing ground — diagnose, do not publish over it", of("declining"), SHOW_LIMIT);

  const unexpected = [];
  for (const [page, rows] of queriesByPage) {
    for (const row of unexpectedQueries(page, rows).slice(0, 3)) {
      unexpected.push({ page, ...row });
    }
  }
  unexpected.sort((a, b) => b.impressions - a.impressions);
  heading(`Ranking for queries the page was not written for  (${unexpected.length})`);
  if (!unexpected.length) log("  none");
  for (const row of unexpected.slice(0, SHOW_LIMIT)) {
    log(`  ${String(row.impressions).padStart(7)} impressions  "${row.query}"`);
    log(`          currently answered by ${row.page}`);
  }
  log(
    `\n  These are demand the site serves by accident. A dedicated page is worth it\n` +
      `  only where the query is a genuinely different intent — otherwise improving\n` +
      `  the page already ranking is the better move, and avoids competing with it.\n`,
  );
}

main().catch((error) => {
  console.error(`\n${error.stack || error.message}\n`);
  process.exit(1);
});
