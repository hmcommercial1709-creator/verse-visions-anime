/**
 * The trend feeds, one function each, all returning the same shape.
 *
 * What is here and what is not, and why:
 *
 *   Google Trends RSS   Keyless, official, stable. `/trending/rss?geo=XX`
 *                       returns the day's rising searches with an approximate
 *                       traffic figure. This is the one the plan called
 *                       "pytrends" — pytrends is an unofficial scraper of an
 *                       internal endpoint that rate-limits and breaks; the RSS
 *                       feed is the supported path to the same signal and
 *                       needs no library at all.
 *
 *   YouTube Data API    Needs a key (YOUTUBE_API_KEY). videos.list with
 *                       chart=mostPopular costs 1 quota unit per call against
 *                       a 10,000/day budget, so a handful of regions per run
 *                       is nothing. Category 20 is Gaming, 1 is Film &
 *                       Animation, 24 is Entertainment.
 *
 *   TikTok              Deliberately absent. The Creative Center has no public
 *                       API; reaching it means scraping an undocumented
 *                       endpoint behind a signed token, against their terms,
 *                       and it breaks whenever they rotate it. A source that
 *                       fails silently every few weeks is worse than no source,
 *                       because the scores quietly become wrong rather than
 *                       missing. If a supported API appears, it drops in here
 *                       as one more function returning this same shape.
 *
 * Every fetcher degrades rather than throwing: a feed that is down returns an
 * empty list with a reason, and the run continues on the sources that worked.
 * One broken feed must not cost the whole day's history.
 */

const USER_AGENT = "GameCastleTrendBot/1.0 (+https://gamecastle.store)";

/** Lets the tests point the fetchers at a local stub; unset in production. */
const base = (name, fallback) => process.env[name] || fallback;

const TRENDS_BASE = base("TRENDS_RSS_BASE", "https://trends.google.com");
const YOUTUBE_BASE = base("YOUTUBE_API_BASE", "https://www.googleapis.com");

/** Normalized key for a term. Display keeps the source's own spelling. */
export const normalizeTerm = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

async function getText(url, { timeoutMs = 15000, accept = "*/*" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${(await response.text()).slice(0, 200)}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Google Trends daily RSS.
 *
 * `ht:approx_traffic` arrives as "50,000+" — parsed to a number when present,
 * left null when absent. Not defaulted to zero: zero is a measurement, absence
 * is not, and the scorer treats them differently.
 */
export async function fetchGoogleTrends(geo, { log = console.log } = {}) {
  const url = `${TRENDS_BASE}/trending/rss?geo=${encodeURIComponent(geo)}`;
  try {
    const xml = await getText(url, { accept: "application/rss+xml, application/xml" });
    const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/g)].map((m) => m[0]);
    const rows = [];
    items.forEach((item, index) => {
      const title = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1];
      if (!title?.trim()) return;
      const trafficRaw = item.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/)?.[1];
      const traffic = trafficRaw ? Number(trafficRaw.replace(/[^0-9]/g, "")) : null;
      rows.push({
        source: "google-trends",
        geo,
        rawTerm: title.trim(),
        term: normalizeTerm(title),
        rank: index + 1,
        weight: Number.isFinite(traffic) && traffic > 0 ? traffic : null,
      });
    });
    return { rows, ok: true };
  } catch (error) {
    log(`  google-trends ${geo}: unavailable (${error.message})`);
    return { rows: [], ok: false, reason: error.message };
  }
}

/**
 * YouTube's most-popular chart for one category and region.
 *
 * The video TITLE is the signal, not a search term, so it is passed through
 * the same normalizer and then the same domain filter as everything else. A
 * title that does not name something the site covers is dropped there.
 */
export async function fetchYouTubePopular(
  geo,
  categoryId,
  { apiKey = process.env.YOUTUBE_API_KEY, maxResults = 50, log = console.log } = {},
) {
  if (!apiKey) return { rows: [], ok: false, reason: "no YOUTUBE_API_KEY" };
  const url =
    `${YOUTUBE_BASE}/youtube/v3/videos?part=snippet,statistics&chart=mostPopular` +
    `&regionCode=${encodeURIComponent(geo)}&videoCategoryId=${encodeURIComponent(categoryId)}` +
    `&maxResults=${maxResults}&key=${encodeURIComponent(apiKey)}`;
  try {
    const payload = JSON.parse(await getText(url, { accept: "application/json" }));
    const rows = (payload.items ?? []).map((item, index) => {
      const views = Number(item?.statistics?.viewCount);
      return {
        source: `youtube-${categoryId}`,
        geo,
        rawTerm: (item?.snippet?.title ?? "").trim(),
        term: normalizeTerm(item?.snippet?.title),
        rank: index + 1,
        weight: Number.isFinite(views) && views > 0 ? views : null,
      };
    });
    return { rows: rows.filter((r) => r.term), ok: true };
  } catch (error) {
    log(`  youtube ${geo}/${categoryId}: unavailable (${error.message})`);
    return { rows: [], ok: false, reason: error.message };
  }
}

/** Gaming, Film & Animation, Entertainment. */
export const YOUTUBE_CATEGORIES = ["20", "1", "24"];
