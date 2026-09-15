/**
 * Personal anime lists, kept in the reader's own browser.
 *
 * Deliberately localStorage and nothing else. A watchlist is worth having the
 * moment someone taps the button — not after a sign-up form, an email
 * confirmation and a password they will never use again. Nothing here leaves
 * the device unless the reader chooses to share the link.
 *
 * Every entry stores the slug and the title. The slug alone would be enough
 * to rebuild the list from the catalog, but that means a database round trip
 * before the list can be drawn at all; keeping the title makes the list
 * render instantly and offline, and the slug still links to the real page.
 */

export const WATCHLIST_KEY = "gamecastle.watchlist.v1";
export const WATCHLIST_EVENT = "gamecastle:watchlist";

export type ListStatus = "watching" | "completed";

export interface WatchlistEntry {
  slug: string;
  title: string;
  status: ListStatus;
  /** ms since epoch, so a list can be shown newest-first without a sort key. */
  addedAt: number;
}

/** The most a single browser will hold. Past this the oldest entries drop. */
export const MAX_ENTRIES = 300;

const isEntry = (value: unknown): value is WatchlistEntry => {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<WatchlistEntry>;
  return (
    typeof row.slug === "string" &&
    row.slug.length > 0 &&
    typeof row.title === "string" &&
    (row.status === "watching" || row.status === "completed") &&
    typeof row.addedAt === "number" &&
    Number.isFinite(row.addedAt)
  );
};

/**
 * Parses whatever is in storage into a list we can trust.
 *
 * Every field is checked rather than cast. This value survives across releases
 * in a browser we do not control, so it can be a list from an older shape, a
 * half-written string from a tab that was closed mid-write, or something a
 * reader pasted in by hand. A bad row is dropped; a bad blob yields an empty
 * list rather than throwing into a render.
 */
export function parseWatchlist(raw: string | null): WatchlistEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const out: WatchlistEntry[] = [];
    for (const row of parsed) {
      if (!isEntry(row) || seen.has(row.slug)) continue;
      seen.add(row.slug);
      out.push({ slug: row.slug, title: row.title, status: row.status, addedAt: row.addedAt });
    }
    return out.slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Adds or replaces one entry, newest first. Pure: returns a new list. */
export function upsertEntry(
  list: WatchlistEntry[],
  entry: Omit<WatchlistEntry, "addedAt"> & { addedAt?: number },
): WatchlistEntry[] {
  const addedAt = entry.addedAt ?? Date.now();
  const without = list.filter((row) => row.slug !== entry.slug);
  return [{ ...entry, addedAt }, ...without].slice(0, MAX_ENTRIES);
}

export function removeEntry(list: WatchlistEntry[], slug: string): WatchlistEntry[] {
  return list.filter((row) => row.slug !== slug);
}

/**
 * Tapping the status a title already has removes it.
 *
 * Without this, the only way to undo a mis-tap is to find the list page, which
 * is a dead end on a phone. Tapping "Watching" on something already marked
 * watching is unambiguously "undo".
 */
export function toggleStatus(
  list: WatchlistEntry[],
  entry: { slug: string; title: string },
  status: ListStatus,
): WatchlistEntry[] {
  const current = list.find((row) => row.slug === entry.slug);
  if (current?.status === status) return removeEntry(list, entry.slug);
  return upsertEntry(list, { ...entry, status });
}

export const statusOf = (list: WatchlistEntry[], slug: string): ListStatus | null =>
  list.find((row) => row.slug === slug)?.status ?? null;

export const countByStatus = (list: WatchlistEntry[], status: ListStatus): number =>
  list.reduce((n, row) => (row.status === status ? n + 1 : n), 0);

/* ---- storage, wrapped: it throws in private mode and in some webviews ---- */

export function readWatchlist(): WatchlistEntry[] {
  try {
    return parseWatchlist(localStorage.getItem(WATCHLIST_KEY));
  } catch {
    return [];
  }
}

export function writeWatchlist(list: WatchlistEntry[]): void {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  } catch {
    // The list still works for this page view; it just will not survive a
    // reload. Better than refusing the tap.
  }
  // Storage events only fire in OTHER tabs, so a same-tab listener (the header
  // count, a second button on the page) would never hear about the change.
  try {
    window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT));
  } catch {
    /* no window: nothing is listening anyway */
  }
}

/* ---- sharing a list as a URL ---- */

const SLUG = /^[a-z0-9][a-z0-9-]{0,120}$/;

/** Slugs for the share link: bounded, and only what could be a real page. */
export function encodeListParam(list: WatchlistEntry[], max = 60): string {
  return list
    .map((row) => row.slug)
    .filter((slug) => SLUG.test(slug))
    .slice(0, max)
    .join(",");
}

export function decodeListParam(raw: unknown, max = 60): string[] {
  if (typeof raw !== "string" || !raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const slug = part.trim().toLowerCase();
    // Anything else in this parameter is a typo or someone probing, and
    // neither should reach a database query.
    if (!SLUG.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= max) break;
  }
  return out;
}
