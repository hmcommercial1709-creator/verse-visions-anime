import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Anime Recommendations — What to Watch Next · AnimeVerse" },
      { name: "description", content: "Handpicked recommendations. Tell us what you liked; we'll tell you what to watch next." },
      { property: "og:title", content: "Anime Recommendations · AnimeVerse" },
      { property: "og:description", content: "Handpicked next-watch suggestions." },
    ],
    links: [{ rel: "canonical", href: "/recommendations" }],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Recommendations" }]} />
      <h1 className="font-display text-5xl font-bold">Recommendations</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Curated pairings from our editors. Every recommendation includes a "watch this if…" note so you know what you're signing up for.</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {animes.map(a => <AnimeCard key={a.slug} anime={a} />)}
      </div>
    </div>
  ),
});
