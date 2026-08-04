import { createFileRoute } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/new-releases")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/new-releases" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "New Anime Releases — Latest Series · GameCastle Anime" },
      { name: "description", content: "The newest anime series to hit streaming. Fresh drops, first impressions, and where to start." },
      { property: "og:title", content: "New Anime Releases · GameCastle Anime" },
      { property: "og:description", content: "This season's newest anime." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/new-releases" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/new-releases", name: 'New Anime Releases', description: 'The newest anime series hitting streaming, with first impressions.' })),
      },
    ],
  }),
  component: () => {
    const list = [...animes].filter(a => a.year >= 2022).sort((a,b) => b.year - a.year);
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "New Releases" }]} />
        <h1 className="font-display text-5xl font-bold">New releases</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">The most recent seasons and premieres, updated as new episodes drop.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{list.map(a => <AnimeCard key={a.slug} anime={a} />)}</div>
      </div>
    );
  },
});
