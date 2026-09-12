import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { publishedAnime, populatedGenres } from "@/lib/content-registry";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const PATH = "/browse";
const TITLE = "Browse All Anime | GameCastle";
const DESCRIPTION =
  "Browse every anime series covered by GameCastle, filter by genre, and jump straight into the full guide for each title.";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: absoluteUrl(PATH) },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(PATH) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Browse" }])),
      },
    ],
  }),
  component: BrowseCatalog,
});

function BrowseCatalog() {
  const [genre, setGenre] = useState("all");
  const anime = publishedAnime();
  const genres = populatedGenres();

  const filtered = useMemo(
    () => (genre === "all" ? anime : anime.filter((a) => a.genres.includes(genre))),
    [anime, genre],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span> Browse
      </nav>

      <h1 className="font-display text-4xl font-bold">Browse all anime</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Every series with a full GameCastle guide — {anime.length} titles covering watch orders, arcs,
        characters and power systems.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGenre("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
            genre === "all"
              ? "border-primary bg-primary/15 text-primary"
              : "border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({anime.length})
        </button>
        {genres.map((g) => {
          const count = anime.filter((a) => a.genres.includes(g.slug)).length;
          if (count === 0) return null;
          return (
            <button
              key={g.slug}
              type="button"
              onClick={() => setGenre(g.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                genre === g.slug
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.name} ({count})
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "series" : "series"}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            to="/anime/$slug"
            params={{ slug: a.slug }}
            className="group rounded-2xl border border-border/60 bg-card/40 p-5 card-hover hover:border-primary/50"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-bold leading-snug group-hover:text-gradient">{a.title}</h2>
              <span className="shrink-0 text-xs font-bold text-amber-400">⭐ {a.rating.toFixed(1)}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{a.year}</span>
              <span>{a.status}</span>
              <span>{a.episodes === "?" ? "Ongoing" : `${a.episodes} episodes`}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6 text-muted-foreground">
          No series in that genre yet. Pick another filter above.
        </p>
      )}
    </div>
  );
}
