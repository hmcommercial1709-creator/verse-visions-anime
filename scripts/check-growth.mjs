#!/usr/bin/env node
/**
 * Conformance checks for the opportunity model, lifecycle and decision layer.
 * No network, no database — runs on every push.
 *
 * What it protects, in order of how much damage the regression would do:
 *
 *   1. A missing factor never becomes a default. The whole model rests on it:
 *      the moment an unmeasured competition value silently becomes 0.5, every
 *      score is part fiction and nothing downstream can tell which part.
 *
 *   2. create_new requires positive evidence. Automated content systems fail
 *      by creating, not by holding back, and one loosened branch here is how a
 *      site ends up with four pages competing for one query.
 *
 *   3. The publishing cap cannot be routed around.
 *
 *   4. Lifecycle stages require history, and declining/emerging never grant
 *      permission to publish.
 */

import {
  scoreOpportunity,
  demandScore,
  velocityScore,
  feasibilityScore,
  cannibalizationScore,
  intentOf,
  DEFAULT_WEIGHTS,
} from "./growth/opportunity.mjs";
import { classifyLifecycle, policyFor } from "./growth/lifecycle.mjs";
import { decide, applyPublishingLimits, overlap, DEFAULTS } from "./growth/decide.mjs";
import { nullProvider, serpFactors } from "./growth/serp-provider.mjs";

let failures = 0;
const check = (label, got, want) => {
  const ok = Object.is(got, want);
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "ok  " : "FAIL"}  ${label}${ok ? "" : `   got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`,
  );
};

console.log("\nUnmeasured factors are dropped, never defaulted");
{
  const partial = scoreOpportunity({ factors: { demand: 0.8 }, provenance: { demand: "test" } });
  check("only the measured factor counts", partial.contributions.length, 1);
  check("the rest are reported missing", partial.missing.includes("competition"), true);
  check("confidence reflects the gap", partial.confidence < 0.2, true);
  check("the explanation says so", /no evidence for/.test(partial.explanation), true);

  const none = scoreOpportunity({ factors: {} });
  check("nothing measured yields no score", none.score, null);
  check("  and zero confidence", none.confidence, 0);
}
{
  // A candidate must not gain by having a PENALTY measured.
  const without = scoreOpportunity({ factors: { demand: 1 } }).score;
  const withPenalty = scoreOpportunity({ factors: { demand: 1, cannibalization: 1 } }).score;
  check("a measured penalty lowers the score", withPenalty < without, true);
}

console.log("\nFactor scales are honest");
check("no demand evidence yields null", demandScore(0), null);
check("no velocity evidence yields null", velocityScore(null), null);
check("+500% growth reaches the top of the scale", velocityScore(5), 1);
check("an unranked page has no feasibility", feasibilityScore(null), null);
check("position 8 beats position 45", feasibilityScore(8) > feasibilityScore(45), true);
check(
  "a page already at 2 has little left to win",
  feasibilityScore(2) < feasibilityScore(8),
  true,
);
check("no ranking pages means no cannibalization", cannibalizationScore([]), 0);
check(
  "a page ranking top 10 means full cannibalization risk",
  cannibalizationScore([{ position: 4 }]),
  1,
);
check("commercial intent is recognised", intentOf("cheap roblox gift card").intent, "commercial");
check("an opaque query is marked unclear", intentOf("zzz qqq").intent, "unclear");

console.log("\nThe SERP provider admits it knows nothing");
{
  const result = await nullProvider.fetchSerp("anything");
  check("default provider is unavailable", result.available, false);
  check("it contributes no factors", Object.keys(serpFactors(result).factors).length, 0);
}

console.log("\nLifecycle needs history");
check(
  "two days is not a stage",
  classifyLifecycle(
    [
      { day: "2026-09-13", score: 1 },
      { day: "2026-09-14", score: 1 },
    ],
    2,
  ).stage,
  "unknown",
);
check("unknown never permits publishing", policyFor("unknown").publish, false);
check("declining never permits expanding", policyFor("declining").expand, false);
check("rising permits acting", policyFor("rising").publish, true);
{
  const days = (n, score) =>
    Array.from({ length: n }, (_, i) => ({
      day: `2026-09-${String(i + 1).padStart(2, "0")}`,
      score,
    }));
  check(
    "no measured velocity means emerging",
    classifyLifecycle(days(6, 0.5), null).stage,
    "emerging",
  );
  check(
    "sustained presence is evergreen",
    classifyLifecycle(days(25, 0.8), 0.05).stage,
    "evergreen",
  );
}

console.log("\ncreate_new requires positive evidence");
{
  const strong = {
    query: "brand new distinct topic xyz",
    score: 0.9,
    confidence: 0.9,
    lifecycle: { stage: "rising" },
    intent: "informational",
  };
  check("nothing related → create_new", decide(strong, []).action, "create_new");
  check(
    "a page already ranking → improve_existing",
    decide(strong, [{ url: "/a", title: "a", position: 6, rankingForQuery: true }]).action,
    "improve_existing",
  );
  check(
    "a closely related page → improve_existing",
    decide({ ...strong, query: "solo leveling season three" }, [
      { url: "/anime/solo-leveling", title: "Solo Leveling Season", rankingForQuery: false },
    ]).action,
    "improve_existing",
  );
  check(
    "low confidence → needs_review, never create",
    decide({ ...strong, confidence: 0.2 }, []).action,
    "needs_review",
  );
  check(
    "a declining topic → skip",
    decide({ ...strong, lifecycle: { stage: "declining" } }, []).action,
    "skip",
  );
  check("an unscored candidate → skip", decide({ ...strong, score: null }, []).action, "skip");
  check(
    "a score under the create bar never creates",
    decide({ ...strong, score: DEFAULTS.createThreshold - 0.01 }, []).action === "create_new",
    false,
  );
  check("every decision explains itself", decide(strong, []).reason.length > 20, true);
}

console.log("\nOverlap detection");
check(
  "near-identical topics overlap strongly",
  overlap("solo leveling season 3", "Solo Leveling Season Guide") >= DEFAULTS.strongOverlap,
  true,
);
check(
  "unrelated topics do not",
  overlap("roblox gift card", "attack on titan finale") < DEFAULTS.weakOverlap,
  true,
);

console.log("\nThe publishing cap holds");
{
  const many = Array.from({ length: 50 }, () => ({ action: "create_new" }));
  const { created, deferred } = applyPublishingLimits(many, { maxCreate: 5, maxImprove: 15 });
  check("creations are capped", created.length, 5);
  check("the rest are deferred, not dropped", deferred.length, 45);
}

console.log(failures ? `\n${failures} check(s) failed.\n` : "\nAll growth-engine checks passed.\n");
process.exit(failures ? 1 : 0);
