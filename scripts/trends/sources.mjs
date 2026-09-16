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
        originalTitle: (item?.snippet?.title ?? "").trim(),
        rawTerm: cleanVideoTitle(item?.snippet?.title),
        term: normalizeTerm(cleanVideoTitle(item?.snippet?.title)),
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

/** Gaming, Film & Animation, Entertainment. Nothing else is ever requested. */
export const YOUTUBE_CATEGORIES = ["20", "1", "24"];

/* ------------------------------------------------- title cleanup ------- */

/**
 * Noise that appears in a video title and never in a subject.
 *
 * Kept as whole-token patterns rather than substrings: stripping the letters
 * "hd" wherever they appear turns "Shield Hero" into "Sield Hero".
 */
const TITLE_NOISE = [
  /\B#\w+/gu, // #shorts, #anime, #fyp
  /\p{Extended_Pictographic}/gu, // every emoji
  /[\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}]/gu, // skin tones, variation selectors, ZWJ
  /【[^】]*】/gu, // Japanese lenticular brackets
  /\[[^\]]*\]/gu, // [ENG SUB], [4K], [Official]
  /\([^)]*\)/gu, // (Official Video), (2026)
  // A trailing "| X" was stripped here as the uploader's name, which threw
  // away the subject on every title of the form "gameplay | Overwatch". The
  // separator goes, the text stays: a channel name that survives costs
  // nothing, because extraction only keeps words the vocabulary knows.
  /\b(?:official|full|complete|new|latest|best|top\s*\d*)\b/giu,
  /\b(?:trailer|teaser|pv|mv|amv|edit|edits|reaction|review|recap|explained)\b/giu,
  /\b(?:gameplay|walkthrough|playthrough|speedrun|montage|highlights|stream|live)\b/giu,
  /\b(?:shorts?|tiktok|reels?|viral|trending|clickbait)\b/giu,
  /\b(?:eng|english|arabic|indo|sub|subbed|dubbed|subtitle[sd]?)\b/giu,
  /\b(?:season|episode|ep|part|chapter|ch|vol|volume)\s*\.?\s*\d+/giu,
  /\b(?:s\d{1,2}e\d{1,3}|\d{1,2}x\d{1,3})\b/giu,
  /\b(?:hd|4k|8k|60fps|1080p|720p)\b/giu,
  /\b(?:20\d{2})\b/gu, // a bare year
  /[|•·]/gu, // separators, not their contents
  /["'“”‘’«»]/gu,
  /[!?]{2,}/gu,
  /\s*[-–—|:•·]+\s*$/gu, // dangling separators after stripping
  /^\s*[-–—|:•·]+\s*/gu,
];

/**
 * A video title reduced to the part that could be a subject.
 *
 * Titles arrive decorated for the click, not for the index: emoji, hashtags,
 * bracketed language tags, episode numbers, the uploader's name after a pipe.
 * None of that identifies what the video is about, and leaving it in produced
 * "terms" like "ELE ESTA TE OBSERVANDO NO MINECRAFT... O TEMPO TODO!" — a
 * string nobody will ever search for.
 *
 * This is deliberately lossy and deliberately not clever. It removes what is
 * reliably noise and leaves the rest alone; deciding what the remainder names
 * is extractEntity's job, against a real vocabulary, not a guess made here.
 */
export function cleanVideoTitle(raw) {
  let text = String(raw ?? "");
  for (const pattern of TITLE_NOISE) text = text.replace(pattern, " ");
  return text
    .replace(/\s{2,}/gu, " ")
    .replace(/\s*([,.;:!?])\s*/gu, "$1 ")
    .trim();
}

/* ------------------------------------------------- seed keywords ------- */

/**
 * The queries the search pass actually asks YouTube.
 *
 * chart=mostPopular answers "what is being watched in this country", which is
 * a different question from "what is being watched in our field". On a general
 * chart an anime trailer competes with a football match and loses, which is
 * why 1,119 of 1,271 collected terms were off-topic. A seeded search asks the
 * narrower question directly.
 *
 * Both languages are present because the site publishes in both and the two
 * markets do not trend together.
 */
