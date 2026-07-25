import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, RotateCcw, Vote } from "lucide-react";

type PollOption = { id: string; label: string; seed: number };

const POLL: { question: string; options: PollOption[] } = {
  question: "Which 2020s shonen has the strongest single arc?",
  options: [
    { id: "shibuya", label: "Jujutsu Kaisen — Shibuya Incident", seed: 41 },
    { id: "rumbling", label: "Attack on Titan — The Rumbling", seed: 27 },
    { id: "wano", label: "One Piece — Wano", seed: 21 },
    { id: "swordsmith", label: "Demon Slayer — Swordsmith Village", seed: 11 },
  ],
};

const QUIZ: { question: string; options: { id: string; label: string; result: string }[] } = {
  question: "Which Jujutsu sorcerer are you? Pick your instinct under pressure.",
  options: [
    { id: "a", label: "Take the hit so nobody else has to", result: "You're Yuji Itadori — stubborn empathy as a weapon." },
    { id: "b", label: "Read the room, then end it in one move", result: "You're Satoru Gojo — insufferable, and usually right." },
    { id: "c", label: "Plan three steps ahead, share none of them", result: "You're Megumi Fushiguro — quiet strategy, loud results." },
    { id: "d", label: "Clock out on time, no matter what", result: "You're Kento Nanami — boundaries are a power system." },
  ],
};

/** Interactive engagement widget: a poll and a quiz, both client-side. */
export function EngagementWidget() {
  const [vote, setVote] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const results = useMemo(() => {
    const bump = (id: string) => (vote === id ? 1 : 0);
    const total = POLL.options.reduce((n, o) => n + o.seed, 0) + (vote ? 1 : 0);
    return POLL.options.map((o) => ({
      ...o,
      pct: Math.round(((o.seed + bump(o.id)) / total) * 100),
    }));
  }, [vote]);

  const quizResult = QUIZ.options.find((o) => o.id === answer);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-transparent p-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          <Vote className="h-3.5 w-3.5" /> Reader poll
        </div>
        <h3 className="mt-2 font-display text-xl font-bold">{POLL.question}</h3>

        <div className="mt-4 space-y-2">
          {results.map((o) => {
            const chosen = vote === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setVote(o.id)}
                aria-pressed={chosen}
                className={`relative w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                  chosen ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/50"
                }`}
              >
                {vote && (
                  <span
                    className="absolute inset-y-0 left-0 bg-primary/15"
                    style={{ width: `${o.pct}%` }}
                    aria-hidden
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {chosen && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {vote && <span className="shrink-0 font-mono text-xs text-muted-foreground">{o.pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-3 w-3" /> {vote ? "Thanks — results are live." : "Vote to reveal live results."}
          </span>
          {vote && (
            <button onClick={() => setVote(null)} className="flex items-center gap-1 hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-card/40 to-transparent p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Quick quiz</div>
        <h3 className="mt-2 font-display text-xl font-bold">{QUIZ.question}</h3>

        <div className="mt-4 grid gap-2">
          {QUIZ.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setAnswer(o.id)}
              aria-pressed={answer === o.id}
              className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                answer === o.id ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent/50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-3 text-sm" aria-live="polite">
          {quizResult ? (
            <span>
              <span className="font-semibold text-accent">Result: </span>
              {quizResult.result}
            </span>
          ) : (
            <span className="text-muted-foreground">Pick an answer to see your sorcerer.</span>
          )}
        </div>
      </div>
    </div>
  );
}
