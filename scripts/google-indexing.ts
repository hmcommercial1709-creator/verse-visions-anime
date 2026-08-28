import fetch from 'node-fetch';

const SITEMAP_URL = "https://gamecastle.store/sitemap.xml";

const PING_SERVICES = [
  "https://www.google.com/ping?sitemap=",
  "http://rpc.pingomatic.com/?"
];

async function broadcastPing() {
  try {
    console.log("Fetching sitemap URLs for multi-service ping...");
    const response = await fetch(SITEMAP_URL);
    const xml = await response.text();

    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    console.log(`Found ${urls.length} URLs to broadcast.`);

    for (const url of urls) {
      for (const service of PING_SERVICES) {
        const pingUrl = `${service}${encodeURIComponent(url)}`;
        await fetch(pingUrl).catch(() => null);
      }
      console.log(`Broadcasted ping for: ${url}`);
    }

    console.log("All broadcast ping processes completed successfully!");
  } catch (error) {
    console.error("Error in broadcast ping:", error);
  }
}

broadcastPing();
