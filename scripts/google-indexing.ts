const SITEMAP_URL = "https://gamecastle.store/sitemap.xml";

async function pingGoogleIndexing() {
  try {
    console.log("Fetching sitemap URLs...");
    const response = await fetch(SITEMAP_URL);
    const xml = await response.text();

    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    console.log(`Found ${urls.length} sitemaps/URLs to index.`);

    for (const url of urls) {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`;
      await fetch(pingUrl).catch(() => null);
      console.log(`Pinged Google for: ${url}`);
    }

    console.log("Google indexing ping completed successfully!");
  } catch (error) {
    console.error("Error pinging Google:", error);
  }
}

pingGoogleIndexing();
