import { createFileRoute, Link } from "@tanstack/react-router";
import { genres } from "@/data/genres";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/genres")({
  head: () => ({
    meta: [
      { title: "All Anime Genres — Complete Directory · AnimeVerse" },
      { name: "description", content: "Browse every anime genre we cover: action, adventure, romance, isekai, psychological, mecha, slice-of-life and more." },
      { property: "og:title", content: "Anime Genres · AnimeVerse" },
      { property: "og:description", content: "Every mood, every night." },
    ],
    links: [{ rel: "canonical", href: "/genres" }],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Genres" }]} />
      <h1 className="font-display text-5xl font-bold">Anime genres</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Twenty ways in. Pick your mood; we'll pick your next weekend.</p>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {genres.map(g => (
          <Link key={g.slug} to="/genre/$slug" params={{ slug: g.slug }} className="relative overflow-hidden rounded-xl border border-border/60 p-5 h-36 flex flex-col justify-end card-hover hover:!card-hover-active" style={{ background: `linear-gradient(135deg, ${g.hue}22, ${g.hue}08)` }}>
            <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 30% 20%, ${g.hue}88, transparent 60%)` }} />
            <div className="relative">
              <div className="font-display text-xl font-bold">{g.name}</div>
              <div className="text-xs text-muted-foreground">{g.tagline}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ),
});
