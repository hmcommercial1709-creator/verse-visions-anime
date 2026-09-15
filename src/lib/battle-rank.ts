/**
 * Battle Rank: a progress counter for what the reader has actually done.
 *
 * Every point here is earned by a real action taken in this browser —
 * deploying a loadout, voting, reacting, opening a bundle. Nothing is granted
 * for time spent, nothing is granted for arriving, and there is no leaderboard,
 * because a leaderboard needs other people's scores and there is no shared
 * store holding any. A rank that compared you to invented rivals would be the
 * same fabrication we spent this week removing.
 *
 * So it is honest about what it is: your own tally, on your own device, which
 * the page says out loud.
 */

export const RANK_KEY = "gamecastle.rank.v1";
export const RANK_EVENT = "gamecastle:rank";

/** What each action is worth. Small integers: this is a nudge, not a currency. */
export const POINTS = {
  deploy: 3,
  vote: 2,
  react: 1,
  open: 1,
} as const;

export type RankAction = keyof typeof POINTS;

export interface RankState {
  points: number;
  /** Per-action counts, so the page can show what earned the total. */
  actions: Record<string, number>;
}

/**
 * Rank bands. The names are flavour; the thresholds are the real part, and the
 * page shows both the band and the raw points so the label can always be
 * checked against the number behind it.
 */
export const BANDS: { at: number; name: string }[] = [
  { at: 0, name: "Recruit" },
  { at: 10, name: "Scout" },
  { at: 25, name: "Raider" },
  { at: 50, name: "Vanguard" },
  { at: 90, name: "Commander" },
  { at: 150, name: "Legend" },
];

export function bandFor(points: number): {
  name: string;
  at: number;
  next: { name: string; at: number } | null;
} {
  let current = BANDS[0];
  for (const band of BANDS) if (points >= band.at) current = band;
  const next = BANDS.find((b) => b.at > current.at) ?? null;
  return { ...current, next };
}

export const EMPTY_RANK: RankState = { points: 0, actions: {} };

/** Parses stored state, dropping anything that is not a finite count. */
export function parseRank(raw: string | null): RankState {
  if (!raw) return { ...EMPTY_RANK, actions: {} };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...EMPTY_RANK, actions: {} };
    }
    const row = parsed as { points?: unknown; actions?: unknown };
    const points =
      typeof row.points === "number" && Number.isFinite(row.points) && row.points >= 0
        ? Math.floor(row.points)
        : 0;
    const actions: Record<string, number> = {};
    if (row.actions && typeof row.actions === "object" && !Array.isArray(row.actions)) {
      for (const [key, value] of Object.entries(row.actions as Record<string, unknown>)) {
        if (typeof value === "number" && Number.isFinite(value) && value > 0) {
          actions[key] = Math.floor(value);
        }
      }
    }
    return { points, actions };
  } catch {
    return { ...EMPTY_RANK, actions: {} };
  }
}

/** Pure: applies one action to a state and returns the next one. */
export function award(state: RankState, action: RankAction): RankState {
  const points = state.points + POINTS[action];
  return {
    points,
    actions: { ...state.actions, [action]: (state.actions[action] ?? 0) + 1 },
  };
}

/** True when this action crosses into a new band — the moment worth a boom. */
export function crossesBand(before: RankState, after: RankState): boolean {
  return bandFor(after.points).name !== bandFor(before.points).name;
}

/* ---- storage ---- */

export function readRank(): RankState {
  try {
    return parseRank(localStorage.getItem(RANK_KEY));
  } catch {
    return { ...EMPTY_RANK, actions: {} };
  }
}

export function writeRank(state: RankState): void {
  try {
    localStorage.setItem(RANK_KEY, JSON.stringify(state));
  } catch {
    // Progress still shows for this page view.
  }
  try {
    window.dispatchEvent(new CustomEvent(RANK_EVENT));
  } catch {
    /* no window */
  }
}

/** Award, persist and report whether a band was crossed. */
export function recordAction(action: RankAction): { state: RankState; promoted: boolean } {
  const before = readRank();
  const after = award(before, action);
  writeRank(after);
  return { state: after, promoted: crossesBand(before, after) };
}
