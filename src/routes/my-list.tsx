import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ListChecks, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/ui-bits";
import { ShareBar } from "@/components/share-bar";
import { loadPicksBySlugs, type CatalogPickRow } from "@/lib/catalog/db-catalog";
import {
  WATCHLIST_EVENT,
  countByStatus,
  decodeListParam,
  encodeListParam,
  readWatchlist,
  removeEntry,
  writeWatchlist,
  type WatchlistEntry,
} from "@/lib/watchlist";

const TITLE = "My Anime Watchlist — Build and Share Your List";
const DESC =
  "Keep a watchlist as you browse GameCastle Anime, mark what you have finished, and share the whole list as one link. Stored in your browser, not on an account.";
const URL = "https://gamecastle.store/my-list";

export const Route = createFileRoute("/my-list")({
  validateSearch: (search: Record<string, unknown>): { ids?: string } => {
    const ids = decodeListParam(search.ids);
    return ids.length ? { ids: ids.join(",") } : {};
  },
  head: ({ match }) => {
    const shared = Boolean((match.search as { ids?: string } | undefined)?.ids);
    return {
      meta: [
        { title: `${TITLE} · GameCastle Anime` },
        { name: "description", content: DESC },
        // A shared list is one reader's arbitrary set of slugs. Indexing those
        // would mint an unbounded number of near-identical pages competing
        // with each other and with the tool itself; the canonical below
        // collapses them, and noindex keeps them out entirely. The bare tool
        // page stays indexable, because that is the page worth finding.
        { name: "robots", content: shared ? "noindex, follow" : "index, follow" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:url", content: URL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: URL }],
    };
  },
  component: MyListPage,
});

function MyListPage() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [mine, setMine] = useState<WatchlistEntry[]>([]);
  const [shared, setShared] = useState<CatalogPickRow[] | null>(null);
  const [loadingShared, setLoadingShared] = useState(Boolean(ids));

  const sync = useCallback(() => setMine(readWatchlist()), []);

  useEffect(() => {
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(WATCHLIST_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(WATCHLIST_EVENT, sync);
    };
  }, [sync]);

  // A shared link carries slugs only, so the titles come from the catalog.
  useEffect(() => {
    if (!ids) {
      setShared(null);
      return;
    }
    let cancelled = false;
    setLoadingShared(true);
    loadPicksBySlugs(ids.split(",")).then((rows) => {
      if (cancelled) return;
      setShared(rows);
      setLoadingShared(false);
    });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const shareUrl = useMemo(() => {
    const param = encodeListParam(mine);
    return param ? `${URL}?ids=${param}` : URL;
  }, [mine]);

  const drop = (slug: string) => {
    const next = removeEntry(readWatchlist(), slug);
    writeWatchlist(next);
    setMine(next);
  };

  const watching = countByStatus(mine, "watching");
  const completed = countByStatus(mine, "completed");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "My List" }]} />

      <h1 className="font-display text-4xl font-bold lg:text-5xl">My Watchlist</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Everything you saved while browsing, kept in this browser. Nothing is sent anywhere and
        there is no account — the only way it leaves your device is the link you choose to share.
      </p>

      {ids && (
        <section className="mt-8 rounded-2xl border border-primary/40 bg-primary/10 p-5">
          <h2 className="font-display text-xl font-bold">A list someone shared with you</h2>
          {loadingShared ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading the list…</p>
          ) : shared && shared.length ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {shared.map((row) => (
                <li key={row.slug}>
                  <Link
                    to="/catalog/anime/$slug"
                    params={{ slug: row.slug }}
                    className="block min-h-11 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm font-medium hover:border-primary/60"
                  >
                    {row.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              None of the titles in that link are in our catalog any more.
            </p>
          )}
        </section>
      )}

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
            <ListChecks className="h-5 w-5 text-primary" aria-hidden="true" />
            Your list
          </h2>
          {mine.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {watching} watching · {completed} completed
            </span>
          )}
        </div>

        {mine.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border/60 bg-card/40 p-6">
            <p className="text-muted-foreground">
              Nothing saved yet. Open any title in the catalog and tap{" "}
              <strong className="text-foreground">Add to Watchlist</strong>.
            </p>
            <Link
              to="/anime"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Browse the catalog
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-4 grid gap-2">
              {mine.map((row) => (
                <li
                  key={row.slug}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5"
                >
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      row.status === "completed"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {row.status === "completed" ? "Completed" : "Watching"}
                  </span>
                  <Link
                    to="/catalog/anime/$slug"
                    params={{ slug: row.slug }}
                    className="flex-1 text-sm font-medium hover:text-primary"
                  >
                    {row.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => drop(row.slug)}
                    aria-label={`Remove ${row.title}`}
                    className="min-h-11 rounded-lg px-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <ShareBar
                url={shareUrl}
                text={`My anime watchlist — ${mine.length} ${mine.length === 1 ? "title" : "titles"}`}
                label="Share your list"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                writeWatchlist([]);
                setMine([]);
                navigate({ search: {}, replace: true });
              }}
              className="mt-4 text-xs text-muted-foreground underline hover:text-destructive"
            >
              Clear the whole list
            </button>
          </>
        )}
      </section>
    </div>
  );
}
