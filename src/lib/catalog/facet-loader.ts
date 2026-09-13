import {
  loadMatrixIndex,
  parseFacetSegments,
  resolveFacet,
  loadFacetRows,
  siblingFacets,
  facetPath,
  type CatalogType,
  type FacetEntry,
} from "./matrix";

/**
 * Everything a facet page needs, or null when the URL is not one we publish.
 *
 * Null covers three different situations on purpose, because all three should
 * be the same 404: the path is malformed, the index has not been built, and
 * the intersection exists arithmetically but fell below the inventory
 * threshold. Distinguishing them in the response would only tell a crawler
 * that the URL space is bigger than what we publish, which is the opposite of
 * the point.
 */

export const FACET_PAGE_SIZE = 36;

export interface FacetPageData {
  entry: FacetEntry;
  canonical: string;
  rows: {
    slug: string;
    name: string;
    description: string | null;
    image_url: string | null;
    categories: string[] | null;
    metadata: unknown;
  }[];
  total: number;
  siblings: FacetEntry[];
  /** Computed statements about this intersection; see facet-seo.ts. */
  builtAt: string;
}

export async function loadFacetPageData(
  type: CatalogType,
  splat: string,
): Promise<FacetPageData | null> {
  const segments = splat.split("/").filter(Boolean);
  const parsed = parseFacetSegments(segments);
  if (!parsed) return null;

  const index = await loadMatrixIndex(type);
  if (!index) return null;

  const entry = resolveFacet(index, parsed);
  if (!entry) return null;

  // The index carries the display values ("Slice of Life"); the URL carried
  // slugs. Querying with the index's own parts is what makes the database
  // filter match, and it is also what makes the canonical URL single-valued:
  // whatever casing or spacing the visitor typed, the page declares one.
  const result = await loadFacetRows(type, entry.parts, FACET_PAGE_SIZE);
  if (!result || result.rows.length === 0) return null;

  return {
    entry,
    canonical: facetPath(type, entry.parts),
    rows: result.rows as FacetPageData["rows"],
    total: result.total,
    siblings: siblingFacets(index, entry.parts),
    builtAt: index.builtAt,
  };
}
