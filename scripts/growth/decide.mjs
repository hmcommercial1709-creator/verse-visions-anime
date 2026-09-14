/**
 * Update an existing page, or create a new one?
 *
 * This is the decision that decides whether an SEO engine compounds or rots.
 * Getting it wrong in the "new page" direction is how sites end up with four
 * pages competing for one query, none of them ranking, authority split between
 * them — and it is the default failure mode of every automated content system,
 * because creating is easier to automate than judging.
 *
 * So the bias is explicit and one-directional: a new URL requires positive
 * evidence that no existing page can serve the intent. Absence of evidence
 * produces `improve_existing` or `needs_review`, never `create_new`.
 *
 * Four outcomes:
 *   improve_existing  a page already ranks or already covers this intent
 *   create_new        genuinely distinct intent, nothing close, demand proven
 *   needs_review      the signals conflict, or the evidence is too thin
 *   skip              the lifecycle stage or the gates say do not act
 */

import { policyFor } from "./lifecycle.mjs";

export const DEFAULTS = {
  /** A page ranking this well for the query already owns the intent. */
  ownsIntentPosition: 30,
  /** Title/slug overlap above which a page is "about" the same thing. */
  strongOverlap: 0.6,
  weakOverlap: 0.3,
  /** New pages need a score this high — deliberately above the improve bar. */
  createThreshold: 0.62,
  improveThreshold: 0.45,
  /** Below this the score rests on too few measured factors to act on. */
  minConfidence: 0.5,
};

/** Jaccard overlap on meaningful words; cheap, and good enough to spot "about the same thing". */
export function overlap(a, b) {
  const words = (value) =>
    new Set(
      String(value ?? "")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 3),
    );
  const left = words(a);
  const right = words(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const word of left) if (right.has(word)) shared += 1;
  return shared / Math.min(left.size, right.size);
}

/**
 * `candidate`   { query, score, confidence, lifecycle, intent }
 * `existing`    pages that might already serve it, each
 *               { url, title, position?, impressions?, rankingForQuery? }
 */
export function decide(candidate, existing = [], options = {}) {
  const o = { ...DEFAULTS, ...options };
  const { query, score, confidence, lifecycle, intent } = candidate;
  const policy = policyFor(lifecycle?.stage);

  const evidence = [];

  if (score === null || score === undefined) {
    return {
      action: "skip",
      reason: "not scored — no factor had evidence behind it",
      evidence,
      target: null,
    };
  }

  // A page Google already ranks for this exact query owns the intent. Creating
  // a rival is the textbook cannibalization mistake, whatever the score.
  const ranking = existing
    .filter(
      (page) =>
        page.rankingForQuery &&
        Number.isFinite(page.position) &&
        page.position <= o.ownsIntentPosition,
    )
    .sort((a, b) => a.position - b.position);
  if (ranking.length) {
    const best = ranking[0];
    evidence.push(`${best.url} already ranks ${best.position.toFixed(1)} for "${query}"`);
    return {
      action: "improve_existing",
      target: best.url,
      reason: `${best.url} already ranks ${best.position.toFixed(1)} for this query — improving it beats competing with it`,
      evidence,
      policy,
    };
  }

  // Nothing ranks yet, but something may already be about this.
  const scored = existing
    .map((page) => ({ page, overlap: overlap(query, `${page.title ?? ""} ${page.url ?? ""}`) }))
    .sort((a, b) => b.overlap - a.overlap);
  const closest = scored[0];

  if (closest && closest.overlap >= o.strongOverlap) {
    evidence.push(
      `${closest.page.url} overlaps ${(closest.overlap * 100).toFixed(0)}% with the query`,
    );
    return {
      action: "improve_existing",
      target: closest.page.url,
      reason: `${closest.page.url} already covers this topic (${(closest.overlap * 100).toFixed(0)}% overlap) — extend it rather than split the topic across two URLs`,
      evidence,
      policy,
    };
  }

  if (confidence < o.minConfidence) {
    evidence.push(`confidence ${confidence} — too few factors measured`);
    return {
      action: "needs_review",
      target: closest?.page.url ?? null,
      reason: `score ${score} rests on too little evidence (confidence ${confidence}) to justify a URL — a person should look`,
      evidence,
      policy,
    };
  }

  if (!policy.publish) {
    evidence.push(`lifecycle ${lifecycle?.stage}: ${policy.note}`);
    return {
      action: "skip",
      target: null,
      reason: `${lifecycle?.stage ?? "unknown"} — ${policy.note}`,
      evidence,
      policy,
    };
  }

  if (score < o.createThreshold) {
    // Strong enough to be worth something, not strong enough for a new URL.
    if (score >= o.improveThreshold && closest && closest.overlap >= o.weakOverlap) {
      evidence.push(`score ${score} below the ${o.createThreshold} bar for a new URL`);
      return {
        action: "improve_existing",
        target: closest.page.url,
        reason: `score ${score} does not clear the bar for a new URL, but ${closest.page.url} is close enough to absorb it`,
        evidence,
        policy,
      };
    }
    return {
      action: "skip",
      target: null,
      reason: `score ${score} is below both the create (${o.createThreshold}) and improve (${o.improveThreshold}) thresholds`,
      evidence,
      policy,
    };
  }

  evidence.push(`nothing ranks for "${query}"`);
  evidence.push(
    closest
      ? `closest existing page overlaps only ${(closest.overlap * 100).toFixed(0)}%`
      : "no existing page is related",
  );
  evidence.push(`lifecycle ${lifecycle?.stage}: ${policy.note}`);
  return {
    action: "create_new",
    target: null,
    reason: `distinct intent (${intent ?? "unclassified"}), nothing ranking, nothing closely related, score ${score} at confidence ${confidence}`,
    evidence,
    policy,
  };
}

/**
 * Caps how much the engine may do in one pass.
 *
 * The brief asks for 5-15 strong actions a day, and a cap is the difference
 * between a growth engine and a content farm. It is enforced here, once, so no
 * caller can route around it.
 */
export function applyPublishingLimits(decisions, { maxCreate = 5, maxImprove = 15 } = {}) {
  const created = [];
  const improved = [];
  const deferred = [];
  for (const decision of decisions) {
    if (decision.action === "create_new") {
      (created.length < maxCreate ? created : deferred).push(decision);
    } else if (decision.action === "improve_existing") {
      (improved.length < maxImprove ? improved : deferred).push(decision);
    }
  }
  return { created, improved, deferred };
}
