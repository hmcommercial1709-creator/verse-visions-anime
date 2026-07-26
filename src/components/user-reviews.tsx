import { useCallback, useEffect, useMemo, useState } from "react";
import { Star, Trash2 } from "lucide-react";

type Review = { id: string; name: string; rating: number; body: string; at: string };

const key = (slug: string) => `av:reviews:${slug}`;

const read = (slug: string): Review[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(slug));
    const parsed = raw ? (JSON.parse(raw) as Review[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function Stars({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: "sm" | "lg";
}) {
  const cls = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const icon = (
          <Star
            className={`${cls} ${filled ? "fill-gold text-gold" : "text-muted-foreground"}`}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} out of 5`}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}

/**
 * Reader review system for anime pages. Client-only and privacy-first: reviews
 * and scores live in localStorage per series, so nothing leaves the device.
 * Editorial score is shown alongside the reader average for context.
 */
export function UserReviews({
  slug,
  title,
  editorialScore,
}: {
  slug: string;
  title: string;
  editorialScore: number;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  useEffect(() => {
    setReviews(read(slug));
    setHydrated(true);
  }, [slug]);

  const persist = useCallback(
    (next: Review[]) => {
      setReviews(next);
      try {
        window.localStorage.setItem(key(slug), JSON.stringify(next));
      } catch {
        /* storage disabled — keep the in-memory list */
      }
    },
    [slug],
  );

  const average = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
    [reviews],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    persist([
      {
        id: `${Date.now()}`,
        name: name.trim() || "Anonymous viewer",
        rating,
        body: trimmed,
        at: new Date().toLocaleDateString(),
      },
      ...reviews,
    ]);
    setBody("");
    setName("");
    setRating(5);
  };

  return (
    <section id="reviews" className="my-10">
      <h2 className="font-display text-2xl font-bold">Reader reviews</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Rate {title} and keep your own notes. Reviews stay in this browser.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Editorial score
          </div>
          <div className="mt-1 font-display text-3xl font-bold text-gradient">
            {editorialScore.toFixed(1)}/10
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Reader average
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-display text-3xl font-bold">
              {hydrated && reviews.length ? average.toFixed(1) : "—"}
            </span>
            <Stars value={Math.round(average)} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {hydrated ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "Loading…"}
          </div>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-card/50 p-5"
      >
        <div className="flex flex-wrap items-center gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="flex-1 min-w-[180px] rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
          />
          <Stars value={rating} onChange={setRating} size="lg" />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={`What did you think of ${title}?`}
          className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Post review
        </button>
      </form>

      {hydrated && reviews.length > 0 && (
        <ul className="mt-4 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-border/60 bg-card/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{r.name}</span>
                  <Stars value={r.rating} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{r.at}</span>
                  <button
                    type="button"
                    aria-label="Delete review"
                    onClick={() => persist(reviews.filter((x) => x.id !== r.id))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
