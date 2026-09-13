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
  studio?: { name: string; total: number; rank?: number; scoredTotal?: number };
  season?: { season: string; year: number; cohort: number };
  length?: {
    episodes: number;
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
export function positioningStatements(meta: CatalogMeta | null, name: string): string[] {
  const d = meta?.derived;
  if (!d) return [];
  const out: string[] = [];

  if (d.genreRank) {
    const { genre, rank, total } = d.genreRank;
    out.push(
      `Within this catalog, ${name} ranks #${rank.toLocaleString()} of ${total.toLocaleString()} ${genre} titles by average score.`,
    );
  }

  if (d.studio) {
    const { name: studio, total, rank } = d.studio;
    out.push(
      rank
        ? `${studio} accounts for ${total.toLocaleString()} titles here, and this is their #${rank.toLocaleString()} by score.`
        : `${studio} accounts for ${total.toLocaleString()} titles in this catalog.`,
    );
  }

  if (d.season) {
    const label = SEASON_LABEL[d.season.season] ?? titleCase(d.season.season);
    out.push(
      `It premiered in ${label} ${d.season.year}, one of ${d.season.cohort.toLocaleString()} titles from that season in this catalog.`,
    );
  }

  if (d.length) {
    const { episodes, genre, median, verdict } = d.length;
    const phrase =
      verdict === "longer"
        ? `well above the ${median}-episode median`
        : verdict === "shorter"
          ? `well below the ${median}-episode median`
          : `close to the ${median}-episode median`;
    out.push(`At ${episodes} episodes it sits ${phrase} for ${genre} titles here.`);
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
): { question: string; answer: string }[] {
  if (!meta) return [];
  const faq: { question: string; answer: string }[] = [];

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
    const others = meta.derived?.studio?.total;
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
