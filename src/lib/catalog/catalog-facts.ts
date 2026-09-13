/**
 * Turns the stored derived block into the sections a catalog page renders.
 *
 * The 23 hand-built guides are rich because of their STRUCTURE: an overview,
 * a chronology, a cast, a thematic profile, an FAQ, a set of onward links —
 * each a real section with its own anchor and its own schema. This module is
 * how an imported title gets the same structure without the same prose.
 *
 * The rule every function here follows: a sentence is only produced when the
 * data supports it. There is no fallback copy, no "this beloved series" filler
 * and no placeholder. A title with no score simply has no placement sentence,
 * and the section does not render. That is the difference between a generated
 * page and a fabricated one.
 *
 * What makes these pages non-duplicate is that the numbers are OURS: a rank
 * within this catalog's Action titles, a length against this catalog's genre
 * median, a season cohort counted from this catalog. No other site publishes
 * them, because no other site holds this collection.
 *
 * Written by scripts/derive-facts.mjs at ingest time; see
 * supabase/migrations/20260913120000_entities_metadata_jsonb.sql.
 */

export interface CatalogTag {
  name: string;
  rank: number | null;
  category: string | null;
}

export interface CatalogCharacter {
  id: number;
  name: string;
  native: string | null;
  role: string | null;
  image: string | null;
}

export interface CatalogRelation {
  relationType: string;
  id: number;
  format: string | null;
  title: string;
}

export interface DerivedFacts {
  genreRank?: { genre: string; rank: number; total: number };
  /** Animation studio for anime, developer for games. */
  maker?: { name: string; total: number; rank?: number; scoredTotal?: number };
  /** Broadcast season for anime, release year for games. */
  cohort?: { key: string; label: string; size: number };
  size?: {
    value: number;
    unit: string;
    genre: string;
    median: number;
    verdict: "longer" | "shorter" | "typical";
  };
  tags?: { name: string; rank: number }[];
  franchise?: { slug: string; relation: string; title: string }[];
  similar?: { slug: string; shared: number; name?: string }[];
}

export interface CatalogMeta {
  anilistId?: number;
  malId?: number | null;
  format?: string | null;
  steamAppId?: number;
  developers?: string[];
  publishers?: string[];
  platforms?: string[];
  releaseDate?: string | null;
  releaseYear?: number | null;
  metacritic?: number | null;
  isFree?: boolean;
  price?: { final: string | null; discount: number } | null;
  achievements?: number | null;
  website?: string | null;
  screenshots?: string[];
  features?: string[];
  /** Manga. */
  provider?: string;
  chapters?: number | null;
  volumes?: number | null;
  publishedFrom?: string | null;
  publishedTo?: string | null;
  malScore?: number | null;
  scoredBy?: number | null;
  authors?: string[];
  serializations?: string[];
  demographics?: string[];
  mangaType?: string | null;
  status?: string | null;
  season?: string | null;
  seasonYear?: number | null;
  episodes?: number | null;
  duration?: number | null;
  countryOfOrigin?: string | null;
  averageScore?: number | null;
  popularity?: number | null;
  favourites?: number | null;
  startYear?: number | null;
  banner?: string | null;
  titles?: { romaji: string | null; english: string | null; native: string | null };
  studios?: { id: number; name: string; isAnimationStudio: boolean; isMain: boolean }[];
  tags?: CatalogTag[];
  relations?: CatalogRelation[];
  characters?: CatalogCharacter[];
  derived?: DerivedFacts;
}

/** Unknown JSON from the database, narrowed without trusting its shape. */
export function parseMeta(value: unknown): CatalogMeta | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as CatalogMeta;
}

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export type CatalogKind = "anime" | "game" | "manga";

const SEASON_LABEL: Record<string, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Autumn",
};

/** "Sequel", "Side story" — AniList's SCREAMING_SNAKE made readable. */
export function relationLabel(relation: string): string {
  return titleCase(relation.replace(/_/g, " "));
}

/**
 * The chronology, ordered the way someone would actually watch it: what came
 * before, then this, then what follows, then everything adjacent.
 */
const RELATION_ORDER = ["PARENT", "PREQUEL", "SEQUEL", "SIDE_STORY", "SPIN_OFF", "ALTERNATIVE"];

export function orderedFranchise(facts: DerivedFacts | undefined) {
  if (!facts?.franchise?.length) return [];
  return [...facts.franchise].sort(
    (a, b) =>
      (RELATION_ORDER.indexOf(a.relation) + 1 || 99) -
      (RELATION_ORDER.indexOf(b.relation) + 1 || 99),
  );
}

/**
 * The positioning sentences. Each is a statement about this catalog, and each
 * is returned only when its inputs exist — the caller renders whatever comes
 * back and nothing more.
 */
