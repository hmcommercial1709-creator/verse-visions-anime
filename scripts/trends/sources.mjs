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
/**
 * The franchises the seeded pass points YouTube AT.
 *
 * This is the other half of the site owner's reference list, and the half that
 * matters more. Used as vocabulary the list only decides what to keep out of
 * what YouTube happened to return; used as seeds it decides what YouTube is
 * asked for in the first place, which is the difference between filtering
 * noise and never collecting it.
 *
 * "anime trailer" returns whatever the algorithm favours today. "Kaiju No. 8"
 * returns what is happening to Kaiju No. 8 today, and a site that publishes
 * about Kaiju No. 8 can use the second and not the first.
 */
// Note: entries the VOCABULARY refuses ("Monster", "Another") are fine as
// seeds. A seed is a question put to YouTube inside Film & Animation, and
// whatever comes back is still filtered by the catalog and the vocabulary
// before it is stored. Asking about Monster is safe; believing every string
// containing "monster" is Monster is not.
export const SEED_FRANCHISES = [
  "One Piece",
  "Naruto",
  "Bleach",
  "Dragon Ball",
  "Dragon Ball Z",
  "Dragon Ball GT",
  "Dragon Ball Super",
  "Attack on Titan",
  "Demon Slayer",
  "Jujutsu Kaisen",
  "My Hero Academia",
  "Hunter x Hunter",
  "Death Note",
  "Fullmetal Alchemist",
  "One Punch Man",
  "Tokyo Ghoul",
  "Sword Art Online",
  "Black Clover",
  "Fairy Tail",
  "JoJo's Bizarre Adventure",
  "Chainsaw Man",
  "Spy x Family",
  "Haikyuu!!",
  "Blue Lock",
  "Solo Leveling",
  "Vinland Saga",
  "Dr. Stone",
  "Mob Psycho 100",
  "Code Geass",
  "Steins;Gate",
  "Neon Genesis Evangelion",
  "Cowboy Bebop",
  "Samurai Champloo",
  "Trigun",
  "Yu Yu Hakusho",
  "Rurouni Kenshin",
  "Inuyasha",
  "Ranma ½",
  "Sailor Moon",
  "Cardcaptor Sakura",
  "Pokémon",
  "Digimon Adventure",
  "Yu-Gi-Oh!",
  "Shaman King",
  "Beyblade",
  "Bakugan Battle Brawlers",
  "The Seven Deadly Sins",
  "Magi",
  "Assassination Classroom",
  "Fire Force",
  "Soul Eater",
  "Noragami",
  "Blue Exorcist",
  "Akame ga Kill!",
  "Kill la Kill",
  "Mirai Nikki",
  "Parasyte",
  "Erased",
  "Another",
  "Elfen Lied",
  "Hellsing",
  "Hellsing Ultimate",
  "Berserk",
  "Claymore",
  "Dororo",
  "Monster",
  "Pluto",
  "Psycho-Pass",
  "Made in Abyss",
  "Re:Zero",
  "That Time I Got Reincarnated as a Slime",
  "Overlord",
  "KonoSuba",
  "No Game No Life",
  "The Rising of the Shield Hero",
  "Mushoku Tensei",
  "Log Horizon",
  "The Eminence in Shadow",
  "The Misfit of Demon King Academy",
  "Classroom of the Elite",
  "Frieren",
  "Delicious in Dungeon",
  "The Apothecary Diaries",
  "Oshi no Ko",
  "Kaguya-sama",
  "Your Lie in April",
  "Toradora!",
  "Clannad",
  "Anohana",
  "Violet Evergarden",
  "Fruits Basket",
  "Komi Can't Communicate",
  "My Dress-Up Darling",
  "Horimiya",
  "Rascal Does Not Dream of Bunny Girl Senpai",
  "A Silent Voice",
  "Your Name",
  "Weathering with You",
  "Spirited Away",
  "Princess Mononoke",
  "Howl's Moving Castle",
  "My Neighbor Totoro",
  "Kiki's Delivery Service",
  "Castle in the Sky",
  "Nausicaä of the Valley of the Wind",
  "The Wind Rises",
  "Ponyo",
  "Grave of the Fireflies",
  "Akira",
  "Ghost in the Shell",
  "Perfect Blue",
  "Paprika",
  "Summer Wars",
  "The Boy and the Heron",
  "The Last",
  "Boruto",
  "Jujutsu Kaisen 0",
  "Black Butler",
  "Tokyo Revengers",
  "Classroom of the Elite 2nd Season",
  "Haikyuu!! Second Season",
  "Haikyuu!! Third Season",
  "Haikyuu!! To the Top",
  "Naruto SD",
  "Pokémon Journeys",
  "Pokémon Horizons",
  "Digimon Adventure 02",
  "Digimon Tamers",
  "Digimon Frontier",
  "Digimon Data Squad",
  "Yu-Gi-Oh! Duel Monsters",
  "Yu-Gi-Oh! GX",
  "Yu-Gi-Oh! 5D's",
  "Yu-Gi-Oh! ZEXAL",
  "Yu-Gi-Oh! ARC-V",
  "Yu-Gi-Oh! VRAINS",
  "Death Note Rewrite",
  "Steins;Gate 0",
  "Evangelion",
  "Trigun Stampede",
  "Slam Dunk",
  "Kuroko's Basketball",
  "Kuroko's Basketball 2",
  "Kuroko's Basketball 3",
  "The Prince of Tennis",
  "Free!",
  "Yuri!!! on Ice",
  "Run with the Wind",
  "Initial D",
  "Wangan Midnight",
  "Food Wars! Shokugeki no Soma",
  "The Promised Neverland",
  "Darling in the Franxx",
  "Gurren Lagann",
  "Cyberpunk",
  "Arcane",
  "Castlevania",
  "Devilman Crybaby",
  "Beastars",
  "Dorohedoro",
  "Bungo Stray Dogs",
  "Durarara!!",
  "Baccano!",
  "Great Pretender",
  "Afro Samurai",
  "Megalo Box",
  "Odd Taxi",
  "Ranking of Kings",
  "To Your Eternity",
  "The Ancient Magus' Bride",
  "Land of the Lustrous",
  "A Place Further than the Universe",
  "March Comes in Like a Lion",
  "Barakamon",
  "Natsume's Book of Friends",
  "Mushishi",
  "Mononoke",
  "The Tatami Galaxy",
  "Ping Pong the Animation",
  "Serial Experiments Lain",
  "Ergo Proxy",
  "Texhnolyze",
  "Mobile Suit Gundam",
  "Mobile Suit Gundam Wing",
  "Mobile Suit Gundam SEED",
  "Mobile Suit Gundam 00",
  "Fate stay night",
  "Fate/Zero",
  "Fate/Apocrypha",
  "Fate/Grand Order",
  "Fate/Grand Order Absolute Demonic Front",
  "The Garden of Sinners",
  "Kara no Kyoukai",
  "Konosuba 2",
  "Konosuba 3",
  "Platinum End",
  "Future Diary",
  "Hell's Paradise",
  "Kaiju No. 8",
  "Wind Breaker",
  "Mashle",
  "Undead Unluck",
  "Dandadan",
  "Sakamoto Days",
  "Zom 100",
  "The Elusive Samurai",
  "Spy x Family Code"
];

