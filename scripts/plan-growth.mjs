#!/usr/bin/env node
/**
 * The decision pass: turns stored signals into a short, ranked, explained list
 * of actions — and nothing else.
 *
 *   node scripts/plan-growth.mjs --dry-run
 *   node scripts/plan-growth.mjs --max-create=5 --max-improve=15
 *
 * It reads what the other passes stored (trend observations and velocity,
 * Search Console performance) and the site's own page inventory, scores each
 * candidate, decides update-vs-create, applies the publishing cap, and prints
 * the result with the numbers that produced it.
 *
 * It writes no content and creates no URLs. The output is a plan a person
 * approves. That boundary is deliberate: an engine that both chooses and
 * publishes has no point at which a bad choice can be caught, and the failure
 * mode of automated SEO is never "too few pages".
 *
 * Every factor is measured or absent. Where a signal is missing its weight
 * leaves the model rather than taking a default, and the printed confidence
 * says how much of the score rested on real evidence.
 */

import { readFileSync } from "node:fs";
import { assertCredentials } from "./supabase-preflight.mjs";
import {
  scoreOpportunity,
  rankOpportunities,
  velocityScore,
  intentOf,
  DEFAULT_WEIGHTS,
} from "./growth/opportunity.mjs";
import { loadQueryPerformance, authorityBySection, gscFactors } from "./growth/gsc-signals.mjs";
import { classifyLifecycle } from "./growth/lifecycle.mjs";
import { decide, applyPublishingLimits } from "./growth/decide.mjs";
import { resolveSerpProvider, serpFactors } from "./growth/serp-provider.mjs";
import { classifyTerm } from "./trends/classify.mjs";
import { heatOf } from "./trends/velocity.mjs";

