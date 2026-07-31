import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Live AdSense publisher ID (script is loaded globally from the root <head>). */
export const AD_CLIENT = "ca-pub-6422431093727588";

export type AdsenseUnitProps = {
  /** Stable DOM id for the <ins> element. */
  id?: string;
  /** Ad unit / slot id. */
  slot?: string;
  format?: string;
  layout?: string;
  /** Reserved height so the unit never shifts layout before it fills. */
  minHeight?: number;
  /** Fluid units (in-article, multiplex) must be allowed to grow. */
  fluidHeight?: boolean;
  className?: string;
  /** Extra data-* attributes (geo targeting, etc). */
  extraAttrs?: Record<string, string>;
  /** ms to wait for a fill before collapsing the container. */
  collapseAfterMs?: number;
};

/**
 * Reusable Google AdSense unit.
 *
 * CLS contract:
 *  - the wrapper reserves `minHeight` from the very first (server) render, so a
 *    unit that later fills does NOT push content down;
 *  - a unit that never fills only collapses when it is *outside the viewport*,
 *    so reclaiming that space can never move anything the user is looking at.
 */
export function AdsenseUnit({
  id,
  slot,
  format = "auto",
  layout,
  minHeight = 100,
  fluidHeight = false,
  className = "",
  extraAttrs,
  collapseAfterMs = 2500,
}: AdsenseUnitProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const [filled, setFilled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const node = insRef.current;
    if (!node) return;
    let cancelled = false;

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      if (node.getAttribute("data-adsbygoogle-status") !== "done") {
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            if (cancelled) return;
            if (node.getAttribute("data-ad-status") === "filled" || node.firstElementChild) {
              setFilled(true);
            }
          })
        : null;
    observer?.observe(node, {
      attributes: true,
      childList: true,
      attributeFilter: ["data-ad-status"],
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [id, slot, pathname]);

  // Reclaim the reserved space only when nothing filled AND the box is off
  // screen — collapsing an on-screen box is exactly what causes layout shift.
  useEffect(() => {
    setCollapsed(false);
    const timer = window.setTimeout(() => {
      if (filled) return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const offScreen = r.bottom < 0 || r.top > window.innerHeight;
      if (offScreen) setCollapsed(true);
    }, collapseAfterMs);
    return () => window.clearTimeout(timer);
  }, [id, slot, pathname, collapseAfterMs, filled]);

  return (
    <div
      ref={wrapRef}
      className={`ad-container relative w-full overflow-hidden ${filled ? className : ""}`}
      style={
        collapsed
          ? { display: "none", height: 0, minHeight: 0, border: "none", background: "transparent" }
          : {
              // Space is reserved from the first render in every state, so a
              // late fill never moves the page.
              minHeight,
              contain: "layout",
              ...(filled
                ? { backgroundColor: "var(--ad-surface)" }
                : { background: "transparent", border: "none" }),
              ...(fluidHeight && filled ? { minHeight: undefined } : null),
            }
      }
      aria-label="advertisement"
      role="complementary"
      data-ad-filled={filled ? "true" : "false"}
      data-ad-collapsed={collapsed ? "true" : "false"}
    >
      <ins
        ref={insRef}
        id={id}
        className="adsbygoogle block w-full"
        style={{ display: "block", width: "100%", minHeight, background: "transparent" }}
        data-ad-client={AD_CLIENT}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
        {...extraAttrs}
      />
    </div>
  );
}
