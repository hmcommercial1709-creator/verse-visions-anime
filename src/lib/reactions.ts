/**
 * Storage for the reaction strip: emoji taps and short notes, per topic.
 *
 * Separated from the component so the parsing can be tested — this value
 * survives across releases in a browser we do not control, so it can be a
 * shape from an older version, a half-written string from a tab closed
 * mid-write, or something pasted in by hand.
 */

export const REACTIONS_KEY = "gamecastle.reactions.v1";
export const MAX_NOTES = 12;
export const MAX_NOTE_LEN = 140;

export const FACES = ["🔥", "💜", "😂", "😐", "🤯", "😭"] as const;

export interface ReactionNote {
  id: string;
  body: string;
  at: number;
}

export interface ReactionStore {
  faces: Record<string, Record<string, number>>;
  notes: Record<string, ReactionNote[]>;
}

export const EMPTY_REACTIONS: ReactionStore = { faces: {}, notes: {} };

const countMap = (value: unknown): Record<string, number> => {
  const out: Record<string, number> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  for (const [face, count] of Object.entries(value as Record<string, unknown>)) {
    if (typeof count === "number" && Number.isFinite(count) && count > 0) {
      out[face] = Math.floor(count);
    }
  }
  return out;
};

const noteList = (value: unknown): ReactionNote[] => {
  if (!Array.isArray(value)) return [];
  const out: ReactionNote[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const note = row as Partial<ReactionNote>;
    if (typeof note.id !== "string" || typeof note.body !== "string" || !note.body) continue;
    out.push({
      id: note.id,
      body: note.body.slice(0, MAX_NOTE_LEN),
      at: typeof note.at === "number" && Number.isFinite(note.at) ? note.at : 0,
    });
    if (out.length >= MAX_NOTES) break;
  }
  return out;
};

export function parseReactions(raw: string | null): ReactionStore {
  if (!raw) return { faces: {}, notes: {} };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { faces: {}, notes: {} };
    }
    const row = parsed as { faces?: unknown; notes?: unknown };
    const faces: ReactionStore["faces"] = {};
    if (row.faces && typeof row.faces === "object" && !Array.isArray(row.faces)) {
      for (const [topic, map] of Object.entries(row.faces as Record<string, unknown>)) {
        const counts = countMap(map);
        if (Object.keys(counts).length) faces[topic] = counts;
      }
    }
    const notes: ReactionStore["notes"] = {};
    if (row.notes && typeof row.notes === "object" && !Array.isArray(row.notes)) {
      for (const [topic, list] of Object.entries(row.notes as Record<string, unknown>)) {
        const parsedList = noteList(list);
        if (parsedList.length) notes[topic] = parsedList;
      }
    }
    return { faces, notes };
  } catch {
    return { faces: {}, notes: {} };
  }
}

export function readReactions(): ReactionStore {
  try {
    return parseReactions(localStorage.getItem(REACTIONS_KEY));
  } catch {
    return { faces: {}, notes: {} };
  }
}

export function writeReactions(store: ReactionStore): void {
  try {
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(store));
  } catch {
    // Still shows for this page view.
  }
}

/** Pure: one more tap of `face` on `topic`. */
export function addFace(store: ReactionStore, topic: string, face: string): ReactionStore {
  const forTopic = { ...(store.faces[topic] ?? {}) };
  forTopic[face] = (forTopic[face] ?? 0) + 1;
  return { ...store, faces: { ...store.faces, [topic]: forTopic } };
}

/** Pure: prepend a note, trimmed and bounded. Empty input is a no-op. */
export function addNote(store: ReactionStore, topic: string, body: string): ReactionStore {
  const text = body.trim().slice(0, MAX_NOTE_LEN);
  if (!text) return store;
  const note: ReactionNote = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    body: text,
    at: Date.now(),
  };
  const list = [note, ...(store.notes[topic] ?? [])].slice(0, MAX_NOTES);
  return { ...store, notes: { ...store.notes, [topic]: list } };
}
