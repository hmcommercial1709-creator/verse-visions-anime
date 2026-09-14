/**
 * Does this term belong to the site, and to which part of it?
 *
 * A trending feed is mostly noise for any one site: elections, sport, weather,
 * a celebrity. Storing all of it would make every score a ranking of the news.
 * So a term is kept only when it names something this site is actually about —
 * games, anime, or the gift cards and top-ups the store sells.
 *
 * Two ways a term can qualify, and the difference matters downstream:
 *
 *   catalog   It names a row that already exists in public.entities. This is
 *             the strong signal: demand with somewhere to land. The match is
 *             returned so the pipeline can point at the page.
 *
 *   vocabulary  It contains a term from the lists below. Weaker, and it is why
 *             `matched_entity_slug` can be null - the term is on-topic but the
 *             site has nothing for it yet. Those become the gap report.
 *
 * The lists are deliberately specific. "game" alone would swallow "the big
 * game" every Sunday; the platform and currency names would not.
 */

/** Store-side: the things the shop actually sells credit for. */
const COMMERCE = [
  "roblox",
  "robux",
  "steam wallet",
  "steam gift",
  "psn",
  "playstation network",
  "playstation store",
  "xbox game pass",
  "xbox live",
  "nintendo eshop",
  "pubg uc",
  "uc pubg",
  "free fire diamonds",
  "genshin genesis crystals",
  "valorant points",
  "fortnite v-bucks",
  "v-bucks",
  "vbucks",
  "apple gift card",
  "google play gift",
  "razer gold",
  "gift card",
  "top up",
  "top-up",
];

/** Platform and franchise vocabulary that reliably means games. */
const GAMES = [
  "steam",
  "playstation",
  "ps5",
  "ps4",
  "xbox",
  "nintendo switch",
  "switch 2",
  "epic games",
  "game pass",
  "speedrun",
  "gameplay",
  "dlc",
  "patch notes",
  "battle pass",
  "esports",
  "twitch drops",
  "early access",
  "open beta",
  "minecraft",
  "fortnite",
  "valorant",
  "genshin impact",
  "honkai",
  "zenless",
  "call of duty",
  "warzone",
  "elden ring",
  "gta",
  "grand theft auto",
  "league of legends",
  "counter-strike",
  "cs2",
  "dota",
  "overwatch",
  "apex legends",
  "pubg",
  "free fire",
  "mobile legends",
  "clash royale",
  "brawl stars",
  "pokemon",
  "zelda",
  "mario",
  "final fantasy",
  "resident evil",
  "silent hill",
  "baldur's gate",
  "cyberpunk 2077",
  "helldivers",
  "palworld",
  "marvel rivals",
];

/** Anime and manga vocabulary. */
const ANIME = [
  "anime",
  "manga",
  "manhwa",
  "manhua",
  "shonen",
  "shounen",
  "seinen",
  "shojo",
  "isekai",
  "crunchyroll",
  "studio ghibli",
  "mappa",
  "ufotable",
  "toei animation",
  "wit studio",
  "bones studio",
  "sub indo",
  "dub",
  "opening theme",
  "op theme",
  "light novel",
  "season 2",
  "season 3",
  "final season",
  "episode",
  "one piece",
  "naruto",
  "boruto",
  "bleach",
  "dragon ball",
  "jujutsu kaisen",
  "demon slayer",
  "kimetsu",
  "attack on titan",
  "shingeki",
  "chainsaw man",
  "solo leveling",
  "spy x family",
  "my hero academia",
  "hunter x hunter",
  "tokyo revengers",
  "blue lock",
  "frieren",
  "dandadan",
  "sakamoto days",
  "oshi no ko",
  "mushoku tensei",
  "re:zero",
  "overlord",
  "dr stone",
];

const DOMAINS = [
  ["gift-cards", COMMERCE],
  ["anime", ANIME],
  ["games", GAMES],
];

/**
 * Word-boundary match, so "uc" inside "produce" is not a PUBG top-up and
 * "gta" inside "gtaa" is not Grand Theft Auto. Multi-word entries match as a
 * phrase. Regexes are built once, not per term: this runs across every term
 * from every feed on every pass.
 */
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const COMPILED = DOMAINS.map(([domain, words]) => [
  domain,
  words.map((word) => ({
    word,
    re: new RegExp(`(?:^|[^a-z0-9])${escape(word)}(?:[^a-z0-9]|$)`, "i"),
  })),
]);

/**
 * Returns { domain, matchedWord } for the first domain that claims the term,
 * or null. gift-cards is tested first: "roblox gift card" is a commerce intent
 * before it is a games one, and the commerce page is the one worth ranking.
 */
export function classifyTerm(term) {
  const haystack = ` ${String(term ?? "").toLowerCase()} `;
  for (const [domain, entries] of COMPILED) {
    for (const { word, re } of entries) {
      if (re.test(haystack)) return { domain, matchedWord: word };
    }
  }
  return null;
}

/**
 * Finds the catalog row a term names, if there is one.
 *
 * Matching is on the entity NAME appearing in the term, not the other way
 * round: the feeds publish "Solo Leveling Season 3 release date", and the
 * catalog holds "Solo Leveling". Longest name first, so "Dragon Ball Daima"
 * wins over "Dragon Ball" when both would match.
 *
 * Short names are skipped entirely. A two-character title would match almost
 * any sentence, and a wrong match is worse than none here - it would send
 * real demand at an unrelated page.
 */
export function buildCatalogMatcher(entities, { minNameLength = 4 } = {}) {
  const sorted = entities
    .filter((e) => (e?.name ?? "").trim().length >= minNameLength)
    .map((e) => ({
      entityType: e.entity_type ?? e.entityType ?? null,
      slug: e.slug,
      name: String(e.name).trim(),
      needle: ` ${String(e.name).trim().toLowerCase()} `,
    }))
    .sort((a, b) => b.name.length - a.name.length);

  return (term) => {
    const haystack = ` ${String(term ?? "").toLowerCase()} `;
    for (const row of sorted) {
      if (haystack.includes(row.needle)) {
        return { entityType: row.entityType, slug: row.slug, name: row.name };
      }
    }
    return null;
  };
}

export const VOCABULARY_SIZE = COMMERCE.length + GAMES.length + ANIME.length;
