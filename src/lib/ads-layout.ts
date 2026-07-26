/**
 * Multi-slot ad layout planning for long-form templates.
 *
 * Keeps the "which paragraph gets an ad" decision out of the templates so the
 * article and episode pages stay in sync and slot IDs stay deterministic
 * (deterministic IDs = stable reporting + zero layout shift on re-render).
 */

export const AD_PARAGRAPH_INTERVAL = 4;
/** Named in-article slots, filled in order before falling back to Body_N. */
export const NAMED_IN_ARTICLE_SLOTS = ["InArticle_Ad_1", "InArticle_Ad_2", "InArticle_Ad_3"] as const;

export interface AdPlanEntry {
  /** Stable DOM/reporting id, e.g. InArticle_Ad_2. */
  adId: string;
  /** 1-based ordinal of the in-body unit. */
  index: number;
}

/**
 * Given the paragraph counts of each section, returns a lookup of
 * `${sectionIndex}:${paragraphIndex}` → ad slot to render after that paragraph.
 *
 * Long bodies get a unit every 3–4 paragraphs. Shorter bodies tighten the
 * spacing (min 2 paragraphs) so the density target is still met, and an ad is
 * never rendered after the final paragraph.
 */
export function planInArticleAds(
  paragraphCounts: number[],
  {
    interval,
    startAt = 1,
    max = 6,
  }: { interval?: number; startAt?: number; max?: number } = {},
): Map<string, AdPlanEntry> {
  const plan = new Map<string, AdPlanEntry>();
  const total = paragraphCounts.reduce((sum, n) => sum + n, 0);
  const step =
    interval ??
    Math.min(AD_PARAGRAPH_INTERVAL, Math.max(2, Math.round(total / (Math.min(max, 3) + 1))));
  let paragraph = 0;
  let placed = 0;

  paragraphCounts.forEach((count, sectionIndex) => {
    for (let p = 0; p < count; p += 1) {
      paragraph += 1;
      const isLast = paragraph === total;
      if (isLast || placed >= max) continue;
      if (paragraph % step !== 0) continue;
      placed += 1;
      const ordinal = startAt + placed - 1;
      const adId =
        NAMED_IN_ARTICLE_SLOTS[ordinal - 1] ?? `InArticle_Ad_Body_${ordinal - NAMED_IN_ARTICLE_SLOTS.length}`;
      plan.set(`${sectionIndex}:${p}`, { adId, index: ordinal });
    }
  });

  return plan;
}
