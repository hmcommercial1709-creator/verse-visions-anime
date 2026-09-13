/**
 * Validates the live sitemaps, and the pages they advertise.
 *
 * The structural half (index parses, children parse, counts and sizes are
 * within spec, no duplicate or cross-origin URLs) was always here. The rest is
 * new, because every indexing failure this site has actually hit passed the
 * structural checks and still could not be indexed:
 *
 *   - sitemap-codes-1.xml returned an error while codes-2 succeeded, because
 *     the larger partition exhausted the Worker.
 *   - Every /codes/ URL 404'd: the sitemap advertised a path no route served.
 *   - A third of the URLs 307'd to ?page=1, which Google files as "Page with
 *     redirect" and does not index.
 *   - Every /anime/ child page carried two conflicting <link rel="canonical">,
 *     and Google ignores canonicals entirely when they conflict.
 *
 * So a sitemap being well-formed proves very little. This now samples the URLs
 * inside each sitemap and checks what a crawler would actually find: a 200,
 * exactly one canonical, and nothing asking it not to index the page.
 *
 * Failures are collected rather than thrown on first sight, so one run reports
 * everything that is wrong.
 *
 *   SITE_ORIGIN     origin to check (default https://gamecastle.store)
 *   SAMPLE_PER_MAP  URLs sampled per child sitemap (default 5, 0 disables)
 */

const origin = (process.env.SITE_ORIGIN || "https://gamecastle.store").replace(/\/$/, "");
const SAMPLE_PER_MAP = Number(process.env.SAMPLE_PER_MAP ?? 5);
const MAX_URLS_PER_SITEMAP = 50000;
const MAX_BYTES = 50 * 1024 * 1024;

const failures = [];
const notes = [];
const fail = (message) => failures.push(message);

async function get(url, { redirect = "manual" } = {}) {
  const response = await fetch(url, { redirect, signal: AbortSignal.timeout(60000) });
  return response;
}

async function readXml(url) {
  const response = await get(url);
  if (response.status !== 200) {
    // A redirect here is its own problem: Google follows it but reports the
    // sitemap at the submitted URL as an error.
    const where = response.headers.get("location");
    fail(`${url} → HTTP ${response.status}${where ? ` (→ ${where})` : ""}, expected 200`);
    return null;
  }
  if (!/xml/i.test(response.headers.get("content-type") || "")) {
    fail(`${url} → content-type is not XML (${response.headers.get("content-type")})`);
    return null;
  }
  const text = await response.text();
  if (Buffer.byteLength(text) > MAX_BYTES) {
    fail(`${url} → larger than 50MB`);
    return null;
  }
  return text;
}

const locations = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">"),
  );

/** Deterministic spread so the same URLs are sampled run to run. */
function sample(urls, n) {
  if (n <= 0 || urls.length === 0) return [];
  if (urls.length <= n) return [...urls];
  const step = (urls.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => urls[Math.round(i * step)]);
}

/** What a crawler finds at a URL the sitemap advertises. */
async function checkPage(url) {
  let response;
  try {
    response = await get(url);
  } catch (error) {
    fail(`${url} → request failed: ${error.message}`);
    return;
  }

  if (response.status !== 200) {
    const where = response.headers.get("location");
    fail(
      `${url} → HTTP ${response.status}${where ? ` (→ ${where})` : ""}` +
        (response.status >= 300 && response.status < 400
          ? " — a sitemap must list the final URL, not one that redirects"
          : ""),
    );
    return;
  }

  // X-Robots-Tag outranks the meta tag and is easy to set by accident at the
  // CDN, so check the header before reading the body.
  const headerRobots = response.headers.get("x-robots-tag") || "";
  if (/noindex/i.test(headerRobots)) {
    fail(`${url} → X-Robots-Tag says noindex ("${headerRobots}")`);
  }

  const html = await response.text();

  const metaRobots = [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*>/gi)].map((m) => m[0]);
  if (metaRobots.some((tag) => /noindex/i.test(tag))) {
    fail(`${url} → page carries <meta name="robots" ... noindex>`);
  }

  const canonicals = [
    ...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi),
  ].map((m) => m[1]);

  if (canonicals.length === 0) {
    notes.push(`${url} → no canonical (Google will self-canonicalise; usually fine)`);
  } else if (canonicals.length > 1) {
    // The failure mode that cost this site 148 pages: conflicting canonicals
    // make Google discard all of them.
    fail(
      `${url} → ${canonicals.length} canonical tags (${canonicals.join(", ")}) — Google ignores all of them when they conflict`,
    );
  } else if (canonicals[0] !== url) {
    // Pointing elsewhere is legitimate, but then the sitemap should list the
    // target instead: Google will not index a URL that disowns itself.
    fail(
      `${url} → canonical points at ${canonicals[0]}, so this URL will not be indexed; list the canonical in the sitemap instead`,
    );
  }
}

/* ------------------------------------------------------------------- run */

console.log(`Checking ${origin}\n`);

const indexXml = await readXml(`${origin}/sitemap.xml`);
if (!indexXml) {
  console.error("\nThe sitemap index itself is unreachable; nothing else could be checked.\n");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
if (!/<sitemapindex\b/.test(indexXml)) fail(`${origin}/sitemap.xml is not a <sitemapindex>`);

const children = locations(indexXml);
if (children.length === 0) fail("the sitemap index lists no child sitemaps");

const allUrls = new Set();
let sampled = 0;

for (const child of children) {
  if (new URL(child).origin !== origin) {
    fail(`${child} → child sitemap is on another origin`);
    continue;
  }

  const xml = await readXml(child);
  if (!xml) continue;
  if (!/<urlset\b/.test(xml)) {
    fail(`${child} → not a <urlset>`);
    continue;
  }

  const urls = locations(xml);
  if (urls.length === 0) {
    fail(`${child} → contains no URLs`);
    continue;
  }
  if (urls.length > MAX_URLS_PER_SITEMAP) {
    fail(`${child} → ${urls.length} URLs, over the 50,000 limit`);
  }

  let offOrigin = 0;
  let duplicates = 0;
  for (const url of urls) {
    if (new URL(url).origin !== origin) offOrigin++;
    if (allUrls.has(url)) duplicates++;
    allUrls.add(url);
  }
  if (offOrigin) fail(`${child} → ${offOrigin} URL(s) on another origin`);
  if (duplicates) fail(`${child} → ${duplicates} URL(s) also listed in another sitemap`);

  const picked = sample(urls, SAMPLE_PER_MAP);
  for (const url of picked) await checkPage(url);
  sampled += picked.length;

  console.log(`  ${child.replace(origin, "")} — ${urls.length} URLs, ${picked.length} sampled`);
}

console.log(
  `\n${children.length} sitemaps · ${allUrls.size} unique URLs · ${sampled} pages fetched`,
);

if (notes.length) {
  console.log("\nNotes:");
  for (const n of notes.slice(0, 10)) console.log(`  · ${n}`);
  if (notes.length > 10) console.log(`  · … and ${notes.length - 10} more`);
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s) that would stop Google indexing these URLs:\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error("");
  process.exit(1);
}

console.log("\nNo indexing blockers found. (Indexing itself is still Google's call.)\n");
