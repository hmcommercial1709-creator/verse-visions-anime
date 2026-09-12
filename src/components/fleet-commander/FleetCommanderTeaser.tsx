import { lazy, Suspense, useState } from "react";
import { Anchor } from "lucide-react";

/**
 * Hero teaser for the Fleet Commander demo. The actual canvas game (with
 * its animation loop and audio) is code-split via React.lazy and only
 * fetched/mounted once a visitor clicks Launch — so it costs nothing on
 * initial page load and can't affect LCP/CLS for the homepage or the
 * catalog pages.
 */
const FleetCommanderGame = lazy(() => import("./FleetCommanderGame"));

export function FleetCommanderTeaser() {
  const [launched, setLaunched] = useState(false);

  if (launched) {
    return (
      <Suspense
        fallback={
          <div className="rounded-3xl border border-primary/30 bg-card/60 p-6 backdrop-blur-xl shadow-2xl h-[420px] flex items-center justify-center text-sm text-muted-foreground">
            Loading Fleet Commander…
          </div>
        }
      >
        <FleetCommanderGame />
      </Suspense>
    );
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-cyan-500/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-6">
      <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/20 flex items-center justify-center">
        <Anchor className="h-8 w-8 text-primary" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-1">New — Playable Demo</div>
        <h2 className="text-xl sm:text-2xl font-black mb-1">Fleet Commander</h2>
        <p className="text-sm text-muted-foreground">
          A quick tactical naval combat demo, playable right here — no download, no account.
        </p>
      </div>
      <button
        onClick={() => setLaunched(true)}
        className="shrink-0 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:opacity-90 transition"
      >
        Launch Demo ⚓
      </button>
    </div>
  );
}
