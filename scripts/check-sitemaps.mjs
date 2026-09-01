import assert from 'node:assert/strict';

const origin = process.env.SITE_ORIGIN || 'https://gamecastle.store';
async function readXml(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Sitemap HTTP failure: ${url}`);
  assert.match(response.headers.get('content-type') || '', /xml/i, `Not XML: ${url}`);
  const text = await response.text();
  assert.ok(Buffer.byteLength(text) <= 50 * 1024 * 1024, `Sitemap too large: ${url}`);
  return text;
}
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));
const index = await readXml(`${origin}/sitemap.xml`);
assert.match(index, /<sitemapindex\b/);
const children = locations(index);
assert.ok(children.length > 0 && children.length <= 50000);
const all = new Set();
for (const child of children) {
  assert.equal(new URL(child).origin, origin);
  const xml = await readXml(child);
  assert.match(xml, /<urlset\b/);
  const urls = locations(xml);
  assert.ok(urls.length > 0 && urls.length <= 50000, `Invalid URL count: ${child}`);
  for (const url of urls) {
    assert.equal(new URL(url).origin, origin);
    assert.ok(!all.has(url), `Duplicate sitemap URL: ${url}`);
    all.add(url);
  }
}
console.log(`Verified ${children.length} sitemaps and ${all.size} unique URLs. Google indexing is not implied.`);
