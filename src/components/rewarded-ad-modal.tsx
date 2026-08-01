import { useEffect, useRef, useState } from "react";
import { ExternalLink, Gift, Loader2, Lock, X } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";

/**
 * Rewarded-ad gate.
 *
 * A simulated rewarded-video modal: it reserves a real ad container (the
 * AdSense/rewarded script drops into `<AdSlot>`), runs a countdown, and only
 * then reveals the unlock CTA. Nothing here blocks page load — the modal is
 * mounted on demand and is fully dismissible, so it never behaves like an
 * intrusive interstitial.
 */
export function RewardedAdModal({
  open,
  onClose,
  onReward,
  seconds = 15,
  platformLabel,
  platformUrl,
  rewardLabelAr = "أكمل الحلقة على المنصة الرسمية",
}: {
  open: boolean;
  onClose: () => void;
  onReward?: () => void;
  seconds?: number;
  platformLabel: string;
  platformUrl: string;
  rewardLabelAr?: string;
}) {
  const [left, setLeft] = useState(seconds);
  const rewarded = left <= 0;
  const rewardFired = useRef(false);

  useEffect(() => {
    if (!open) {
      setLeft(seconds);
      rewardFired.current = false;
      return;
    }
    const id = window.setInterval(() => setLeft((v) => (v <= 1 ? 0 : v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [open, seconds]);

  useEffect(() => {
    if (open && rewarded && !rewardFired.current) {
      rewardFired.current = true;
      onReward?.();
    }
  }, [open, rewarded, onReward]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pct = Math.round(((seconds - left) / seconds) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rewarded ad"
      className="fixed inset-0 z-[80] grid place-items-center bg-background/85 p-4"
    >
      <div
        dir="rtl"
        lang="ar"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-right shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5 pt-6">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
            <Gift className="h-3.5 w-3.5" /> مكافأة
          </span>
          <h2 className="mt-2 font-display text-xl font-bold leading-snug">
            شاهد إعلاناً قصيراً لفتح الملخص الكامل أو الانتقال إلى المنصة الرسمية
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            الإعلان يدعم الموقع ويحفظ الملخصات مجانية للجميع. يمكنك الإغلاق في أي وقت.
          </p>

          {/* Real ad container — AdSense / rewarded script renders here. */}
          <AdSlot slot="rewarded-gate" className="mt-4" minHeight={200} />

          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
              {rewarded ? "تم فتح المكافأة" : `يتبقى ${left} ثانية…`}
            </p>
          </div>

          {rewarded ? (
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-accent-foreground hover:brightness-110"
            >
              {rewardLabelAr} — {platformLabel}
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          ) : (
            <span className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-3.5 text-base font-bold text-muted-foreground">
              <Lock className="h-4 w-4" />
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري تحميل المكافأة
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