const log = console.log;
const arg = (name, fallback = null) => {
  const hit = process.argv.find((v) => v.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const DRY_RUN = process.argv.includes("--dry-run");
const MAX_CREATE = Number(arg("max-create", process.env.GROWTH_MAX_CREATE || 5));
const MAX_IMPROVE = Number(arg("max-improve", process.env.GROWTH_MAX_IMPROVE || 15));
const HISTORY_DAYS = Number(arg("history-days", 30));

function loadDotEnv() {
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
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

/**
 * Every page the site actually serves, from the sitemap — one source of truth.
 *
 * src/lib/sitemap.ts is TypeScript and uses the "@/..." path alias, which only
 * a bundler or tsx resolves. Run under plain node this threw
 * ERR_MODULE_NOT_FOUND and took the whole plan down — after it had already
 * read the signals, which is the expensive part. It passed locally only
 * because I ran it with tsx, and CI runs `node`.
 *
 * So: tsx is now a declared dependency and the npm script uses it, AND this
 * degrades rather than throwing. Losing the static page inventory makes the
 * update-vs-create decision more conservative (fewer known pages to match
 * against), never wrong — and a conservative plan beats no plan.
 */
async function loadSitePages({ log: logger = log } = {}) {
  try {
    const { PARTITIONS, partitionEntries } = await import("../src/lib/sitemap.ts");
    const pages = [];
    for (const partition of PARTITIONS) {
      for (const entry of partitionEntries(partition)) {
        pages.push({
          url: entry.path,
          title: entry.path.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ") ?? "",
          partition,
        });
      }
    }
    return pages;
  } catch (error) {
    logger(
      `  the static page inventory is unavailable (${error.code ?? error.message}).\n` +
        `  Run this with tsx so the TypeScript path aliases resolve:\n` +
        `    npm run plan:growth\n` +
        `  Continuing on Search Console pages alone — decisions stay conservative.`,
    );
    return [];
  }
}

async function loadTrendTerms(supabase, { log: logger = log } = {}) {
  const { data, error } = await supabase
    .from("trend_terms")
    .select(
      "term,display_term,domain,velocity,current_score,observation_count,matched_entity_slug,matched_entity_type",
    );
  if (error) {
    throw new Error(
      `Reading trend_terms: ${error.message}\n` +
        `  If the table does not exist, apply:\n` +
        `    supabase/migrations/20260914120000_trend_signals.sql`,
    );
  }
  logger(`  ${data?.length ?? 0} trend term(s).`);
  return data ?? [];
}

async function loadObservations(supabase, sinceDays) {
  const since = new Date(Date.now() - sinceDays * 86400000).toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("trend_observations")
    .select("term,rank,list_size,observed_on")
    .gte("observed_on", since);
  if (error) throw new Error(`Reading trend_observations: ${error.message}`);
  const byTerm = new Map();
  for (const row of data ?? []) {
    const list = byTerm.get(row.term) ?? [];
    list.push({ day: row.observed_on, score: heatOf(row.rank, row.list_size) });
    byTerm.set(row.term, list);
  }
  return byTerm;
}

const bar = (value) => "█".repeat(Math.round((value ?? 0) * 20)).padEnd(20, "·");

function printDecision(index, row) {
  const { candidate, scored, decision, lifecycle } = row;
  log(`\n${String(index).padStart(2)}. ${candidate.display}`);
  log(
    `    score ${bar(scored.score)} ${scored.score}   confidence ${scored.confidence}   ${lifecycle.stage}`,
  );
  log(`    → ${decision.action.toUpperCase()}${decision.target ? `  ${decision.target}` : ""}`);
  log(`      ${decision.reason}`);
  for (const line of decision.evidence) log(`      · ${line}`);
  log(`      factors: ${scored.contributions.map((c) => `${c.factor}=${c.value}`).join("  ")}`);
  if (scored.missing.length)
    log(`      unmeasured (weights removed): ${scored.missing.join(", ")}`);
}

async function main() {
  const loadedEnv = loadDotEnv();
  log(`Growth plan${DRY_RUN ? "  (dry run)" : ""}`);
  log(
    `Config: ${loadedEnv ? ".env loaded" : "no .env file"}   caps: ${MAX_CREATE} new, ${MAX_IMPROVE} improvements\n`,
  );

  const supabase = supabaseClient();
  await assertCredentials(supabase, "trend_terms", { log, column: "term" });

  log("Loading signals:");
  const terms = await loadTrendTerms(supabase);
  const observations = await loadObservations(supabase, HISTORY_DAYS);
  const queryPerformance = await loadQueryPerformance(supabase, { log });
  const authority = authorityBySection(queryPerformance);
  const sitePages = await loadSitePages();
  log(`  ${sitePages.length} page(s) the site already serves.`);

  const serp = resolveSerpProvider({ log });
  log(`  SERP provider: ${serp.name}`);

  const rows = [];
  for (const term of terms) {
    const display = term.display_term ?? term.term;
    const lifecycle = classifyLifecycle(observations.get(term.term) ?? [], term.velocity);
    const { intent, clarity } = intentOf(display);

    const factors = {};
    const provenance = {};

    const velocity = velocityScore(term.velocity);
    if (velocity !== null) {
      factors.velocity = velocity;
      provenance.velocity = `trend_terms: ${(term.velocity * 100).toFixed(0)}% growth across two windows`;
    }

    const domain = term.domain ?? classifyTerm(display)?.domain ?? null;
    if (domain) {
      // Commerce terms are what the store exists for; anime and games are the
      // editorial core. Both are relevant, and the split is the site's own.
      factors.relevance = domain === "gift-cards" ? 1 : 0.85;
      provenance.relevance = `classifier: "${domain}" is a subject this site covers`;
    }

    factors.intentClarity = clarity;
    provenance.intentClarity = `query shape: ${intent}`;

    const gsc = gscFactors(display, queryPerformance, authority);
    Object.assign(factors, gsc.factors);
    Object.assign(provenance, gsc.provenance);

    const serpData = await serp.fetchSerp(display);
    const fromSerp = serpFactors(serpData);
    Object.assign(factors, fromSerp.factors);
    Object.assign(provenance, fromSerp.provenance);

    const scored = scoreOpportunity({ factors, provenance }, DEFAULT_WEIGHTS);

    // The pages that could serve this: anything Search Console shows ranking
    // for it, plus the site's own inventory for overlap matching.
    const existing = [
      ...(gsc.entry?.pageList ?? []),
      ...sitePages.map((page) => ({ ...page, rankingForQuery: false })),
    ];
    const decision = decide(
      { query: display, score: scored.score, confidence: scored.confidence, lifecycle, intent },
      existing,
    );

    rows.push({ candidate: { term: term.term, display, domain }, scored, decision, lifecycle });
  }

  const ranked = rows
    .filter((row) => row.scored.score !== null)
    .sort((a, b) => b.scored.score - a.scored.score || b.scored.confidence - a.scored.confidence);

  log(`\nScored ${ranked.length} of ${rows.length} candidate(s).`);

  const { created, improved, deferred } = applyPublishingLimits(
    ranked.map((r) => r.decision),
    {
      maxCreate: MAX_CREATE,
      maxImprove: MAX_IMPROVE,
    },
  );
  const chosen = new Set([...created, ...improved]);

  log(
    `\n${"═".repeat(70)}\nTHE PLAN — ${created.length} new page(s), ${improved.length} improvement(s)\n${"═".repeat(70)}`,
  );
  let n = 0;
  for (const row of ranked) {
    if (!chosen.has(row.decision)) continue;
    printDecision((n += 1), row);
  }
  if (!n)
    log(
      "\n  Nothing clears the bar this pass. That is a valid outcome — the caps are\n  upper limits, not quotas to fill.",
    );

  const skipped = ranked.filter((r) => !chosen.has(r.decision));
  log(`\n${"─".repeat(70)}\nNot actioned: ${skipped.length}`);
  const byReason = new Map();
  for (const row of skipped) {
    const key = row.decision.action;
    byReason.set(key, (byReason.get(key) ?? 0) + 1);
  }
  for (const [action, count] of byReason) log(`  ${String(count).padStart(4)}  ${action}`);
  if (deferred.length)
    log(
      `  ${String(deferred.length).padStart(4)}  over the publishing cap — carried to the next pass`,
    );

  log(
    `\nThis is a plan, not a publication. Nothing here has been written or created.\n` +
      `Every score above lists the factors behind it and the ones with no evidence,\n` +
      `so a recommendation can be checked rather than taken on trust.\n`,
  );
}

main().catch((error) => {
  console.error(`\n${error.stack || error.message}\n`);
  process.exit(1);
});
