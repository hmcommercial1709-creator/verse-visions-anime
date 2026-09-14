/**
 * The Opportunity Score: one number per candidate, and the sentence that
 * explains it.
 *
 * Two rules govern everything here.
 *
 * FIRST: every factor is either measured or absent. There is no default value
 * standing in for a missing signal. A factor with no evidence contributes
 * nothing AND removes its own weight from the denominator, so a candidate is
 * scored only on what is actually known about it. The alternative — defaulting
 * competition to 0.5, say — silently invents the very number the decision turns
 * on, and does it invisibly, which is worse than not scoring at all.
 *
 * SECOND: the output carries its own provenance. `contributions` lists each
 * factor, its value, its weight and where the value came from, so any ranking
 * can be explained without re-running anything. The brief asks for explainable
 * recommendations; this is the mechanism, not a comment promising it.
 *
 * On competition and SERP difficulty: there is no free, legitimate source for
 * them. Rather than fake a number, those factors are supplied by a pluggable
 * provider (see serp-provider.mjs) which reports `unavailable` until a real
 * provider is configured. Until then those weights simply leave the model, and
 * the score says so.
 */

/**
 * Weights are relative, not percentages — they are normalized across whichever
 * factors have evidence. Negative weights are penalties.
 */
export const DEFAULT_WEIGHTS = {
  demand: 1.6,
  velocity: 1.4,
  relevance: 1.5,
  contentGap: 1.2,
  freshness: 0.6,
  rankingFeasibility: 1.0,
  ctrOpportunity: 0.9,
  existingAuthority: 1.1,
  intentClarity: 0.8,
  competition: -1.3,
  cannibalization: -1.5,
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const round = (value, places = 3) =>
  Number.isFinite(value) ? Math.round(value * 10 ** places) / 10 ** places : null;

/** log10-scaled so six orders of magnitude of demand stay comparable. */
export const demandScore = (impressionsOrTraffic) => {
  const value = Number(impressionsOrTraffic);
  if (!Number.isFinite(value) || value <= 0) return null;
  return clamp01(Math.log10(value) / 5); // 100,000 ≈ 1.0
};

/** 0 at flat, 1 at +500% — the brief's breakout bar. */
export const velocityScore = (velocity) =>
  velocity === null || velocity === undefined || !Number.isFinite(velocity)
    ? null
    : clamp01(velocity / 5);

/**
 * How reachable page one is from where the page already sits. A page at 8 is
 * far more feasible than one that has never ranked, and that difference is the
 * single biggest driver of traffic-per-action.
 */
export const feasibilityScore = (position) => {
  if (!Number.isFinite(position)) return null;
  if (position <= 3) return 0.2; // already there; little left to win
  if (position <= 10) return 1;
  if (position <= 20) return 0.8;
  if (position <= 30) return 0.55;
  if (position <= 50) return 0.3;
  return 0.15;
};

/** Gap between the clicks a position normally earns and what the page takes. */
export const ctrOpportunityScore = (ctr, expectedCtr) => {
  if (!Number.isFinite(ctr) || !Number.isFinite(expectedCtr) || expectedCtr <= 0) return null;
  return clamp01((expectedCtr - ctr) / expectedCtr);
};

/**
 * Cannibalization: how badly a new page would compete with pages the site
 * already ranks. 1 means "an existing page owns this query" — a strong reason
 * to improve that page instead of minting a rival.
 */
export const cannibalizationScore = (matchingPages) => {
  if (!Array.isArray(matchingPages)) return null;
  if (matchingPages.length === 0) return 0;
  const best = Math.min(...matchingPages.map((p) => p.position ?? 100));
  if (!Number.isFinite(best)) return 0.3;
  if (best <= 10) return 1;
  if (best <= 30) return 0.6;
  return 0.25;
};

/**
 * Intent clarity from the query's own shape. Deliberately conservative: these
 * are linguistic markers, not a claim to know what a searcher wants.
 */
const INTENT_MARKERS = [
  [/\b(buy|cheap|price|discount|code|coupon|top ?up|gift card|deal)\b/i, "commercial", 1],
  [
    /\b(how to|how do|guide|tutorial|walkthrough|fix|error|not working|why)\b/i,
    "informational",
    0.9,
  ],
  [/\b(release date|when|schedule|season \d|episode \d|update|patch)\b/i, "temporal", 0.85],
  [/\b(vs|versus|compare|better than|best)\b/i, "comparison", 0.8],
];

export function intentOf(query) {
  for (const [pattern, intent, clarity] of INTENT_MARKERS) {
    if (pattern.test(String(query ?? ""))) return { intent, clarity };
  }
  return { intent: "unclear", clarity: 0.3 };
}

/**
 * Scores one candidate.
 *
 * `factors` holds values in 0..1, or null/undefined where there is no
 * evidence. Provenance is a short string per factor naming its source, and is
 * what makes the ranking auditable afterwards.
 */
export function scoreOpportunity(candidate, weights = DEFAULT_WEIGHTS) {
  const { factors = {}, provenance = {} } = candidate;
  const contributions = [];
  let weighted = 0;
  let totalWeight = 0;
  const missing = [];

  for (const [name, weight] of Object.entries(weights)) {
    const value = factors[name];
    if (value === null || value === undefined || !Number.isFinite(value)) {
      missing.push(name);
      continue;
    }
    const bounded = clamp01(value);
    // A penalty contributes its full magnitude to the denominator, so a
    // candidate cannot improve its score merely by having a penalty measured.
    weighted += bounded * weight;
    totalWeight += Math.abs(weight);
    contributions.push({
      factor: name,
      value: round(bounded),
      weight,
      effect: round(bounded * weight),
      source: provenance[name] ?? "unspecified",
    });
  }

  if (!totalWeight) {
    return {
      score: null,
      confidence: 0,
      contributions: [],
      missing,
      explanation: "no factor had any evidence behind it — not scored",
    };
  }

  // Map from [-sum(penalties), +sum(bonuses)] onto 0..1.
  const score = clamp01((weighted / totalWeight + 1) / 2);
  const measured = contributions.length;
  const confidence = round(measured / (measured + missing.length), 2);

  contributions.sort((a, b) => Math.abs(b.effect) - Math.abs(a.effect));
  const top = contributions.slice(0, 3).map((c) => `${c.factor} ${c.value} (${c.source})`);

  return {
    score: round(score),
    confidence,
    contributions,
    missing,
    explanation:
      `scored ${round(score)} on ${measured} measured factor(s); driven by ${top.join(", ")}` +
      (missing.length
        ? `; no evidence for ${missing.join(", ")}, so those weights were removed rather than assumed`
        : ""),
  };
}

/** Highest score first; ties broken by confidence, so guesses never lead. */
export const rankOpportunities = (scored) =>
  [...scored]
    .filter((row) => row.score !== null)
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence);
