import { Link } from "@tanstack/react-router";
import { Gift, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  addVisibleBrowsingTime,
  clampRewardProgress,
  REWARD_NOTICE_KEY,
  REWARD_PROGRESS_KEY,
  REWARD_THRESHOLD_MS,
  REWARD_UNLOCKED_KEY,
} from "@/lib/visitor-reward";

export function VisitorRewardTracker() {
  const locale = useLocale();
  const [showReward, setShowReward] = useState(false);
  const lastTickRef = useRef(0);
  const progressRef = useRef(0);
  const unlockedRef = useRef(false);

  useEffect(() => {
    try {
      progressRef.current = clampRewardProgress(sessionStorage.getItem(REWARD_PROGRESS_KEY));
      const unlocked = localStorage.getItem(REWARD_UNLOCKED_KEY) === "true";
      const noticeSeen = sessionStorage.getItem(REWARD_NOTICE_KEY) === "true";
      unlockedRef.current = unlocked;
      if (unlocked) progressRef.current = REWARD_THRESHOLD_MS;
      if (unlocked && !noticeSeen) setShowReward(true);
    } catch {
      progressRef.current = 0;
    }

    lastTickRef.current = performance.now();

    const persist = () => {
      try {
        sessionStorage.setItem(REWARD_PROGRESS_KEY, String(progressRef.current));
      } catch {
        // Browsing time still works for this render when storage is unavailable.
      }
    };

    const unlock = () => {
      unlockedRef.current = true;
      progressRef.current = REWARD_THRESHOLD_MS;
      try {
        localStorage.setItem(REWARD_UNLOCKED_KEY, "true");
      } catch {
        // The notification can still be used during the current visit.
      }
      persist();
      setShowReward(true);
    };

    const tick = () => {
      if (unlockedRef.current) return;
      const now = performance.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;
      if (document.visibilityState !== "visible") return;
      progressRef.current = addVisibleBrowsingTime(progressRef.current, elapsed);
      persist();
      if (progressRef.current >= REWARD_THRESHOLD_MS) unlock();
    };

    const onVisibilityChange = () => {
      lastTickRef.current = performance.now();
      persist();
    };

    const interval = window.setInterval(tick, 1_000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", persist);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", persist);
      persist();
    };
  }, []);

  if (!showReward) return null;

  const isArabic = locale.code === "ar";
  const rewardPath = isArabic ? "/ar/rewards/anime-wallpapers" : "/rewards/anime-wallpapers";

  const dismiss = () => {
    try {
      sessionStorage.setItem(REWARD_NOTICE_KEY, "true");
    } catch {
      // Dismissal still applies until the component remounts.
    }
    setShowReward(false);
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md overflow-hidden rounded-2xl border border-primary/50 bg-popover/95 p-1 shadow-2xl shadow-primary/20 backdrop-blur-xl motion-safe:animate-in motion-safe:slide-in-from-bottom-6 sm:inset-x-auto sm:end-5 sm:bottom-5 sm:mx-0"
    >
      <div className="relative rounded-xl bg-gradient-to-br from-primary/20 via-background to-accent/15 p-5">
        <button
          type="button"
          onClick={dismiss}
          aria-label={isArabic ? "إغلاق إشعار المكافأة" : "Dismiss reward notification"}
          className="absolute end-3 top-3 rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex gap-4 pe-7">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground glow-primary">
            <Gift className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isArabic ? "تم فتح مكافأتك" : "Reward unlocked"}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold">
              {isArabic
                ? "أكملت 7 دقائق — هديتك جاهزة"
                : "Seven minutes complete — your gift is ready"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {isArabic
                ? "افتح معرض خلفيات الأنمي الحصرية وحمّل ما يعجبك مجانًا."
                : "Open the exclusive anime wallpaper gallery and download your favorites free."}
            </p>
          </div>
        </div>
        <Link
          to={rewardPath}
          onClick={dismiss}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
        >
          <Gift className="h-4 w-4" aria-hidden="true" />
          {isArabic ? "فتح هدية الخلفيات" : "Open wallpaper gift"}
        </Link>
      </div>
    </aside>
  );
}
