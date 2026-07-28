import { useEffect } from "react";

type Tag = {
  id: string;
  src?: string;
  type?: string;
  inline?: string;
  crossOrigin?: string;
  attrs?: Record<string, string>;
};

/**
 * Third-party tags (analytics, ads) are injected after the page is interactive
 * instead of blocking the critical path. They contribute nothing to first
 * paint, so loading them on idle keeps LCP and TBT low without losing data.
 */
const TAGS: Tag[] = [
  { id: "ga4-lib", src: "https://www.googletagmanager.com/gtag/js?id=G-LETSF76JTN" },
  {
    id: "ga4-init",
    inline:
      "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-LETSF76JTN');",
  },
  // NOTE: the AdSense loader is intentionally NOT here — it ships in the
  // document head (src/routes/__root.tsx) so Auto Ads can run on every page.

  // Monetag global tags. Load once, site-wide, so the network can serve
  // immediately without waiting on custom wrappers. In-page push + vignette
  // banner zones only — no popunder / OnClick zones.
  { id: "monetag-inpage", src: "https://thubanoa.com/1?z=11410811" },
  {
    id: "monetag-inpage-11443705",
    src: "https://nap5k.com/tag.min.js",
    attrs: { "data-zone": "11443705" },
  },
  {
    id: "monetag-vignette-11443723",
    src: "https://n6wxm.com/vignette.min.js",
    attrs: { "data-zone": "11443723" },
  },



  {
    id: "cf-beacon",
    type: "module",
    src: "https://static.cloudflareinsights.com/beacon.min.js",
    attrs: { "data-cf-beacon": '{"token": "c56a7a14c83d442c9d5e830751558e64"}' },
  },
];


function injectAll() {
  for (const tag of TAGS) {
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

export function DeferredScripts() {
  useEffect(() => {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      injectAll();
    };

    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    const timer = window.setTimeout(() => (idle ? idle(run, { timeout: 3000 }) : run()), 1500);
    // Any real interaction means the user is engaged — load immediately.
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll"];
    events.forEach((e) => window.addEventListener(e, run, { once: true, passive: true }));

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, run));
    };
  }, []);

  return null;
}
