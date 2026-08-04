import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/timeline" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Timeline — A History of the Medium · GameCastle Anime" },
      { name: "description", content: "The most important anime series year by year, from the 1990s to now." },
      { property: "og:title", content: "Anime Timeline · GameCastle Anime" },
      { property: "og:description", content: "A visual history of anime." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/timeline" }],
  }),
  component: () => {
    const byYear = [...animes].sort((a,b) => a.year - b.year);
    return (
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Timeline" }]} />
        <h1 className="font-display text-5xl font-bold">Anime timeline</h1>
        <p className="mt-3 text-lg text-muted-foreground">A living history of the medium, one landmark series at a time.</p>
        <div className="mt-10 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
          <div className="space-y-8">
            {byYear.map(a => (
              <div key={a.slug} className="pl-12 relative">
                <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-primary glow-primary" />
                <div className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">{a.year}</div>
                <div className="font-display text-2xl font-bold">{a.title}</div>
                <div className="text-sm text-muted-foreground">{a.tagline}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});
