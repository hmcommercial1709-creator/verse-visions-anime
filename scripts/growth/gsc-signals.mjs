/**
 * Reads the stored Search Console tables and turns them into opportunity
 * factors, each tagged with where it came from.
 *
 * Note on table names: the brief referred to `gsc_performance_daily`. The
 * tables this repository actually writes are `search_page_stats` and
 * `search_query_stats` (supabase/migrations/20260914170000_search_performance.sql).
 * Using the real names rather than creating a third, redundant table.
 *
 * Every value here is read from a row that Search Console reported. Where a
 * query has no history, the factor is omitted — the opportunity model then
 * drops its weight instead of substituting a number, and the resulting score
 * carries a lower confidence that says so.
 */

import { expectedCtr } from "../gsc/actions.mjs";
import {
  demandScore,
  feasibilityScore,
  ctrOpportunityScore,
  cannibalizationScore,
} from "./opportunity.mjs";

/**
 * Loads recent query-grain performance, keyed by normalized query.
 *
 * Aggregated across the window with position weighted by impressions: a plain
 * mean lets one impression at position 90 drag a query's average off a cliff.
 */
export async function loadQueryPerformance(
  supabase,
  { table = "search_query_stats", sinceDays = 28, log = console.log } = {},
) {
  const since = new Date(Date.now() - sinceDays * 86400000).toISOString().slice(0, 10);
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select("page,query,clicks,impressions,ctr,position,observed_on")
      .gte("observed_on", since)
      .range(from, from + pageSize - 1);
    if (error) {
      // A missing table is a migration that has not been applied — say which,
      // rather than letting the run die on a PostgREST code.
      throw new Error(
        `Reading ${table}: ${error.message}\n` +
          `  If the table does not exist, apply:\n` +
          `    supabase/migrations/20260914170000_search_performance.sql`,
      );
    }
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
  }
  log(`  ${rows.length} query row(s) since ${since}.`);

  const byQuery = new Map();
  for (const row of rows) {
    const key = String(row.query ?? "")
      .toLowerCase()
      .trim();
    if (!key) continue;
    let entry = byQuery.get(key);
    if (!entry) {
      entry = { query: key, clicks: 0, impressions: 0, positionWeight: 0, pages: new Map() };
      byQuery.set(key, entry);
    }
    entry.clicks += row.clicks ?? 0;
    entry.impressions += row.impressions ?? 0;
    entry.positionWeight += (row.position ?? 0) * (row.impressions ?? 0);

    let page = entry.pages.get(row.page);
    if (!page) {
      page = { url: row.page, clicks: 0, impressions: 0, positionWeight: 0 };
      entry.pages.set(row.page, page);
    }
    page.clicks += row.clicks ?? 0;
    page.impressions += row.impressions ?? 0;
    page.positionWeight += (row.position ?? 0) * (row.impressions ?? 0);
  }

  for (const entry of byQuery.values()) {
    entry.position = entry.impressions ? entry.positionWeight / entry.impressions : null;
    entry.ctr = entry.impressions ? entry.clicks / entry.impressions : null;
    entry.pageList = [...entry.pages.values()].map((page) => ({
      url: page.url,
      clicks: page.clicks,
      impressions: page.impressions,
      position: page.impressions ? page.positionWeight / page.impressions : null,
      rankingForQuery: true,
    }));
  }
  return byQuery;
}

/** Site-wide authority for the section a query's best page sits in. */
export function authorityBySection(queryPerformance) {
  const sections = new Map();
  for (const entry of queryPerformance.values()) {
    for (const page of entry.pageList) {
      const section =
        String(page.url)
          .replace(/^https?:\/\/[^/]+/, "")
          .split("/")
          .filter(Boolean)[0] ?? "root";
      const current = sections.get(section) ?? { impressions: 0, clicks: 0 };
      current.impressions += page.impressions;
      current.clicks += page.clicks;
      sections.set(section, current);
    }
  }
  const max = Math.max(1, ...[...sections.values()].map((s) => s.impressions));
  const scores = new Map();
  for (const [section, stats] of sections) scores.set(section, stats.impressions / max);
  return scores;
}

/**
 * Builds the GSC-derived half of a candidate's factors.
 *
 * Returns `{}` for a query Search Console has never reported. That is the
 * honest result — and it is also informative: a query with real trend demand
 * and no GSC history at all is precisely a content gap.
 */
export function gscFactors(query, queryPerformance, authority) {
  const entry = queryPerformance.get(String(query).toLowerCase().trim());
  const factors = {};
  const provenance = {};

  if (!entry) {
    // No impressions at all means the site does not appear for this query.
    // That is measured evidence of a gap, not an absence of evidence.
    factors.contentGap = 1;
    provenance.contentGap = "search_query_stats: no impressions recorded for this query";
    factors.cannibalization = 0;
    provenance.cannibalization = "search_query_stats: no page of this site ranks for it";
    return { factors, provenance, entry: null };
  }

  const demand = demandScore(entry.impressions);
  if (demand !== null) {
    factors.demand = demand;
    provenance.demand = `search_query_stats: ${entry.impressions.toLocaleString()} impressions`;
  }

  const feasibility = feasibilityScore(entry.position);
  if (feasibility !== null) {
    factors.rankingFeasibility = feasibility;
    provenance.rankingFeasibility = `search_query_stats: average position ${entry.position.toFixed(1)}`;
  }

  const ctrGap = ctrOpportunityScore(entry.ctr, expectedCtr(entry.position));
  if (ctrGap !== null) {
    factors.ctrOpportunity = ctrGap;
    provenance.ctrOpportunity = `search_query_stats: ${(entry.ctr * 100).toFixed(1)}% CTR at position ${entry.position.toFixed(1)}`;
  }

  // Already ranking is the opposite of a gap; how much depends on how well.
  factors.contentGap =
    entry.position === null ? 0.5 : Math.max(0, Math.min(1, (entry.position - 3) / 40));
  provenance.contentGap = `search_query_stats: already ranks ${entry.position?.toFixed(1) ?? "—"}`;

  const cannibalization = cannibalizationScore(entry.pageList);
  if (cannibalization !== null) {
    factors.cannibalization = cannibalization;
    provenance.cannibalization = `search_query_stats: ${entry.pageList.length} page(s) of this site rank for it`;
  }

  const best = entry.pageList.sort((a, b) => b.impressions - a.impressions)[0];
  if (best && authority) {
    const section =
      String(best.url)
        .replace(/^https?:\/\/[^/]+/, "")
        .split("/")
        .filter(Boolean)[0] ?? "root";
    const score = authority.get(section);
    if (score !== undefined) {
      factors.existingAuthority = score;
      provenance.existingAuthority = `search_query_stats: /${section} carries ${Math.round(score * 100)}% of the site's strongest section`;
    }
  }

  return { factors, provenance, entry };
}
