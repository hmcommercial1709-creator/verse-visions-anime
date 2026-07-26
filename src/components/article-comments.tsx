import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";

type Comment = { id: string; name: string; body: string; at: string };

const key = (slug: string) => `av:comments:${slug}`;

const read = (slug: string): Comment[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(slug));
    const parsed = raw ? (JSON.parse(raw) as Comment[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const seeds: Comment[] = [
  {
    id: "seed-1",
    name: "Editorial team",
    body: "Comments are stored locally in your browser so you can keep your own reading notes on this page. Be kind, and tag spoilers.",
    at: "Pinned",
  },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

/**
 * Reader discussion section. Client-only and privacy-friendly: entries live in
 * localStorage per article slug, so nothing leaves the device. Rendered after
 * hydration to avoid an SSR/client mismatch.
 */
export function ArticleComments({ slug }: { slug: string }) {
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setItems(read(slug));
    setHydrated(true);
  }, [slug]);

  const persist = useCallback(
    (next: Comment[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(key(slug), JSON.stringify(next));
      } catch {
        /* storage unavailable — comments stay in memory for this session */
      }
    },
    [slug],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    persist([
      {
        id: `c-${Date.now()}`,
        name: name.trim() || "Anonymous fan",
        body: text.slice(0, 1200),
        at: new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
      },
      ...items,
    ]);
    setBody("");
  };

  const visible = useMemo(() => [...seeds, ...items], [items]);

  return (
    <section id="comments" className="mt-14 scroll-mt-28 border-t border-border/60 pt-8">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
        <MessageSquare className="h-5 w-5 text-primary" />
        Discussion
        <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Share your read of this piece. Notes are saved to this browser only — no account, no tracking.
      </p>

      <form onSubmit={submit} className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4">
        <label htmlFor={`cm-name-${slug}`} className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Display name
        </label>
        <input
          id={`cm-name-${slug}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Anonymous fan"
          className="mt-1.5 w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
        />
        <label htmlFor={`cm-body-${slug}`} className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Your comment
        </label>
        <textarea
          id={`cm-body-${slug}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={1200}
          placeholder="Tag spoilers, be specific, disagree freely."
          className="mt-1.5 w-full resize-y rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{1200 - body.length} characters left</span>
          <button
            type="submit"
            disabled={!body.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" /> Post comment
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-4">
        {visible.map((c) => (
          <li key={c.id} className="flex gap-3 rounded-2xl border border-border/60 bg-card/30 p-4">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
              {initials(c.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.at}</span>
              </div>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.body}</p>
            </div>
            {hydrated && !c.id.startsWith("seed-") && (
              <button
                type="button"
                aria-label="Delete comment"
                onClick={() => persist(items.filter((x) => x.id !== c.id))}
                className="self-start rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
