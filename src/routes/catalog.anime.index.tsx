import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTopAnime, animeSlug, displayTitle } from "@/lib/catalog/jikan";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const PATH = "/catalog/anime";
const MAX_PAGE = 40; // Jikan paginates 25/page; bounded so crawlers can't walk forever.

export const Route = createFileRoute("/catalog/anime/")({
  // page is omitted entirely on page 1 so the canonical URL stays clean —
  // otherwise the router normalises /catalog/anime to ?page=1 and the
  // sitemap ends up listing a URL that redirects.
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Math.min(MAX_PAGE, Math.max(1, Number(search?.page) || 1));
    return page > 1 ? { page } : {};
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const result = await getTopAnime(deps.page);
    if (!result.ok) {
      if (result.reason === "not_found" || result.reason === "invalid_shape") throw notFound();
      throw new Error(`Anime catalog unavailable (${result.reason})`);
    }
    return { anime: result.data, page: deps.page };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => {
    const page = loaderData?.page ?? 1;
    const title = page > 1 ? `Anime Catalog — Page ${page} | GameCastle` : "Anime Catalog | GameCastle";
    const description =
      "Browse top-rated anime series with scores, episode counts, studios and genres, cross-linked to our own in-depth guides.";
    const url = page > 1 ? `${absoluteUrl(PATH)}?page=${page}` : absoluteUrl(PATH);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Anime Catalog" }]),
          ),
        },
      ],
    };
  },
  component: AnimeCatalog,
});

function AnimeCatalog() {
  const { anime, page } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span> Anime Catalog
      </nav>
      <h1 className="font-display text-4xl font-bold">Anime Catalog</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Top-rated series with scores, episode counts and studios. Where we have written a full guide,
        each entry links straight to it. Catalog data from the{" "}
        <a href="https://jikan.moe" rel="noopener noreferrer nofollow" target="_blank" className="underline">
          Jikan
        </a>{" "}
        public API.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {anime.map((a) => {
          const image = a.images.webp?.image_url || a.images.jpg.image_url;
          return (
            <Link
              key={a.mal_id}
              to="/catalog/anime/$slug"
              params={{ slug: animeSlug(a) }}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover"
            >
              {image && (
                <img
                  src={image}
                  alt={displayTitle(a)}
                  loading="lazy"
                  width={225}
                  height={320}
                  className="aspect-[225/320] w-full object-cover"
                />
              )}
              <div className="p-3">
                <h2 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                  {displayTitle(a)}
                </h2>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.score ? `⭐ ${a.score}` : a.type}
                  {a.episodes ? ` · ${a.episodes} ep` : ""}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <nav className="mt-10 flex items-center justify-between border-t border-border/60 pt-5" aria-label="Pagination">
        {page > 1 ? (
          <Link to="/catalog/anime" search={{ page: page - 1 }} className="text-sm font-semibold text-primary hover:underline">
            ← Previous
          </Link>
        ) : <span />}
        <span className="text-sm text-muted-foreground">Page {page}</span>
        {page < MAX_PAGE ? (
          <Link to="/catalog/anime" search={{ page: page + 1 }} className="text-sm font-semibold text-primary hover:underline">
            Next →
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}
