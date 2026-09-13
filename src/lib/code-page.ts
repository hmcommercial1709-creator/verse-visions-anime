import { notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { absoluteUrl } from "@/lib/seo";

/**
 * Data and metadata for a code page, shared by the two routes that serve one:
 *   /codes/:slug          — canonical (default locale carries no prefix)
 *   /:locale/codes/:slug  — localized editions
 *
 * They were not shared before, and the canonical route did not exist at all:
 * the sitemap advertised /codes/:slug, localizePath having stripped the "en",
 * while the only route was /$locale/codes/:slug. Every code URL Google was
 * given therefore 404'd.
 */
export type CodeItem = {
  slug: string;
  title: string;
  target_language: string;
  target_market: string;
  aggregate_rating: string | null;
  reviews_count: number | null;
  sample_review: string | null;
  updated_at: string | null;
};

const CODE_PAGE_SELECT =
  "slug, title, target_language, target_market, aggregate_rating, reviews_count, sample_review, updated_at";

export interface CodePageData {
  item: CodeItem;
  related: { slug: string; title: string }[];
}

/**
 * A handful of sibling codes, used to cross-link the catalog.
 *
 * Without them the 30,000 code pages hang off one paginated listing, so
 * reaching the last of them means walking well over a thousand pagination
 * steps — a crawler will not do that, and the pages sat orphaned in the
 * sitemap. Linking each page to its neighbours turns a chain into a mesh, so
 * a crawler entering anywhere can reach the rest in a few hops. Scoped to the
 * same market so the links are useful to a reader too, not just to a crawler.
 */
async function loadRelatedCodes(item: CodeItem): Promise<{ slug: string; title: string }[]> {
  const pick = (rows: unknown) =>
    ((rows ?? []) as { slug: string | null; title: string | null }[]).filter(
      (r): r is { slug: string; title: string } => Boolean(r.slug && r.title),
    );

  // A window around this code in slug order — some after it, some before —
  // rather than "the first N in this market", which would point every one of
  // the 30,000 pages at the same twelve and leave the rest unreachable. A
  // moving window makes each page's links unique, so the pages form a chain a
  // crawler can walk in either direction instead of a hub with twelve spokes.
  const [after, before] = await Promise.all([
    supabase
      .from("game_nexus_matrix")
      .select("slug, title")
      .gt("slug", item.slug)
      .order("slug", { ascending: true })
      .limit(8),
    supabase
      .from("game_nexus_matrix")
      .select("slug, title")
      .lt("slug", item.slug)
      .order("slug", { ascending: false })
      .limit(8),
  ]);

  if (after.error && before.error) return [];
  return [...pick(before.data).reverse(), ...pick(after.data)];
}

export async function loadCodePage(slug: string): Promise<CodePageData> {
  const item = await loadCodeItem(slug);
  return { item, related: await loadRelatedCodes(item) };
}

export async function loadCodeItem(slug: string): Promise<CodeItem> {
  const { data, error } = await supabase
    .from("game_nexus_matrix")
    .select(CODE_PAGE_SELECT)
    .eq("slug", slug)
    .single();

  // Checking for the fields the page actually renders, not just truthiness:
  // an empty array or a partial row is truthy, and would render a page headed
  // "undefined" with a 200. Google files those as soft 404s, which is worse
  // than an honest 404 because the URL keeps getting crawled.
  const item = data as Partial<CodeItem> | null;
  if (error || !item?.slug || !item?.title) throw notFound();
  return item as CodeItem;
}

/** Canonical URL for a code page: default locale, no prefix. */
export const codeCanonical = (slug: string) => absoluteUrl(`/codes/${slug}`);

export function codePageHead(item: CodeItem | undefined, slug: string) {
  if (!item) return { meta: [] };
  const description = `Activation guide for ${item.title} in the ${item.target_market} market (${item.target_language}).`;
  return {
    meta: [
      { title: `${item.title} | GameCastle` },
      { name: "description", content: description },
      { property: "og:title", content: item.title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: codeCanonical(slug) },
    ],
    // Both routes point at the same canonical, so the localized editions do
    // not compete with the canonical URL in the index.
    links: [{ rel: "canonical", href: codeCanonical(slug) }],
  };
}
