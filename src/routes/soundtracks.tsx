import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/soundtracks")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/soundtracks" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "The Best Anime Soundtracks & OSTs · AnimeVerse" },
      { name: "description", content: "The scores that made anime hit harder — from Yoko Kanno to Hiroyuki Sawano to Kensuke Ushio." },
      { property: "og:title", content: "Anime Soundtracks · AnimeVerse" },
      { property: "og:description", content: "OSTs that defined the medium." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/soundtracks" }],
  }),
  component: () => {
    const tracks = animes.flatMap(a => a.soundtrack.filter(s => s.type === "OST").map(s => ({ ...s, anime: a.title, accent: a.accent })));
    return (
      <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Soundtracks" }]} />
        <h1 className="font-display text-5xl font-bold">Anime soundtracks</h1>
        <p className="mt-3 text-lg text-muted-foreground">Scores that carry entire arcs on their shoulders.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {tracks.map((t, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card/40 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded" style={{ background: `linear-gradient(135deg, ${t.accent}, #111)` }} />
              <div className="min-w-0">
                <div className="font-semibold truncate">{t.title}</div>
                <div className="text-xs text-muted-foreground truncate">{t.artist} · {t.anime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
