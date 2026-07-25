import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/top")({
  head: () => ({
    meta: [
      { title: "Top 100 Anime of All Time — Ranked · AnimeVerse" },
      { name: "description", content: "The best anime ever made, ranked by our editorial team and community rating." },
      { property: "og:title", content: "Top 100 Anime · AnimeVerse" },
      { property: "og:description", content: "The definitive ranking." },
    ],
    links: [{ rel: "canonical", href: "/top" }],
  }),
  component: () => {
    const list = [...animes].sort((a,b) => b.rating - a.rating);
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Top 100" }]} />
        <h1 className="font-display text-5xl font-bold">The top anime of all time</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Our long-running editorial ranking, updated as new seasons air and new classics are re-appraised.</p>
        <AdSlot placement="between" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map(a => <AnimeCard key={a.slug} anime={a} />)}
        </div>
      </div>
    );
  },
});
