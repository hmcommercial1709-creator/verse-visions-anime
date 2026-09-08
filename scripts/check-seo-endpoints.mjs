import assert from "node:assert/strict";

const origin = process.env.SITE_ORIGIN || "https://gamecastle.store";
const minimumProgrammaticRecords = Number(process.env.MIN_PROGRAMMATIC_RECORDS || 80000);

async function read(path, contentType) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  assert.match(response.headers.get("content-type") || "", new RegExp(contentType, "i"), `${path} has an invalid content type`);
  assert.match(response.headers.get("cache-control") || "", /s-maxage=/i, `${path} is missing edge caching`);
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

const browsePage = await read("/browse?page=2", "text/html");
assert.match(browsePage, /Full anime catalog/);
assert.match(browsePage, /browse\?page=3|browse\?page=1/);

const aiIndex = JSON.parse(await read("/ai-index.json", "application/json"));
assert.equal(aiIndex.schema_version, "1.0");
assert.equal(aiIndex.publisher.url, origin);
assert.ok(Array.isArray(aiIndex.entities.anime));
assert.ok(Array.isArray(aiIndex.entities.articles));
assert.ok(Array.isArray(aiIndex.entities.code_catalog));
assert.ok(aiIndex.pagination.code_catalog_total >= minimumProgrammaticRecords, `Expected at least ${minimumProgrammaticRecords} programmatic records, found ${aiIndex.pagination.code_catalog_total}`);
assert.ok(aiIndex.pagination.code_catalog_total >= aiIndex.entities.code_catalog.length);
assert.match(aiIndex.pagination.page_url_template, /\/en\/codes\?page=\{page\}/);

console.log(`Verified AI manifests at ${origin}: ${aiIndex.entities.code_catalog.length} quality-gated catalog entities.`);