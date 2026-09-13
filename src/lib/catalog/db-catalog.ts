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
}

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
