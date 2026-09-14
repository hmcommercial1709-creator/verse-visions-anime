#!/usr/bin/env node
/**
 * Conformance checks for the trend pipeline's pure logic.
 *
 * Needs no network and no database, so it runs on every push rather than only
 * on the scheduled job. What it protects:
 *
 *   1. Velocity is never invented. One snapshot must yield null, not a number.
 *      This is the whole reason the observations table exists, and it is a
 *      one-line change away from being quietly broken - someone "fixing" the
 *      nulls by defaulting a missing baseline to zero would turn every new
 *      term into infinite growth and put a fabricated percentage at the top
 *      of the build queue.
 *
 *   2. The classifier stays precise. A trends feed is mostly news; if the
 *      vocabulary drifts loose enough to match an election or a football
 *      score, the queue becomes a ranking of the news and the signal is gone.
 *
 *   3. The catalog matcher prefers the longer title and refuses short ones,
 *      so rising demand is never pointed at the wrong page.
 */

import { computeVelocity, heatOf, weightMultiplier } from "./trends/velocity.mjs";
import { classifyTerm, buildCatalogMatcher } from "./trends/classify.mjs";

let failures = 0;
const check = (label, got, want) => {
  const ok = Object.is(got, want);
  if (!ok) failures += 1;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${ok ? "" : `   got ${got}, want ${want}`}`);
};

const observation = (day, rank, listSize = 20) => ({
  observed_on: day,
  rank,
  list_size: listSize,
  source: "google-trends",
  weight: null,
});

console.log("\nVelocity is measured, never assumed");
check(
  "one snapshot yields no velocity",
  computeVelocity([observation("2026-09-14", 1)], { asOf: "2026-09-14" }).velocity,
  null,
);
check(
  "  and says why",
  computeVelocity([observation("2026-09-14", 1)], { asOf: "2026-09-14" }).state,
  "baseline_establishing",
);
check(
  "a zero baseline yields no velocity, not Infinity",
  computeVelocity(
    [observation("2026-09-14", 1), { ...observation("2026-09-10", 1), list_size: 0 }],
    { asOf: "2026-09-14" },
  ).velocity,
  null,
);
check(
  "flat history is 0% growth, not null",
  computeVelocity(
    ["2026-09-14", "2026-09-13", "2026-09-12", "2026-09-11", "2026-09-10", "2026-09-09"].map((d) =>
      observation(d, 10),
    ),
    { asOf: "2026-09-14" },
  ).velocity,
  0,
);
check(
  "a real climb is measured",
  Math.round(
    computeVelocity(
      [
        observation("2026-09-14", 1),
        observation("2026-09-13", 1),
        observation("2026-09-12", 1),
        observation("2026-09-11", 20),
        observation("2026-09-10", 20),
        observation("2026-09-09", 20),
      ],
      { asOf: "2026-09-14" },
    ).velocity,
  ),
  19,
);
check(
  "observations dated in the future are ignored",
  computeVelocity([observation("2026-09-20", 1), observation("2026-09-14", 1)], {
    asOf: "2026-09-14",
  }).observationCount,
  1,
);
check("heat is comparable across list sizes", heatOf(1, 20), heatOf(1, 50));
check("an absent weight does not penalise a term", weightMultiplier(null), 1);

console.log("\nThe classifier keeps the news out");
for (const [term, want] of [
  ["Roblox gift card 2000 Robux", "gift-cards"],
  ["PUBG UC cheap top up", "gift-cards"],
  ["Solo Leveling Season 3 release date", "anime"],
  ["Elden Ring Nightreign gameplay", "games"],
  ["presidential election results", null],
  ["Lakers vs Celtics final score", null],
  ["how to produce more milk", null],
  ["gtaa airport parking", null],
  ["the big game on sunday", null],
  ["switch to a new bank account", null],
]) {
  check(JSON.stringify(term), classifyTerm(term)?.domain ?? null, want);
}

console.log("\nThe catalog matcher points at the right page");
const match = buildCatalogMatcher([
  { entity_type: "anime", slug: "dragon-ball", name: "Dragon Ball" },
  { entity_type: "anime", slug: "dragon-ball-daima", name: "Dragon Ball Daima" },
  { entity_type: "anime", slug: "id", name: "ID" },
]);
check("longest title wins", match("dragon ball daima episode 20")?.slug, "dragon-ball-daima");
check("shorter title still matches on its own", match("dragon ball super")?.slug, "dragon-ball");
check("a two-letter title never matches", match("a valid id number"), null);
check("an unrelated term matches nothing", match("nothing relevant here"), null);

console.log(
  failures ? `\n${failures} check(s) failed.\n` : "\nAll trend-pipeline checks passed.\n",
);
process.exit(failures ? 1 : 0);
