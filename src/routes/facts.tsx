import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/facts")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:url", content: "https://gamecastle.store/facts" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Fun Facts, Hidden Details & Easter Eggs · GameCastle Anime" },
      { name: "description", content: "Trivia, hidden references, and behind-the-scenes production notes from your favorite anime." },
      { property: "og:title", content: "Anime Facts & Easter Eggs · GameCastle Anime" },
      { property: "og:description", content: "Trivia and hidden details." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/facts" }],
  }),
  component: () => {
    const all = animes.flatMap(a => a.facts.map(f => ({ fact: f, title: a.title, slug: a.slug })));
    return (
      <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Facts" }]} />
        <h1 className="font-display text-5xl font-bold">Anime facts, hidden details & easter eggs</h1>
        <div className="mt-10 space-y-3">
          {all.map((f, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card/40 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{f.title}</div>
              <div className="mt-1 text-foreground/90">{f.fact}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
