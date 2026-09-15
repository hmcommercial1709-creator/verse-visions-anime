import { supabase } from "@/integrations/supabase/client";

/**
 * Polls that never show a number nobody cast.
 *
 * The brief asked for "live animated percentage bars showing global community
 * results". Global results need somewhere shared to put them, and the browser
 * key is read-only under RLS — so on a site with no votes table, a global
 * percentage is a number with nothing behind it. That is the same failure as
 * the 50,000 fabricated review counts we removed this week, in a nicer costume,
 * and MysteryVault.tsx already refused it in its own header: "There is no
 * global 'live wins' feed, because there is no real global win data to
 * display."
 *
 * So this reads a shared tally when one exists and falls back to the reader's
 * own votes when it does not — and the scope travels WITH the tally, so the UI
 * can only ever label the bars for what they actually are. There is no code
 * path that produces a number labelled "global" without a shared table behind
 * it.
 *
 * supabase/setup-community-polls.sql creates that table. Until it is applied
 * the bars are honest and local; after it, the same component is honest and
 * global, with nothing to change here.
 */

export const POLL_STORAGE_KEY = "gamecastle.polls.v1";
export const POLL_TABLE = "poll_votes";

export type TallyScope = "global" | "local";

export interface Tally {
  /** optionId -> count. Only options with votes appear. */
  counts: Record<string, number>;
  total: number;
  scope: TallyScope;
}

export interface PollOption {
  id: string;
  label: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

/* ---------------- pure maths ---------------- */

/**
 * Percentages that always sum to exactly 100.
 *
 * Rounding each share independently gives 33/33/33 for a three-way split, and
 * a bar chart that visibly does not add up is the fastest way to make a real
 * number look invented. The largest remainder takes the leftover.
 */
export function percentages(
  counts: Record<string, number>,
  optionIds: string[],
): Record<string, number> {
  const total = optionIds.reduce((sum, id) => sum + (counts[id] ?? 0), 0);
  if (total <= 0) return Object.fromEntries(optionIds.map((id) => [id, 0]));

  const exact = optionIds.map((id) => ({ id, value: ((counts[id] ?? 0) / total) * 100 }));
  const floored = exact.map((row) => ({ ...row, floor: Math.floor(row.value) }));
  let leftover = 100 - floored.reduce((sum, row) => sum + row.floor, 0);

  const byRemainder = [...floored].sort(
    (a, b) => b.value - b.floor - (a.value - a.floor) || a.id.localeCompare(b.id),
  );
  const out: Record<string, number> = Object.fromEntries(floored.map((r) => [r.id, r.floor]));
  for (const row of byRemainder) {
    if (leftover <= 0) break;
    out[row.id] += 1;
    leftover -= 1;
  }
  return out;
}

/** Parses the stored vote map, dropping anything that is not a plain string. */
export function parseVotes(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [pollId, optionId] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof optionId === "string" && optionId) out[pollId] = optionId;
    }
    return out;
  } catch {
    return {};
  }
}

/* ---------------- this browser ---------------- */

export function readVotes(): Record<string, string> {
  try {
    return parseVotes(localStorage.getItem(POLL_STORAGE_KEY));
  } catch {
    return {};
  }
}

export function writeVote(pollId: string, optionId: string): Record<string, string> {
  const next = { ...readVotes(), [pollId]: optionId };
  try {
    localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode. The vote still shows for this page view.
  }
  return next;
}

/** A tally built from this browser alone — one vote, labelled as such. */
export function localTally(pollId: string, votes: Record<string, string>): Tally {
  const choice = votes[pollId];
  if (!choice) return { counts: {}, total: 0, scope: "local" };
  return { counts: { [choice]: 1 }, total: 1, scope: "local" };
}

/* ---------------- the shared table, when it exists ---------------- */

/**
 * The global tally, or null when there is no table to read.
 *
 * Null rather than an empty tally: "nobody has voted" and "there is nowhere to
 * count votes" have to stay distinguishable, because the first is a real
 * global result worth showing and the second is not a global result at all.
 */
export async function fetchGlobalTally(pollId: string, optionIds: string[]): Promise<Tally | null> {
  try {
    const { data, error } = await supabase
      .from(POLL_TABLE)
      .select("option_id")
      .eq("poll_id", pollId)
      .limit(5000);
    if (error || !data) return null;

    const counts: Record<string, number> = {};
    let total = 0;
    for (const row of data as Array<{ option_id?: unknown }>) {
      const id = typeof row.option_id === "string" ? row.option_id : null;
      // A row for an option this poll no longer offers is ignored rather than
      // counted into a total it cannot be shown against.
      if (!id || !optionIds.includes(id)) continue;
      counts[id] = (counts[id] ?? 0) + 1;
      total += 1;
    }
    return { counts, total, scope: "global" };
  } catch {
    return null;
  }
}

/** Records a vote in the shared table. False when there is nowhere to record it. */
export async function castGlobalVote(pollId: string, optionId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(POLL_TABLE).insert({
      poll_id: pollId,
      option_id: optionId,
    } as never);
    return !error;
  } catch {
    return false;
  }
}
