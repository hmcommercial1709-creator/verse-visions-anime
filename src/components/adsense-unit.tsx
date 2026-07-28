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
 * - renders a single responsive `<ins class="adsbygoogle">`
 * - pushes to `window.adsbygoogle` on mount and on every route change
 * - collapses itself (`display: none`) when Google returns no ad, so the page
 *   never shows an empty dark box
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
  collapseAfterMs = 2000,
}: AdsenseUnitProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const [filled, setFilled] = useState(false);
  const [expired, setExpired] = useState(false);
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

  // Collapse entirely when nothing fills: no border, no background, no height.
  useEffect(() => {
    setExpired(false);
    const timer = window.setTimeout(() => setExpired(true), collapseAfterMs);
    return () => window.clearTimeout(timer);
  }, [id, slot, pathname, collapseAfterMs]);

  const collapsed = expired && !filled;

  return (
    <div
      className={`relative w-full overflow-hidden ${filled ? `bg-ad-surface ${className}` : ""}`}
      style={
        collapsed
          ? { display: "none" }
          : filled
            ? fluidHeight
              ? { minHeight, contain: "layout", backgroundColor: "var(--ad-surface)" }
              : { minHeight, height: minHeight, contain: "layout size", backgroundColor: "var(--ad-surface)" }
            : {
                minHeight,
                height: fluidHeight ? undefined : minHeight,
                contain: "layout",
                background: "transparent",
                border: "none",
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
        style={{ display: "block", width: "100%", ...(fluidHeight ? {} : { height: "100%" }) }}
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
