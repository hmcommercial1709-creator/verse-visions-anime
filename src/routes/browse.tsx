import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/browse" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Browse All Anime — Filter by Genre, Year & Studio · AnimeVerse" },
      { name: "description", content: "Explore the AnimeVerse library. Filter anime by genre, year, studio, status and rating to find your next series." },
      { property: "og:title", content: "Browse All Anime · AnimeVerse" },
      { property: "og:description", content: "The AnimeVerse anime library. Filter, sort, and discover." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/browse" }],
  }),
  component: Browse,
});

function Browse() {
  const [genre, setGenre] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<"rating"|"year"|"popularity">("rating");

  const list = useMemo(() => {
    let l = [...animes];
    if (genre !== "all") l = l.filter(a => a.genres.includes(genre));
    if (status !== "all") l = l.filter(a => a.status === status);
    l.sort((a,b) => sort === "year" ? b.year - a.year : sort === "popularity" ? a.popularity - b.popularity : b.rating - a.rating);
    return l;
  }, [genre, status, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Browse" }]} />
      <h1 className="font-display text-5xl font-bold">Browse the library</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Every anime we've profiled. Filter it, sort it, save it. The list grows every week.</p>

      <div className="mt-8 flex flex-wrap gap-3 items-center rounded-2xl border border-border/60 bg-card/50 p-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select value={genre} onChange={(e)=>setGenre(e.target.value)} className="rounded-md bg-secondary/60 border border-border px-3 py-1.5 text-sm">
          <option value="all">All genres</option>
          {genres.map(g => <option key={g.slug} value={g.slug}>{g.name}</option>)}
        </select>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-md bg-secondary/60 border border-border px-3 py-1.5 text-sm">
          <option value="all">All status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="rounded-md bg-secondary/60 border border-border px-3 py-1.5 text-sm">
          <option value="rating">Sort: Rating</option>
          <option value="year">Sort: Year</option>
          <option value="popularity">Sort: Popularity</option>
        </select>
        <div className="ml-auto text-sm text-muted-foreground">{list.length} results</div>
      </div>

      <AdSlot placement="between" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {list.map(a => <AnimeCard key={a.slug} anime={a} />)}
      </div>
    </div>
  );
}
