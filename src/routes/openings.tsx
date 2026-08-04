import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/openings")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:url", content: "https://gamecastle.store/openings" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "The Best Anime Openings & Endings · GameCastle Anime" },
      { name: "description", content: "The OPs and EDs that made you not skip the intro. Ranked, annotated, and constantly updated." },
      { property: "og:title", content: "Anime Openings · GameCastle Anime" },
      { property: "og:description", content: "The best OPs and EDs." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/openings" }],
  }),
  component: () => {
    const list = animes.flatMap(a => a.soundtrack.filter(s => s.type === "OP" || s.type === "ED").map(s => ({ ...s, anime: a.title, accent: a.accent })));
    return (
      <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Openings & Endings" }]} />
        <h1 className="font-display text-5xl font-bold">Openings & endings</h1>
        <p className="mt-3 text-lg text-muted-foreground">The ninety-second sequences that carry entire fandoms.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {list.map((s, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card/40 p-4 flex items-center gap-3">
              <span className="rounded bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">{s.type}</span>
              <div className="min-w-0">
                <div className="font-semibold truncate">{s.title}</div>
                <div className="text-xs text-muted-foreground truncate">{s.artist} · {s.anime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
