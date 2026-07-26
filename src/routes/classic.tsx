import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/classic")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/classic" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Classic Anime — The Series That Built the Medium · AnimeVerse" },
      { name: "description", content: "Landmark anime you should watch at least once: the shows that shaped everything that followed." },
      { property: "og:title", content: "Classic Anime · AnimeVerse" },
      { property: "og:description", content: "The greats. The foundation." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/classic" }],
  }),
  component: () => {
    const list = animes.filter(a => a.year < 2015);
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Classic" }]} />
        <h1 className="font-display text-5xl font-bold">Classic anime</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">The shows that built the vocabulary. If you haven't watched these, half of modern anime is quoting things you haven't heard.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{list.map(a => <AnimeCard key={a.slug} anime={a} />)}</div>
      </div>
    );
  },
});
