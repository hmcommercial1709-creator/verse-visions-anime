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

  // Monetag global overlay formats. Loaded EXACTLY ONCE site-wide (id-guarded
  // in injectAll) so the "Download is ready" widgets never stack.
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
  // NOTE: no OnClick/popunder zone here on purpose — the anti-intrusive policy
  // blocks window.open, so popunder formats stay off the site.





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

    // Third-party tags are the single biggest source of main-thread blocking,
    // so they are always injected from an idle callback and never synchronously
    // inside an input/scroll handler (that is exactly what wrecks INP).
    const schedule = () => (idle ? idle(run, { timeout: 4000 }) : window.setTimeout(run, 200));
    const timer = window.setTimeout(schedule, 2500);
    // Real engagement pulls them in sooner — but still via idle, never inline.
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown"];
    events.forEach((e) => window.addEventListener(e, schedule, { once: true, passive: true }));

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, schedule));
    };
  }, []);

  return null;
}
