import { createFileRoute } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/upcoming" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Upcoming Anime — Release Calendar · GameCastle Anime" },
      { name: "description", content: "Every anime with a confirmed release window: new seasons, sequels, and adaptations." },
      { property: "og:title", content: "Upcoming Anime · GameCastle Anime" },
      { property: "og:description", content: "What's next on the schedule." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/upcoming" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/upcoming", name: 'Upcoming Anime Release Calendar', description: 'Every anime with a confirmed release window: new seasons, sequels and adaptations.' })),
      },
    ],
  }),
  component: () => {
    const list = animes.filter(a => a.status === "Upcoming" || a.status === "Ongoing");
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Upcoming" }]} />
        <h1 className="font-display text-5xl font-bold">Upcoming anime</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Announced, dated, and just far enough away to get excited about.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{list.map(a => <AnimeCard key={a.slug} anime={a} />)}</div>
      </div>
    );
  },
});
