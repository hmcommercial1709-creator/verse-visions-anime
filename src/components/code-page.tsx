import type { CodeItem } from "@/lib/code-page";

export function CodePage({
  item,
  related = [],
}: {
  item: CodeItem;
  related?: { slug: string; title: string }[];
}) {
  const rating = Number(item.aggregate_rating);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-3xl mx-auto">
      <div className="mb-4 text-xs font-mono text-accent uppercase tracking-widest">
        GAMING CODES &amp; GIFT CARDS
      </div>

      <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
        {item.title}
      </h1>

      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1">
          Market: {item.target_market}
        </span>
        <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1">
          Language: {item.target_language}
        </span>
        {Number.isFinite(rating) && rating > 0 && (
          <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1">
            ⭐ {rating.toFixed(1)}
            {item.reviews_count ? ` (${item.reviews_count} reviews)` : ""}
          </span>
        )}
      </div>

      {item.sample_review && (
        <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
          {item.sample_review}
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        Follow your platform's redemption instructions and confirm your account is eligible for{" "}
        {item.target_market} before activating.
      </p>

      {related.length > 0 && (
        <section className="mt-12 border-t border-border/60 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            More codes
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <a
                  href={`/codes/${r.slug}`}
                  className="inline-flex rounded-full border border-border/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
                >
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/codes"
            className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline"
          >
            Browse the full codes catalog →
          </a>
        </section>
      )}
    </div>
  );
}
