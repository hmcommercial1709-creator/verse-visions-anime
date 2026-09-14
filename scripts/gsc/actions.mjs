/**
 * Turning Search Console numbers into a ranked queue of things to do.
 *
 * The governing idea, and it is the plan's own: a page at position 5-20 has
 * already proven Google will rank it. Moving it up a few places is usually
 * worth more than a new page that has proven nothing — the impressions already
 * exist, and clicks follow position steeply. So the queue is ordered by
 * expected clicks gained, not by traffic or by how interesting a page is.
 *
 * Five plays, each with a different fix:
 *
 *   striking_distance  position 5-20. Depth, internal links, coverage. The
 *                      highest-value bucket and the reason this file exists.
 *   ctr_gap            ranks in the top 5 but takes far fewer clicks than that
 *                      position normally earns. The page is fine; the title and
 *                      description are not. Cheapest possible win.
 *   rising             impressions climbing against the previous window.
 *                      Expand while Google is already leaning in.
 *   declining          losing position. Diagnose - do NOT answer a decline by
 *                      publishing something else.
 *   unexpected_query   ranking for something the page was not written for.
 *                      Evidence of demand the site has not deliberately served.
 *
 * Every number here is measured. `positionDelta` and `impressionsDelta` are
 * null on a first run rather than zero, because "no previous window" and "no
 * change" are different facts and only one of them justifies acting.
 */

/**
 * Typical click-through by position. Used ONLY to flag a page taking far fewer
 * clicks than its position normally earns — never to predict traffic or to
 * report a number as if it were measured. These are public industry-study
 * averages, they vary hugely by query type, and the comparison below is
 * deliberately coarse (a third of expected) so ordinary variance never trips it.
 */
export const CTR_BY_POSITION = [0, 0.28, 0.15, 0.11, 0.08, 0.06, 0.05, 0.04, 0.03, 0.028, 0.025];

export const expectedCtr = (position) => {
  if (!Number.isFinite(position) || position < 1) return null;
  const index = Math.min(Math.round(position), CTR_BY_POSITION.length - 1);
  return CTR_BY_POSITION[index] ?? 0.02;
};

export const DEFAULT_THRESHOLDS = {
  strikingMin: 5,
  strikingMax: 20,
  /** Below this an "improvement" is measuring noise, not demand. */
  minImpressions: 50,
  ctrGapMaxPosition: 5,
  /** Flag only when clicks are under a third of what the position usually earns. */
  ctrGapRatio: 0.34,
  risingImpressionsDelta: 100,
  decliningPositionDelta: 1.5,
};

const round = (value, places = 2) =>
  value === null || value === undefined || !Number.isFinite(value)
    ? null
    : Math.round(value * 10 ** places) / 10 ** places;

/**
 * Expected clicks gained if this page moved to position 3.
 *
 * This is the ordering key, and it is explicitly a PROJECTION, not a promise -
 * it exists so that 10,000 impressions at position 8 outranks 200 impressions
 * at position 6 in the queue. A page already at or above 3 scores 0.
 */
export function upliftEstimate({ impressions, position }) {
  if (!Number.isFinite(impressions) || !Number.isFinite(position) || position <= 3) return 0;
  const now = expectedCtr(position) ?? 0;
  const target = expectedCtr(3) ?? 0;
  return Math.max(0, (target - now) * impressions);
}

/**
 * Classifies one page. `current` and `baseline` are the aggregates for the two
 * windows; baseline may be null on a first run.
 */
export function classifyPage(current, baseline, queries = [], thresholds = DEFAULT_THRESHOLDS) {
  const t = { ...DEFAULT_THRESHOLDS, ...thresholds };
  const { page, clicks = 0, impressions = 0, ctr = null, position = null } = current;

  const positionDelta =
    baseline && Number.isFinite(baseline.position) && Number.isFinite(position)
      ? round(baseline.position - position, 2) // positive = improved (lower is better)
      : null;
  const impressionsDelta =
    baseline && Number.isFinite(baseline.impressions) ? impressions - baseline.impressions : null;

  const base = {
    page,
    clicks,
    impressions,
    ctr: round(ctr, 4),
    position: round(position, 2),
    positionDelta,
    impressionsDelta,
    bestQuery: queries.length
      ? [...queries].sort((a, b) => b.impressions - a.impressions)[0].query
      : null,
  };

  // Too small to reason about. Saying so beats inventing a play for it.
  if (impressions < t.minImpressions) {
    return {
      ...base,
      action: null,
      reason: `only ${impressions} impressions — below the ${t.minImpressions} needed to tell signal from noise`,
      priority: 0,
    };
  }

  // Decline first: a falling page must never be answered by expanding it.
  if (positionDelta !== null && positionDelta <= -t.decliningPositionDelta) {
    return {
      ...base,
      action: "declining",
      reason: `position fell ${Math.abs(positionDelta)} places (${round(baseline.position, 1)} → ${round(position, 1)}) — diagnose before writing anything new`,
      priority: impressions / 100,
    };
  }

  if (Number.isFinite(position) && position >= t.strikingMin && position <= t.strikingMax) {
    const uplift = upliftEstimate({ impressions, position });
    return {
      ...base,
      action: "striking_distance",
      reason:
        `ranks ${round(position, 1)} on ${impressions.toLocaleString()} impressions` +
        `${positionDelta !== null ? `, ${positionDelta >= 0 ? "up" : "down"} ${Math.abs(positionDelta)} places` : ""}` +
        ` — reaching position 3 projects about ${Math.round(uplift)} more clicks per window`,
      priority: uplift,
    };
  }

  if (Number.isFinite(position) && position <= t.ctrGapMaxPosition && Number.isFinite(ctr)) {
    const expected = expectedCtr(position);
    if (expected && ctr < expected * t.ctrGapRatio) {
      const uplift = Math.max(0, (expected - ctr) * impressions);
      return {
        ...base,
        action: "ctr_gap",
        reason:
          `ranks ${round(position, 1)} but takes ${(ctr * 100).toFixed(1)}% of clicks where that position ` +
          `usually earns nearer ${(expected * 100).toFixed(0)}% — the title and description are the fix, not the content`,
        priority: uplift,
      };
    }
  }

  if (impressionsDelta !== null && impressionsDelta >= t.risingImpressionsDelta) {
    return {
      ...base,
      action: "rising",
      reason: `impressions up ${impressionsDelta.toLocaleString()} against the previous window — expand while it is moving`,
      priority: impressionsDelta / 10,
    };
  }

  return { ...base, action: null, reason: "performing normally; nothing queued", priority: 0 };
}

/**
 * Queries a page ranks for that its own URL does not reflect — demand the site
 * is serving by accident. Worth a deliberate page only when the query is
 * genuinely a different intent, which stays a human call.
 */
export function unexpectedQueries(page, queries, thresholds = DEFAULT_THRESHOLDS) {
  const t = { ...DEFAULT_THRESHOLDS, ...thresholds };
  const slugWords = new Set(
    String(page)
      .toLowerCase()
      .replace(/https?:\/\/[^/]+/, "")
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 3),
  );
  return queries
    .filter((row) => row.impressions >= t.minImpressions)
    .filter((row) => {
      const words = String(row.query)
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      if (!words.length) return false;
      // Not one meaningful word of the query appears in the URL.
      return !words.some((word) => slugWords.has(word));
    })
    .sort((a, b) => b.impressions - a.impressions);
}

/** Ranks the queue by expected clicks gained, highest first. */
export const rankActions = (actions) =>
  actions.filter((a) => a.action).sort((a, b) => b.priority - a.priority);