export function positioningStatements(
  meta: CatalogMeta | null,
  name: string,
  kind: CatalogKind = "anime",
): string[] {
  const d = meta?.derived;
  if (!d) return [];
  const out: string[] = [];
  const noun = kind === "game" ? "games" : kind === "manga" ? "series" : "titles";

  if (d.genreRank) {
    const { genre, rank, total } = d.genreRank;
    const basis =
      kind === "game" ? "Metacritic score" : kind === "manga" ? "MAL score" : "average score";
    out.push(
      `Within this catalog, ${name} ranks #${rank.toLocaleString()} of ${total.toLocaleString()} ${genre} ${noun} by ${basis}.`,
    );
  }

  if (d.maker) {
    const { name: maker, total, rank } = d.maker;
    out.push(
      rank
        ? `${maker} accounts for ${total.toLocaleString()} ${noun} here, and this is their #${rank.toLocaleString()} by score.`
        : `${maker} accounts for ${total.toLocaleString()} ${noun} in this catalog.`,
    );
  }

  if (d.cohort) {
    // The cohort key is "SPRING 2020" for anime and "2015" for a game, so the
    // sentence has to differ; the count either side of it does not.
    const label = d.cohort.label.replace(
      /^(WINTER|SPRING|SUMMER|FALL)/,
      (m) => SEASON_LABEL[m] ?? titleCase(m),
    );
    out.push(
      kind === "game"
        ? `It released in ${label}, one of ${d.cohort.size.toLocaleString()} games from that year in this catalog.`
        : kind === "manga"
          ? `Serialisation began in ${label}, one of ${d.cohort.size.toLocaleString()} series starting that year in this catalog.`
          : `It premiered in ${label}, one of ${d.cohort.size.toLocaleString()} titles from that season in this catalog.`,
    );
  }

  if (d.size) {
    const { value, unit, genre, median, verdict } = d.size;
    const phrase =
      verdict === "longer"
        ? `well above the ${median}-${unit.replace(/s$/, "")} median`
        : verdict === "shorter"
          ? `well below the ${median}-${unit.replace(/s$/, "")} median`
          : `close to the ${median}-${unit.replace(/s$/, "")} median`;
    out.push(`At ${value} ${unit} it sits ${phrase} for ${genre} ${noun} here.`);
  }

  return out;
}

/**
 * An FAQ built from stored values, not invented answers. Every question is one
 * the data can answer exactly; a question whose answer is unknown is never
 * asked, so the FAQ schema never carries a guess.
 */
export function generatedFaq(
  meta: CatalogMeta | null,
  name: string,
  kind: CatalogKind = "anime",
): { question: string; answer: string }[] {
  if (!meta) return [];
  const faq: { question: string; answer: string }[] = [];

  if (kind === "game") return gameFaq(meta, name, faq);
  if (kind === "manga") return mangaFaq(meta, name, faq);

  if (typeof meta.episodes === "number" && meta.episodes > 0) {
    const runtime =
      typeof meta.duration === "number" && meta.duration > 0
        ? ` Each episode runs about ${meta.duration} minutes, so the full run is roughly ${Math.round(
            (meta.episodes * meta.duration) / 60,
          )} hours.`
        : "";
    faq.push({
      question: `How many episodes does ${name} have?`,
      answer: `${name} has ${meta.episodes} episodes.${runtime}`,
    });
  }

  const studio = meta.studios?.find((s) => s.isMain) ?? meta.studios?.[0];
  if (studio) {
    const others = meta.derived?.maker?.total;
    faq.push({
      question: `Which studio animated ${name}?`,
      answer:
        `${name} was animated by ${studio.name}.` +
        (others && others > 1 ? ` This catalog lists ${others} titles from them.` : ""),
    });
  }

  if (meta.season && meta.seasonYear) {
    const label = SEASON_LABEL[meta.season] ?? titleCase(meta.season);
    faq.push({
      question: `When did ${name} come out?`,
      answer: `${name} premiered in ${label} ${meta.seasonYear}.`,
    });
  }

  const chain = orderedFranchise(meta.derived);
  if (chain.length) {
    const before = chain.filter((c) => c.relation === "PREQUEL" || c.relation === "PARENT");
    const after = chain.filter((c) => c.relation === "SEQUEL");
    const parts: string[] = [];
    if (before.length) parts.push(`${before.map((c) => c.title).join(", ")} comes first`);
    if (after.length) parts.push(`${after.map((c) => c.title).join(", ")} follows`);
    if (parts.length) {
      faq.push({
        question: `What is the watch order for ${name}?`,
        answer:
          `${parts.join("; ")}. ` +
          (chain.length === 1
            ? "It is listed in the chronology on this page."
            : `All ${chain.length} related entries are listed in the chronology on this page.`),
      });
    }
  }

  if (typeof meta.averageScore === "number" && meta.averageScore > 0) {
    const rank = meta.derived?.genreRank;
    faq.push({
      question: `Is ${name} worth watching?`,
      answer:
        `Viewers rate it ${meta.averageScore}/100 on AniList` +
        (rank
          ? `, placing it #${rank.rank} of ${rank.total} ${rank.genre} titles in this catalog.`
          : ". Judge it against the similar titles listed on this page."),
    });
  }

  return faq;
}

