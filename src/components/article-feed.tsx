import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Loader2 } from "lucide-react";
import type { Article } from "@/data/articles";
import { readingLabel } from "@/lib/reading";
import { InArticleAd } from "@/components/ad-slot";
import { InlineAffiliateCard, productsForContext } from "@/components/affiliate-products";
import { getAnime } from "@/data/animes";

const PAGE = 4;

/**
 * Infinite-scroll editorial feed. Renders progressively as the sentinel
 * enters the viewport, keeping first paint light on long lists.
 */
export function InfiniteArticleFeed({ items, initial = PAGE }: { items: Article[]; initial?: number }) {
  const [count, setCount] = useState(Math.min(initial, items.length));
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const done = count >= items.length;

  const loadMore = useCallback(() => {
    setLoading((busy) => {
      if (busy) return busy;
      window.setTimeout(() => {
        setCount((c) => Math.min(c + PAGE, items.length));
        setLoading(false);
      }, 250);
      return true;
    });
  }, [items.length]);

  // Re-observed after every batch so a sentinel that stays in view keeps
  // requesting the next page (and its freshly injected ad units).
  useEffect(() => {
    const node = sentinel.current;
    if (!node || done || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [done, loading, count, loadMore]);

  return (
    <div>
      <div className="space-y-5">
        {items.slice(0, count).map((a, i) => (
          <div key={a.slug}>
            <Link
              to="/article/$slug"
              params={{ slug: a.slug }}
              className="group grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4 card-hover hover:!card-hover-active hover:border-primary/50 sm:grid-cols-[200px_minmax(0,1fr)]"
            >
              <div className="h-32 rounded-xl sm:h-full" style={{ background: a.cover }} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                  <span className="font-semibold text-primary">{a.tag}</span>
                  <span className="rounded-full border border-border/60 px-2 py-0.5 text-muted-foreground">
                    {readingLabel(a.body)}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold group-hover:text-gradient">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {a.date}
                </div>
              </div>
            </Link>
            {/* Ad unit auto-injected between content blocks as batches load */}
            {i > 0 && (i + 1) % PAGE === 0 && (
              <InArticleAd
                index={Math.ceil((i + 1) / PAGE)}
                unitId={`av-feed-${a.slug}-${Math.ceil((i + 1) / PAGE)}`}
                adId={`InArticle_Ad_Feed_${Math.ceil((i + 1) / PAGE)}`}
              />
            )}

            {/* Affiliate card woven between feed sections */}
            {i > 0 && (i + 1) % (PAGE * 2) === 0 && (() => {
              const product = productsForContext(getAnime(a.related?.[0] ?? ""), a.title)[
                (Math.ceil((i + 1) / (PAGE * 2)) - 1) % 3
              ];
              return product ? <InlineAffiliateCard product={product} /> : null;
            })()}
          </div>
        ))}
      </div>

      <div ref={sentinel} className="h-10" aria-hidden />
      <div className="mt-2 flex justify-center text-sm text-muted-foreground" aria-live="polite">
        {loading && (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading more stories…
          </span>
        )}
        {done && !loading && <span>You've reached the end of the feed.</span>}
        {!done && !loading && (
          <button onClick={loadMore} className="rounded-lg border border-border px-4 py-2 hover:border-primary/60">
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
