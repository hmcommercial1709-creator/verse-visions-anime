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

/**
 * Column sets tried in order, widest first.
 *
 * PostgREST fails the whole query for one column the table does not have, so
 * a single optional column missing takes the entire read with it. `metadata`
 * and `categories` are both optional in this schema — ingest-catalog.mjs has
 * always probed for `categories` — and a detail page that silently fell back
 * to the API because of one absent column is exactly the kind of degradation
 * that is invisible until someone reads the logs.
 */
const DETAIL_COLUMN_SETS = [
  "slug, name, description, image_url, categories, source_url, source_name, metadata",
  "slug, name, description, image_url, categories, source_url, source_name",
  "slug, name, description, image_url, source_url, source_name",
  "slug, name, description, image_url",
];

/**
 * The columns the taste card reads, and only those.
 *
 * Kept separate from DbCatalogItem rather than reusing it: the card never
 * selects source_url or source_name, so typing these rows as DbCatalogItem
 * would promise two fields that are genuinely absent at runtime, and the first
 * caller to read one would get undefined with the compiler saying it is a
 * string. A smaller honest type costs nothing.
 */
export interface CatalogPickRow {
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  categories: string[] | null;
  entity_type: string | null;
}

const PICK_COLUMNS = "slug, name, description, image_url, categories, entity_type";

export interface DbCatalogPage {
  items: DbCatalogItem[];
  total: number;
  totalPages: number;
}

export async function loadCatalogFromDb(
  entityType: "anime" | "game" | "manga",
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

/**
 * Every active slug of one type, for the sitemap.
 *
 * The catalog sitemap listed games from the FreeToGame API only, so the Steam
 * rows the nightly ingest writes to public.entities — 1,197 of them and
 * growing — had working pages at /catalog/games/{slug} that no sitemap
 * advertised. A page nothing links to and nothing lists is a page Google has
 * no route to.
 *
 * Paged rather than fetched in one request: PostgREST caps a response, and a
 * silent truncation here would quietly drop the tail of the catalog out of the
 * sitemap without any error to notice.
 */
export async function listAllCatalogSlugs(
  entityType: "anime" | "game" | "manga",
  { pageSize = 1000, maxRows = 50000 } = {},
): Promise<string[]> {
  const slugs: string[] = [];
  for (let from = 0; from < maxRows; from += pageSize) {
    const { data, error } = await supabase
      .from("entities")
      .select("slug")
      .eq("entity_type", entityType)
      .eq("status", "active")
      .order("slug", { ascending: true })
      .range(from, from + pageSize - 1);
    // Degrade rather than throw: a partial sitemap beats a 500, which the
    // index would report as a failing child against the whole property.
    if (error || !data?.length) break;
    for (const row of data as Array<{ slug: string | null }>) {
      if (row.slug) slugs.push(row.slug);
    }
    if (data.length < pageSize) break;
  }
  return slugs;
}

/**
 * Title search across the catalog, for the picker in the gamer card.
 *
 * Runs from the browser against the anon key, which the active_catalog_read
 * policy limits to rows already marked active — so the search can only ever
 * surface pages that exist and pass the quality gate.
 *
 * ilike rather than full-text: the catalog is names, not prose, and a prefix
 * match on a name is what someone typing "solo lev" expects. Escaping the
 * wildcards matters — an unescaped % turns one keystroke into a full scan.
 */
export async function searchCatalog(
  term: string,
  { entityType, limit = 12 }: { entityType?: "anime" | "game" | "manga"; limit?: number } = {},
): Promise<CatalogPickRow[]> {
  const cleaned = term.trim().replace(/[%_\\]/g, "");
  if (cleaned.length < 2) return [];

  let query = supabase
    .from("entities")
    .select(PICK_COLUMNS)
    .eq("status", "active")
    .ilike("name", `%${cleaned}%`)
    .limit(limit);
  if (entityType) query = query.eq("entity_type", entityType);

  const { data, error } = await query;
  // A search that fails should return nothing, not throw into a render.
  if (error || !data) return [];
  return data as unknown as CatalogPickRow[];
}

/** How many pages the database can serve, or 0 when it holds nothing. */
export async function countDbCatalogPages(
  entityType: "anime" | "game" | "manga",
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
  entityType: "anime" | "game" | "manga",
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

  // Widest set first, narrowing on each failure, so the page renders whatever
  // the table can actually give it rather than nothing at all.
  let data = null;
  let error = null;
  for (const columns of DETAIL_COLUMN_SETS) {
    ({ data, error } = await read(columns));
    if (!error) break;
  }

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

/**
 * The rows behind a set of slugs, for rehydrating a shared card.
 *
 * A card's URL carries slugs, not names, so opening someone else's link has to
 * look the picks up again. Fetched in one request rather than one per slug:
 * six round trips to render a shared page is six chances to half-render it.
 *
 * Order follows the slugs given, not the order PostgREST returns, so the card
 * a reader opens is laid out exactly like the card that was shared. Slugs with
 * no active row are dropped — a pick that was deleted or demoted since the
 * link was made simply is not on the card, rather than showing as a blank.
 */
export async function loadPicksBySlugs(slugs: string[]): Promise<CatalogPickRow[]> {
  const wanted = slugs.filter(Boolean).slice(0, 12);
  if (!wanted.length) return [];

  const { data, error } = await supabase
    .from("entities")
    .select(PICK_COLUMNS)
    .eq("status", "active")
    .in("slug", wanted);

  if (error || !data) return [];
  const bySlug = new Map((data as unknown as CatalogPickRow[]).map((row) => [row.slug, row]));
  return wanted
    .map((slug) => bySlug.get(slug))
    .filter((row): row is CatalogPickRow => Boolean(row));
}

/**
 * Catalog rows whose `categories` overlap any of the given tags.
 *
 * Used by the Mission Loadout to find a game that genuinely shares a vibe's
 * genre rather than any game at all. `overlaps` is a real array operation in
 * PostgREST, so the filtering happens in the database instead of pulling the
 * catalog down and discarding most of it in the browser.
 *
 * Returns [] on any failure, so a slot that cannot be filled stays visibly
 * empty rather than throwing into a render.
 */
export async function searchCatalogByTags(
  tags: string[],
  { entityType, limit = 12 }: { entityType?: "anime" | "game" | "manga"; limit?: number } = {},
): Promise<CatalogPickRow[]> {
  const wanted = tags.filter((tag) => /^[A-Za-z0-9 &'-]{2,40}$/.test(tag));
  if (!wanted.length) return [];

  let query = supabase
    .from("entities")
    .select(PICK_COLUMNS)
    .eq("status", "active")
    .overlaps("categories", wanted)
    .limit(limit);
  if (entityType) query = query.eq("entity_type", entityType);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as CatalogPickRow[];
}
