import { useEffect } from "react";

/**
 * No-popup ad policy (client-side).
 *
 * Monetization is strictly in-page: display, in-feed, in-article and video
 * units. Anything that leaves the page flow is blocked:
 *  - popups / popunders (`window.open` from third-party scripts)
 *  - full-screen interstitial or screen-hugging foreign overlays
 *  - push-notification permission prompts
 *  - deceptive creatives ("Your download is ready", fake virus alerts)
 *
 * AdSense in-page units and our own UI are never touched.
 */


/** Elements the app itself owns and must never be removed. */
const OWNED_SELECTOR =
  "[data-app-overlay], [data-radix-portal], [data-sonner-toaster], [data-ad-slot], ins.adsbygoogle";

/**
 * Text signatures of deceptive creatives. Matched case-insensitively against the
 * overlay's own text. Legitimate ad creatives never say these things in the
 * page's own DOM (real ads live inside cross-origin iframes we cannot read).
 */
const DECEPTIVE_PATTERNS: RegExp[] = [
  /your\s+download\s+(is\s+)?ready/i,
  /download\s+(is\s+)?ready/i,
  /(file|video)\s+is\s+ready/i,
  /click\s+(here\s+)?(to\s+)?(allow|continue|download)/i,
  /press\s+["“]?allow["”]?/i,
  /(your\s+)?(pc|device|phone|system)\s+is\s+infected/i,
  /virus\s+detected/i,
  /(win|won)\s+a\s+(free\s+)?(prize|iphone|gift)/i,
  /you\s+are\s+the\s+winner/i,
  /update\s+your\s+(flash|player|browser)/i,
];

/** Ad networks we intentionally run, including Monetag's vignette banner. */
const ALLOWED_AD_HOSTS = [
  "nap5k.com",
  "n6wxm.com",
  "thubanoa.com",
  "fpyf8.com",
  "monetag.com",
  "googlesyndication.com",
  "doubleclick.net",
];

/** True when the overlay is creative from one of our own configured networks. */
function isAllowedNetwork(el: HTMLElement): boolean {
  const nodes = [el, ...Array.from(el.querySelectorAll("iframe, img, a, script"))] as HTMLElement[];
  return nodes.some((n) => {
    const src = n.getAttribute?.("src") ?? n.getAttribute?.("href") ?? "";
    const id = n.id ?? "";
    return ALLOWED_AD_HOSTS.some((h) => src.includes(h)) || /monetag|vignette/i.test(id);
  });
}

/** True when the node lives outside the React app root (i.e. injected by a third party). */
function isForeign(el: HTMLElement): boolean {
  const appRoot = document.getElementById("root") ?? document.querySelector("main")?.parentElement;
  return !appRoot || !appRoot.contains(el);
}

/**
 * Intrusive overlay = third-party, visible, floating layer that either covers a
 * large share of the viewport (interstitial), hugs a viewport edge (floating
 * banner), or carries deceptive scam text. In-page AdSense units are never
 * positioned this way, so they are unaffected.
 */
function isIntrusiveOverlay(el: HTMLElement): boolean {
  if (el.closest(OWNED_SELECTOR)) return false;
  if (!isForeign(el)) return false;

  const style = window.getComputedStyle(el);
  if (style.position !== "fixed" && style.position !== "absolute") return false;
  if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") return false;

  const rect = el.getBoundingClientRect();
  if (rect.width < 80 || rect.height < 40) return false;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Full-screen / large interstitial.
  if (rect.width >= vw * 0.75 && rect.height >= vh * 0.6) return true;

  // Screen-hugging floating banner (anchored to an edge, fixed position).
  if (style.position === "fixed") {
    const hugsBottom = vh - rect.bottom <= 4;
    const hugsTop = rect.top <= 4;
    const wide = rect.width >= vw * 0.6;
    if (wide && (hugsBottom || hugsTop)) return true;
  }

  const text = (el.textContent ?? "").slice(0, 600);
  if (text.trim() && DECEPTIVE_PATTERNS.some((re) => re.test(text))) return true;

  return false;
}

export function enforceNonIntrusiveAds(): () => void {
  if (typeof window === "undefined") return () => {};

  // 1. Kill popups / popunders. The app never calls window.open itself, so any
  //    call is third-party ad code trying to open a new tab or window.
  const originalOpen = window.open;
  try {
    Object.defineProperty(window, "open", {
      configurable: true,
      writable: true,
      value: () => null,
    });
  } catch {
    /* locked down by the browser — nothing else to do */
  }

  // 2. Block push-notification permission prompts (a popup format, not in-page).
  const originalRequest = typeof Notification !== "undefined" ? Notification.requestPermission : undefined;
  if (originalRequest) {
    try {
      Notification.requestPermission = (() => Promise.resolve("denied")) as typeof Notification.requestPermission;
    } catch {
      /* ignore */
    }
  }

  // 3. Sweep intrusive overlays out of the DOM as they appear.
  const sweep = (root: ParentNode) => {
    root.querySelectorAll?.("body > div, body > iframe, body > section").forEach((node) => {
      const el = node as HTMLElement;
      if (isIntrusiveOverlay(el)) el.remove();
    });
  };

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (isIntrusiveOverlay(node)) {
          node.remove();
          return;
        }
        sweep(node);
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  sweep(document);

  return () => {
    observer.disconnect();
    try {
      Object.defineProperty(window, "open", { configurable: true, writable: true, value: originalOpen });
      if (originalRequest) Notification.requestPermission = originalRequest;
    } catch {
      /* ignore */
    }
  };
}

/** Mount once, at the app root. */
export function useNonIntrusiveAdPolicy() {
  useEffect(() => enforceNonIntrusiveAds(), []);
}
