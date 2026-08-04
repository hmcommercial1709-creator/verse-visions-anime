import { createFileRoute, Link } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { listArticles } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/reviews" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Reviews — Deep-Dive Editorial · GameCastle Anime" },
      { name: "description", content: "Long-form anime reviews from the GameCastle Anime editorial team. No spoilers above the fold, no hedging below it." },
      { property: "og:title", content: "Anime Reviews · GameCastle Anime" },
      { property: "og:description", content: "Long-form editorial reviews." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/reviews" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/reviews", name: 'Anime Reviews', description: 'Long-form anime reviews from the GameCastle Anime editorial team.' })),
      },
    ],
  }),
  component: () => {
    const list = listArticles("reviews");
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Reviews" }]} />
        <h1 className="font-display text-5xl font-bold">Reviews</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">Everything scored. Everything justified. Our reviews take a season to write and about ten minutes to read.</p>
        <AdSlot placement="between" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map(a => (
            <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="rounded-2xl overflow-hidden border border-border/60 bg-card/40 card-hover hover:!card-hover-active">
              <div className="h-36" style={{ background: a.cover }} />
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">{a.tag}</div>
                <h3 className="mt-1 font-display text-lg font-bold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
});
