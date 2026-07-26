import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ExternalLink, Loader2, Lock, X } from "lucide-react";
import { InArticleAd } from "@/components/ad-slot";

const COUNTDOWN_SECONDS = 10;

export interface UnlockTarget {
  kind: "wallpaper" | "stream";
  label: string;
  detail?: string;
  href: string;
}

/**
 * Elegant 10-second unlock overlay used before HD wallpaper downloads and
 * official stream server links. Holds a high-visibility ad slot while the
 * timer runs, then reveals the destination link.
 */
export function UnlockCountdownModal({
  target,
  onClose,
}: {
  target: UnlockTarget | null;
  onClose: () => void;
}) {
  const [left, setLeft] = useState(COUNTDOWN_SECONDS);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!target) return;
    setLeft(COUNTDOWN_SECONDS);
    closeRef.current?.focus();
    const id = window.setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  if (!target) return null;

  const ready = left === 0;
  const pct = ((COUNTDOWN_SECONDS - left) / COUNTDOWN_SECONDS) * 100;
  const isWallpaper = target.kind === "wallpaper";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preparing ${target.label}`}
      className="fixed inset-0 z-[70] grid place-items-center bg-background/85 p-4 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-border/50 bg-gradient-to-r from-primary/15 to-accent/10 px-6 py-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary">
            {isWallpaper ? <Download className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
            {isWallpaper ? "HD Wallpaper" : "Stream Server"}
          </div>
          <h2 className="mt-1.5 font-display text-xl font-bold">{target.label}</h2>
          {target.detail && <p className="mt-1 text-sm text-muted-foreground">{target.detail}</p>}
        </div>

        <div className="px-6 py-5">
          <InArticleAd index={1} unitId={`av-unlock-${target.kind}`} adId={`InArticle_Ad_Unlock_${target.kind}`} />

          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-4" aria-live="polite">
            {ready ? (
              <a
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {isWallpaper ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                {isWallpaper ? "Download HD Wallpaper" : "Open Official Stream"}
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 py-3 text-sm font-semibold text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Your link unlocks in {left}s
              </div>
            )}
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> VIP members skip every countdown.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Hook that wires triggers to the overlay. */
export function useUnlockCountdown() {
  const [target, setTarget] = useState<UnlockTarget | null>(null);
  const open = useCallback((t: UnlockTarget) => setTarget(t), []);
  const close = useCallback(() => setTarget(null), []);
  return { target, open, close };
}
