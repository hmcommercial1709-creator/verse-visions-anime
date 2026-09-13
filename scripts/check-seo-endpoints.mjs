import assert from "node:assert/strict";

const origin = process.env.SITE_ORIGIN || "https://gamecastle.store";
// A floor, not a target: this exists to catch the catalog silently emptying —
// a broken RLS grant, a failed read, a truncated table — not to assert a size.
// It was set to 80,000 when game_nexus_matrix holds 50,000 (25,000 in each of
// the two codes sitemaps), so it could never pass and would have failed the
// moment the checks ahead of it stopped failing first.
const minimumProgrammaticRecords = Number(process.env.MIN_PROGRAMMATIC_RECORDS || 10000);

async function read(path, contentType) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  assert.match(
    response.headers.get("content-type") || "",
    new RegExp(contentType, "i"),
    `${path} has an invalid content type`,
  );
  assert.match(
    response.headers.get("cache-control") || "",
    /s-maxage=/i,
    `${path} is missing edge caching`,
  );
  return response.text();
}

const llms = await read("/llms.txt", "text/plain");
assert.match(llms, /\/ai-index\.json/);
assert.match(llms, /\/sitemap\.xml/);

const feed = await read("/rss.xml", "application/rss\\+xml");
assert.match(feed, /<rss\b/);
assert.match(feed, /xmlns:atom=/);
assert.match(feed, /<item>/);

const sitemap = await read("/sitemap.xml", "application/xml");
assert.match(sitemap, /<sitemapindex\b/);
assert.ok((sitemap.match(/<sitemap>/g) || []).length >= 2);

// /browse lists every covered series on one page — it has no pagination, and
// with 23 of them it does not need any. This used to assert a paginated
// design that no longer exists, which is why it failed on text the page has
// never rendered. What matters for indexing is that the page answers, is
// cached at the edge (read() checks both), renders its heading, and links
// into the series pages.
const browsePage = await read("/browse", "text/html");
assert.match(browsePage, /Browse all anime/i);
assert.match(browsePage, /href="\/anime\/[a-z0-9-]+"/);

// A stray ?page= must not fork the page into a duplicate: it should still
// answer 200 and point its canonical back at /browse.
const browseParam = await read("/browse?page=2", "text/html");
assert.match(
  browseParam,
  /<link rel="canonical" href="[^"]*\/browse"/,
  "/browse?page=2 must canonicalise to /browse",
);

const aiIndex = JSON.parse(await read("/ai-index.json", "application/json"));
assert.equal(aiIndex.schema_version, "1.0");
assert.equal(aiIndex.publisher.url, origin);
assert.ok(Array.isArray(aiIndex.entities.anime));
assert.ok(Array.isArray(aiIndex.entities.articles));
assert.ok(Array.isArray(aiIndex.entities.code_catalog));
assert.ok(
  aiIndex.pagination.code_catalog_total >= minimumProgrammaticRecords,
  `Expected at least ${minimumProgrammaticRecords} programmatic records, found ${aiIndex.pagination.code_catalog_total}`,
);
assert.ok(aiIndex.pagination.code_catalog_total >= aiIndex.entities.code_catalog.length);
assert.match(aiIndex.pagination.page_url_template, /\/codes\?page=\{page\}/);

console.log(
  `Verified AI manifests at ${origin}: ${aiIndex.entities.code_catalog.length} quality-gated catalog entities.`,
);
