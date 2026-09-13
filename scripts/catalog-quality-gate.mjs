/**
 * The catalog quality gate — one definition, shared by the ingester and the
 * verifier.
 *
 * This lived in both scripts as hand-copied twins, which is exactly how the
 * two drift: the verifier's copy had already lost the categories rule, so it
 * would have passed rows the ingester holds back. A row's grade must mean the
 * same thing wherever it is computed, so there is now a single source.
 *
 * A record passes when it has all of: a slug, a name, a summary of at least
 * MIN_SUMMARY_CHARS, an image URL, and at least one category. Anything short
 * of that is stored with status 'incomplete', which the active_catalog_read
 * RLS policy hides from the public client — so partial records are invisible
 * to visitors and to Googlebot without needing a separate noindex flag.
 *
 * Nothing here invents data to fill a gap. A missing summary stays missing
 * and the record stays incomplete.
 */

export const MIN_SUMMARY_CHARS = 120;

/**
 * Returns the reasons a record is not publishable; an empty array means it
 * qualifies for status 'active'.
 *
 * `categories` is checked only when the caller can actually see the value.
 * The ingester always can — it grades the record it is about to write. The
 * verifier reads rows back from a schema that may not carry a categories
 * column at all, and a rule it cannot evaluate must not be reported as a
 * violation, so it opts out rather than failing every row.
 */
export function incompletenessReasons(record, { checkCategories = true } = {}) {
  const reasons = [];
  if (!record.slug) reasons.push("missing slug");
  if (!record.name?.trim()) reasons.push("missing name");
  if (!record.description || record.description.trim().length < MIN_SUMMARY_CHARS) {
    reasons.push(`summary under ${MIN_SUMMARY_CHARS} chars`);
  }
  if (!record.image_url || !/^https?:\/\//i.test(record.image_url)) reasons.push("missing image");
  if (checkCategories && (!Array.isArray(record.categories) || record.categories.length === 0)) {
    reasons.push("no categories");
  }
  return reasons;
}
