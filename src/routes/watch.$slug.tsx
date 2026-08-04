import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, MonitorPlay, Play, Info } from "lucide-react";
import { getAnime } from "@/data/animes";
import { episodesFor, getEpisode } from "@/data/episodes";
import { trailerFor } from "@/data/trailers";
import { backdropFor } from "@/lib/media";
import { MediaImage } from "@/components/media";
import { Breadcrumbs } from "@/components/ui-bits";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

/**
 * Licensed services to check. Catalogues differ by region and change over
 * time, so each entry links to that service's own search rather than
 * asserting the series is available there.
 */
const PROVIDERS = [
  {
    id: "crunchyroll",
    label: "Crunchyroll",
    quality: "Search the Crunchyroll catalogue",
    url: "https://www.crunchyroll.com/search?q=",
  },
  {
    id: "netflix",
    label: "Netflix",
    quality: "Search the Netflix catalogue",
    url: "https://www.netflix.com/search?q=",
  },
  {
    id: "hidive",
    label: "HIDIVE",
    quality: "Search the HIDIVE catalogue",
    url: "https://www.hidive.com/search?q=",
  },
  {
    id: "prime",
    label: "Prime Video",
    quality: "Search Prime Video",
    url: "https://www.primevideo.com/search?phrase=",
  },
] as const;

export const Route = createFileRoute("/watch/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    ep: search.ep ? Number(search.ep) : undefined,
  }),
  loader: ({ params }) => {
    const anime = getAnime(params.slug);
    if (!anime) throw notFound();
    return { anime };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.anime;
    const title = `Where to Watch ${a.title} Legally — Official Trailer & Episode Guide · GameCastle Anime`;
    const desc = `Watch the official ${a.title} trailer, browse the episode guide and see which licensed streaming services to check. GameCastle Anime does not host episodes.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "video.tv_show" },
        { property: "og:url", content: absoluteUrl(`/watch/${a.slug}`) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(`/watch/${a.slug}`) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { path: "/", name: "Home" },
              { path: "/browse", name: "Anime" },
              { path: `/anime/${a.slug}`, name: a.title },
              { name: "Watch" },
            ]),
          ),
        },
      ],
    };
  },
  component: WatchPage,
});

function WatchPage() {
  const { anime } = Route.useLoaderData();
  const { ep } = Route.useSearch();
  const eps = episodesFor(anime.slug);
  const total = typeof anime.episodes === "number" ? anime.episodes : eps.length || 12;
  const numbers = eps.length > 0 ? eps.map((e) => e.number) : Array.from({ length: Math.min(24, total) }, (_, i) => i + 1);

  const [current, setCurrent] = useState<number>(ep && numbers.includes(ep) ? ep : (numbers[0] ?? 1));
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]["id"]>(PROVIDERS[0].id);
  const [playing, setPlaying] = useState(false);

  const episode = getEpisode(anime.slug, current);
  const videoId = trailerFor(anime.slug) ?? trailerFor(anime.title);
  const activeProvider = PROVIDERS.find((p) => p.id === provider) ?? PROVIDERS[0];
  const providerLink = `${activeProvider.url}${encodeURIComponent(anime.title)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8">
      <Breadcrumbs
        items={[
          { to: "/", label: "Home" },
          { to: "/browse", label: "Anime" },
          { label: `Watch ${anime.title}` },
        ]}
      />

      <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
        Where to watch {anime.title} legally
        <span className="text-muted-foreground"> — Episode {current}</span>
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {episode?.title ? `${episode.title}. ` : ""}Play the official trailer or clip below, then head to a licensed
        streaming service for the full episode. We do not host or stream episodes here.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
        <div className="min-w-0">
          {/* PLAYER */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black" style={{ aspectRatio: "16/9" }}>
            {playing && videoId ? (
              <iframe
                key={`${videoId}-${current}`}
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={`${anime.title} — official trailer or promotional clip`}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <MediaImage
                  art={backdropFor(anime.slug)}
                  alt={`${anime.title} episode ${current} key visual`}
                  ratio="16/9"
                  className="absolute inset-0 h-full w-full"
                  priority
                />
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-background/80 to-background/10">
                  {videoId ? (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground glow-primary hover:brightness-110"
                    >
                      <Play className="h-5 w-5 fill-current" /> Play official trailer
                    </button>
                  ) : (
                    <a
                      href={providerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground glow-primary hover:brightness-110"
                    >
                      <Play className="h-5 w-5 fill-current" /> Look for it on {activeProvider.label}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={providerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-110"
            >
              <MonitorPlay className="h-4 w-4" /> Watch the full episode on {activeProvider.label}
            </a>
            {episode && (
              <Link
                to="/anime/$slug/episode/$num"
                params={{ slug: anime.slug, num: String(current) }}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm hover:border-primary/60"
              >
                <Info className="h-4 w-4" /> Episode {current} recap
              </Link>
            )}
            <Link
              to="/anime/$slug"
              params={{ slug: anime.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm hover:border-primary/60"
            >
              Series hub
            </Link>
          </div>

          {/* EPISODE SELECTOR */}
          <section className="mt-8">
            <h2 className="font-display text-2xl font-bold">Episode guide</h2>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
              {numbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setCurrent(n);
                    setPlaying(false);
                  }}
                  aria-pressed={n === current}
                  className={`grid h-10 place-items-center rounded-lg border font-mono text-xs transition-colors ${
                    n === current
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {episode && (
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">{episode.synopsis}</p>
            )}
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              Where to watch legally
            </div>
            <div className="mt-3 space-y-1.5">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  aria-pressed={p.id === activeProvider.id}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    p.id === activeProvider.id ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MonitorPlay className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="min-w-0 flex-1 truncate">{p.label}</span>
                  </span>
                  <span className="mt-0.5 block pl-5 text-[11px] text-muted-foreground">{p.quality}</span>
                </button>
              ))}
            </div>
            <Link
              to="/streaming"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
            >
              Compare all platforms <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              GameCastle Anime embeds only official trailers and clips, and links out to licensed services. We never
              host episodes, downloads or unlicensed sources. Availability varies by region — check the service.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
