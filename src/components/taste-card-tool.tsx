import { Link } from "@tanstack/react-router";
import { Check, Download, Link2, Loader2, Search, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadPicksBySlugs, searchCatalog, type CatalogPickRow } from "@/lib/catalog/db-catalog";
import {
  MAX_PICKS,
  MIN_PICKS,
  insights as computeInsights,
  shareCaption,
  type CardPick,
} from "@/lib/gamer-card";
import { drawTasteCard, downloadCanvas } from "@/components/taste-card-canvas";

/**
 * The Taste Card builder.
 *
 * Search the catalog, pick three to six titles, and the card states what the
 * picks actually have in common. Everything printed is derived from the picks
 * — see gamer-card.ts — so a card with nothing to say says less rather than
 * inventing a compliment.
 *
 * The picks live in the URL. That is the difference between a toy and a page:
 * a shared link reopens the same card for someone else, so the card is a
 * reason to link here, and every pick on it is a real internal link into the
 * catalog page for that title.
 */

const DEBOUNCE_MS = 280;

/**
 * A typed link to the catalog page for one pick.
 *
 * Branching on the three literal routes rather than building one string: the
 * router's link types are literal, and a template string would typecheck as
 * `string` and silently allow a path no route serves — a 404 from a link the
 * card itself printed.
 */
function PickLink({ row, className }: { row: CatalogPickRow; className?: string }) {
  const params = { slug: row.slug };
  if (row.entity_type === "game") {
    return (
      <Link to="/catalog/games/$slug" params={params} className={className}>
        {row.name}
      </Link>
    );
  }
  if (row.entity_type === "manga") {
    return (
      <Link to="/catalog/manga/$slug" params={params} className={className}>
        {row.name}
      </Link>
    );
  }
  return (
    <Link to="/catalog/anime/$slug" params={params} className={className}>
      {row.name}
    </Link>
  );
}

const toPick = (row: CatalogPickRow): CardPick => ({
  slug: row.slug,
  name: row.name,
  categories: row.categories,
  entityType: row.entity_type,
});

