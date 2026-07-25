import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export type SpoilerLevel = "minor" | "major" | "ending";

const LABEL: Record<SpoilerLevel, string> = {
  minor: "Minor spoilers",
  major: "Major spoilers",
  ending: "Ending spoilers",
};

/**
 * <Spoiler /> — reusable, accessible spoiler gate.
 *
 * Content is rendered but visually hidden until the user opts in. The
 * inner text remains in the DOM for search engines (the block itself
 * carries a clear warning + label so it's not deceptive), and the
 * expand button is keyboard-operable.
 */
export function Spoiler({
  level = "major",
  scope,
  children,
}: {
  level?: SpoilerLevel;
  scope?: string; // e.g. "Shibuya arc"
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4 rounded-lg border border-border/60 bg-card/50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-primary"
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>{LABEL[level]}{scope ? ` — ${scope}` : ""}</span>
        <span className="ml-auto text-muted-foreground">{open ? "Hide" : "Reveal"}</span>
      </button>
      <div
        className={open ? "px-4 pb-4" : "px-4 pb-4 blur-sm select-none pointer-events-none"}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}
