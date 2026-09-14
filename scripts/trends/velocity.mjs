/**
 * Velocity: how fast a term is growing, measured from stored history.
 *
 * The requested behaviour was "isolate terms growing more than 500% a week".
 * That is a ratio between two points in time, so it needs two points. A single
 * call to any trends feed returns one — today's rank order — and no arithmetic
 * on one snapshot produces a growth rate. Inventing one (treating rank as
 * growth, say, or comparing against a constant) would put a confident number
 * on a page that nothing measured.
 *
 * So the rule here: velocity is computed only when both windows contain
 * observations, and is null otherwise. A brand-new term reports
 * `baseline_establishing`, and the first useful velocities appear one full
 * window after the pipeline starts running. That is the earliest the number
 * can honestly exist.
 *
 * Heat, not rank, is what gets averaged. Rank 1 of 20 and rank 1 of 50 are not
 * the same achievement, so each observation is converted to
 * (list_size - rank + 1) / list_size, which lands in (0, 1] and stays
 * comparable across feeds of different lengths.
 *
 * Weight, where a feed publishes one, is folded in as a log-scaled multiplier
 * rather than a raw factor: view counts and approximate traffic span six
 * orders of magnitude, and a raw multiply would let one viral video outrank
 * every genuine search trend on the board.
 */

export const CURRENT_WINDOW_DAYS = 3;
export const BASELINE_WINDOW_DAYS = 3;

/** (list_size - rank + 1) / list_size, in (0, 1]. */
export const heatOf = (rank, listSize) => {
  const size = Number(listSize);
  const position = Number(rank);
  if (!Number.isFinite(size) || size <= 0) return 0;
  if (!Number.isFinite(position) || position <= 0) return 0;
  return Math.max(0, Math.min(size, size - position + 1)) / size;
};

/**
 * Log-scaled bonus for a published magnitude. Absent weight returns 1 — the
 * term is scored on position alone rather than being penalised for arriving
 * from a feed that publishes no numbers.
 */
export const weightMultiplier = (weight) => {
  const value = Number(weight);
  if (!Number.isFinite(value) || value <= 0) return 1;
  return 1 + Math.log10(value) / 10;
};

export const scoreObservation = (observation) =>
  heatOf(observation.rank, observation.list_size ?? observation.listSize) *
  weightMultiplier(observation.weight);

const mean = (values) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;

const dayKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

/** Days between two YYYY-MM-DD keys. */
const daysBetween = (from, to) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);

/**
 * Splits one term's observations into the recent window and the one before it,
 * and returns the growth between them.
 *
 * `asOf` is passed in rather than read from the clock so the same history
 * always yields the same answer - the function is testable, and a re-run does
 * not drift because it happened a few hours later.
 */
export function computeVelocity(
  observations,
  { asOf, currentDays = CURRENT_WINDOW_DAYS, baselineDays = BASELINE_WINDOW_DAYS } = {},
) {
  const today = dayKey(asOf ?? new Date());
  const current = [];
  const baseline = [];
  const sources = new Set();
  let firstSeen = null;
  let lastSeen = null;

  for (const observation of observations) {
    const day = dayKey(
      observation.observed_on ?? observation.observedOn ?? observation.observed_at,
    );
    if (!day) continue;
    const age = daysBetween(day, today);
    if (age < 0) continue;
    const score = scoreObservation(observation);
    if (age < currentDays) current.push(score);
    else if (age < currentDays + baselineDays) baseline.push(score);
    if (observation.source) sources.add(observation.source);
    if (!firstSeen || day < firstSeen) firstSeen = day;
    if (!lastSeen || day > lastSeen) lastSeen = day;
  }

  const currentScore = mean(current);
  const baselineScore = mean(baseline);

  // Both windows, and a baseline that is actually non-zero. Dividing by a
  // zero baseline would produce Infinity and read as the hottest term on the
  // board, which is the opposite of what no-signal means.
  const measurable = currentScore !== null && baselineScore !== null && baselineScore > 0;

  return {
    currentScore,
    baselineScore,
    velocity: measurable ? (currentScore - baselineScore) / baselineScore : null,
    state: measurable
      ? "measured"
      : currentScore === null
        ? "no_recent_observations"
        : "baseline_establishing",
    observationCount: current.length + baseline.length,
    sourceCount: sources.size,
    firstSeen,
    lastSeen,
  };
}

/** Groups raw observation rows by term and computes each one's velocity. */
export function summarizeByTerm(observations, options = {}) {
  const byTerm = new Map();
  for (const observation of observations) {
    const list = byTerm.get(observation.term);
    if (list) list.push(observation);
    else byTerm.set(observation.term, [observation]);
  }
  const out = new Map();
  for (const [term, rows] of byTerm) out.set(term, computeVelocity(rows, options));
  return out;
}

/** The requested cut-off, expressed as the ratio the code actually compares. */
export const BREAKOUT_VELOCITY = 5;