export function TasteCardTool({
  initialSlugs,
  onPicksChange,
}: {
  initialSlugs: string[];
  onPicksChange: (slugs: string[]) => void;
}) {
  const [picks, setPicks] = useState<CatalogPickRow[]>([]);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<CatalogPickRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [restoring, setRestoring] = useState(initialSlugs.length > 0);
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rehydrate a shared link once, on mount. initialSlugs is read from the URL
  // the page was opened with; re-running on every change would fight the
  // user's own edits.
  useEffect(() => {
    let cancelled = false;
    if (!initialSlugs.length) return;
    loadPicksBySlugs(initialSlugs).then((rows) => {
      if (cancelled) return;
      setPicks(rows.slice(0, MAX_PICKS));
      setRestoring(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search. The guard on the response is not decoration: typing
  // "one piece" fires several queries and they can land out of order, so a
  // slow early response would otherwise overwrite the results for what was
  // actually typed.
  useEffect(() => {
    const query = term.trim();
    if (query.length < 2) {
      setResults([]);
      setSearching(false);
      setSearched(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const timer = window.setTimeout(() => {
      searchCatalog(query, { limit: 8 }).then((rows) => {
        if (cancelled) return;
        setResults(rows);
        setSearching(false);
        setSearched(true);
      });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [term]);

  const cardPicks = useMemo(() => picks.map(toPick), [picks]);
  const lines = useMemo(() => computeInsights(cardPicks), [cardPicks]);
  const ready = picks.length >= MIN_PICKS;

  useEffect(() => {
    onPicksChange(picks.map((p) => p.slug));
  }, [picks, onPicksChange]);

  // Redraw whenever the picks change, so the preview is never a card for an
  // earlier set of picks.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    drawTasteCard(canvas, {
      picks: cardPicks,
      cardInsights: lines,
      title: "My Anime & Gaming Taste Card",
    });
    setSaveError(false);
  }, [cardPicks, lines, ready]);

  const addPick = useCallback((row: CatalogPickRow) => {
    setPicks((current) => {
      if (current.length >= MAX_PICKS) return current;
      if (current.some((p) => p.slug === row.slug)) return current;
      return [...current, row];
    });
    setTerm("");
    setResults([]);
    setSearched(false);
  }, []);

  const removePick = useCallback((slug: string) => {
    setPicks((current) => current.filter((p) => p.slug !== slug));
  }, []);

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ok = downloadCanvas(canvas, "gamecastle-taste-card.png");
    setSaveError(!ok);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is refused in some browsers and in every insecure
      // context; the address bar already holds the link either way.
      setCopied(false);
    }
  };

  const chosen = new Set(picks.map((p) => p.slug));

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 lg:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="h-5 w-5 text-neon" aria-hidden="true" />
        <h2 className="font-display text-xl font-bold">Build your card</h2>
        <span className="text-sm text-muted-foreground">
          Pick {MIN_PICKS}–{MAX_PICKS} titles you actually love.
        </span>
      </div>

      <label htmlFor="taste-search" className="sr-only">
        Search the anime and game catalog
      </label>
      <div className="relative mt-5">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="taste-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search an anime, manga or game…"
          autoComplete="off"
          disabled={picks.length >= MAX_PICKS}
          className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-10 text-sm outline-none focus:border-neon disabled:opacity-60"
        />
        {searching ? (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
      </div>

      {picks.length >= MAX_PICKS ? (
        <p className="mt-2 text-xs text-muted-foreground">
          That is the maximum of {MAX_PICKS}. Remove one to swap in something else.
        </p>
      ) : null}

      {results.length > 0 ? (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {results.map((row) => (
            <li key={row.slug}>
              <button
                type="button"
                onClick={() => addPick(row)}
                disabled={chosen.has(row.slug)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-accent disabled:opacity-50"
              >
                <span className="flex-1 font-medium">{row.name}</span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {row.entity_type ?? "title"}
                </span>
                {chosen.has(row.slug) ? (
                  <Check className="h-4 w-4 text-neon" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {searched && !searching && results.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nothing in the catalog matches that yet.
        </p>
      ) : null}

      {restoring ? (
        <p className="mt-5 text-sm text-muted-foreground">Loading the shared card…</p>
      ) : null}

      {picks.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {picks.map((row) => (
            <li
              key={row.slug}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm"
            >
              <PickLink row={row} className="font-medium hover:text-neon" />
              <button
                type="button"
                onClick={() => removePick(row.slug)}
                aria-label={`Remove ${row.name}`}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {!ready ? (
        <p className="mt-5 text-sm text-muted-foreground">
          {MIN_PICKS - picks.length} more to go. Below three picks there is nothing honest to say
          about a pattern, so the card waits.
        </p>
      ) : (
        <div className="mt-6">
          {lines.length === 0 ? (
            <p className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
              None of these picks carry genre tags in our catalog yet, so there is no pattern to
              report. The card below still lists them — swap one for a tagged title and the read-out
              appears.
            </p>
          ) : null}
          <ul className="grid gap-3 sm:grid-cols-2">
            {lines.map((line) => (
              <li key={line.label} className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {line.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold">{line.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{line.basis}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            {/* Fixed intrinsic size plus aspect-ratio: the box is the right
                shape before the bitmap is drawn, so nothing shifts. */}
            <canvas
              ref={canvasRef}
              width={1200}
              height={630}
              className="block w-full"
              style={{ aspectRatio: "1200 / 630" }}
              aria-label="Preview of your taste card"
              role="img"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download the card (PNG)
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-xl border border-input px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
              {copied ? "Link copied" : "Copy share link"}
            </button>
          </div>

          {saveError ? (
            <p className="mt-3 text-sm text-destructive">
              Your browser blocked the download. Long-press or right-click the preview above and
              save the image instead.
            </p>
          ) : null}

          <p className="mt-4 text-sm text-muted-foreground">{shareCaption(cardPicks)}</p>
        </div>
      )}
    </div>
  );
}
