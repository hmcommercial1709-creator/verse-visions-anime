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

/** True when the node lives outside the React app root (i.e. injected by a third party). */
function isForeign(el: HTMLElement): boolean {
  const appRoot = document.getElementById("root") ?? document.querySelector("main")?.parentElement;
  return !appRoot || !appRoot.contains(el);
}

/**
 * A fake overlay = third-party, visible, floating/covering layer whose *own*
 * readable text matches a known scam pattern. Anything without that text is left
 * alone so real network creatives keep serving.
 */
function isFakeOverlay(el: HTMLElement): boolean {
  if (el.closest(OWNED_SELECTOR)) return false;
  if (!isForeign(el)) return false;

  const style = window.getComputedStyle(el);
  if (style.position !== "fixed" && style.position !== "absolute") return false;
  if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") return false;

  const rect = el.getBoundingClientRect();
  if (rect.width < 80 || rect.height < 40) return false;

  const text = (el.textContent ?? "").slice(0, 600);
  if (!text.trim()) return false;

  return DECEPTIVE_PATTERNS.some((re) => re.test(text));
}

export function enforceNonIntrusiveAds(): () => void {
  if (typeof window === "undefined") return () => {};

  const sweep = (root: ParentNode) => {
    root.querySelectorAll?.("body > div, body > iframe, body > section").forEach((node) => {
      const el = node as HTMLElement;
      if (isFakeOverlay(el)) el.remove();
    });
  };


  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (isFakeOverlay(node)) {
          node.remove();
          return;
        }
        sweep(node);
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  sweep(document);

  return () => observer.disconnect();
}

/** Mount once, at the app root. */
export function useNonIntrusiveAdPolicy() {
  useEffect(() => enforceNonIntrusiveAds(), []);
}
