import { supabase } from "@/integrations/supabase/client";

/**
 * The programmatic matrix, read from the index the ingest pipeline stores.
 *
 * Nothing here decides what exists — scripts/facet-index.mjs already did that,
 * once, over the whole catalog, applying the inventory thresholds that keep
 * near-empty intersections from becoming URLs. This side only reads the
 * verdict, so a facet route can answer "is this a real page?" with one cached
 * lookup instead of aggregating the catalog on every request.
 *
 * An intersection the index does not contain is not a 404 to apologise for.
 * It was never published, never linked and never in a sitemap, so the only
 * way to reach it is by typing it — and a 404 is the correct answer to that.
 */

export interface FacetPart {
  dim: string;
  value: string;
}

export interface FacetEntry {
  parts: FacetPart[];
  count: number;
  path: string;
}

export interface ComparisonEntry {
  a: string;
  b: string;
  shared: number;
  path: string;
}

export interface MatrixIndex {
  builtAt: string;
  rows: number;
  facets: Record<string, FacetEntry>;
  dropped: number;
  considered: number;
  comparisons: ComparisonEntry[];
}

export type CatalogType = "anime" | "game" | "manga";

const DIM_ORDER = ["genre", "studio", "platform", "season", "format", "year"];

/** Must match BROWSE_BASE in scripts/facet-index.mjs. */
const BROWSE_BASE: Record<CatalogType, string> = {
  anime: "/anime/browse",
  game: "/games/browse",
  manga: "/manga/browse",
};

export const facetSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/** Must match keyOf() in scripts/facet-index.mjs, or nothing ever resolves. */
export function facetKey(parts: FacetPart[]): string {
  const sorted = [...parts].sort((a, b) => DIM_ORDER.indexOf(a.dim) - DIM_ORDER.indexOf(b.dim));
  return sorted.map((p) => `${p.dim}:${facetSlug(p.value)}`).join("|");
}

/**
 * Parses the URL's facet segments.
 *
 * Returns null for anything malformed rather than guessing, so a typo
 * produces a 404 instead of a page for some other intersection. Duplicate
 * dimensions are rejected too: /genre-action/genre-drama is not an
 * intersection we publish, and quietly serving one of them would be a second
 * URL for a page that already exists.
 */
export function parseFacetSegments(segments: string[]): FacetPart[] | null {
  if (segments.length === 0 || segments.length > 3) return null;
  const parts: FacetPart[] = [];
  const seen = new Set<string>();

  for (const segment of segments) {
    const index = segment.indexOf("-");
    if (index <= 0) return null;
    const dim = segment.slice(0, index);
    const value = segment.slice(index + 1);
    if (!DIM_ORDER.includes(dim) || !value) return null;
    if (seen.has(dim)) return null;
    seen.add(dim);
    parts.push({ dim, value });
  }
  return parts;
}

/** The canonical path for an intersection — one page, one URL. */
export function facetPath(type: CatalogType, parts: FacetPart[]): string {
  const sorted = [...parts].sort((a, b) => DIM_ORDER.indexOf(a.dim) - DIM_ORDER.indexOf(b.dim));
  return `${BROWSE_BASE[type]}/${sorted.map((p) => `${p.dim}-${facetSlug(p.value)}`).join("/")}`;
}

/**
 * The stored index for one catalog type, or null when the pipeline has not
 * built one yet. Null means the matrix routes 404 rather than render empty
 * listings, which is the right failure: an empty listing page indexed once is
 * harder to undo than a page that never appeared.
 */
export async function loadMatrixIndex(type: CatalogType): Promise<MatrixIndex | null> {
  const { data, error } = await supabase
    .from("automation_state")
    .select("value")
    .eq("key", `catalog_matrix:${type}`)
    .maybeSingle();

  if (error || !data) return null;
  const value = (data as { value?: unknown }).value;
  if (!value || typeof value !== "object") return null;
  const index = value as Partial<MatrixIndex>;
  if (!index.facets || typeof index.facets !== "object") return null;
  return {
    builtAt: index.builtAt ?? "",
    rows: index.rows ?? 0,
    facets: index.facets,
    dropped: index.dropped ?? 0,
    considered: index.considered ?? 0,
    comparisons: Array.isArray(index.comparisons) ? index.comparisons : [],
  };
}

/** The catalog rows behind one intersection. */
export async function loadFacetRows(
  type: CatalogType,
  parts: FacetPart[],
  limit: number,
  offset = 0,
) {
  let query = supabase
    .from("entities")
    .select("slug, name, description, image_url, categories, metadata", { count: "exact" })
    .eq("entity_type", type)
    .eq("status", "active");

  for (const part of parts) {
    switch (part.dim) {
      case "genre":
        // The stored value is the display form ("Slice of Life"); the URL
        // carries the slug. Matching on the slug is not possible server-side,
        // so the index's own label is used — which is why parts come back
        // from the index rather than straight from the URL.
        query = query.contains("categories", [part.value]);
        break;
      case "year":
        query = query.or(
          `metadata->>seasonYear.eq.${part.value},metadata->>releaseYear.eq.${part.value}`,
        );
        break;
      case "studio":
        query = query.contains("metadata->makers", [{ name: part.value }]);
        break;
      case "platform":
        query = query.contains("metadata->platforms", [part.value]);
        break;
      case "format":
        query = query.eq("metadata->>format", part.value);
        break;
      case "season": {
        const [season, year] = part.value.split(" ");
        query = query.eq("metadata->>season", season).eq("metadata->>seasonYear", year);
        break;
      }
      default:
        return null;
    }
  }

  const { data, count, error } = await query
    .order("slug", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error || !data) return null;
  return { rows: data, total: count ?? 0 };
}

/**
 * The index entry for an intersection, resolved from URL slugs back to the
 * stored display values. The URL carries "slice-of-life"; the database holds
 * "Slice of Life", and only the index knows the mapping.
 */
export function resolveFacet(index: MatrixIndex, parts: FacetPart[]): FacetEntry | null {
  const key = facetKey(parts);
  return index.facets[key] ?? null;
}

/**
 * Sibling intersections one step away — the same dimensions with one value
 * changed. This is what stops a facet page being a dead end: without it every
 * intersection links down into its rows and nowhere across, and a crawler
 * that arrives on one has no route to the other four hundred.
 */
export function siblingFacets(index: MatrixIndex, parts: FacetPart[], limit = 12): FacetEntry[] {
  const own = facetKey(parts);
  const dims = parts.map((p) => p.dim).join(",");
  return Object.entries(index.facets)
    .filter(([key, entry]) => key !== own && entry.parts.map((p) => p.dim).join(",") === dims)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([, entry]) => entry);
}
