import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { adsInBand } from "@/lib/gamer-card";

/**
 * The floating invitation to the Taste Card.
 *
 * Three constraints shaped this, and each one is load-bearing:
 *
 * 1. AdSense. A fixed element that sits over — or next to — an ad unit is an
 *    accidental-click risk, and Google suspends accounts for it, not just the
 *    placement. So the button measures the real ad containers on the page and
 *    takes itself out of the DOM while any of them is inside the strip it
 *    occupies. That is why the check is a live rect test and not a per-route
 *    allowlist: Auto Ads inserts units this code never placed.
 *
 * 2. Motion. It has to be noticed, so it pulses — but `prefers-reduced-motion`
 *    is a real accessibility setting and for some people motion like this is
 *    nausea, not attention. The animation is CSS-gated on the media query, so
 *    the button still appears, just still.
 *
 * 3. Layout. Fixed positioning keeps it out of flow entirely, so it can appear
 *    and disappear at any moment without contributing a pixel of CLS.
 *
 * Dismissal is per-session, not forever: someone who closes it today should
 * not have the site decide for them next month.
 */

const DISMISS_KEY = "gc-taste-cta-dismissed";
/** Scroll depth before it appears, so it never competes with the first screen. */
const REVEAL_AFTER_PX = 700;

export function TasteCardCta() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const blockedRef = useRef(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "true");
    } catch {
      // Storage is unavailable in some privacy modes; showing it is the
      // correct default there.
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const containers = document.querySelectorAll<HTMLElement>(
        ".ad-container, ins.adsbygoogle, .google-auto-placed",
      );
      const rects: Array<{ top: number; bottom: number }> = [];
      for (const node of containers) {
        const rect = node.getBoundingClientRect();
        // A collapsed or unfilled box has no area and cannot be clicked.
        if (rect.height > 0) rects.push({ top: rect.top, bottom: rect.bottom });
      }
      blockedRef.current = adsInBand(rects, window.innerHeight);
      const scrolled = window.scrollY > REVEAL_AFTER_PX;
      setVisible(scrolled && !blockedRef.current);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  // Always the canonical path: /gamer-card is one route with one canonical
  // URL, and pointing readers at a locale prefix the route tree does not serve
  // would send them through the catch-all instead of to the tool.
  // Not on the tool's own page, and not over an ad.
  const onToolPage = pathname.replace(/\/+$/, "").endsWith("/gamer-card");
  if (dismissed || !visible || onToolPage) return null;

  return (
    <div
      className="taste-cta fixed bottom-5 z-40 ltr:right-5 rtl:left-5"
      // Fixed, so it is out of flow and cannot shift the page.
      data-testid="taste-card-cta"
    >
      <div className="relative">
        <Link
          to="/gamer-card"
          className="taste-cta-pulse inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Build your Taste Card
        </Link>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, "true");
            } catch {
              // Dismissal still holds for this render.
            }
          }}
          aria-label="Hide the Taste Card button"
          className="absolute -top-2 rounded-full border border-border bg-background p-1 text-muted-foreground shadow ltr:-right-2 rtl:-left-2"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
