import { google } from 'googleapis';
import fetch from 'node-fetch';

const SITEMAP_URL = "https://gamecastle.store/sitemap.xml";

async function runIndexing() {
  try {
    console.log("Fetching sitemap for indexing...");
    const response = await fetch(SITEMAP_URL);
    const xml = await response.text();

    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    console.log(`Found ${urls.length} URLs to process.`);

    if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
      console.log("GOOGLE_SERVICE_ACCOUNT secret not found, falling back to standard sitemap ping...");
      for (const url of urls) {
        await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`).catch(() => null);
      }
      console.log("Standard ping completed.");
      return;
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({
      version: 'v3',
      auth: auth,
    });

    // إرسال أول 100 رابط نشط لضمان عدم تجاوز الحد اليومي للـ API وتنشيط الأرشفة الفورية
    const batchUrls = urls.slice(0, 100);
    for (const url of batchUrls) {
      try {
        const res = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`Successfully indexed via API: ${url}`);
      } catch (err: any) {
        console.error(`Failed to index ${url}:`, err.message || err);
      }
    }

    console.log("Google Indexing API process finished!");
  } catch (error) {
    console.error("Error in indexing script:", error);
  }
}

runIndexing();
