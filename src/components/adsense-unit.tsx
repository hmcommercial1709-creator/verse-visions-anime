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
    const wrapper = wrapRef.current;
    if (!node || !wrapper) return;
    let cancelled = false;
    let pushed = false;
    let frame = 0;

    const pushWhenSized = () => {
      if (
        cancelled ||
        pushed ||
        node.getAttribute("data-adsbygoogle-status") === "done"
      )
        return;

      const rect = wrapper.getBoundingClientRect();
      const style = window.getComputedStyle(wrapper);
      const hasUsableWidth =
        wrapper.isConnected &&
        rect.width >= 250 &&
        node.getBoundingClientRect().width >= 250 &&
        style.display !== "none" &&
        style.visibility !== "hidden";
      if (!hasUsableWidth) return;

      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
        pushed = true;
      } catch (error) {
        console.error("AdSense push error:", error);
      }
    };

    const schedulePush = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(pushWhenSized);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedulePush)
        : null;
    resizeObserver?.observe(wrapper);
    window.addEventListener("resize", schedulePush, { passive: true });
    schedulePush();

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            if (cancelled) return;
            const status = node.getAttribute("data-ad-status");
            if (status === "filled") setFilled(true);
            if (status === "unfilled") setFilled(false);
          })
        : null;
    observer?.observe(node, {
      attributes: true,
      childList: true,
      attributeFilter: ["data-ad-status"],
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", schedulePush);
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
          ? {
              display: "none",
              height: 0,
              minHeight: 0,
              border: "none",
              background: "transparent",
            }
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
        style={{
          display: "block",
          width: "100%",
          // A fixed height on the <ins> makes Google pick a creative that fits
          // the reserved box, instead of resizing the box after the fact.
          ...(fluidHeight ? { minHeight } : { height: minHeight }),
          background: "transparent",
        }}
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
