import { createFileRoute, Link } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

const TITLE = "Top Rated Anime — Highest Scoring Series by Decade · GameCastle Anime";
const DESC =
  "Every anime in the GameCastle Anime library scoring 8.0 and above, grouped by decade so you can see how the medium's best work evolved from the classics to today.";
const URL = "https://gamecastle.store/top-rated";

export const Route = createFileRoute("/top-rated")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: URL,
        }),
      },
    ],
  }),
  component: TopRatedPage,
});

function decadeOf(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

function TopRatedPage() {
  const rated = [...animes].filter((a) => a.rating >= 8).sort((a, b) => b.rating - a.rating);
  const decades = Array.from(new Set(rated.map((a) => decadeOf(a.year)))).sort().reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Top rated" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Top rated anime</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        These are the series our editors and readers score highest — everything at 8.0 and above, sorted by rating and
        split by decade. It is a different lens from our{" "}
        <Link to="/top" className="text-primary hover:underline">
          all-time top ranking
        </Link>
        : instead of one fixed list, you can see which era produced the shows that still hold up.
      </p>

      <AdSlot placement="between" />

      {decades.map((decade) => {
        const list = rated.filter((a) => decadeOf(a.year) === decade);
        if (!list.length) return null;
        return (
          <section key={decade} className="mt-12">
            <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3">
              <h2 className="font-display text-2xl font-bold">The {decade}</h2>
              <span className="text-sm text-muted-foreground">{list.length} titles</span>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.map((a) => (
                <AnimeCard key={a.slug} anime={a} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-14 rounded-2xl border border-border/60 bg-card/30 p-6">
        <h2 className="font-display text-xl font-bold">Keep exploring</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {[
            { to: "/trending", label: "Trending now" },
            { to: "/new-releases", label: "New releases" },
            { to: "/upcoming", label: "Upcoming" },
            { to: "/classic", label: "Classics" },
            { to: "/genres", label: "Browse genres" },
            { to: "/recommendations", label: "Recommendations" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full border border-border/60 px-4 py-2 hover:border-primary hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
