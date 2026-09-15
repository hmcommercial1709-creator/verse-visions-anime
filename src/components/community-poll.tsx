import { Check, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  castGlobalVote,
  fetchGlobalTally,
  localTally,
  percentages,
  readVotes,
  writeVote,
  type Poll,
  type Tally,
} from "@/lib/community-poll";
import { feedback } from "@/lib/hype";

/**
 * A poll whose bars are labelled for what they actually count.
 *
 * `scope` travels with the tally, so the caption under the bars is derived
 * from the data rather than written by hand. There is no way to render the
 * word "global" over numbers that came from this browser, which is the whole
 * point — a percentage nobody cast is the same failure as an invented review
 * count, and the site removed 50,000 of those this week.
 */
export function CommunityPoll({
  poll,
  onVoted,
}: {
  poll: Poll;
  onVoted?: (optionId: string) => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [tally, setTally] = useState<Tally | null>(null);
  const optionIds = poll.options.map((o) => o.id);

  const refresh = useCallback(
    async (fallbackVotes: Record<string, string>) => {
      const global = await fetchGlobalTally(poll.id, optionIds);
      setTally(global ?? localTally(poll.id, fallbackVotes));
    },
    // optionIds is rebuilt each render; poll.id is what actually identifies it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poll.id],
  );

  useEffect(() => {
    const votes = readVotes();
    setChoice(votes[poll.id] ?? null);
    if (votes[poll.id]) void refresh(votes);
  }, [poll.id, refresh]);

  const vote = async (optionId: string) => {
    if (choice) return;
    feedback("pop", 10);
    setChoice(optionId);
    const votes = writeVote(poll.id, optionId);
    // Recorded remotely when there is somewhere to record it; the local vote
    // above already stands either way.
    await castGlobalVote(poll.id, optionId);
    await refresh(votes);
    onVoted?.(optionId);
  };

  const shares = tally ? percentages(tally.counts, optionIds) : null;

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <p className="flex items-start gap-2 text-sm font-semibold">
        <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {poll.question}
      </p>

      <div className="mt-3 grid gap-2">
        {poll.options.map((option) => {
          const picked = choice === option.id;
          const share = shares?.[option.id] ?? 0;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => void vote(option.id)}
              disabled={Boolean(choice)}
              aria-pressed={picked}
              className={`relative min-h-11 overflow-hidden rounded-xl border px-4 text-left text-sm transition-colors ${
                picked
                  ? "border-primary bg-primary/10 font-semibold"
                  : "border-border/60 bg-background/60 hover:border-primary/60"
              } ${choice ? "cursor-default" : ""}`}
            >
              {/* The bar is a background layer so the label stays readable on
                  top of it at any width. */}
              {choice && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 bg-primary/25 transition-[width] duration-700 ease-out"
                  style={{ width: `${share}%` }}
                />
              )}
              <span className="relative flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2">
                  {picked && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                  {option.label}
                </span>
                {choice && <span className="tabular-nums font-semibold">{share}%</span>}
              </span>
            </button>
          );
        })}
      </div>

      {choice && tally && (
        <p className="mt-2 text-xs text-muted-foreground">
          {tally.scope === "global"
            ? `${tally.total} ${tally.total === 1 ? "vote" : "votes"} from everyone who has answered.`
            : "Counted in this browser only — there is no shared vote store yet, so this is your answer, not a community result."}
        </p>
      )}
    </div>
  );
}
