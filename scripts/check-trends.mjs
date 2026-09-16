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
import {
  classifyTerm,
  buildCatalogMatcher,
  extractEntity,
  VOCABULARY_SIZE,
} from "./trends/classify.mjs";
import {
  cleanVideoTitle,
  SEED_FRANCHISES,
  FRANCHISE_SEEDS_PER_RUN,
  franchiseSeedsForDay,
  YOUTUBE_SEED_KEYWORDS,
  YOUTUBE_FALLBACK_SEEDS,
  YOUTUBE_SEARCH_BUDGET,
  YOUTUBE_CATEGORIES,
} from "./trends/sources.mjs";

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

/* --- A video title is not a subject ---------------------------------- *
 *
 * A real collection run stored 152 "terms" that were YouTube video titles in
 * six languages — "ELE ESTA TE OBSERVANDO NO MINECRAFT... O TEMPO TODO!" —
 * none of which anyone searches for. These checks run the real cleaner and
 * the real extractor over the titles that run actually produced.
 */

console.log("\nTitle cleanup removes decoration, not subject");
check("hashtags go", cleanVideoTitle("Frieren AMV #shorts #anime").includes("#"), false);
check(
  "bracketed language tags go",
  cleanVideoTitle("Bleach [ENG SUB] [4K]").trim(),
  "Bleach",
);
check(
  "episode and season numbering goes",
  cleanVideoTitle("Naruto Season 2 Episode 14").trim(),
  "Naruto",
);
// The separator is noise; what follows it is as often the game as the channel.
// The entity must be in the LAST segment for this to test anything: the old
// rule stripped from the final pipe to the end, so a title with the subject in
// the middle survived it and the check passed against the broken cleaner.
check(
  "a trailing pipe segment is kept",
  cleanVideoTitle("gameplay walkthrough | Overwatch").includes("Overwatch"),
  true,
);

console.log("\nEntity extraction names a thing, or nothing");
check("the longest match wins", extractEntity("JUJUTSU KAISEN reaction")?.entity, "jujutsu kaisen");
check("an entity at the end of a title is found", extractEntity("gameplay | Overwatch")?.entity, "overwatch");
// The vocabulary carries topic markers so the on-topic filter works. A page
// about the word "anime" is the thin page this site already deleted 81,250 of.
check("a topic marker is on-topic", Boolean(classifyTerm("best anime this season")), true);
check("a topic marker is never an entity", extractEntity("best anime this season"), null);
// Surfaced by the first clean live run: every one of these was returned as a
// trending "entity", correctly on-topic and useless as a page subject.
check("a mechanic is not a subject", extractEntity("insane speedrun world record"), null);
check("patch notes are not a subject", extractEntity("new patch notes breakdown"), null);
check("a storefront is not a subject", extractEntity("steam autumn sale"), null);
check("a console is not a subject", extractEntity("nintendo switch 2 hands on"), null);
check("a top-up is not a subject", extractEntity("cheap top up guide"), null);
// …while the game named alongside them still is.
check("but the game beside it still is", extractEntity("Elden Ring speedrun world record")?.entity, "elden ring");
// "episode" and "season 3" as anime vocabulary matched every television drama
// in every language; a Pakistani serial was being stored as an anime trend.
check("a foreign TV serial is not anime", classifyTerm("Aap Ki Izzat Episode 18 ENG SUB"), null);
check("and yields no entity", extractEntity("Aap Ki Izzat Episode 18 ENG SUB"), null);
// Measured gaps from a real run: both were collected and both were dropped.
check("EA Sports FC is known", extractEntity("EA SPORTS FC 27 gameplay")?.entity, "ea sports fc");

/* --- Anime means Japanese animation ---------------------------------- *
 *
 * A pass that widened the vocabulary added a dozen Korean manhwa with no anime
 * adaptation, and two Korean live-action dramas. Those would have pulled
 * K-drama traffic into the anime queue in exactly the way the word "episode"
 * pulled in Pakistani serials — the same fault, one commit later.
 *
 * The test is the adaptation, not the origin of the source comic: Korean
 * material that became a Japanese anime production belongs; Korean material
 * that stayed a webtoon, or became live action, does not.
 */
console.log("\nAnime means Japanese animation");
check("a currently-airing Japanese series", extractEntity("Kaiju No. 8 Season 2 Trailer")?.entity, "kaiju no. 8");
check("a long-running Japanese series", extractEntity("Death Note rewatch")?.entity, "death note");
// A brand-new title the vocabulary has never seen still reads as anime when
// the studio is named, which is how week-one trends get picked up at all.
check("a Japanese studio", extractEntity("MAPPA announces a new project")?.entity, "mappa");
check("Korean source WITH a Japanese anime", extractEntity("Tower of God S3 PV")?.entity, "tower of god");
check("Korean live-action drama is not anime", extractEntity("Sweet Home season 3 Netflix"), null);
check("and is not even on-topic", classifyTerm("Weak Hero Class 2 trailer"), null);
check("a manhwa with no anime is not anime", extractEntity("Eleceed chapter 300 review"), null);

/* --- A big list is only worth what its precision survives ------------- *
 *
 * A 287-line reference list reduced to 207 franchises, and two of those
 * reduced to fragments that match ordinary English: "Re:Zero" split at the
 * colon becomes "re", and "The Last: Naruto the Movie" becomes "the last".
 * Either one turns the vocabulary into a filter that matches everything,
 * which classifies nothing.
 */
