import { createFileRoute, Link } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { listArticles } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/top-lists")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/top-lists" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Top Lists — Rankings & Best-Ofs · GameCastle Anime" },
      { name: "description", content: "The best anime by genre, decade, and mood. Curated top-lists from the GameCastle Anime editorial team." },
      { property: "og:title", content: "Anime Top Lists · GameCastle Anime" },
      { property: "og:description", content: "Rankings and best-ofs." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/top-lists" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/top-lists", name: 'Anime Top Lists & Rankings', description: 'Curated anime rankings and best-of lists by genre, decade and mood.' })),
      },
    ],
  }),
  component: () => {
    const list = listArticles("top-lists");
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Top Lists" }]} />
        <h1 className="font-display text-5xl font-bold">Top lists</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">Every list is arguable. That's why we write them.</p>
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
