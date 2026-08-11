import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getStudio } from "@/data/studios";
import { getGenre } from "@/data/genres";
import type { Anime } from "@/data/animes";
import { animeByStudio, populatedStudios } from "@/lib/content-registry";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { collectionSchema } from "@/lib/seo";

export const Route = createFileRoute("/studio/$slug")({
  loader: ({ params }) => {
    const studio = getStudio(params.slug);
    if (!studio) throw notFound();
    return { studio, works: animeByStudio(studio.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }],
      };

    const { studio, works } = loaderData;
    const hasPublishedGuides = works.length > 0;
    const title = hasPublishedGuides
      ? `${studio.name} Anime — Studio Profile · GameCastle Anime`
      : `${studio.name} · GameCastle Anime`;
    const description = hasPublishedGuides
      ? `${studio.name} studio profile: ${studio.country}, founded ${studio.founded}. Explore ${works.length} published GameCastle anime guide${works.length === 1 ? "" : "s"}, with years, genres and status.`
      : "Browse GameCastle Anime's currently published studio guides.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(!hasPublishedGuides
          ? [{ name: "robots", content: "noindex, follow" }]
          : []),
        {
          property: "og:url",
          content: `https://gamecastle.store/studio/${studio.slug}`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://gamecastle.store/studio/${studio.slug}`,
        },
      ],
      scripts: hasPublishedGuides
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                collectionSchema({
                  path: `/studio/${studio.slug}`,
                  name: `${studio.name} anime guides`,
                  description,
                  items: works.map((anime) => ({
                    path: `/anime/${anime.slug}`,
                    name: anime.title,
                  })),
                }),
              ),
            },
          ]
        : [],
    };
  },
  component: StudioPage,
});

function StudioPage() {
  const { studio, works } = Route.useLoaderData();
  const others = populatedStudios()
    .filter((item) => item.slug !== studio.slug)
    .slice(0, 6);
  const years = works
    .map((anime) => anime.year)
    .sort((left, right) => left - right);
  const yearRange =
    years.length === 1
      ? String(years[0])
      : `${years[0]}–${years[years.length - 1]}`;
  const genreNames = [...new Set(works.flatMap((anime) => anime.genres))]
    .map((slug) => getGenre(slug)?.name ?? slug)
    .sort();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(900px 500px at 10% 0%, ${studio.accent}55, transparent 60%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <Breadcrumbs
            items={[
              { to: "/", label: "Home" },
              { label: "Studios" },
              { label: studio.name },
            ]}
          />
          <div
            className="text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: studio.accent }}
          >
            Studio · {studio.country} · est. {studio.founded}
          </div>
          <h1 className="mt-2 font-display text-5xl font-bold lg:text-6xl">
            {studio.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/85">
            {studio.blurb}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {works.length > 0 ? (
          <>
            <h2 className="mb-6 font-display text-3xl font-bold">
              Selected works
            </h2>
            <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {works.map((anime: Anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>

            <section className="mb-16 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold">
                GameCastle's {studio.name} guide directory
              </h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-foreground/85">
                This directory is limited to anime with a published GameCastle
                profile. It currently connects {works.length} {studio.name}{" "}
                title{works.length === 1 ? "" : "s"} from {yearRange}, so every
                entry below leads to a complete series guide rather than an
                empty catalog page.
              </p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Published guides
                  </dt>
                  <dd className="mt-1 text-xl font-bold">{works.length}</dd>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Release years
                  </dt>
                  <dd className="mt-1 text-xl font-bold">{yearRange}</dd>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Genres represented
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {genreNames.join(" · ")}
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {works.map((anime) => (
                  <li
                    key={anime.slug}
                    className="rounded-xl border border-border/60 p-4"
                  >
                    <Link
                      to="/anime/$slug"
                      params={{ slug: anime.slug }}
                      className="font-display text-lg font-bold hover:text-primary"
                    >
                      {anime.title}
                    </Link>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {anime.year} · {anime.status} · {anime.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                      {anime.synopsis}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <div className="my-12 rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
            <h2 className="font-display text-2xl font-bold">
              No published studio guides yet
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              This empty profile is excluded from search engines and discovery
              until it has useful published coverage.
            </p>
            <Link
              to="/browse"
              className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
            >
              Browse published anime
            </Link>
          </div>
        )}

        {others.length > 0 && (
          <>
            <h2 className="mb-4 font-display text-2xl font-bold">
              Other populated studios
            </h2>
            <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  to="/studio/$slug"
                  params={{ slug: item.slug }}
                  className="rounded-xl border border-border/60 bg-card/40 p-4 hover:border-primary/60"
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    est. {item.founded}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
