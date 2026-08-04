import { useEffect } from "react";

type Tag = {
  id: string;
  src?: string;
  type?: string;
  inline?: string;
  crossOrigin?: string;
  attrs?: Record<string, string>;
};

const ADSENSE_TAG: Tag = {
  id: "adsense-lib",
  src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6422431093727588",
  crossOrigin: "anonymous",
};

const SUPPORT_TAGS: Tag[] = [
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

/**
 * Keep third-party work outside the critical rendering window. Analytics and
 * the lightweight beacon start on idle. AdSense starts after real engagement,
 * or after a 15-second fallback so an interested reader still sees ads without
 * ads competing with the article, LCP or the first interaction.
 */
export function DeferredScripts() {
  useEffect(() => {
    let disposed = false;
    let supportLoaded = false;
    let adsLoaded = false;

    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    const onIdle = (callback: () => void, timeout: number) => {
      const guarded = () => {
        if (!disposed) callback();
      };
      return idle ? idle(guarded, { timeout }) : window.setTimeout(guarded, Math.min(timeout, 250));
    };

    const loadSupport = () => {
      if (supportLoaded) return;
      supportLoaded = true;
      inject(SUPPORT_TAGS);
    };

    const loadAds = () => {
      if (adsLoaded) return;
      adsLoaded = true;
      inject([ADSENSE_TAG]);
    };

    const supportTimer = window.setTimeout(() => onIdle(loadSupport, 2500), 2500);
    const adsTimer = window.setTimeout(() => onIdle(loadAds, 2000), 15000);

    // An engaged visitor should not wait for the fallback. Scheduling on idle
    // keeps the interaction itself responsive while preserving ad impressions.
    const engage = () => onIdle(loadAds, 800);
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, engage, { once: true, passive: true }));

    return () => {
      disposed = true;
      window.clearTimeout(supportTimer);
      window.clearTimeout(adsTimer);
      events.forEach((event) => window.removeEventListener(event, engage));
    };
  }, []);

  return null;
}
