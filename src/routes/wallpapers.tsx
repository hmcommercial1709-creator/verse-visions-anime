import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
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
