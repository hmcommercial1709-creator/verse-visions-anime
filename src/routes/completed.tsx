import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/completed")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/completed" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Completed Anime — Series You Can Binge · AnimeVerse" },
      { name: "description", content: "Fully finished anime series with definitive endings. Perfect for a weekend binge." },
      { property: "og:title", content: "Completed Anime · AnimeVerse" },
      { property: "og:description", content: "Fully finished. Ready to binge." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/completed" }],
  }),
  component: () => {
    const list = animes.filter(a => a.status === "Completed");
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Completed" }]} />
        <h1 className="font-display text-5xl font-bold">Completed anime</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Series that stuck the landing. Every entry here has a finale you can point to.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{list.map(a => <AnimeCard key={a.slug} anime={a} />)}</div>
      </div>
    );
  },
});
