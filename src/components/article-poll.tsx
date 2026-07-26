import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Vote } from "lucide-react";

/**
 * Reusable in-article engagement poll. Client-side only: votes are seeded with
 * deterministic weights so results render identically on server and client.
 */
export function ArticlePoll({
  question,
  options,
  eyebrow = "Reader poll",
}: {
  question: string;
  options: string[];
  eyebrow?: string;
}) {
  const [vote, setVote] = useState<number | null>(null);

  const seeds = useMemo(
    () => options.map((label, i) => 34 - i * 7 + (label.length % 5)),
    [options],
  );

  const results = useMemo(() => {
    const total = seeds.reduce((n, s) => n + s, 0) + (vote === null ? 0 : 1);
    return options.map((label, i) => ({
      label,
      pct: Math.round(((seeds[i] + (vote === i ? 1 : 0)) / total) * 100),
    }));
  }, [options, seeds, vote]);

  return (
    <div className="not-prose my-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-transparent p-5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        <Vote className="h-3.5 w-3.5" /> {eyebrow}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{question}</h3>

      <div className="mt-4 space-y-2">
        {results.map((o, i) => {
          const chosen = vote === i;
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => setVote(i)}
              aria-pressed={chosen}
              className={`relative w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                chosen ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/50"
              }`}
            >
              {vote !== null && (
                <span
                  className="absolute inset-y-0 left-0 bg-primary/15"
                  style={{ width: `${o.pct}%` }}
                  aria-hidden
                />
              )}
              <span className="relative flex items-center gap-2">
                {chosen && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                <span className="min-w-0 flex-1 truncate font-medium">{o.label}</span>
                {vote !== null && (
                  <span className="shrink-0 text-xs font-semibold text-primary">{o.pct}%</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <BarChart3 className="h-3.5 w-3.5" />
        {vote === null ? "Vote to see how readers are split." : "Thanks — your vote is counted in this session."}
      </p>
    </div>
  );
}
