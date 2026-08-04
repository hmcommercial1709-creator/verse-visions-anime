import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { animes } from "@/data/animes";
import { genres, getGenre } from "@/data/genres";
import { studios } from "@/data/studios";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { HeaderBannerAd, AdSlot } from "@/components/ad-slot";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { Filter, Search, X } from "lucide-react";

const TITLE = "Explore Anime — Filter by Genre, Studio, Year & Status · GameCastle Anime";
const DESC =
  "Explore the full GameCastle Anime library with multi-filter controls: combine genre, studio, airing status, release year and search to find your next series in seconds.";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Explore the GameCastle Anime library" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/explore") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/explore") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Explore" }]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Explore Anime",
          description: DESC,
          url: absoluteUrl("/explore"),
        }),
      },
    ],
  }),
  component: Explore,
});

type Sort = "rating" | "year" | "popularity" | "title";

function Explore() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("all");
  const [studio, setStudio] = useState("all");
  const [status, setStatus] = useState("all");
  const [decade, setDecade] = useState("all");
  const [sort, setSort] = useState<Sort>("rating");

  const decades = useMemo(
    () =>
      Array.from(new Set(animes.map((a) => Math.floor(a.year / 10) * 10))).sort((a, b) => b - a),
    [],
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let l = animes.filter((a) => {
      if (needle && !`${a.title} ${a.japaneseTitle ?? ""} ${a.tagline}`.toLowerCase().includes(needle))
        return false;
      if (genre !== "all" && !a.genres.includes(genre)) return false;
      if (studio !== "all" && a.studio !== studio) return false;
      if (status !== "all" && a.status !== status) return false;
      if (decade !== "all" && Math.floor(a.year / 10) * 10 !== Number(decade)) return false;
      return true;
    });
    l = [...l].sort((a, b) =>
      sort === "year"
        ? b.year - a.year
        : sort === "popularity"
          ? a.popularity - b.popularity
          : sort === "title"
            ? a.title.localeCompare(b.title)
            : b.rating - a.rating,
    );
    return l;
  }, [q, genre, studio, status, decade, sort]);

  const active = [genre, studio, status, decade].filter((v) => v !== "all").length + (q ? 1 : 0);

  const reset = () => {
    setQ("");
    setGenre("all");
    setStudio("all");
    setStatus("all");
    setDecade("all");
  };

  const selectCls =
    "rounded-md border border-border bg-secondary/60 px-3 py-1.5 text-sm focus:border-primary focus:outline-none";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <HeaderBannerAd />
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Explore" }]} />
      <h1 className="font-display text-5xl font-bold">Explore</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Stack as many filters as you like. Genre, studio, airing status, decade and free-text
        search all combine, and every result links to a full editorial deep-dive.
      </p>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card/50 p-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, taglines, Japanese names…"
            className="w-full bg-transparent text-sm outline-none"
            aria-label="Search anime"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectCls} aria-label="Genre">
            <option value="all">All genres</option>
            {genres.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
          <select value={studio} onChange={(e) => setStudio(e.target.value)} className={selectCls} aria-label="Studio">
            <option value="all">All studios</option>
            {studios.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Status">
            <option value="all">Any status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <select value={decade} onChange={(e) => setDecade(e.target.value)} className={selectCls} aria-label="Decade">
            <option value="all">Any year</option>
            {decades.map((d) => (
              <option key={d} value={d}>
                {d}s
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={selectCls}
            aria-label="Sort order"
          >
            <option value="rating">Sort: Rating</option>
            <option value="year">Sort: Newest</option>
            <option value="popularity">Sort: Popularity</option>
            <option value="title">Sort: A–Z</option>
          </select>
          {active > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              <X className="h-3 w-3" /> Clear {active}
            </button>
          )}
          <div className="ml-auto text-sm text-muted-foreground">{list.length} results</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {genres.slice(0, 12).map((g) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => setGenre(genre === g.slug ? "all" : g.slug)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              genre === g.slug
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-secondary/50 hover:border-primary/60"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <AdSlot placement="between" />

      {list.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((a) => (
            <AnimeCard key={a.slug} anime={a} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card/50 p-10 text-center">
          <p className="text-lg font-semibold">No series match that combination.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Reset filters
          </button>
        </div>
      )}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Jump straight to a genre hub</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((g) => (
            <Link
              key={g.slug}
              to="/genre/$slug"
              params={{ slug: g.slug }}
              className="rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60"
            >
              <div className="font-semibold">{getGenre(g.slug)?.name ?? g.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {animes.filter((a) => a.genres.includes(g.slug)).length} series profiled
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
