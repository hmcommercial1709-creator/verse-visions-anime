import { useEffect, useState } from "react";
import { Crown, Sparkles, X, Zap } from "lucide-react";

const DISMISS_KEY = "av-vip-banner-dismissed";

/**
 * Top strip promoting the ad-free VIP tier. Dismissal persists for the session
 * so it never nags a returning reader mid-visit.
 */
export function VipMembershipBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative border-b border-primary/25 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 lg:px-6">
        <Crown className="hidden h-4 w-4 shrink-0 text-primary sm:block" />
        <p className="min-w-0 flex-1 text-xs sm:text-sm">
          <span className="font-semibold">Upgrade to VIP for $3/mo</span>{" "}
          <span className="text-muted-foreground">— read ad-free & get early access to every deep-dive.</span>
        </p>
        <a
          href="/contact?desk=business"
          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go VIP
        </a>
        <button
          type="button"
          aria-label="Dismiss VIP offer"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Floating card variant for long article pages / sidebars. */
export function VipUpgradeCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-accent/10 p-5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary">
        <Crown className="h-3.5 w-3.5" /> AnimeVerse VIP
      </div>
      <h3 className="mt-2 font-display text-lg font-bold">Read Ad-Free for $3/mo</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-primary" /> Zero ads across every guide
        </li>
        <li className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Early access to season deep-dives
        </li>
        <li className="flex items-center gap-2">
          <Crown className="h-3.5 w-3.5 text-primary" /> HD wallpaper library, no countdowns
        </li>
      </ul>
      <a
        href="/contact?desk=business"
        className="mt-4 block rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Upgrade to VIP
      </a>
    </div>
  );
}
