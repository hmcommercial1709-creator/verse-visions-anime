import { createFileRoute, Link } from "@tanstack/react-router";
import { characters } from "@/data/characters";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Anime Characters — Full Directory · AnimeVerse" },
      { name: "description", content: "Deep-dives, biographies, powers and quotes for every major anime character in the AnimeVerse library." },
      { property: "og:title", content: "All Anime Characters · AnimeVerse" },
      { property: "og:description", content: "Browse the AnimeVerse character directory." },
    ],
    links: [{ rel: "canonical", href: "/characters" }],
  }),
  component: () => {
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Characters" }]} />
        <h1 className="font-display text-5xl font-bold">Characters</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">The people the stories are about. Search, filter, and explore.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {characters.map(c => (
            <Link key={c.slug} to="/character/$slug" params={{ slug: c.slug }} className="rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60 card-hover hover:!card-hover-active flex gap-3">
              <div className="h-14 w-14 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${c.accent}, #111)` }} />
              <div className="min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
});