export const YOUTUBE_SEED_KEYWORDS = [
  { q: "anime trailer", lang: "en", category: "1" },
  { q: "new anime announcement", lang: "en", category: "1" },
  { q: "anime episode reaction", lang: "en", category: "24" },
  { q: "manhwa webtoon adaptation", lang: "en", category: "1" },
  { q: "anime opening", lang: "en", category: "24" },
  { q: "game trailer", lang: "en", category: "20" },
  { q: "new game release", lang: "en", category: "20" },
  { q: "game update patch notes", lang: "en", category: "20" },
  { q: "anime أنمي", lang: "ar", category: "1" },
  { q: "مراجعة أنمي", lang: "ar", category: "24" },
  { q: "أقوى شخصيات أنمي", lang: "ar", category: "24" },
  { q: "لعبة جديدة", lang: "ar", category: "20" },
  { q: "تحديث لعبة", lang: "ar", category: "20" },
  { q: "شحن جواهر", lang: "ar", category: "20" },
];

/**
 * Used only when every seed above came back empty.
 *
 * An empty pass is not a harmless no-op: the day's history has a hole in it,
 * and velocity needs an unbroken series to mean anything. These are broader on
 * purpose — they will return something even on a quiet day — and the run says
 * plainly when it fell back, so a week of fallback-only results is visible
 * rather than looking like ordinary data.
 */
export const YOUTUBE_FALLBACK_SEEDS = [
  { q: "anime news", lang: "en", category: "1" },
  { q: "anime trending leaks", lang: "en", category: "24" },
  { q: "new gaming updates", lang: "en", category: "20" },
  { q: "أخبار الأنمي", lang: "ar", category: "1" },
];

/**
 * search.list costs 100 quota units against a 10,000/day budget, where
 * videos.list costs 1. Eighteen calls is 1,800 units — comfortable beside the
 * catalog ingest and the daily chart pass, and low enough that a retry storm
 * cannot exhaust the day. The cap is enforced by the caller, not suggested.
 */
export const YOUTUBE_SEARCH_BUDGET = 18;

/**
 * Most-viewed videos for one seed, published inside the window.
 *
 * order=viewCount with publishedAfter is the combination that means "what got
 * watched today", rather than "what has the most views ever", which would
 * return the same handful of videos for years.
 */
export async function fetchYouTubeSearch(
  seed,
  {
    apiKey = process.env.YOUTUBE_API_KEY,
    hours = 24,
    geo = null,
    maxResults = 25,
    log = console.log,
  } = {},
) {
  if (!apiKey) return { rows: [], ok: false, reason: "no YOUTUBE_API_KEY" };
  const publishedAfter = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const url =
    `${YOUTUBE_BASE}/youtube/v3/search?part=snippet&type=video` +
    `&q=${encodeURIComponent(seed.q)}` +
    `&videoCategoryId=${encodeURIComponent(seed.category)}` +
    `&order=viewCount&publishedAfter=${encodeURIComponent(publishedAfter)}` +
    `&relevanceLanguage=${encodeURIComponent(seed.lang)}` +
    (geo ? `&regionCode=${encodeURIComponent(geo)}` : "") +
    `&maxResults=${maxResults}&key=${encodeURIComponent(apiKey)}`;
  try {
    const payload = JSON.parse(await getText(url, { accept: "application/json" }));
    const rows = (payload.items ?? [])
      .map((item, index) => {
        const original = (item?.snippet?.title ?? "").trim();
        const title = cleanVideoTitle(original);
        return {
          source: `youtube-search-${seed.category}`,
          geo: geo ?? seed.lang.toUpperCase(),
          // Cleaning is for the human reading the log. Extraction runs on the
          // original, because every cleaning rule is a chance to delete the
          // one word that identified the subject.
          originalTitle: original,
          rawTerm: title,
          term: normalizeTerm(title),
          rank: index + 1,
          // search.list carries no statistics part, so rank is the only
          // strength signal available. Inventing a view count to fill the
          // column would be a made-up number.
          weight: null,
        };
      })
      .filter((row) => row.term);
    return { rows, ok: true };
  } catch (error) {
    log(`  youtube search "${seed.q}" (${seed.lang}/${seed.category}): ${error.message}`);
    return { rows: [], ok: false, reason: error.message };
  }
}
