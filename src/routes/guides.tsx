import { createFileRoute, Link } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { listArticles } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/guides" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Guides — Watch Orders, Beginner Guides & Deep-Dives · GameCastle Anime" },
      { name: "description", content: "The GameCastle Anime library of watch orders, beginner guides, character breakdowns, and long-form deep-dives." },
      { property: "og:title", content: "Anime Guides · GameCastle Anime" },
      { property: "og:description", content: "Watch orders and beginner guides." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/guides" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/guides", name: 'Anime Guides & Watch Orders', description: 'Watch orders, beginner routes, glossaries and long-form explainers.' })),
      },
    ],
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
