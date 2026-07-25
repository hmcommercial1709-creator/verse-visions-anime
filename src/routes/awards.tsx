import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

const awards = [
  { year: 2024, best: "Frieren: Beyond Journey's End", host: "Crunchyroll Anime Awards" },
  { year: 2023, best: "Cyberpunk: Edgerunners", host: "Crunchyroll Anime Awards" },
  { year: 2022, best: "Attack on Titan Final Season Part 2", host: "Crunchyroll Anime Awards" },
  { year: 2021, best: "Jujutsu Kaisen", host: "Crunchyroll Anime Awards" },
  { year: 2020, best: "Demon Slayer", host: "Crunchyroll Anime Awards" },
];

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Anime Awards — Complete History · AnimeVerse" },
      { name: "description", content: "Every Anime of the Year winner and major industry award, tracked year by year." },
      { property: "og:title", content: "Anime Awards · AnimeVerse" },
      { property: "og:description", content: "AOTY winners across the years." },
    ],
    links: [{ rel: "canonical", href: "/awards" }],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Awards" }]} />
      <h1 className="font-display text-5xl font-bold">Anime Awards</h1>
      <p className="mt-3 text-lg text-muted-foreground">Anime of the Year, past winners, and where the medium's biggest ceremonies land each spring.</p>
      <div className="mt-10 space-y-3">
        {awards.map(a => (
          <div key={a.year} className="rounded-xl border border-gold/30 bg-gold/5 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">{a.year} · {a.host}</div>
            <div className="mt-1 font-display text-2xl font-bold">{a.best}</div>
          </div>
        ))}
      </div>
    </div>
  ),
});
