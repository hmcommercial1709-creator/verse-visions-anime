import { google } from "googleapis";

const SITEMAP_URL = "https://gamecastle.store/sitemap.xml";
const SITE_URL = process.env.GSC_SITE_URL || "https://gamecastle.store/";
const MAX_ATTEMPTS = 4;

function getConfig() {
  const email = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;
  return email && privateKey ? { email, privateKey: privateKey.replace(/\\n/g, "\n") } : null;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function isRetryable(error) {
  const status = error?.code || error?.response?.status;
  return status === 429 || status >= 500;
}

async function submitSitemap(searchconsole) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await searchconsole.sitemaps.submit({ siteUrl: SITE_URL, feedpath: SITEMAP_URL });
      return;
    } catch (error) {
      if (!isRetryable(error) || attempt === MAX_ATTEMPTS) throw error;
      const delay = 2 ** (attempt - 1) * 1000;
      console.warn(`GSC attempt ${attempt} failed; retrying in ${delay}ms.`);
      await wait(delay);
    }
  }
}

const config = getConfig();
if (!config) {
  console.warn("GSC sitemap submission skipped: GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY are not configured.");
  process.exit(0);
}

try {
  const auth = new google.auth.JWT({
    email: config.email,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });
  const searchconsole = google.searchconsole({ version: "v1", auth });
  await submitSitemap(searchconsole);
  console.log(`GSC sitemap submitted successfully: ${SITEMAP_URL}`);
} catch (error) {
  const status = error?.code || error?.response?.status || "unknown";
  const reason = error?.response?.data?.error?.message || error?.message || "Unknown Google API error";
  console.error(`GSC sitemap submission failed (status ${status}): ${reason}`);
  process.exitCode = 1;
}