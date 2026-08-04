import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

const events = [
  { name: "Anime Expo", city: "Los Angeles, CA", date: "July 3–6, 2026", desc: "The largest anime convention in North America." },
  { name: "Comiket 108", city: "Tokyo, Japan", date: "August 14–16, 2026", desc: "The world's largest doujin market." },
  { name: "Crunchyroll Anime Awards", city: "Tokyo, Japan", date: "March 2027", desc: "The medium's most watched awards show." },
  { name: "Otakon", city: "Washington, D.C.", date: "August 1–3, 2026", desc: "East Coast USA's flagship anime con." },
  { name: "Japan Expo", city: "Paris, France", date: "July 8–12, 2026", desc: "Europe's largest anime and Japanese culture event." },
  { name: "AnimeJapan", city: "Tokyo, Japan", date: "March 21–24, 2026", desc: "Studio & industry showcase for the upcoming production slate." },
];

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:url", content: "https://gamecastle.store/events" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Events & Conventions 2026 · GameCastle Anime" },
      { name: "description", content: "Anime conventions, expos, and industry events happening around the world in 2026." },
      { property: "og:title", content: "Anime Events · GameCastle Anime" },
      { property: "og:description", content: "Cons and events worldwide." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/events" }],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Events" }]} />
      <h1 className="font-display text-5xl font-bold">Anime events & conventions</h1>
      <p className="mt-3 text-lg text-muted-foreground">Cons, expos, and industry showcases worth flying for.</p>
      <div className="mt-10 space-y-4">
        {events.map(e => (
          <div key={e.name} className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="font-display text-2xl font-bold">{e.name}</h2>
              <div className="text-xs uppercase tracking-[0.2em] text-primary">{e.date}</div>
            </div>
            <div className="text-sm text-muted-foreground mb-2">{e.city}</div>
            <p>{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
