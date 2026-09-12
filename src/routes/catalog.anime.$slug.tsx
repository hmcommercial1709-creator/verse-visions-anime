import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAnime, malIdFromSlug, displayTitle } from "@/lib/catalog/jikan";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { publishedAnime } from "@/lib/content-registry";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Finds one of our own 25 hand-written guides for this series, if we have
 * one. Syndicated catalog data is thin on its own; linking it to original
 * editorial is what makes the page worth landing on.
 */
function ownGuideFor(titles: string[]) {
  const keys = titles.filter(Boolean).map(normalize);
  return publishedAnime().find((a) => {
    const candidates = [normalize(a.title), normalize(a.slug)];
    return keys.some((k) => candidates.includes(k));
  });
}

export const Route = createFileRoute("/catalog/anime/$slug")({
  loader: async ({ params }) => {
    const malId = malIdFromSlug(params.slug);
    if (malId === null) throw notFound();

    const result = await getAnime(malId);
    if (!result.ok) {
      if (result.reason === "not_found" || result.reason === "invalid_shape") throw notFound();
      throw new Error(`Anime unavailable (${result.reason})`);
    }

    const anime = result.data;
    const guide = ownGuideFor([anime.title, anime.title_english ?? ""]);
    return { anime, guideSlug: guide?.slug ?? null, guideTitle: guide?.title ?? null };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const a = loaderData.anime;
    const title = displayTitle(a);
    const url = absoluteUrl(`/catalog/anime/${params.slug}`);
    const image = a.images.webp?.large_image_url || a.images.jpg.large_image_url || a.images.jpg.image_url || undefined;
    const description =
      a.synopsis?.slice(0, 300) ??
      `${title}${a.year ? ` (${a.year})` : ""} — episodes, studios, genres and where it ranks.`;

    return {
      meta: [
        { title: `${title}${a.year ? ` (${a.year})` : ""} | GameCastle Anime Catalog` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "video.tv_show" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            // schema.org has no "AnimeSeries" type — TVSeries is the correct one.
            "@type": "TVSeries",
            name: title,
            alternateName: a.title_japanese || undefined,
            url,
            description,
            image,
            ...(a.episodes ? { numberOfEpisodes: a.episodes } : {}),
            ...(a.year ? { datePublished: String(a.year) } : {}),
            genre: [...a.genres.map((g) => g.name), ...a.themes.map((t) => t.name)],
            ...(a.studios.length
              ? { productionCompany: a.studios.map((s) => ({ "@type": "Organization", name: s.name })) }
              : {}),
            ...(a.score && a.scored_by
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: a.score,
                    ratingCount: a.scored_by,
                    bestRating: 10,
                    worstRating: 1,
                  },
                }
              : {}),
            sameAs: a.url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { path: "/", name: "Home" },
              { path: "/catalog/anime", name: "Anime Catalog" },
              { name: title },
            ]),
          ),
        },
      ],
    };
  },
  component: AnimeDetail,
});

function AnimeDetail() {
  const { anime, guideSlug, guideTitle } = Route.useLoaderData();
  const title = displayTitle(anime);
  const image = anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || anime.images.jpg.image_url;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span>
        <Link to="/catalog/anime" className="hover:text-foreground">Anime Catalog</Link>{" "}
        <span className="mx-1">/</span> {title}
      </nav>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {image && (
          <img
            src={image}
            alt={title}
            width={425}
            height={600}
            className="w-full rounded-2xl border border-border/60 object-cover"
          />
        )}
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {anime.title_japanese && <p className="mt-1 text-sm text-muted-foreground">{anime.title_japanese}</p>}

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {anime.type && <span className="rounded-full border border-border/60 px-3 py-1">{anime.type}</span>}
            {anime.episodes && <span className="rounded-full border border-border/60 px-3 py-1">{anime.episodes} episodes</span>}
            {anime.status && <span className="rounded-full border border-border/60 px-3 py-1">{anime.status}</span>}
            {anime.score && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">
                ⭐ {anime.score}
              </span>
            )}
          </div>

          {anime.synopsis && <p className="mt-5 leading-relaxed text-muted-foreground">{anime.synopsis}</p>}

          {guideSlug && (
            <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/10 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Our full guide</div>
              <Link
                to="/anime/$slug"
                params={{ slug: guideSlug }}
                className="mt-1 block font-bold hover:underline"
              >
                Read the GameCastle guide to {guideTitle} →
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                Watch order, arc breakdowns, characters and power systems — written by our editorial desk.
              </p>
            </div>
          )}
        </div>
      </div>

      {(anime.genres.length > 0 || anime.studios.length > 0) && (
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          {anime.genres.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold">Genres</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...anime.genres, ...anime.themes].map((g) => (
                  <span key={`${g.mal_id}-${g.name}`} className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {anime.studios.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold">Studios</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {anime.studios.map((s) => (
                  <span key={s.mal_id} className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <p className="mt-10 text-xs text-muted-foreground">
        Catalog data from the{" "}
        <a href={anime.url} rel="noopener noreferrer nofollow" target="_blank" className="underline">
          MyAnimeList
        </a>{" "}
        database via the Jikan public API.
      </p>
    </div>
  );
}
