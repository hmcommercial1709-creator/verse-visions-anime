import { createFileRoute } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/trending" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Trending Anime This Week — What Everyone Is Watching · GameCastle Anime" },
      { name: "description", content: "The anime dominating streaming charts, social discussion, and our editors' group chat this week." },
      { property: "og:title", content: "Trending Anime · GameCastle Anime" },
      { property: "og:description", content: "Live pulse of what fans are watching." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/trending" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/trending", name: 'Trending Anime This Week', description: 'The anime dominating streaming charts and community discussion right now.' })),
      },
    ],
  }),
  component: () => {
    const list = [...animes].sort((a,b) => a.popularity - b.popularity);
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Trending" }]} />
        <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.22em] font-semibold"><TrendingUp className="h-3 w-3" /> Live rankings</div>
        <h1 className="mt-2 font-display text-5xl font-bold">Trending this week</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Rankings refresh every Monday based on our aggregated engagement, streaming charts, and community activity.</p>
        <AdSlot placement="between" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((a, i) => (
            <div key={a.slug} className="relative">
              <div className="absolute -top-2 -left-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-display text-sm font-bold glow-primary">{i+1}</div>
              <AnimeCard anime={a} />
            </div>
          ))}
        </div>
      </div>
    );
  },
});