/** The tag profile, grouped the way AniList categorises them. */
export function groupedTags(meta: CatalogMeta | null): { category: string; tags: CatalogTag[] }[] {
  const tags = meta?.tags?.filter((t) => t.name) ?? [];
  if (tags.length === 0) return [];
  const groups = new Map<string, CatalogTag[]>();
  for (const tag of tags) {
    const key = tag.category ?? "Other";
    const list = groups.get(key);
    if (list) list.push(tag);
    else groups.set(key, [tag]);
  }
  return [...groups]
    .map(([category, list]) => ({
      category,
      tags: list.sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0)),
    }))
    .sort((a, b) => b.tags.length - a.tags.length);
}

/** Main cast first — the order a reader expects, not AniList's edge order. */
export function sortedCharacters(meta: CatalogMeta | null): CatalogCharacter[] {
  const list = meta?.characters?.filter((c) => c.name) ?? [];
  return [...list].sort((a, b) => {
    const rank = (role: string | null) => (role === "MAIN" ? 0 : role === "SUPPORTING" ? 1 : 2);
    return rank(a.role) - rank(b.role);
  });
}

/**
 * The games FAQ. Same rule as the anime one: every answer is read out of a
 * stored value, so a question whose answer is unknown is never asked and the
 * FAQPage schema never carries a guess.
 */
function gameFaq(
  meta: CatalogMeta,
  name: string,
  faq: { question: string; answer: string }[],
): { question: string; answer: string }[] {
  if (meta.platforms?.length) {
    const labels: Record<string, string> = { windows: "Windows", mac: "macOS", linux: "Linux" };
    const list = meta.platforms.map((p) => labels[p] ?? p);
    const joined =
      list.length > 1 ? `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}` : list[0];
    faq.push({
      question: `What platforms does ${name} run on?`,
      answer: `According to its Steam listing, ${name} runs on ${joined}.`,
    });
  }

  if (meta.isFree || meta.price?.final) {
    faq.push({
      question: `How much does ${name} cost?`,
      answer: meta.isFree
        ? `${name} is free to play on Steam.`
        : `${name} is listed at ${meta.price?.final} on Steam` +
          (meta.price?.discount ? `, currently ${meta.price.discount}% off.` : "."),
    });
  }

  if (meta.releaseDate) {
    const dev = meta.developers?.[0];
    faq.push({
      question: `When did ${name} come out?`,
      answer: `${name} released on ${meta.releaseDate}` + (dev ? `, developed by ${dev}.` : "."),
    });
  }

  if (typeof meta.achievements === "number" && meta.achievements > 0) {
    faq.push({
      question: `How many achievements does ${name} have?`,
      answer: `${name} has ${meta.achievements} Steam achievements.`,
    });
  }

  if (typeof meta.metacritic === "number" && meta.metacritic > 0) {
    const rank = meta.derived?.genreRank;
    faq.push({
      question: `Is ${name} worth playing?`,
      answer:
        `It holds a Metacritic score of ${meta.metacritic}` +
        (rank
          ? `, placing it #${rank.rank} of ${rank.total} ${rank.genre} games in this catalog.`
          : ". Compare it against the similar games listed on this page."),
    });
  }

  return faq;
}

/**
 * The manga FAQ. Same rule as the others: every answer is read out of a
 * stored value, so a question whose answer is unknown is never asked.
 */
function mangaFaq(
  meta: CatalogMeta,
  name: string,
  faq: { question: string; answer: string }[],
): { question: string; answer: string }[] {
  if (typeof meta.chapters === "number" && meta.chapters > 0) {
    const volumes =
      typeof meta.volumes === "number" && meta.volumes > 0 ? ` across ${meta.volumes} volumes` : "";
    faq.push({
      question: `How many chapters does ${name} have?`,
      answer: `${name} has ${meta.chapters} chapters${volumes}.`,
    });
  }

  if (meta.authors?.length) {
    faq.push({
      question: `Who wrote ${name}?`,
      answer: `${name} is by ${meta.authors.join(", ")}.`,
    });
  }

  if (meta.publishedFrom) {
    const from = meta.publishedFrom.slice(0, 4);
    const to = meta.publishedTo ? meta.publishedTo.slice(0, 4) : null;
    faq.push({
      question: `When was ${name} published?`,
      answer:
        to && to !== from
          ? `${name} was serialised from ${from} to ${to}.`
          : `${name} began serialisation in ${from}${meta.status ? ` and is ${meta.status.toLowerCase()}` : ""}.`,
    });
  }

  if (meta.serializations?.length) {
    faq.push({
      question: `Where was ${name} serialised?`,
      answer: `${name} ran in ${meta.serializations.join(", ")}.`,
    });
  }

  if (typeof meta.malScore === "number" && meta.malScore > 0) {
    const rank = meta.derived?.genreRank;
    faq.push({
      question: `Is ${name} worth reading?`,
      answer:
        `Readers rate it ${meta.malScore}/10 on MyAnimeList` +
        (rank
          ? `, placing it #${rank.rank} of ${rank.total} ${rank.genre} series in this catalog.`
          : ". Compare it against the similar series listed on this page."),
    });
  }

  return faq;
}