/**
 * The game franchises the seeded pass points YouTube at, taken from the same
 * vocabulary the classifier uses so the two never drift apart.
 *
 * Platform and storefront words are excluded: "Steam" and "battle pass" are
 * things a video mentions, not things a video is about, and a 100-unit call
 * spent asking about "DLC" returns the whole platform.
 */
export const SEED_GAMES = [
  "EA SPORTS FC 27",
  "Ea Sports Fc",
  "Fifa",
  "Rocket League",
  "Among Us",
  "Fall Guys",
  "Baldur'S Gate",
  "Black Myth",
  "Wukong",
  "Wuthering Waves",
  "Zenless Zone Zero",
  "Honkai Star Rail",
  "Honor Of Kings",
  "Delta Force",
  "Mobile Legends",
  "Clash Royale",
  "Clash Of Clans",
  "Brawl Stars",
  "Rainbow Six",
  "Counter-Strike",
  "Dota 2",
  "Path Of Exile",
  "No Rest For The Wicked",
  "Silent Hill",
  "Resident Evil",
  "Monster Hunter",
  "Final Fantasy",
  "Persona",
  "Tekken",
  "Street Fighter",
  "Mortal Kombat",
  "Playstation",
  "Xbox",
  "Minecraft",
  "Fortnite",
  "Valorant",
  "Genshin Impact",
  "Honkai",
  "Zenless",
  "Call Of Duty",
  "Warzone",
  "Elden Ring",
  "League Of Legends",
  "Overwatch",
  "Apex Legends",
  "Pubg",
  "Free Fire",
  "Pokemon",
  "Zelda",
  "Mario",
  "Cyberpunk 2077",
  "Helldivers",
  "Palworld",
  "Marvel Rivals",
  "Arcane",
  "Castlevania"
];

/**
 * Which slice of SEED_FRANCHISES this run asks about.
 *
 * All of them in one pass would cost 20,700 quota units against a 10,000/day
 * budget, so the list is walked instead: a deterministic window that advances
 * with the day, covering everything over a few days and repeating the cycle.
 * Deterministic rather than random so that a gap in the data can be traced to
 * a day rather than to luck.
 */
function windowOf(list, count, day, category) {
  const total = list.length;
  if (!total || count <= 0) return [];
  const start = (((day * count) % total) + total) % total;
  const picked = [];
  for (let i = 0; i < Math.min(count, total); i += 1) {
    // The franchise name is the whole query: adding "anime" to "Cowboy Bebop"
    // narrows it to videos that say both, which is fewer, not better.
    picked.push({ q: list[(start + i) % total], lang: "en", category });
  }
  return picked;
}

export function franchiseSeedsForDay(count, date = new Date()) {
  const day = Math.floor(date.getTime() / 86400000);
  // Split between the two fields the site covers. Anime takes the larger share
  // because its list is the longer one, so both complete a cycle in a similar
  // number of days rather than the shorter list repeating while the other is
  // still on its first pass.
  const animeShare = Math.max(1, Math.round(count * 0.6));
  const gameShare = Math.max(0, count - animeShare);
  return [
    // Film & Animation, where trailers and episode discussion live.
    ...windowOf(SEED_FRANCHISES, animeShare, day, "1"),
    // Gaming.
    ...windowOf(SEED_GAMES, gameShare, day, "20"),
  ];
}

/**
 * search.list costs 100 quota units against a 10,000/day budget, where
 * videos.list costs 1. Sixty calls is 6,000 units, which leaves room for the
 * daily chart pass and a retry without risking the day. The cap is enforced by
 * the caller, not suggested.
 */
export const YOUTUBE_SEARCH_BUDGET = 60;

/** How many of those calls go to rotating franchise seeds. */
export const FRANCHISE_SEEDS_PER_RUN = 40;

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
