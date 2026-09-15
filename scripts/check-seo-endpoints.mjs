import assert from "node:assert/strict";

const origin = process.env.SITE_ORIGIN || "https://gamecastle.store";

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
// These three assertions were the exact inverse: they REQUIRED /ai-index.json
// to publish a code catalog and to advertise a paginated walk through at
// least 10,000 of its entries. Every one of those entries was manufactured by
// scripts/master-neural-core.mjs — invented ratings, invented review counts,
// four review sentences shared across 50,000 pages — so the check was
// enforcing the site's biggest indexing problem as a requirement.
assert.equal(aiIndex.entities.code_catalog, undefined, "must not list fabricated entities");
assert.equal(aiIndex.indexes.code_catalog, undefined, "must not link a code catalog");
assert.equal(aiIndex.pagination, undefined, "must not advertise a paginated code catalog");

console.log(
  `Verified AI manifests at ${origin}: ${aiIndex.entities.anime.length} anime, ` +
    `${aiIndex.entities.articles.length} articles, no fabricated entities.`,
);
