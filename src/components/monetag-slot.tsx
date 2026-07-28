import { useEffect, useRef, useState } from "react";

/**
 * Monetag in-page banner / native / in-feed container.
 *
 * Loads the zone's tag INSIDE this element (never at document level), so the
 * creative is bound to a fixed, reserved box — no popunders, no overlays, no
 * layout shift. Popunder / OnClick / Vignette zones must never be passed here.
 */
export function MonetagSlot({
  zone,
  minHeight = 250,
  label,
  className = "",
  /** Companion mode: take no space (and show no label) until the zone fills. */
  collapseUntilFilled = false,
}: {
  zone: string;
  minHeight?: number;
  label?: string;
  className?: string;
  collapseUntilFilled?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = `https://fpyf8.com/88/tag.min.js`;
    script.setAttribute("data-zone", zone);
    // In-page mode: the tag renders into this container instead of the page.
    script.setAttribute("data-sdk", `show_${zone}`);
    host.appendChild(script);

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            if (host.querySelector("iframe, img, ins, a")) setFilled(true);
          })
        : null;
    observer?.observe(host, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      host.innerHTML = "";
    };
  }, [zone]);

  // Collapse (display:none) when nothing renders within 2s.
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    setExpired(false);
    const timer = window.setTimeout(() => setExpired(true), 2000);
    return () => window.clearTimeout(timer);
  }, [zone]);

  const collapsed = (collapseUntilFilled || expired) && !filled;

  return (
    <div
      className={`relative w-full overflow-hidden ${filled ? `bg-ad-surface ${className}` : ""}`}
      style={
        collapsed
          ? { display: "none" }
          : {
              minHeight: filled ? minHeight : 0,
              contain: "layout",
              background: filled ? "var(--ad-surface)" : "transparent",
            }
      }
      aria-label="advertisement"
      role="complementary"
      data-monetag-zone={zone}
      data-monetag-filled={filled ? "true" : "false"}
    >
      <div ref={hostRef} className="w-full" />
    </div>
  );
}

