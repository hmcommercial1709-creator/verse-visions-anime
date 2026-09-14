/**
 * Where a topic sits in its life: emerging → rising → peak → declining → evergreen.
 *
 * The stage is not decoration; it changes what the engine is allowed to do.
 * The expensive mistake in trend-led publishing is treating every rising line
 * the same — pouring effort into a spike two days after it peaked, when the
 * traffic it would have earned has already gone elsewhere. Staging separates
 * "worth acting on now" from "worth watching" and from "already over".
 *
 * Derived from the observation history the trend pipeline already stores, so
 * no new collection is needed. Every stage requires evidence; a term without
 * enough history is `unknown`, which is a real answer and blocks publishing
 * rather than defaulting to something optimistic.
 */

export const STAGES = ["unknown", "emerging", "rising", "peak", "declining", "evergreen"];

export const STAGE_POLICY = {
  unknown: { publish: false, expand: false, note: "not enough history to act on" },
  emerging: {
    publish: false,
    expand: false,
    note: "validate and watch; too early to commit a page",
  },
  rising: { publish: true, expand: true, note: "act now — this is the window" },
  peak: { publish: true, expand: true, note: "maximize coverage and CTR while attention holds" },
  declining: { publish: false, expand: false, note: "do not expand; harvest what exists" },
  evergreen: {
    publish: false,
    expand: true,
    note: "maintain and improve on performance, not on trend",
  },
};

const DEFAULTS = {
  /** Days of observations needed before a stage is anything but unknown. */
  minHistoryDays: 4,
  /** Sustained presence that marks a topic as structural rather than a spike. */
  evergreenDays: 21,
  /** Fraction of its own peak below which a topic counts as past it. */
  peakDecayRatio: 0.65,
  risingVelocity: 0.25,
  decliningVelocity: -0.2,
};

/**
 * `observations` are daily heat scores, any order. `velocity` comes from the
 * trend pipeline and may be null while a baseline is still forming — which is
 * exactly why `emerging` exists as a distinct stage from `rising`.
 */
export function classifyLifecycle(observations, velocity, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const days = [...new Set(observations.map((row) => row.day))].sort();

  if (days.length < o.minHistoryDays) {
    return {
      stage: "unknown",
      reason: `only ${days.length} day(s) of history; ${o.minHistoryDays} needed before a stage means anything`,
    };
  }

  const byDay = new Map();
  for (const row of observations) byDay.set(row.day, Math.max(byDay.get(row.day) ?? 0, row.score));
  const series = days.map((day) => byDay.get(day) ?? 0);
  const peak = Math.max(...series);
  const latest = series[series.length - 1];
  const ratioOfPeak = peak > 0 ? latest / peak : 0;

  // Sustained presence outranks any short-term slope: a topic seen for three
  // weeks is structural, and treating a normal dip in it as "declining" would
  // stop the engine maintaining the pages that earn steadily.
  if (days.length >= o.evergreenDays && ratioOfPeak >= o.peakDecayRatio) {
    return {
      stage: "evergreen",
      reason: `present ${days.length} days and holding ${Math.round(ratioOfPeak * 100)}% of its peak — structural demand, not a spike`,
    };
  }

  if (velocity === null || velocity === undefined) {
    return {
      stage: "emerging",
      reason: `seen ${days.length} days but no measured velocity yet — validate before committing a page`,
    };
  }
  if (velocity <= o.decliningVelocity || ratioOfPeak < o.peakDecayRatio) {
    return {
      stage: "declining",
      reason: `at ${Math.round(ratioOfPeak * 100)}% of its peak${velocity <= o.decliningVelocity ? ` and falling ${Math.round(velocity * 100)}%` : ""} — the window has closed`,
    };
  }
  if (velocity >= o.risingVelocity) {
    return {
      stage: "rising",
      reason: `growing ${Math.round(velocity * 100)}% and at ${Math.round(ratioOfPeak * 100)}% of its peak — act now`,
    };
  }
  return {
    stage: "peak",
    reason: `flat at ${Math.round(ratioOfPeak * 100)}% of its peak — attention is holding, maximize coverage`,
  };
}

export const policyFor = (stage) => STAGE_POLICY[stage] ?? STAGE_POLICY.unknown;
