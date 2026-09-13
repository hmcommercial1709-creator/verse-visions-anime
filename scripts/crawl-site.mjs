#!/usr/bin/env node
/**
 * Crawls the site the way Googlebot would and reports anything that stops a
 * page being indexed.
 *
 * scripts/check-sitemaps.mjs samples what the sitemaps advertise. This walks
 * the link graph instead: it starts at the homepage, robots.txt and the
 * sitemap index, and follows every internal link it finds, which is how a
 * crawler actually discovers pages and how orphans reveal themselves.
 *
 * It records, per URL: status, redirect target, canonical, robots directives
 * (meta and X-Robots-Tag), title, and which pages link to it. It then reports
 *
 *   - broken links (4xx/5xx) and who links to them
 *   - redirects that are linked to internally, which waste crawl budget
 *   - pages with no canonical, or more than one, or one pointing elsewhere
 *   - noindex on a page that is linked or advertised
 *   - sitemap URLs never reachable by following links (orphans)
 *   - pages with no outgoing internal links (dead ends)
 *
 *   SITE_ORIGIN  origin to crawl (default https://gamecastle.store)
 *   MAX_PAGES    safety ceiling (default 1500)
 *   CONCURRENCY  parallel requests (default 6)
 */

const origin = (process.env.SITE_ORIGIN || "https://gamecastle.store").replace(/\/$/, "");
const MAX_PAGES = Number(process.env.MAX_PAGES ?? 1500);
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 6);

const SKIP_EXT =
  /\.(png|jpe?g|webp|avif|gif|svg|ico|css|js|mjs|txt|json|xml|webmanifest|mp4|webm|pdf|zip)$/i;

/** @type {Map<string, {status:number, location:string|null, canonicals:string[], robots:string, title:string, links:string[], type:string}>} */
const pages = new Map();
/** @type {Map<string, Set<string>>} who links to a URL */
const inbound = new Map();
const queue = [];
const queued = new Set();

const norm = (u) => {
  try {
    const url = new URL(u, origin);
    if (url.origin !== origin) return null;
    url.hash = "";
    // Keep query strings: ?page=2 is a distinct page.
    let p = url.pathname.replace(/\/+$/, "") || "/";
    return p + (url.search || "");
  } catch {
    return null;
  }
};

const enqueue = (path, from) => {
  if (!path) return;
  if (from) {
    if (!inbound.has(path)) inbound.set(path, new Set());
    inbound.get(path).add(from);
  }
  if (queued.has(path)) return;
  if (SKIP_EXT.test(path.split("?")[0])) return;
  queued.add(path);
  queue.push(path);
};

async function visit(path) {
  let res;
  try {
    res = await fetch(origin + path, {
      redirect: "manual",
      headers: { "User-Agent": "GameCastleCrawler/1.0 (indexing audit)" },
      signal: AbortSignal.timeout(45000),
    });
  } catch (error) {
    pages.set(path, {
      status: 0,
      location: null,
      canonicals: [],
      robots: `fetch failed: ${error.message}`,
      title: "",
      links: [],
      type: "",
    });
    return;
  }

  const type = res.headers.get("content-type") || "";
  const record = {
    status: res.status,
    location: res.headers.get("location"),
    canonicals: [],
    robots: res.headers.get("x-robots-tag") || "",
    title: "",
    links: [],
    type,
  };
  pages.set(path, record);

  if (res.status >= 300 && res.status < 400 && record.location) {
    enqueue(norm(record.location), path);
    return;
  }
  if (res.status !== 200 || !/html/i.test(type)) return;

  const html = await res.text();
  record.title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim();
  record.canonicals = [
    ...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi),
  ].map((m) => m[1]);
  const meta = [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/gi)]
    .map((m) => m[1])
    .join("; ");
  record.robots = [record.robots, meta].filter(Boolean).join(" | ");

  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const target = norm(m[1]);
    if (!target) continue;
    record.links.push(target);
    enqueue(target, path);
  }
}

/* ------------------------------------------------------------------- seeds */

console.log(`Crawling ${origin}\n`);

// robots.txt first, as a crawler does, then the sitemaps it names.
const sitemapUrls = new Set();
try {
  const robots = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(20000) });
  if (robots.ok) {
    const text = await robots.text();
    if (/^\s*Disallow:\s*\/\s*$/im.test(text)) {
      console.error("  ✗ robots.txt disallows the whole site\n");
    }
    for (const m of text.matchAll(/^\s*Sitemap:\s*(\S+)/gim)) {
      // robots.txt names the production origin; when auditing a build served
      // somewhere else, follow the same path on the origin being crawled.
      try {
        sitemapUrls.add(origin + new URL(m[1]).pathname);
      } catch {
        sitemapUrls.add(m[1]);
      }
    }
  } else {
    console.log(`  robots.txt → HTTP ${robots.status}`);
  }
} catch {
  console.log("  robots.txt unreachable");
}
if (sitemapUrls.size === 0) sitemapUrls.add(`${origin}/sitemap.xml`);

// Every URL the sitemaps advertise, so orphans can be told from linked pages.
const advertised = new Set();
for (const sm of sitemapUrls) {
  try {
    const xml = await (await fetch(sm, { signal: AbortSignal.timeout(60000) })).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replaceAll("&amp;", "&"),
    );
    const children = /<sitemapindex/.test(xml) ? locs : [];
    for (const loc of children) {
      const childXml = await (await fetch(loc, { signal: AbortSignal.timeout(60000) })).text();
      for (const m of childXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const p = norm(m[1].replaceAll("&amp;", "&"));
        if (p) advertised.add(p);
      }
    }
    if (children.length === 0)
      for (const loc of locs) {
        const p = norm(loc);
        if (p) advertised.add(p);
      }
  } catch {
    console.log(`  could not read ${sm}`);
  }
}
console.log(`  ${advertised.size} URLs advertised in sitemaps`);

