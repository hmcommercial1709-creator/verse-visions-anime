/**
 * Stores the facet and comparison indexes where the Worker can read them.
 *
 * The alternative is aggregating thousands of rows per request to answer
 * "does /anime/browse/genre-action/year-2020 exist, and what is in it?" — on
 * every render, for every intersection, inside a Worker with a subrequest
 * budget. Computing it once per ingest and reading one row instead is the
 * difference between a matrix that serves and one that times out.
 *
 * Written to automation_state, the same table the Steam cursor uses, because
 * this is operational state produced by the pipeline rather than catalog
 * content. Row-level security already keeps that table off the public client,
 * so the Worker reads it through the route loader's server-side client.
 *
 * The index is a snapshot. A facet that has fallen below the threshold since
 * the last ingest keeps its page until the next one, which is correct: pages
 * appearing and vanishing between crawls is worse for indexing than a page
 * that is briefly a little thinner than the rule would allow.
 */

import { buildFacetIndex, buildComparisonIndex } from "./facet-index.mjs";

const STATE_TABLE = "automation_state";

export const matrixKey = (entityType) => `catalog_matrix:${entityType}`;

export async function writeMatrixIndex(supabase, records, entityType, log = console.log) {
  const facets = buildFacetIndex(records, entityType);
  const comparisons = buildComparisonIndex(records, entityType);

  const facetCount = Object.keys(facets.facets).length;
  log(
    `Matrix (${entityType}): ${facetCount} facet pages kept, ` +
      `${facets.dropped} intersections dropped below the inventory threshold.`,
  );
  log(`  ${comparisons.pairs.length} comparison pages.`);

  const payload = {
    builtAt: new Date().toISOString(),
    rows: records.length,
    facets: facets.facets,
    dropped: facets.dropped,
    considered: facets.considered,
    comparisons: comparisons.pairs,
  };

  const { error } = await supabase
    .from(STATE_TABLE)
    .upsert({ key: matrixKey(entityType), value: payload }, { onConflict: "key" });

  // A missing index costs facet pages on the next render, not data loss, so
  // it must never fail a run whose catalog rows were written successfully.
  if (error) {
    log(`  (could not store the matrix index: ${error.message})`);
    return null;
  }
  return payload;
}
