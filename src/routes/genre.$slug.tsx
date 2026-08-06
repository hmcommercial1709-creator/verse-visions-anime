import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getGenre } from "@/data/genres";
import { animeByGenre, populatedGenres } from "@/lib/content-registry";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/genre/$slug")({
  loader: ({ params }) => {
    const genre = getGenre(params.slug);
    if (!genre) throw notFound();
    return { genre, shows: animeByGenre(genre.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };

    const { genre, shows } = loaderData;
    const hasPublishedGuides = shows.length > 0;
    const title = hasPublishedGuides
      ? `Best ${genre.name} Anime to Watch · GameCastle Anime`
      : `${genre.name} Anime · GameCastle Anime`;
    const description = hasPublishedGuides
      ? `Explore ${genre.name} anime profiled by GameCastle, with clear series guides, themes and places to start.`
      : `Browse GameCastle Anime's currently published genre guides.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(!hasPublishedGuides ? [{ name: "robots", content: "noindex, follow" }] : []),
        { property: "og:url", content: `https://gamecastle.store/genre/${genre.slug}` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      links: [{ rel: "canonical", href: `https://gamecastle.store/genre/${genre.slug}` }],
    };
  },
  component: GenrePage,
});

function GenrePage() {
  const { genre, shows } = Route.useLoaderData();
  const related = populatedGenres()
    .filter((item) => item.slug !== genre.slug)
    .slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(1000px 500px at 20% 10%, ${genre.hue}55, transparent 60%), radial-gradient(800px 400px at 90% 0%, ${genre.hue}22, transparent 60%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <Breadcrumbs
            items={[
              { to: "/", label: "Home" },
              { to: "/browse", label: "Browse" },
              { label: genre.name },
            ]}
          />
          <div className="max-w-3xl">
            <div
              className="text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: genre.hue }}
            >
              Genre
            </div>
            <h1 className="mt-2 font-display text-5xl font-bold lg:text-6xl">{genre.name} Anime</h1>
            <p className="mt-3 text-xl font-semibold text-gradient">{genre.tagline}</p>
            <p className="mt-5 text-lg leading-relaxed text-foreground/85">{genre.description}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {shows.length > 0 ? (
          <>
            <div className="my-8 flex flex-wrap gap-2">
              {genre.hallmarks.map((hallmark: string) => (
                <span
                  key={hallmark}
                  className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm"
                >
                  {hallmark}
                </span>
              ))}
            </div>

            <h2 className="mb-6 font-display text-3xl font-bold">Where to start</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shows.map((anime: Anime) => (
                <AnimeCard key={anime.slug} anime={anime} size="md" />
              ))}
            </div>

            <AdSlot placement="between" />

            <div className="my-16 rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12">
              <h2 className="mb-3 font-display text-2xl font-bold">
                What defines great {genre.name.toLowerCase()} anime?
              </h2>
              <p className="max-w-3xl leading-relaxed text-foreground/85">
                The {genre.name.toLowerCase()} category is not a checklist; it is a promise. Every
                published guide above explores how a series keeps, bends or breaks that promise.
                Start with the premise that interests you, then follow its related characters, watch
                order and analysis.
              </p>
            </div>
          </>
        ) : (
          <div className="my-12 rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
            <h2 className="font-display text-2xl font-bold">
              No published guides in this genre yet
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              We do not index empty shelves. Browse the populated library to find a complete guide
              now.
            </p>
            <Link
              to="/browse"
              className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
            >
              Browse published anime
            </Link>
          </div>
        )}

        {related.length > 0 && (
          <>
            <h2 className="mb-4 font-display text-2xl font-bold">Other populated genres</h2>
            <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/genre/$slug"
                  params={{ slug: item.slug }}
                  className="rounded-xl border border-border/60 bg-card/40 p-4 hover:border-primary/60"
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{item.tagline}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
