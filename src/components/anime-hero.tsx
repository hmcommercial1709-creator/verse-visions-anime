import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Info, Play, Search, Star, Sparkles } from "lucide-react";
import type { Anime } from "@/data/animes";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";
import { SearchDialog } from "@/components/search-dialog";
import { genres } from "@/data/genres";

/**
 * Trending hero — full-bleed poster artwork, a prominent "Watch Now" CTA,
 * an inline search entry point and quick genre filters. Autoplays, pauses on
 * hover/focus, and collapses to a single stacked column on mobile.
 */
export function AnimeHero({ items, quickGenres = ["action", "fantasy", "shonen", "adventure", "romance", "isekai"] }: {
  items: Anime[];
  quickGenres?: string[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const total = items.length;

  useEffect(() => {
    if (paused || total < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % total), 6500);
    return () => window.clearInterval(t);
  }, [paused, total]);

  if (total === 0) return null;
  const active = items[index];
  const chips = quickGenres
    .map((slug) => genres.find((g) => g.slug === slug))
    .filter((g): g is (typeof genres)[number] => Boolean(g));

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Trending anime"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: active.cover }}>
        <MediaImage
          key={active.slug}
          art={posterFor(active.slug, [active.title, ...active.genres])}
          alt={artAlt(active.title, "poster")}
          ratio="16/9"
          className="absolute inset-0 h-full w-full animate-fade-in"
          imgClassName="object-cover object-top scale-105"
          sizes="100vw"
          priority
          overlay={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,transparent,rgba(0,0,0,.7))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 lg:px-6 lg:pb-16 lg:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em]">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> Trending now
              </span>
              <span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-muted-foreground">
                {active.status} · {active.year}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 font-semibold text-gold">
                <Star className="h-3 w-3 fill-current" /> {active.rating.toFixed(1)}
              </span>
            </div>

            <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6">
              <Link
                to="/anime/$slug"
                params={{ slug: active.slug }}
                className="block overflow-hidden rounded-2xl border border-border/60 shadow-2xl card-hover hover:!card-hover-active"
              >
                <MediaImage
                  art={posterFor(active.slug, [active.title])}
                  alt={artAlt(active.title, "poster")}
                  ratio="2/3"
                  sizes="140px"
                  overlay={false}
                  priority
                />
              </Link>

              <div className="min-w-0">
                <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {active.title}
                </h1>
                <p className="mt-3 line-clamp-3 max-w-2xl text-base leading-relaxed text-foreground/85 sm:text-lg">
                  {active.tagline}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.genres.slice(0, 4).map((g) => (
                    <span key={g} className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/anime/$slug"
                    params={{ slug: active.slug }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground glow-primary transition-transform hover:scale-[1.03] hover:brightness-110"
                  >
                    <Play className="h-5 w-5 fill-current" /> Watch Now
                  </Link>
                  <Link
                    to="/anime/$slug"
                    params={{ slug: active.slug }}
                    hash="episodes"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-5 py-3.5 font-semibold transition-colors hover:border-primary/60 hover:bg-secondary"
                  >
                    <Info className="h-4 w-4" /> Series details
                  </Link>
                </div>
              </div>
            </div>

            {/* Search + quick genre filters */}
            <div className="mt-8 max-w-2xl">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">Search anime, characters, studios…</span>
                <span className="hidden shrink-0 rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] sm:block">⌘K</span>
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((g) => (
                  <Link
                    key={g.slug}
                    to="/genre/$slug"
                    params={{ slug: g.slug }}
                    className="rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    {g.name}
                  </Link>
                ))}
                <Link
                  to="/explore"
                  className="rounded-full border border-border/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  All filters
                </Link>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/80 hover:border-primary/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {items.map((it, i) => (
                  <button
                    key={it.slug}
                    type="button"
                    aria-label={`Show ${it.title}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-primary" : "w-3 bg-border hover:bg-muted-foreground"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setIndex((i) => (i + 1) % total)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/80 hover:border-primary/60"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Poster rail */}
          <ul className="hidden gap-2 lg:grid lg:content-start">
            {items.map((it, i) => (
              <li key={it.slug}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`grid w-full grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-xl border p-2 text-left transition-colors ${
                    i === index ? "border-primary/60 bg-primary/10" : "border-border/60 bg-background/40 hover:border-primary/40"
                  }`}
                >
                  <MediaImage
                    art={posterFor(it.slug, [it.title])}
                    alt={artAlt(it.title, "poster")}
                    ratio="2/3"
                    className="rounded-md"
                    sizes="44px"
                    overlay={false}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{it.title}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-gold" /> {it.rating.toFixed(1)} · {it.year}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </section>
  );
}
