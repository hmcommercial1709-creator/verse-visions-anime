import { loadMatrixIndex, type CatalogType } from "./matrix";
import { loadCatalogItemFromDb } from "./db-catalog";
import { parseMeta, type CatalogMeta } from "./catalog-facts";

/**
 * "X vs Y" pages.
 *
 * The pair list is built at ingest by scripts/facet-index.mjs, which only
 * pairs titles that are already near-neighbours in the tag graph and that both
 * carry a score. Every pair of a 20,000-row catalog would be 200 million URLs;
 * a comparison is only worth a page where someone would actually weigh one
 * against the other.
 *
 * The URL is ordered by slug, so a comparison has exactly one address. A
 * request for the reverse order resolves to the same pair and the page
 * declares the canonical form, rather than existing twice.
 */

export interface ComparisonSide {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  meta: CatalogMeta | null;
}

export interface ComparisonRow {
  label: string;
  a: string | null;
  b: string | null;
  /** Which side the number favours, when one of them measurably does. */
  winner: "a" | "b" | null;
}

export interface ComparisonData {
  a: ComparisonSide;
  b: ComparisonSide;
  canonical: string;
  rows: ComparisonRow[];
  shared: string[];
}

/** "a-slug-vs-b-slug" → the two slugs, or null when it is not that shape. */
export function parsePair(pair: string): [string, string] | null {
  const index = pair.indexOf("-vs-");
  if (index <= 0) return null;
  const a = pair.slice(0, index);
  const b = pair.slice(index + 4);
  if (!a || !b || a === b) return null;
  return [a, b];
}

const COMPARE_BASE: Record<CatalogType, string> = {
  anime: "/compare/anime",
  game: "/compare/games",
  manga: "/compare/manga",
};

export const comparisonPath = (type: CatalogType, a: string, b: string) => {
  const [first, second] = [a, b].sort();
  return `${COMPARE_BASE[type]}/${first}-vs-${second}`;
};

const num = (value: unknown) => (typeof value === "number" && value > 0 ? value : null);

/**
 * The comparison table. Every row is a stored value on both sides or it is
 * not a row: a table half full of dashes compares nothing, and publishing one
 * would be the thin page this whole design exists to avoid.
 */
function buildRows(type: CatalogType, a: CatalogMeta | null, b: CatalogMeta | null) {
  const rows: ComparisonRow[] = [];
  const add = (label: string, av: unknown, bv: unknown, higherWins = true) => {
    const an = num(av);
    const bn = num(bv);
    if (an === null && bn === null) return;
    if (typeof av === "string" || typeof bv === "string") {
      if (!av || !bv) return;
      rows.push({ label, a: String(av), b: String(bv), winner: null });
      return;
    }
    if (an === null || bn === null) return;
    rows.push({
      label,
      a: an.toLocaleString(),
      b: bn.toLocaleString(),
      winner: an === bn ? null : an > bn === higherWins ? "a" : "b",
    });
  };

  if (type === "manga") {
    add("MAL score", a?.malScore, b?.malScore);
    add("Chapters", a?.chapters, b?.chapters);
    add("Volumes", a?.volumes, b?.volumes);
    add(
      "First published",
      a?.publishedFrom?.slice(0, 4) ?? "",
      b?.publishedFrom?.slice(0, 4) ?? "",
    );
    add("Author", a?.authors?.[0] ?? "", b?.authors?.[0] ?? "");
  } else if (type === "game") {
    add("Metacritic score", a?.metacritic, b?.metacritic);
    add("Release year", a?.releaseYear, b?.releaseYear, false);
    add("Steam achievements", a?.achievements, b?.achievements);
    const platforms = (m: CatalogMeta | null) => m?.platforms?.join(", ") || "";
    add("Platforms", platforms(a), platforms(b));
    add("Developer", a?.developers?.[0] ?? "", b?.developers?.[0] ?? "");
  } else {
    add("Average score", a?.averageScore, b?.averageScore);
    add("Episodes", a?.episodes, b?.episodes);
    add("Episode length (min)", a?.duration, b?.duration);
    add("Year", a?.seasonYear ?? a?.startYear, b?.seasonYear ?? b?.startYear, false);
    add("Popularity rank", a?.popularity, b?.popularity);
    const studio = (m: CatalogMeta | null) =>
      (m?.studios ?? []).find((s) => s.isMain)?.name ?? m?.studios?.[0]?.name ?? "";
    add("Studio", studio(a), studio(b));
  }
  return rows;
}

export async function loadComparison(
  type: CatalogType,
  pair: string,
): Promise<ComparisonData | null> {
  const parsed = parsePair(pair);
  if (!parsed) return null;
  const [first, second] = parsed;

  // Only pairs the index published. Without this check the route is an open
  // URL space: any two slugs in the catalog would render, which is the 200
  // million pages this design exists to avoid.
  const index = await loadMatrixIndex(type);
  if (!index) return null;
  const [x, y] = [first, second].sort();
  const known = index.comparisons.some((c) => c.a === x && c.b === y);
  if (!known) return null;

  const [rowA, rowB] = await Promise.all([
    loadCatalogItemFromDb(type, first),
    loadCatalogItemFromDb(type, second),
  ]);
  if (!rowA || !rowB) return null;

  const metaA = parseMeta(rowA.metadata);
  const metaB = parseMeta(rowB.metadata);
  const rows = buildRows(type, metaA, metaB);
  if (rows.length < 3) return null;

  const setB = new Set(rowB.categories ?? []);
  const shared = (rowA.categories ?? []).filter((c) => setB.has(c));

  return {
    a: {
      slug: rowA.slug,
      name: rowA.name,
      description: rowA.description,
      image: rowA.image_url,
      meta: metaA,
    },
    b: {
      slug: rowB.slug,
      name: rowB.name,
      description: rowB.description,
      image: rowB.image_url,
      meta: metaB,
    },
    canonical: comparisonPath(type, first, second),
    rows,
    shared,
  };
}
