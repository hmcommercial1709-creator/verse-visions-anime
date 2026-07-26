import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { characters } from "@/data/characters";
import { Breadcrumbs, StatPill } from "@/components/ui-bits";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/statistics" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Statistics — Industry Numbers · AnimeVerse" },
      { name: "description", content: "The state of the anime industry in numbers: library size, ratings, studio output, and viewership trends." },
      { property: "og:title", content: "Anime Statistics · AnimeVerse" },
      { property: "og:description", content: "The industry in numbers." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/statistics" }],
  }),
  component: () => {
    const avg = (animes.reduce((s,a) => s + a.rating, 0) / animes.length).toFixed(2);
    return (
      <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Statistics" }]} />
        <h1 className="font-display text-5xl font-bold">Anime by the numbers</h1>
        <p className="mt-3 text-lg text-muted-foreground">The state of the medium, updated as the library grows.</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill label="Series covered" value={String(animes.length)} />
          <StatPill label="Genres" value={String(genres.length)} />
          <StatPill label="Studios" value={String(studios.length)} />
          <StatPill label="Characters" value={String(characters.length)} />
          <StatPill label="Average rating" value={`${avg}/10`} />
          <StatPill label="Highest rated" value={String(Math.max(...animes.map(a=>a.rating)))} />
          <StatPill label="Ongoing" value={String(animes.filter(a=>a.status==="Ongoing").length)} />
          <StatPill label="Completed" value={String(animes.filter(a=>a.status==="Completed").length)} />
        </div>
      </div>
    );
  },
});