enqueue("/", null);
// LINKS_ONLY seeds from the homepage alone, which is the honest test of
// whether the link graph reaches everything: a page only the sitemap knows
// about is one Google will crawl rarely, if at all.
if (process.env.LINKS_ONLY !== "1") {
  for (const p of advertised) enqueue(p, null);
} else {
  console.log("  (links-only: sitemap URLs are not seeded, only compared against)");
}

/* ------------------------------------------------------------------- crawl */

let done = 0;
while (queue.length && done < MAX_PAGES) {
  const batch = queue.splice(0, CONCURRENCY).filter((p) => !pages.has(p));
  if (batch.length === 0) continue;
  await Promise.all(batch.map(visit));
  done += batch.length;
  if (done % 120 < CONCURRENCY) console.log(`  … ${done} pages, ${queue.length} queued`);
}
console.log(`\nCrawled ${pages.size} URLs (${queue.length} left unvisited)\n`);

/* ------------------------------------------------------------------ report */

const linkedFrom = (p) => [...(inbound.get(p) ?? [])].filter((x) => x !== p);
const problems = [];
const add = (kind, detail) => problems.push({ kind, detail });

const byStatus = new Map();
for (const [path, r] of pages) {
  byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);

  if (r.status === 0) add("unreachable", `${path} — ${r.robots}`);
  else if (r.status >= 400) {
    const from = linkedFrom(path);
    add(
      "broken",
      `${path} → ${r.status}` +
        (from.length ? `  ← linked from ${from.slice(0, 3).join(", ")}` : "  (not linked)"),
    );
  } else if (r.status >= 300) {
    const from = linkedFrom(path);
    if (from.length) {
      add(
        "redirect-linked",
        `${path} → ${r.status} → ${r.location}  ← linked from ${from.slice(0, 3).join(", ")}`,
      );
    }
    if (advertised.has(path)) add("redirect-in-sitemap", `${path} → ${r.status} → ${r.location}`);
  } else if (r.status === 200 && /html/i.test(r.type)) {
    if (/noindex/i.test(r.robots)) {
      if (advertised.has(path)) add("noindex-in-sitemap", `${path} — robots: ${r.robots}`);
    } else {
      if (r.canonicals.length > 1) {
        add("multi-canonical", `${path} — ${r.canonicals.length}: ${r.canonicals.join(", ")}`);
      } else if (r.canonicals.length === 1) {
        const c = norm(r.canonicals[0]);
        if (c && c !== path && advertised.has(path)) {
          add("canonical-elsewhere", `${path} — canonical → ${c}`);
        }
      } else if (advertised.has(path)) {
        add("no-canonical", path);
      }
    }
    if (!r.title) add("no-title", path);
    if (r.links.filter((l) => l !== path).length === 0) add("dead-end", path);
  }
}

for (const p of advertised) {
  if (!inbound.has(p) || linkedFrom(p).length === 0) {
    const r = pages.get(p);
    if (r && r.status === 200) add("orphan", p);
  }
}

console.log("Status codes:");
for (const [s, n] of [...byStatus].sort((a, b) => b[1] - a[1])) console.log(`  ${s}: ${n}`);

const grouped = new Map();
for (const { kind, detail } of problems) {
  if (!grouped.has(kind)) grouped.set(kind, []);
  grouped.get(kind).push(detail);
}

if (grouped.size === 0) {
  console.log("\nNo crawl blockers found.\n");
  process.exit(0);
}

console.log("");
let blocking = 0;
const SEVERITY = {
  unreachable: "BLOCKER",
  broken: "BLOCKER",
  "redirect-in-sitemap": "BLOCKER",
  "noindex-in-sitemap": "BLOCKER",
  "multi-canonical": "BLOCKER",
  "canonical-elsewhere": "BLOCKER",
  "redirect-linked": "waste",
  "no-canonical": "warn",
  "no-title": "warn",
  orphan: "warn",
  "dead-end": "warn",
};
for (const [kind, items] of [...grouped].sort((a, b) => b[1].length - a[1].length)) {
  const sev = SEVERITY[kind] ?? "warn";
  if (sev === "BLOCKER") blocking += items.length;
  console.log(`[${sev}] ${kind}: ${items.length}`);
  // Grouped by path prefix: 800 orphans under three prefixes is three missing
  // links, not 800 problems, and the grouping is what makes that visible.
  if (items.length > 12) {
    const byPrefix = new Map();
    for (const d of items) {
      const prefix = (d.match(/^\/[^/\s]*(\/[^/\s]*)?/)?.[0] ?? d).replace(/\?.*/, "");
      byPrefix.set(prefix, (byPrefix.get(prefix) ?? 0) + 1);
    }
    for (const [prefix, n] of [...byPrefix].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
      console.log(`    ${prefix}…  × ${n}`);
    }
    console.log(`    e.g. ${items[0]}`);
  } else {
    for (const d of items) console.log(`    ${d}`);
  }
}

console.log(`\n${blocking} blocking issue(s).\n`);
process.exit(blocking > 0 ? 1 : 0);
