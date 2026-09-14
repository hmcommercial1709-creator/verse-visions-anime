/**
 * SERP intelligence behind a provider interface.
 *
 * Competition and SERP difficulty have no free, legitimate source. Every route
 * to them is either a paid API or scraping Google directly, and scraping is
 * both against their terms and unreliable enough that the numbers would drift
 * without anyone noticing.
 *
 * So the default provider is honest about knowing nothing. It returns
 * `available: false`, the opportunity model drops those weights rather than
 * defaulting them, and the score reports reduced confidence. That is a worse
 * score than a real provider would give, and a far better one than a fabricated
 * number that looks authoritative and is not.
 *
 * Connecting a real provider later is one file: implement `fetchSerp` and set
 * SERP_PROVIDER. Nothing else in the engine changes, because everything
 * downstream already treats these factors as optional.
 *
 * The shape a provider must return:
 *   {
 *     available: true,
 *     competition: 0..1,        // higher = harder
 *     difficulty: 0..1,
 *     dominantIntent: string,
 *     pageTypes: string[],      // what ranks: guides, videos, forums, stores
 *     freshnessRequired: bool,  // are top results all recent
 *     peopleAlsoAsk: string[],
 *     source: string,
 *   }
 */

/** Knows nothing, and says so. */
export const nullProvider = {
  name: "none",
  async fetchSerp(query) {
    return {
      available: false,
      reason:
        "no SERP provider configured — competition and difficulty are unmeasured, " +
        "so those factors are excluded from the score rather than guessed",
      query,
      source: "none",
    };
  },
};

/**
 * Reads SERP data a person has already gathered and committed as JSON.
 *
 * This exists because the honest interim answer is often manual: someone looks
 * at ten queries that matter, records what ranks, and the engine uses it. Real
 * observation beats both a guess and nothing.
 *
 * File shape: { "<query>": { competition, difficulty, dominantIntent, ... } }
 */
export function fileProvider(path, { readFile } = {}) {
  let cache = null;
  return {
    name: `file:${path}`,
    async fetchSerp(query) {
      if (cache === null) {
        try {
          const read = readFile ?? (await import("node:fs")).readFileSync;
          cache = JSON.parse(read(path, "utf8"));
        } catch {
          cache = {};
        }
      }
      const row = cache[String(query).toLowerCase()];
      if (!row) {
        return {
          available: false,
          reason: `no recorded SERP observation for "${query}"`,
          query,
          source: this.name,
        };
      }
      return { available: true, query, source: this.name, ...row };
    },
  };
}

const PROVIDERS = { none: nullProvider };

/**
 * Resolves the configured provider. Unknown names fall back to the null
 * provider WITH a warning rather than throwing: a missing optional signal must
 * never take down the nightly run, but it must never be silent either.
 */
export function resolveSerpProvider({ env = process.env, log = console.log } = {}) {
  const name = env.SERP_PROVIDER || "none";
  if (name.startsWith("file:")) return fileProvider(name.slice(5));
  const provider = PROVIDERS[name];
  if (!provider) {
    log(
      `  SERP_PROVIDER="${name}" is not a provider this build knows; continuing without SERP data.`,
    );
    return nullProvider;
  }
  return provider;
}

/** Turns a provider response into opportunity-model factors, or nothing. */
export function serpFactors(serp) {
  if (!serp?.available) return { factors: {}, provenance: {} };
  const factors = {};
  const provenance = {};
  if (Number.isFinite(serp.competition)) {
    factors.competition = serp.competition;
    provenance.competition = serp.source;
  }
  if (Number.isFinite(serp.difficulty)) {
    // Difficulty sharpens the competition estimate rather than adding a second
    // near-identical factor that would double-count the same evidence.
    factors.competition = Math.max(factors.competition ?? 0, serp.difficulty);
    provenance.competition = serp.source;
  }
  if (serp.freshnessRequired === true) {
    factors.freshness = 1;
    provenance.freshness = `${serp.source}: top results are all recent`;
  }
  return { factors, provenance };
}
