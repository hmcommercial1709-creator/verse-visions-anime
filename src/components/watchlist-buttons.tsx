import { Bookmark, BookmarkCheck, CircleCheck, ListChecks } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import {
  WATCHLIST_EVENT,
  readWatchlist,
  statusOf,
  toggleStatus,
  writeWatchlist,
  type ListStatus,
} from "@/lib/watchlist";

/**
 * "Add to Watchlist" / "Mark as Completed", stored in the reader's browser.
 *
 * Renders its neutral state on the server and corrects it after mount. The
 * list only exists client-side, so any attempt to render the real state
 * during SSR is a hydration mismatch — and React resolves those by discarding
 * the client tree, which is a worse bug than a button that settles a frame
 * late.
 */
export function WatchlistButtons({ slug, title }: { slug: string; title: string }) {
  const [status, setStatus] = useState<ListStatus | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => setStatus(statusOf(readWatchlist(), slug)), [slug]);

  useEffect(() => {
    sync();
    setReady(true);
    // storage fires in other tabs, the custom event fires in this one, so a
    // second control on the same page stays in step with this one.
    window.addEventListener("storage", sync);
    window.addEventListener(WATCHLIST_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(WATCHLIST_EVENT, sync);
    };
  }, [sync]);

  const set = (next: ListStatus) => {
    const updated = toggleStatus(readWatchlist(), { slug, title }, next);
    writeWatchlist(updated);
    setStatus(statusOf(updated, slug));
  };

  const base =
    "inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors";

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => set("watching")}
        aria-pressed={status === "watching"}
        className={`${base} ${
          status === "watching"
            ? "border-primary bg-primary/20 text-primary"
            : "border-border/60 bg-card/60 hover:border-primary/60"
        }`}
      >
        {status === "watching" ? (
          <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden="true" />
        )}
        {status === "watching" ? "On your watchlist" : "Add to Watchlist"}
      </button>

      <button
        type="button"
        onClick={() => set("completed")}
        aria-pressed={status === "completed"}
        className={`${base} ${
          status === "completed"
            ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
            : "border-border/60 bg-card/60 hover:border-emerald-500/60"
        }`}
      >
        <CircleCheck className="h-4 w-4" aria-hidden="true" />
        {status === "completed" ? "Completed" : "Mark as Completed"}
      </button>

      <Link
        to="/my-list"
        className={`${base} border-border/60 bg-card/60 text-muted-foreground hover:border-primary/60 hover:text-foreground`}
      >
        <ListChecks className="h-4 w-4" aria-hidden="true" />
        My list
      </Link>

      {ready && status && (
        <p className="w-full text-xs text-muted-foreground">
          Saved in this browser only — nothing is sent anywhere. Tap the same button again to remove
          it.
        </p>
      )}
    </div>
  );
}
