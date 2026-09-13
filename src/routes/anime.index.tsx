import { createFileRoute, Link } from "@tanstack/react-router";
import { publishedAnime } from "@/lib/content-registry";
import { getTopAnime, animeSlug, displayTitle } from "@/lib/catalog/jikan";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

/**
 * The anime archive.
 *
 * This listed the 23 hand-written series and nothing else, so the site's main
 * anime page showed 23 entries while a catalog of a thousand sat at
 * /catalog/anime that the main flow barely pointed at. It now serves the
 * catalog, paginated, with the in-depth guides featured above it on page 1 —
 * those are the richest pages on the site (watch orders, characters, arcs,
 * soundtracks, FAQs, and 114 section pages beneath them) and burying them
 * under a thousand catalog rows would waste them.
 *
 * /catalog/anime redirects here rather than serving the same list at a second
 * URL.
 */

const MAX_PAGE = 40; // Jikan paginates 25/page; bounded so crawlers can't walk forever.
const guides = publishedAnime();

export const Route = createFileRoute("/anime/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Math.min(MAX_PAGE, Math.max(1, Number(search?.page) || 1));
    return page > 1 ? { page } : {};
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const result = await getTopAnime(deps.page);
    // Deliberately not thrown. This is a top-level navigation page, and the
    // 23 guides are local data that is always available — degrading to them
    // beats a 500 when a third-party API is briefly unreachable.
    return {
      catalog: result.ok ? result.data : [],
      catalogFailed: !result.ok,
      page: deps.page,
    };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => {
    const page = loaderData?.page ?? 1;
    const title = page > 1 ? `Anime — Page ${page} | GameCastle Anime` : "Anime | GameCastle Anime";
    const description =
      page > 1
        ? `Top-rated anime with scores, episode counts and studios — page ${page}.`
        : `Browse top-rated anime with scores, episode counts and studios, plus ${guides.length} in-depth guides with watch orders, characters and soundtracks.`;
    const url = page > 1 ? `${absoluteUrl("/anime")}?page=${page}` : absoluteUrl("/anime");
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
            breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Anime" }]),
          ),
        },
      ],
    };
  },
  component: AnimeArchive,
});

function AnimeArchive() {
  const { catalog, catalogFailed, page } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        <span className="mx-1">/</span> Anime
      </nav>

      <h1 className="font-display text-4xl font-bold">Anime</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Top-rated series with scores, episode counts and studios. Catalog data from the{" "}
        <a
          href="https://jikan.moe"
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="underline"
        >
          Jikan
        </a>{" "}
        public API.
      </p>

      {page === 1 && guides.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">In-depth guides</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Series we have written up in full — watch order, characters, story arcs, soundtrack and
            FAQ.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((a) => (
              <Link
                key={a.slug}
                to="/anime/$slug"
                params={{ slug: a.slug }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-4 card-hover hover:border-primary/60"
              >
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.year} · {a.status} · ⭐ {a.rating.toFixed(1)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        {page === 1 && <h2 className="font-display text-2xl font-bold">Full catalog</h2>}

        {catalogFailed ? (
          <p className="mt-4 rounded-xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
            The catalog is momentarily unavailable. The guides above are unaffected — please try
            again shortly.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.map((a) => {
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
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                      {displayTitle(a)}
                    </h3>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {a.score ? `⭐ ${a.score}` : a.type}
                      {a.episodes ? ` · ${a.episodes} ep` : ""}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <nav
        className="mt-10 flex items-center justify-between border-t border-border/60 pt-5"
        aria-label="Pagination"
      >
        {page > 1 ? (
          <Link
            to="/anime"
            search={page - 1 > 1 ? { page: page - 1 } : {}}
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        <span className="text-sm text-muted-foreground">
          Page {page} of {MAX_PAGE}
        </span>
        {page < MAX_PAGE ? (
          <Link
            to="/anime"
            search={{ page: page + 1 }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
