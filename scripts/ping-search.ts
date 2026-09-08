import fetch from "node-fetch";

const SITE_ORIGIN = "https://gamecastle.store";
const SITEMAP_INDEX = `${SITE_ORIGIN}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10_000;
const MAX_ATTEMPTS = 4;

function extractLocations(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
}

function documentType(xml: string): "index" | "urlset" {
  if (/<sitemapindex\b/.test(xml)) return "index";
  if (/<urlset\b/.test(xml)) return "urlset";
  throw new Error("Response is not a sitemap index or URL set");
}

async function fetchSitemap(url: string): Promise<string> {
  const response = await fetch(url, { headers: { accept: "application/xml" } });
  if (!response.ok) throw new Error(`Sitemap fetch failed (${response.status}): ${url}`);
  return response.text();
}

async function discoverUrls(): Promise<string[]> {
  const indexXml = await fetchSitemap(SITEMAP_INDEX);
  if (documentType(indexXml) !== "index") throw new Error("The sitemap endpoint is not a sitemap index");
  const childSitemaps = extractLocations(indexXml).filter((url) => new URL(url).origin === SITE_ORIGIN);
  const urls = new Set<string>();
  for (const childUrl of childSitemaps) {
    const childXml = await fetchSitemap(childUrl);
    if (documentType(childXml) !== "urlset") continue;
    for (const url of extractLocations(childXml)) if (new URL(url).origin === SITE_ORIGIN) urls.add(url);
  }
  return [...urls];
}

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function submitBatch(key: string, urlList: string[], batchNumber: number, totalBatches: number): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(SITE_ORIGIN).host, key, keyLocation: `${SITE_ORIGIN}/${key}.txt`, urlList }),
    });
    if (response.ok || response.status === 202) {
      console.log(`IndexNow batch ${batchNumber}/${totalBatches} accepted (${urlList.length} URLs, HTTP ${response.status}).`);
      return;
    }
    if (!isRetryable(response.status) || attempt === MAX_ATTEMPTS) {
      throw new Error(`IndexNow batch ${batchNumber} failed (HTTP ${response.status}): ${(await response.text()).slice(0, 300)}`);
    }
    const delay = 2 ** (attempt - 1) * 1000;
    console.warn(`IndexNow batch ${batchNumber} returned HTTP ${response.status}; retrying in ${delay}ms.`);
    await wait(delay);
  }
}

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.warn("IndexNow submission skipped: INDEXNOW_KEY is not configured.");
  process.exit(0);
}

try {
  const urls = await discoverUrls();
  if (urls.length === 0) throw new Error("No same-origin URLs were discovered from the sitemap index");
  const batches = Array.from({ length: Math.ceil(urls.length / BATCH_SIZE) }, (_, index) => urls.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE));
  for (const [index, batch] of batches.entries()) await submitBatch(key, batch, index + 1, batches.length);
  console.log(`IndexNow submission complete: ${urls.length} URLs broadcast in ${batches.length} batches.`);
} catch (error) {
  console.error(`IndexNow submission failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  process.exitCode = 1;
}