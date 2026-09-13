import { supabase } from "@/integrations/supabase/client";

/**
 * Catalog listings served from public.entities.
 *
 * The live APIs are capped: Jikan's top list is paginated and we bound it at
 * 40 pages, and FreeToGame publishes roughly 400 games in total. Once
 * scripts/ingest-catalog.mjs has filled public.entities, the listings can come
 * from there instead, with no page ceiling and no per-request call to a
 * rate-limited upstream.
 *
 * The slugs match: ingest-catalog.mjs builds `{sourceId}-{title}` with the
 * same normalisation as animeSlug/gameSlug, so rows listed from the database
 * link straight to the existing /catalog/anime/<slug> and
 * /catalog/games/<slug> detail pages.
 *
 * Returns null when the table has nothing to show, so callers fall back to the
 * API rather than rendering an empty catalog. That keeps the site working
 * before the ingest has ever run, and during one.
 *
 * Uses the publishable client, so RLS applies and only status 'active' rows —
 * the ones that passed the ingester's quality gate — are visible.
 */

export interface DbCatalogItem {
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  categories: string[] | null;
  source_url: string | null;
  source_name: string | null;
  /** Source extras plus the derived cross-catalog block; see catalog-facts.ts. */
  metadata?: unknown;
}

const DETAIL_COLUMNS = "slug, name, description, image_url, categories, source_url, source_name";
const DETAIL_COLUMNS_WITH_METADATA = `${DETAIL_COLUMNS}, metadata`;

export interface DbCatalogPage {
  items: DbCatalogItem[];
  total: number;
  totalPages: number;
}

export async function loadCatalogFromDb(
  entityType: "anime" | "game",
  page: number,
  pageSize: number,
): Promise<DbCatalogPage | null> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("entities")
    .select("slug, name, description, image_url", { count: "exact" })
    .eq("entity_type", entityType)
    .eq("status", "active")
    // Ordered so pagination is stable: range() over an unordered query can
    // repeat or skip rows between pages.
    .order("slug", { ascending: true })
    .range(from, to);

  if (error || !data) return null;

  const total = count ?? 0;
  if (total === 0) return null;

  return {
    items: (data as DbCatalogItem[]).filter((r) => r.slug && r.name),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** How many pages the database can serve, or 0 when it holds nothing. */
export async function countDbCatalogPages(
  entityType: "anime" | "game",
  pageSize: number,
): Promise<number> {
  const { count, error } = await supabase
    .from("entities")
    .select("slug", { count: "exact", head: true })
    .eq("entity_type", entityType)
    .eq("status", "active");
  if (error || !count) return 0;
  return Math.ceil(count / pageSize);
}

/** One catalog row by slug, or null when the table has no such row. */
export async function loadCatalogItemFromDb(
  entityType: "anime" | "game",
  slug: string,
): Promise<DbCatalogItem | null> {
  const read = (columns: string) =>
    supabase
      .from("entities")
      .select(columns)
      .eq("entity_type", entityType)
      .eq("status", "active")
      .eq("slug", slug)
      .maybeSingle();

  // metadata is selected by name, and PostgREST fails the whole query for a
  // column that does not exist. So ask for it, and retry without it — the
  // page still renders on a schema that has not had the migration applied.
  let { data, error } = await read(DETAIL_COLUMNS_WITH_METADATA);
  if (error) ({ data, error } = await read(DETAIL_COLUMNS));

  if (error || !data) return null;
  const row = data as Partial<DbCatalogItem>;
  // Checking the fields the page renders, not just truthiness: a partial row
  // would otherwise produce a page headed "undefined" with a 200, which
  // Google files as a soft 404.
  if (!row.slug || !row.name) return null;
  return row as DbCatalogItem;
}

/**
 * The upstream id for a stored row, taken from source_url.
 *
 * Not from the slug: ingest-catalog.mjs writes `{id}-{title}`, but a title
 * that begins with a number produces the same shape by accident —
 * "100-meters" parses to id 100, which is a real and completely unrelated MAL
 * entry. Reading the id from the URL the row was ingested from is exact, and
 * it is the difference between enriching a page and replacing it with the
 * wrong anime.
 */
export function upstreamIdFromSourceUrl(sourceUrl: string | null): number | null {
  if (!sourceUrl) return null;
  const match = sourceUrl.match(/\/(?:anime|game)\/(\d+)/i) ?? sourceUrl.match(/id=(\d+)/i);
  const id = match ? Number.parseInt(match[1], 10) : NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
}
