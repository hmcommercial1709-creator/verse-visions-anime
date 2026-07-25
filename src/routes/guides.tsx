import { createFileRoute, Link } from "@tanstack/react-router";
import { listArticles } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Anime Guides — Watch Orders, Beginner Guides & Deep-Dives · AnimeVerse" },
      { name: "description", content: "The AnimeVerse library of watch orders, beginner guides, character breakdowns, and long-form deep-dives." },
      { property: "og:title", content: "Anime Guides · AnimeVerse" },
      { property: "og:description", content: "Watch orders and beginner guides." },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: () => {
    const list = listArticles("guides");
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Guides" }]} />
        <h1 className="font-display text-5xl font-bold">Guides</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">The homework so you don't have to do it. Watch orders, beginner routes, glossaries, and long-form explainers.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map(a => (
            <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="rounded-2xl overflow-hidden border border-border/60 bg-card/40">
              <div className="h-32" style={{ background: a.cover }} />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
});
