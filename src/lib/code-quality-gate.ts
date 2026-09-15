/**
 * What makes a code page worth advertising to a crawler.
 *
 * One definition, used by the sitemap. It exists for the same reason
 * scripts/catalog-quality-gate.mjs exists — and because of a measured failure.
 *
 * Search Console, 15 September 2026: 25,757 URLs submitted, 137 indexed. Of
 * the 160 Google bothered to classify, 132 were "Discovered - currently not
 * indexed": it found the URLs and declined to spend a crawl on them. The site
 * had been flat for over a month.
 *
 * The cause is visible in the arithmetic. 25,000 of those 25,757 URLs — 97% —
 * were code pages, and a further 25,000 sat in the second partition. A code
 * page renders a title, a market, a language, a rating, a review count and one
 * sample review. Fifty thousand of those is a crawl budget spent on almost
 * nothing, and Google answers by crawling the whole property less. The 7,263
 * genuinely substantive catalog rows were competing with that for attention.
 *
 * So the rule here is not "is this row valid" — they nearly all are. It is
 * "does this page carry anything a searcher could not get from the listing it
 * sits on". A row with no sample review and no ratings renders a heading and a
 * label; it is a real page and it should stay reachable by a link, but putting
 * it in a sitemap asks Google to spend a crawl proving it is thin.
 *
 * Nothing is deleted and nothing is noindexed. These pages keep working and
 * keep their internal links. They simply stop being advertised.
 */

export interface CodeSitemapCandidate {
  slug?: string | null;
  title?: string | null;
  sample_review?: string | null;
  reviews_count?: number | null;
  aggregate_rating?: string | number | null;
}

/**
 * A sample review shorter than this is a stub, not content. Deliberately low:
 * the gate is meant to remove pages with nothing, not to judge prose.
 */
export const MIN_REVIEW_CHARS = 80;

/** Below this, a rating is one person's opinion rather than a signal. */
export const MIN_REVIEWS = 3;

/**
 * Reasons this row should not be advertised. Empty means it qualifies.
 * Returned as reasons rather than a boolean so the sitemap can report WHY it
 * dropped what it dropped, the same way the catalog gate does.
 */
export function codeSitemapExclusions(row: CodeSitemapCandidate): string[] {
  const reasons: string[] = [];
  if (!row.slug) reasons.push("no slug");
  if (!row.title?.trim()) reasons.push("no title");

  const review = row.sample_review?.trim() ?? "";
  const reviews = Number(row.reviews_count ?? 0);
  const rating = Number(row.aggregate_rating ?? 0);

  // The page needs at least ONE of: real prose, or enough ratings to be a
  // signal. Requiring both would drop rows that genuinely say something.
  const hasProse = review.length >= MIN_REVIEW_CHARS;
  const hasAudience = Number.isFinite(reviews) && reviews >= MIN_REVIEWS && Number.isFinite(rating) && rating > 0;
  if (!hasProse && !hasAudience) {
    reasons.push(
      `nothing beyond the listing: review ${review.length} chars (needs ${MIN_REVIEW_CHARS}), ` +
        `${reviews || 0} rating(s) (needs ${MIN_REVIEWS})`,
    );
  }
  return reasons;
}

export const qualifiesForCodeSitemap = (row: CodeSitemapCandidate): boolean =>
  codeSitemapExclusions(row).length === 0;
