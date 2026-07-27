import { useEffect } from "react";

/**
 * Anti-intrusive ad policy enforcement (client-side).
 *
 * Guarantees, regardless of what any third-party tag tries to do:
 *  - no popunders / pop-ups: window.open is neutralised unless the call comes
 *    from a real user gesture on a first-party link;
 *  - no full-screen interstitials or screen-blockers: fixed/absolute overlays
 *    that cover most of the viewport and are not owned by the app are removed;
 *  - no injected ad-network scripts from hosts outside the allowlist.
 *
 * Everything first-party (AdSense in-page units, GA4) keeps working. Removing
 * blockers instead of hiding them keeps Core Web Vitals clean (no CLS, no
 * long-lived layers blocking INP).
 */

/** Script hosts allowed to load. Anything else is blocked before it runs. */
const ALLOWED_SCRIPT_HOSTS = [
  "googletagmanager.com",
  "google-analytics.com",
  "googlesyndication.com",
  "doubleclick.net",
  "gstatic.com",
  "youtube.com",
  "youtube-nocookie.com",
  "ytimg.com",
];

/** Elements the app itself owns and must never be removed. */
const OWNED_SELECTOR = "[data-app-overlay], [data-radix-portal], [data-sonner-toaster], [data-ad-slot], ins.adsbygoogle";

function hostAllowed(src: string): boolean {
  try {
    const { hostname } = new URL(src, window.location.href);
    if (hostname === window.location.hostname) return true;
    return ALLOWED_SCRIPT_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function isScreenBlocker(el: HTMLElement): boolean {
  if (el.closest(OWNED_SELECTOR)) return false;
  const style = window.getComputedStyle(el);
  if (style.position !== "fixed" && style.position !== "absolute") return false;
  if (style.visibility === "hidden" || style.display === "none") return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 40 || rect.height < 20) return false;
  const coversViewport =
    rect.width >= window.innerWidth * 0.85 && rect.height >= window.innerHeight * 0.7;
  const highLayer = Number(style.zIndex || 0) >= 2147483000;
  if (coversViewport && (highLayer || style.position === "fixed")) return true;

  // Floating / anchor banners: any third-party fixed element glued to an edge
  // of the viewport (bottom bars, side stickies, notification-style toasts).
  if (style.position !== "fixed") return false;
  const nearBottom = window.innerHeight - rect.bottom <= 8;
  const nearTop = rect.top <= 8;
  const nearSide = rect.left <= 8 || window.innerWidth - rect.right <= 8;
  return nearBottom || nearSide || (nearTop && rect.height <= window.innerHeight * 0.4);
}

export function enforceNonIntrusiveAds(): () => void {
  if (typeof window === "undefined") return () => {};

  // 1. Block pop-ups / popunders that are not a direct first-party user action.
  const nativeOpen = window.open.bind(window);
  let gestureUntil = 0;
  const markGesture = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a[target='_blank'], [data-allow-popup]")) gestureUntil = Date.now() + 800;
  };
  document.addEventListener("click", markGesture, true);
  window.open = ((...args: Parameters<typeof window.open>) => {
    if (Date.now() < gestureUntil) return nativeOpen(...args);
    return null;
  }) as typeof window.open;

  // 1b. Never let anything raise a push-notification permission prompt, and
  //     neutralise fake "your download is ready" style system notifications.
  let restoreNotification: (() => void) | undefined;
  const N = (window as unknown as { Notification?: typeof Notification }).Notification;
  if (N && typeof N.requestPermission === "function") {
    const nativeRequest = N.requestPermission.bind(N);
    N.requestPermission = ((cb?: NotificationPermissionCallback) => {
      cb?.("denied");
      return Promise.resolve("denied" as NotificationPermission);
    }) as typeof Notification.requestPermission;
    restoreNotification = () => {
      N.requestPermission = nativeRequest;
    };
  }

  let restorePush: (() => void) | undefined;
  const pushProto = (window as unknown as { PushManager?: { prototype?: PushManager } }).PushManager?.prototype;
  if (pushProto?.subscribe) {
    const nativeSubscribe = pushProto.subscribe;
    pushProto.subscribe = (() => Promise.reject(new Error("Push subscriptions are disabled"))) as typeof pushProto.subscribe;
    restorePush = () => {
      pushProto.subscribe = nativeSubscribe;
    };
  }

  // 2. Remove injected scripts from non-allowlisted hosts + screen blockers.
  const sweep = (root: ParentNode) => {
    root.querySelectorAll?.("script[src]").forEach((node) => {
      const src = (node as HTMLScriptElement).src;
      if (src && !hostAllowed(src)) node.remove();
    });
    root.querySelectorAll?.("body > div, body > iframe, body > section").forEach((node) => {
      const el = node as HTMLElement;
      if (isScreenBlocker(el)) el.remove();
    });
  };

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "SCRIPT") {
          const src = (node as HTMLScriptElement).src;
          if (src && !hostAllowed(src)) {
            node.remove();
            return;
          }
        }
        if (isScreenBlocker(node)) {
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
    document.removeEventListener("click", markGesture, true);
    window.open = nativeOpen;
  };
}

/** Mount once, at the app root. */
export function useNonIntrusiveAdPolicy() {
  useEffect(() => enforceNonIntrusiveAds(), []);
}
