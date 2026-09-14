#!/usr/bin/env node
/**
 * Conformance checks for the winner-amplification logic.
 *
 * No credentials, no network — runs on every push. What it protects:
 *
 *   1. A first run reports null deltas, not zero. "No previous window" and "no
 *      change" are different facts, and only one of them is a reason to act.
 *      Defaulting the missing baseline to zero would mark every page on the
 *      site as flat, and the declining bucket would never fire again.
 *
 *   2. The queue is ordered by projected clicks gained, so a big page just off
 *      page one outranks a small page slightly higher up. Reordering this by
 *      position alone is the single easiest way to make the engine spend its
 *      days on pages that cannot move the numbers.
 *
 *   3. Pages under the impression floor are never queued. Below it a position
 *      "improvement" is noise, and acting on noise burns the publishing budget.
 *
 *   4. Comparison windows are equal length and end behind the Search Analytics
 *      lag. Comparing a partial recent window against a complete older one
 *      makes every page on the site look like it is collapsing.
 */

import { classifyPage, upliftEstimate, rankActions, expectedCtr, DEFAULT_THRESHOLDS } from "./gsc/actions.mjs";
import { comparisonWindows, LAG_DAYS, dayOffset } from "./gsc/client.mjs";

let failures = 0;
const check = (label, got, want) => {
  const ok = Object.is(got, want);
  if (!ok) failures += 1;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${ok ? "" : `   got ${got}, want ${want}`}`);
};

const page = (over = {}) => ({ page: "/p", clicks: 10, impressions: 2000, ctr: 0.005, position: 8, ...over });

console.log("\nDeltas are measured, never assumed");
check("first run has no position delta", classifyPage(page(), null).positionDelta, null);
check("first run has no impressions delta", classifyPage(page(), null).impressionsDelta, null);
check(
  "a real change is measured",
  classifyPage(page({ position: 8 }), { position: 9, impressions: 1900 }).positionDelta,
  1,
);

console.log("\nThe queue is ordered by clicks available, not by position");
const ranked = rankActions([
  classifyPage(page({ page: "/big", impressions: 12000, position: 8 }), null),
  classifyPage(page({ page: "/small", impressions: 200, position: 6 }), null),
]);
check("bigger opportunity first", ranked[0]?.page, "/big");
check("a page already at 3 has no uplift", upliftEstimate({ impressions: 99999, position: 3 }), 0);
check("uplift needs a finite position", upliftEstimate({ impressions: 99999, position: null }), 0);

console.log("\nNoise never reaches the queue");
check(
  "under the impression floor is not queued",
  classifyPage(page({ impressions: DEFAULT_THRESHOLDS.minImpressions - 1 }), null).action,
  null,
);
check(
  "at the floor it is",
  classifyPage(page({ impressions: DEFAULT_THRESHOLDS.minImpressions })).action,
  "striking_distance",
);

console.log("\nA falling page is diagnosed, not expanded");
check(
  "a big drop is flagged declining",
  classifyPage(page({ position: 14 }), { position: 9, impressions: 2000 }).action,
  "declining",
);

console.log("\nWindows are comparable and behind the data lag");
const w = comparisonWindows(14, new Date("2026-09-14T00:00:00Z"));
const span = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000) + 1;
check("current window is 14 days", span(w.currentStart, w.currentEnd), 14);
check("previous window is 14 days", span(w.baselineStart, w.baselineEnd), 14);
check("windows do not overlap", w.baselineEnd < w.currentStart, true);
check("windows are adjacent", span(w.baselineEnd, w.currentStart), 2);
check("current window ends behind the lag", w.currentEnd, dayOffset(LAG_DAYS, new Date("2026-09-14T00:00:00Z")));

console.log("\nThe CTR reference curve is monotonic");
let monotonic = true;
for (let i = 2; i <= 10; i += 1) if ((expectedCtr(i) ?? 0) > (expectedCtr(i - 1) ?? 0)) monotonic = false;
check("clicks fall as position worsens", monotonic, true);

console.log(failures ? `\n${failures} check(s) failed.\n` : "\nAll Search Console checks passed.\n");
process.exit(failures ? 1 : 0);
