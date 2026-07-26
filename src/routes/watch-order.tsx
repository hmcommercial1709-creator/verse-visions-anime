import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/watch-order")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/watch-order" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "The Ultimate Anime Watch Order Guide · AnimeVerse" },
      { name: "description", content: "Every long-running anime with a canonical, filler-aware watch order. Naruto, One Piece, Fate, and more." },
      { property: "og:title", content: "Anime Watch Order Guide · AnimeVerse" },
      { property: "og:description", content: "Never watch a series in the wrong order again." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/watch-order" }],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Watch Order" }]} />
      <h1 className="font-display text-5xl font-bold">Watch orders</h1>
      <p className="mt-3 text-lg text-muted-foreground">The canonical order for every long-running series in the AnimeVerse library. Filler-aware where relevant, movie-canon annotated.</p>
      <AdSlot placement="between" />
      <div className="mt-10 space-y-6">
        {animes.filter(a => a.watchOrder.length > 1).map(a => (
          <div key={a.slug} className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h2 className="font-display text-2xl font-bold">{a.title}</h2>
            <ol className="mt-4 space-y-2">
              {a.watchOrder.map((w: string, i: number) => (
                <li key={i} className="flex items-center gap-4 rounded-lg border border-border/60 p-3 bg-background/40">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary text-sm font-bold">{i+1}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  ),
});
