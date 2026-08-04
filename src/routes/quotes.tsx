import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/quotes")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:url", content: "https://gamecastle.store/quotes" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "The Best Anime Quotes of All Time · GameCastle Anime" },
      { name: "description", content: "The most iconic anime quotes ever spoken — annotated by character, arc, and cultural weight." },
      { property: "og:title", content: "Anime Quotes · GameCastle Anime" },
      { property: "og:description", content: "Iconic lines from every era of anime." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/quotes" }],
  }),
  component: () => {
    const all = animes.flatMap(a => a.quotes.map(q => ({ ...q, anime: a.title, slug: a.slug, accent: a.accent })));
    return (
      <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Quotes" }]} />
        <h1 className="font-display text-5xl font-bold">Anime quotes worth remembering</h1>
        <p className="mt-3 text-lg text-muted-foreground">A growing library of the lines that mattered.</p>
        <div className="mt-10 space-y-4">
          {all.map((q, i) => (
            <blockquote key={i} className="rounded-2xl border-l-4 bg-card/40 p-6" style={{ borderColor: q.accent }}>
              <p className="italic text-xl leading-relaxed">"{q.line}"</p>
              <div className="mt-3 text-sm text-muted-foreground">— {q.character} · <span className="text-foreground/70">{q.anime}</span></div>
            </blockquote>
          ))}
        </div>
      </div>
    );
  },
});
