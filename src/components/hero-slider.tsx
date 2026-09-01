import { articleParagraphs } from "@/data/articles";
import { MediaImage } from "@/components/media";
import { backdropFor, artAlt } from "@/lib/media";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";
import type { Article } from "@/data/articles";
import { readingLabel, wordCount } from "@/lib/reading";

/** Featured deep-dive slider with reading-time badges. Autoplays, pauses on hover. */
export function HeroSlider({ items }: { items: Article[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;

  useEffect(() => {
    if (paused || total < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % total), 7000);
    return () => window.clearInterval(t);
  }, [paused, total]);

  if (total === 0) return null;
  const active = items[index];

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured deep-dives"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 transition-[background] duration-700" style={{ background: active.cover }}>
        <MediaImage
          art={backdropFor(active.slug, [active.title, active.tag])}
          alt={artAlt(active.title)}
          ratio="16/9"
          className="absolute inset-0 h-full w-full"
          sizes="100vw"
          overlay={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,transparent,rgba(0,0,0,.65))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 lg:px-6 lg:pb-20 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em]">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> Featured deep-dive
              </span>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {readingLabel(articleParagraphs(active))}
              </span>
              <span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-muted-foreground">
                {wordCount(articleParagraphs(active)).toLocaleString()} words
              </span>
            </div>

            <h2 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {active.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85">{active.excerpt}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/article/$slug"
                params={{ slug: active.slug }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground glow-primary hover:brightness-110"
              >
                Read the deep-dive <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/editorial"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-5 py-3 font-medium hover:bg-secondary"
              >
                All long reads
              </Link>
            </div>

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
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={`relative h-11 w-11 rounded-full after:absolute after:left-1/2 after:top-1/2 after:h-1.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:transition-all ${
                      i === index
                        ? "after:w-8 after:bg-primary"
                        : "after:w-3 after:bg-border hover:after:bg-muted-foreground"
                    }`}
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

          <ul className="hidden gap-2 lg:grid lg:content-start">
            {items.map((it, i) => (
              <li key={it.slug}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    i === index
                      ? "border-primary/60 bg-primary/10"
                      : "border-border/60 bg-background/40 hover:border-primary/40"
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{it.tag}</div>
                  <div className="mt-1 line-clamp-2 text-sm font-semibold">{it.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {readingLabel(articleParagraphs(it))}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
