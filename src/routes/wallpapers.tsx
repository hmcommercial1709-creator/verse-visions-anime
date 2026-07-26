import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/wallpapers")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/wallpapers" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Wallpapers — 4K Backgrounds Gallery · AnimeVerse" },
      { name: "description", content: "High-resolution anime wallpapers for desktop and mobile — curated by series and mood." },
      { property: "og:title", content: "Anime Wallpapers · AnimeVerse" },
      { property: "og:description", content: "4K anime backgrounds gallery." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/wallpapers" }],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Wallpapers" }]} />
      <h1 className="font-display text-5xl font-bold">Wallpapers</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Curated gallery of high-resolution anime artwork, sorted by series and mood.</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {animes.map(a => (
          <div key={a.slug} className="aspect-video rounded-xl border border-border/60 relative overflow-hidden" style={{ background: a.cover }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white font-display font-bold">{a.title}</div>
          </div>
        ))}
      </div>
    </div>
  ),
});
