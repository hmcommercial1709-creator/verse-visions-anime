import { createFileRoute } from "@tanstack/react-router";
import { loadEntityPage } from "@/lib/entity-catalog.functions";
import { CatalogIndex } from "@/components/catalog-entity";

/**
 * Canonical game-codes listing.
 *
 * The listing only ever existed at /en/codes, while the detail pages it links
 * to are canonical at /codes/<slug> — so the catalog's entry point disagreed
 * with everything it pointed at, and /codes itself was a 404. It matters more
 * than a tidiness fix: the code pages are reachable from the sitemap and
 * almost nowhere else, and Google gives orphaned URLs much less attention, so
 * this is the crawl path into 30,000 pages.
 *
 * page is omitted on page 1 so /codes does not redirect to /codes?page=1.
 */
export const Route = createFileRoute("/codes/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Math.max(1, Number(search.page) || 1);
    return page > 1 ? { page } : {};
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: ({ deps }) => loadEntityPage({ data: { kind: "code", page: deps.page } }),
  head: ({ loaderData }) => {
    const page = loaderData?.page ?? 1;
    const url = `https://gamecastle.store/codes${page > 1 ? `?page=${page}` : ""}`;
    return {
      meta: [
        { title: "Game codes catalog · GameCastle Anime" },
        {
          name: "description",
          content: "Browse the published game codes catalog on GameCastle Anime.",
        },
        // An empty listing is a thin page; say so rather than inviting it in.
        {
          name: "robots",
          content: loaderData?.entities.length ? "index, follow" : "noindex, follow",
        },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: function CanonicalCodesIndex() {
    return <CatalogIndex {...Route.useLoaderData()} title="Game codes catalog" basePath="/codes" />;
  },
});