console.log("\nA franchise whose short form is a common fragment is not carried by it");
check("re-upload is not Re:Zero", extractEntity("I re-uploaded this video"), null);
check("The Last of Us is not a Naruto film", extractEntity("the last of us part 2"), null);
check("but the full title still matches", extractEntity("Re:Zero season 3 ep 4")?.entity, "re:zero");
// Video titles drop the apostrophe far more often than they type it.
check("a possessive without its apostrophe", extractEntity("Kurokos Basketball season 3")?.entity, "kuroko");
check("and a multi-word one", extractEntity("Howls Moving Castle 4K")?.entity, "howls moving castle");
// The list is only useful if it is actually broad.
check("the vocabulary is broad", VOCABULARY_SIZE > 300, true);

/* --- The list points YouTube, it does not only filter it -------------- *
 *
 * Used as vocabulary the reference list decides what to keep out of whatever
 * YouTube happened to return. Used as seeds it decides what YouTube is asked
 * for — the difference between filtering noise and never collecting it.
 */
console.log("\nFranchise seeds rotate and stay inside the quota");
check("every franchise is a usable query", SEED_FRANCHISES.every((t) => t.length >= 4), true);
check("the list is large", SEED_FRANCHISES.length > 150, true);
const dayA = franchiseSeedsForDay(FRANCHISE_SEEDS_PER_RUN, new Date("2026-09-16T00:00:00Z"));
const dayB = franchiseSeedsForDay(FRANCHISE_SEEDS_PER_RUN, new Date("2026-09-17T00:00:00Z"));
check("a run asks the configured number", dayA.length, FRANCHISE_SEEDS_PER_RUN);
// Consecutive days must not repeat, or the cycle never reaches the tail of
// the list and half the catalogue is never asked about.
check(
  "consecutive days do not overlap",
  dayA.filter((a) => dayB.some((b) => b.q === a.q)).length,
  0,
);
check("the same day is reproducible", franchiseSeedsForDay(FRANCHISE_SEEDS_PER_RUN, new Date("2026-09-16T00:00:00Z"))[0].q, dayA[0].q);
check("seeds target an allowed category", dayA.every((seed) => YOUTUBE_CATEGORIES.includes(seed.category)), true);
// 100 units per search call against a 10,000/day budget.
check(
  "the whole pass fits the daily quota",
  (YOUTUBE_SEED_KEYWORDS.length + FRANCHISE_SEEDS_PER_RUN) * 100 < 10000,
  true,
);
check(
  "and fits the enforced budget",
  YOUTUBE_SEED_KEYWORDS.length + FRANCHISE_SEEDS_PER_RUN <= YOUTUBE_SEARCH_BUDGET,
  true,
);

/* --- The catalog is the net; the vocabulary is the backstop ----------- *
 *
 * The vocabulary is a few hundred names somebody typed. The catalog is every
 * anime, manga and game the site ingests from AniList, Jikan and Steam,
 * refreshed nightly — thousands of rows, including the series that premiered
 * this week. Running the vocabulary first made it a whitelist and dropped
 * those before the catalog, which already knew them, was ever consulted.
 */
console.log("\nThe catalog reaches further than any hand-written list");
const fresh = buildCatalogMatcher([
  { entity_type: "anime", slug: "gachiakuta", name: "Gachiakuta" },
  { entity_type: "game", slug: "silksong", name: "Hollow Knight Silksong" },
]);
check("a series no list was updated for", fresh("Gachiakuta ep 12 reaction")?.slug, "gachiakuta");
check("a game no list was updated for", fresh("Hollow Knight Silksong release date")?.slug, "silksong");
// If these ever start matching, the ordering has stopped mattering and this
// section can go. Until then they are the reason the catalog is tried first.
check("the vocabulary alone misses the series", extractEntity("Gachiakuta ep 12 reaction"), null);
check("and misses the game", extractEntity("Hollow Knight Silksong release date"), null);

console.log("\nThe seeded search is bounded and cannot come back empty-handed");
check("seeds exist", YOUTUBE_SEED_KEYWORDS.length > 0, true);
check("fallback seeds exist", YOUTUBE_FALLBACK_SEEDS.length > 0, true);
// search.list costs 100 units against a 10,000/day budget where videos.list
// costs 1. The ceiling is the quota, not a number somebody liked: an earlier
// version asserted "<= 40", which failed the moment the budget was raised for
// a good reason and told us nothing about whether the raise was safe.
check("the budget is bounded", YOUTUBE_SEARCH_BUDGET > 0, true);
check(
  "a full pass cannot exhaust the daily quota",
  YOUTUBE_SEARCH_BUDGET * 100 <= 7000,
  true,
);
check(
  "the budget covers the seeds",
  YOUTUBE_SEED_KEYWORDS.length <= YOUTUBE_SEARCH_BUDGET,
  true,
);
check(
  "both languages are seeded",
  new Set(YOUTUBE_SEED_KEYWORDS.map((s) => s.lang)).size >= 2,
  true,
);
check(
  "every seed targets an allowed category",
  YOUTUBE_SEED_KEYWORDS.concat(YOUTUBE_FALLBACK_SEEDS).every((s) =>
    YOUTUBE_CATEGORIES.includes(s.category),
  ),
  true,
);

console.log(
  failures ? `\n${failures} check(s) failed.\n` : "\nAll trend-pipeline checks passed.\n",
);
process.exit(failures ? 1 : 0);
