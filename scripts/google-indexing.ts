import fetch from 'node-fetch';

const SITEMAP_URL = "https://gamecastle.store/sitemap.xml";

async function pingGoogle() {
  try {
    console.log("Fetching sitemap URLs for instant ping...");
    const response = await fetch(SITEMAP_URL);
    const xml = await response.text();

    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    console.log(`Found ${urls.length} URLs to ping.`);

    // إرسال إشارات زحف فورية لكل الروابط دفعة واحدة لمحركات البحث
    for (const url of urls) {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`;
      await fetch(pingUrl).catch(() => null);
      console.log(`Pinged Google for: ${url}`);
    }

    console.log("Google instant ping process completed successfully!");
  } catch (error) {
    console.error("Error pinging Google:", error);
  }
}

pingGoogle();
