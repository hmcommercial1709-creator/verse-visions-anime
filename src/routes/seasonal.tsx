import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { animes } from "@/data/animes";
import { getSeasonNow } from "@/lib/jikan.functions";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { HeaderBannerAd, PostContentAd } from "@/components/ad-slot";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { CalendarDays, ExternalLink, Loader2, Star } from "lucide-react";

const TITLE = "Seasonal Anime — Currently Airing & Season Archive · AnimeVerse";
const DESC =
  "What's airing right now, plus every season in the AnimeVerse archive. Live currently-airing data with a fully cached editorial fallback so the page is always rich.";

export const Route = createFileRoute("/seasonal")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Seasonal Anime · AnimeVerse" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/seasonal") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/seasonal") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Seasonal" }]),
        ),
      },
    ],
  }),
  component: Seasonal,
});

function LiveSeason() {
  const fetcher = useServerFn(getSeasonNow);
  const { data, isLoading } = useQuery({
    queryKey: ["jikan-season-now"],
    queryFn: () => fetcher(),
    staleTime: 6 * 60 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading this season's schedule…
      </div>
    );
  }
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {data.map((a) => (
        <a
          key={a.malId}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="group rounded-xl border border-border/60 bg-card/50 p-2 hover:border-primary/60"
        >
          {a.image && (
            <img
              src={a.image}
              alt={a.title}
              loading="lazy"
              decoding="async"
              width={225}
              height={338}
              className="mb-2 aspect-[2/3] w-full rounded-lg object-cover"
            />
          )}
          <div className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
            {a.title}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            {a.score && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-gold" /> {a.score}
              </span>
            )}
            {a.episodes ? <span>{a.episodes} eps</span> : null}
            <ExternalLink className="ml-auto h-3 w-3" />
          </div>
        </a>
      ))}
    </div>
  );
}

function Seasonal() {
  const byYear = animes.reduce<Record<number, typeof animes>>((acc, a) => {
    (acc[a.year] ||= []).push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <HeaderBannerAd />
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Seasonal" }]} />
      <h1 className="font-display text-5xl font-bold">Seasonal anime</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        The simulcast board for the current season, followed by our own archive grouped by
        release year — every entry links to a full AnimeVerse deep-dive.
      </p>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <CalendarDays className="h-5 w-5 text-primary" /> Airing this season
        </h2>
        <LiveSeason />
      </section>

      {years.map((year) => (
        <section key={year} className="mt-12">
          <h2 className="font-display text-2xl font-bold">{year}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {byYear[year].map((a) => (
              <AnimeCard key={a.slug} anime={a} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12">
        <Link
          to="/explore"
          className="inline-flex rounded-lg border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
        >
          Explore with full filters →
        </Link>
      </div>

      <PostContentAd />
    </div>
  );
}
