import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { Download, Gift } from "lucide-react";
import { MediaImage } from "@/components/media";
import { artAlt, posterFor } from "@/lib/media";
import { publishedAnime } from "@/lib/content-registry";

export const Route = createFileRoute("/wallpapers")({
  head: () => ({
    meta: [
      { title: "Anime Artwork Gallery — Series Posters · GameCastle Anime" },
      {
        name: "description",
        content:
          "Browse GameCastle Anime's original series poster illustrations and continue to detailed anime guides, watch orders and character pages.",
      },
      {
        property: "og:title",
        content: "Anime Artwork Gallery · GameCastle Anime",
      },
      {
        property: "og:description",
        content:
          "Original poster illustrations linked to detailed anime guides.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gamecastle.store/wallpapers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/wallpapers" }],
  }),
  component: ArtworkGallery,
});

function ArtworkGallery() {
  const anime = publishedAnime();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <Breadcrumbs
        items={[{ to: "/", label: "Home" }, { label: "Artwork Gallery" }]}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        GameCastle Anime visuals
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
        Anime artwork gallery
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Explore the original poster illustrations already used across GameCastle
        Anime. Every image opens a real series page with story, characters,
        metadata, watch order and related anime.
      </p>
      <aside className="mt-7 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 to-accent/10 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Gift className="h-4 w-4" aria-hidden="true" /> Free visitor gift
            </p>
            <h2 className="mt-2 font-display text-xl font-bold">Download the HD anime wallpaper collection</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Forty original desktop and mobile artworks with real, instant download links.
            </p>
          </div>
          <Link
            to="/rewards/anime-wallpapers"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Open free gift
          </Link>
        </div>
      </aside>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {anime.map((a) => (
          <Link
            key={a.slug}
            to="/anime/$slug"
            params={{ slug: a.slug }}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 hover:border-primary/60"
          >
            <MediaImage
              art={posterFor(a.slug, [a.title, ...a.genres])}
              alt={artAlt(a.title, "poster")}
              ratio="2/3"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
              overlay={false}
            />
            <div className="p-3">
              <h2 className="font-display text-sm font-bold leading-snug group-hover:text-primary">
                {a.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.year} · {a.status}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
