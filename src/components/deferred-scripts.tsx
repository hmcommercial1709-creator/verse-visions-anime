import { useEffect } from "react";

type Tag = {
  id: string;
  src?: string;
  type?: string;
  inline?: string;
  crossOrigin?: string;
  attrs?: Record<string, string>;
};

const THIRD_PARTY_TAGS: Tag[] = [
  { id: "ga4-lib", src: "https://www.googletagmanager.com/gtag/js?id=G-LETSF76JTN" },
  {
    id: "ga4-init",
    inline:
      "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-LETSF76JTN');",
  },

  // NOTE: no Monetag in-page push / vignette / popunder zones. The homepage
  // must be free of overlay and interstitial formats — display units only.

  {
    id: "cf-beacon",
    type: "module",
    src: "https://static.cloudflareinsights.com/beacon.min.js",
    attrs: { "data-cf-beacon": '{"token": "c56a7a14c83d442c9d5e830751558e64"}' },
  },
  {
    id: "adsense-lib",
    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6422431093727588",
    crossOrigin: "anonymous",
  },
];

function inject(tags: Tag[]) {
  for (const tag of tags) {
    if (document.getElementById(tag.id)) continue;
    const el = document.createElement("script");
    el.id = tag.id;
    if (tag.type) el.type = tag.type;
    if (tag.crossOrigin) el.crossOrigin = tag.crossOrigin;
    if (tag.src) {
      el.src = tag.src;
      el.async = true;
    }
    if (tag.inline) el.text = tag.inline;
    for (const [k, v] of Object.entries(tag.attrs ?? {})) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
}

function tagsForCurrentPage() {
  const path = window.location.pathname.replace(/\/$/, "");
  const isDownloadExperience =
    path === "/resources" ||
    path === "/rewards/anime-wallpapers" ||
    path === "/ar/rewards/anime-wallpapers";

  // Download/reward pages promise immediate access. Loading AdSense here can
  // activate an account-level offerwall that obscures language and download
  // controls, so retain analytics while excluding only the ad library.
  return isDownloadExperience
    ? THIRD_PARTY_TAGS.filter((tag) => tag.id !== "adsense-lib")
    : THIRD_PARTY_TAGS;
}

/**
 * Keep all non-essential third-party work outside the critical rendering
 * window. Engaged readers get analytics, the beacon and AdSense immediately on
 * idle; a 15-second fallback still loads them for readers who begin by reading
 * without touching the page.
 */
export function DeferredScripts() {
  useEffect(() => {
    let disposed = false;
    let loaded = false;

    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    const load = () => {
      if (disposed || loaded) return;
      loaded = true;
      inject(tagsForCurrentPage());
    };

    const onIdle = (timeout: number) => {
      const guarded = () => {
        if (!disposed) load();
      };
      return idle ? idle(guarded, { timeout }) : window.setTimeout(guarded, Math.min(timeout, 250));
    };

    const fallbackTimer = window.setTimeout(() => onIdle(2000), 15000);

    // An engaged visitor should not wait for the fallback. Scheduling on idle
    // keeps the interaction itself responsive while preserving ad impressions.
    const engage = () => onIdle(800);
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((event) => window.addEventListener(event, engage, { once: true, passive: true }));

    return () => {
      disposed = true;
      window.clearTimeout(fallbackTimer);
      events.forEach((event) => window.removeEventListener(event, engage));
    };
  }, []);

  return null;
}
