import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Info, Play, Search, Star, TrendingUp } from "lucide-react";
import type { Anime } from "@/data/animes";
import { getAnime } from "@/data/animes";
import { episodes } from "@/data/episodes";
import { trailerFor } from "@/data/trailers";
import { MediaImage } from "@/components/media";
import { SearchDialog } from "@/components/search-dialog";
import { posterFor, artAlt } from "@/lib/media";

type Card = { ep: (typeof episodes)[number]; anime: Anime };

function latestEpisodes(limit: number): Card[] {
  return episodes
    .map((ep) => ({ ep, anime: getAnime(ep.animeSlug) }))
    .filter((c): c is Card => Boolean(c.anime))
    .sort((a, b) => (a.ep.airDate < b.ep.airDate ? 1 : -1))
    .slice(0, limit);
}

/**
 * Above-the-fold streaming stage: a real player on the left (click-to-play
 * facade so no third-party iframe is loaded on first paint), the newest
 * episodes as a switchable strip underneath, a prominent search entry and a
 * trending top-10 column on the right. No delayed rendering, no overlays —
 * everything reserves its own height so nothing shifts as the page settles.
 */
export function HomeStage({ trending }: { trending: Anime[] }) {
  const cards = latestEpisodes(8);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  if (cards.length === 0) return null;
  const { ep, anime } = cards[Math.min(active, cards.length - 1)];
  const videoId = trailerFor(anime.slug) ?? trailerFor(anime.title);

  const select = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  return (
    <section className="relative border-b border-border/50 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 lg:px-6 lg:pb-10 lg:pt-8">
        {/* Search — first interactive element, always above the fold */}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              Search anime, episodes, characters…
            </span>
            <span className="hidden shrink-0 rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] sm:block">
              ⌘K
            </span>
          </button>
          <Link
            to="/streaming"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/20"
          >
            <TrendingUp className="h-4 w-4" /> Browse all episodes
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            {/* PLAYER */}
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              {playing && videoId ? (
                <iframe
                  key={`${videoId}-${ep.number}`}
                  className="absolute inset-0 h-full w-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={`${anime.title} episode ${ep.number}`}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              ) : (
                <>
                  <MediaImage
                    art={posterFor(anime.slug, [anime.title, ...anime.genres])}
                    alt={artAlt(anime.title, "poster")}
                    ratio="16/9"
                    className="absolute inset-0 h-full w-full"
                    imgClassName="object-cover object-top"
                    sizes="(min-width:1024px) 860px, 100vw"
                    priority
                    overlay={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
                      <span className="rounded-md bg-primary px-2 py-0.5 text-primary-foreground">
                        EP {ep.number}
                      </span>
                      <span className="text-primary">{anime.title}</span>
                      <span className="flex items-center gap-1 text-gold">
                        <Star className="h-3 w-3 fill-current" />{" "}
                        {anime.rating.toFixed(1)}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-4xl">
                      {ep.title}
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {videoId ? (
                        <button
                          type="button"
                          onClick={() => setPlaying(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground glow-primary hover:brightness-110"
                        >
                          <Play className="h-5 w-5 fill-current" /> Watch Now
                        </button>
                      ) : (
                        <Link
                          to="/watch/$slug"
                          params={{ slug: anime.slug }}
                          search={{ ep: ep.number }}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground glow-primary hover:brightness-110"
                        >
                          <Play className="h-5 w-5 fill-current" /> Watch Now
                        </Link>
                      )}
                      <Link
                        to="/watch/$slug"
                        params={{ slug: anime.slug }}
                        search={{ ep: ep.number }}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-3 text-sm font-semibold hover:border-primary/60"
                      >
                        <Info className="h-4 w-4" /> Where to watch
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* EPISODE STRIP — switches the player without a page load */}
            <div className="mt-4 -mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {cards.map((c, i) => (
                  <button
                    key={`${c.anime.slug}-${c.ep.number}`}
                    type="button"
                    onClick={() => select(i)}
                    aria-current={i === active ? "true" : undefined}
                    aria-label={`Play ${c.anime.title}, episode ${c.ep.number}: ${c.ep.title}`}
                    className={`flex w-[210px] shrink-0 snap-start items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                      i === active
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-card/40 hover:border-primary/50"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                      EP {c.ep.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {c.anime.title}
                      </span>
                      <span className="mt-1 block line-clamp-2 text-xs font-bold leading-snug">
                        {c.ep.title}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {c.ep.runtime}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TRENDING TOP 10 */}
          <aside className="min-w-0">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <TrendingUp className="h-4 w-4 text-primary" /> Trending now
            </h2>
            <ul className="mt-3 grid gap-2">
              {trending.slice(0, 6).map((a, i) => (
                <li key={a.slug}>
                  <Link
                    to="/watch/$slug"
                    params={{ slug: a.slug }}
                    search={{ ep: undefined }}
                    className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5 hover:border-primary/50"
                  >
                    <span className="text-center font-display text-lg font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {a.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 text-gold">
                          <Star className="h-3 w-3 fill-current" />
                          {a.rating.toFixed(1)}
                        </span>
                        {a.year}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </section>
  );
}
