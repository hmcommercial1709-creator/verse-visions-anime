import { MessageSquarePlus, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { feedback } from "@/lib/hype";
import {
  EMPTY_REACTIONS,
  FACES,
  MAX_NOTE_LEN,
  addFace,
  addNote as appendNote,
  readReactions,
  writeReactions,
  type ReactionStore,
} from "@/lib/reactions";

/**
 * The reaction strip: emoji taps and one-line notes, kept in this browser.
 *
 * No SDK, no embed, no iframe — those are the three ways a "lightweight
 * comment widget" turns into 200KB and a tracker. This is a list in
 * localStorage and it says so, because calling a private note a community
 * reaction would be the same lie as an invented vote count.
 *
 * It is genuinely useful anyway: notes on what you thought of a pairing, kept
 * against that pairing, are worth having when you come back to it.
 */

export function QuickReactions({ topic, onReact }: { topic: string; onReact?: () => void }) {
  const [store, setStore] = useState<ReactionStore>(EMPTY_REACTIONS);
  const [draft, setDraft] = useState("");

  useEffect(() => setStore(readReactions()), [topic]);

  const react = useCallback(
    (face: string) => {
      feedback("pop", 8);
      const next = addFace(readReactions(), topic, face);
      writeReactions(next);
      setStore(next);
      onReact?.();
    },
    [topic, onReact],
  );

  const saveNote = useCallback(() => {
    if (!draft.trim()) return;
    feedback("whoosh", 12);
    const next = appendNote(readReactions(), topic, draft);
    writeReactions(next);
    setStore(next);
    setDraft("");
    onReact?.();
  }, [draft, topic, onReact]);

  const faces = store.faces[topic] ?? {};
  const notes = store.notes[topic] ?? [];

  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <div className="flex flex-wrap gap-2">
        {FACES.map((face) => (
          <button
            key={face}
            type="button"
            onClick={() => react(face)}
            aria-label={`React ${face}`}
            className="min-h-11 rounded-xl border border-border/60 bg-card/60 px-3 text-lg transition-transform hover:border-primary/60 active:scale-90"
          >
            {face}
            {faces[face] ? (
              <span className="ml-1.5 align-middle text-xs font-semibold text-muted-foreground">
                {faces[face]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <label htmlFor={`note-${topic}`} className="sr-only">
          Add a quick note
        </label>
        <input
          id={`note-${topic}`}
          value={draft}
          maxLength={MAX_NOTE_LEN}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") saveNote();
          }}
          placeholder="Quick thought on this pack…"
          className="min-h-11 flex-1 rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={saveNote}
          aria-label="Save note"
          className="min-h-11 rounded-xl bg-primary px-4 text-primary-foreground transition-transform active:scale-95"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {notes.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-start gap-2 rounded-lg bg-card/50 px-3 py-2 text-sm"
            >
              <MessageSquarePlus
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              {note.body}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Reactions and notes are saved in this browser. They are yours — nothing is published and no
        one else sees them.
      </p>
    </div>
  );
}
