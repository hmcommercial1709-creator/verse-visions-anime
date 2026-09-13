/**
 * The facet index — which intersection pages are worth existing.
 *
 * A combinatorial matrix multiplies out fast: 20 genres × 30 years × 4
 * platforms is 2,400 URLs before studios or tags are involved. Generating all
 * of them is trivial. It is also the fastest way to get a site demoted:
 * Google's spam policy names scaled content abuse and doorway pages
 * explicitly, and a page listing two items under a heading is exactly that.
 * This site is already indexing 51 pages against 133 not indexed, so adding
 * thousands of near-empty URLs would be adding to the wrong side of that
 * ratio.
 *
 * So the matrix is generated, but gated. An intersection becomes a page only
 * when enough real rows sit behind it. Everything under the threshold is not
 * built, not linked, and not in the sitemap — it does not 404 either, it
 * simply was never a URL. That gate is the whole difference between a
 * programmatic matrix and a doorway farm, and it is the reason the pages that
 * DO exist are worth crawling.
 *
 * Computed once per ingest over the whole catalog and stored as one row, so
 * the Worker never aggregates thousands of rows to answer "does this facet
 * exist?" — it reads a single cached index.
 */

/**
 * How many catalog rows an intersection needs before it earns a URL.
 *
 * Deliberately not 1. A "2020 Action anime" page with three entries is a
 * worse result than the genre page that contains it, and publishing it
 * competes with our own better page for the same query.
 */
export const MIN_INVENTORY = {
  single: 8, // one facet: /anime/genre/action
  pair: 12, // two facets: /anime/genre/action/2020
  triple: 15, // three: /games/genre/action/windows/2020
};

/** Facet value → URL segment, and back. */
export const facetSlug = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const SEASONS = new Set(["WINTER", "SPRING", "SUMMER", "FALL"]);

/**
 * Every facet a single record belongs to, as {dimension, value} pairs.
 *
 * Deliberately narrow. Tags are excluded from the combinatorial dimensions
 * even though we store them: AniList carries hundreds, and crossing them with
 * genres and years is how a matrix reaches six figures of pages that no one
 * searches for. Tags stay as on-page content and similarity input.
 */
export function facetsOf(record) {
  const m = record.meta ?? {};
  const out = [];

  for (const genre of record.categories ?? []) {
    if (genre) out.push({ dim: "genre", value: genre });
  }

  const year = m.seasonYear ?? m.releaseYear ?? m.startYear ?? null;
  if (Number.isInteger(year) && year > 1950 && year < 2100) {
    out.push({ dim: "year", value: String(year) });
  }

  const maker = (m.makers ?? []).find((x) => x?.primary) ?? (m.makers ?? [])[0];
  if (maker?.name) out.push({ dim: "studio", value: maker.name });

  for (const platform of m.platforms ?? []) {
    if (platform) out.push({ dim: "platform", value: platform });
  }

  if (m.season && SEASONS.has(m.season) && Number.isInteger(m.seasonYear)) {
    out.push({ dim: "season", value: `${m.season} ${m.seasonYear}` });
  }

  if (m.format) out.push({ dim: "format", value: m.format });

  return out;
}

/**
 * Which dimension pairs and triples are allowed to combine.
 *
 * An allowlist rather than every combination, because most crossings are not
 * things people search. "Action anime 2020" and "Madhouse action anime" are
 * real queries; "TV format Spring 2020" is not, and a page for it is pure
 * index bloat.
 */
const COMBOS = {
  anime: [
    ["genre", "year"],
    ["genre", "studio"],
    ["genre", "season"],
    ["studio", "year"],
    ["genre", "format"],
    ["genre", "studio", "year"],
  ],
  game: [
    ["genre", "year"],
    ["genre", "platform"],
    ["genre", "studio"],
    ["platform", "year"],
    ["genre", "platform", "year"],
  ],
};

const keyOf = (parts) => parts.map((p) => `${p.dim}:${facetSlug(p.value)}`).join("|");

/**
 * Builds the index for one entity type.
 *
 * Returns { facets: { key: {dims, values, count, label} }, dimensions: {...} }
 * where only entries at or above the threshold survive.
 */
export function buildFacetIndex(records, entityType) {
  const counts = new Map();
  const labels = new Map();

  const bump = (parts) => {
    const key = keyOf(parts);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if (!labels.has(key))
      labels.set(
        key,
        parts.map((p) => ({ dim: p.dim, value: p.value })),
      );
  };

  for (const record of records) {
    const facets = facetsOf(record);
    const byDim = new Map();
    for (const f of facets) {
      const list = byDim.get(f.dim);
      if (list) list.push(f);
      else byDim.set(f.dim, [f]);
    }

    for (const f of facets) bump([f]);

    for (const combo of COMBOS[entityType] ?? []) {
      const lists = combo.map((dim) => byDim.get(dim) ?? []);
      if (lists.some((l) => l.length === 0)) continue;
      // Cartesian product within one record — a title in three genres and one
      // year produces three genre+year pairs, which is correct.
      let rows = [[]];
      for (const list of lists) {
        const next = [];
        for (const row of rows) for (const item of list) next.push([...row, item]);
        rows = next;
      }
      for (const row of rows) bump(row);
    }
  }

  const facets = {};
  let dropped = 0;
  for (const [key, count] of counts) {
    const parts = labels.get(key);
    const threshold =
      parts.length === 1
        ? MIN_INVENTORY.single
        : parts.length === 2
          ? MIN_INVENTORY.pair
          : MIN_INVENTORY.triple;
    if (count < threshold) {
      dropped += 1;
      continue;
    }
    facets[key] = {
      parts,
      count,
      path: facetPath(entityType, parts),
    };
  }

  return { entityType, facets, dropped, considered: counts.size };
}

/**
 * The URL for an intersection.
 *
 * Dimension order is fixed, not the order they were combined in, so one
 * intersection has exactly one URL. Two spellings of the same page is a
 * duplicate-content problem we would be creating ourselves.
 */
const DIM_ORDER = ["genre", "studio", "platform", "season", "format", "year"];

export function facetPath(entityType, parts) {
  const sorted = [...parts].sort((a, b) => DIM_ORDER.indexOf(a.dim) - DIM_ORDER.indexOf(b.dim));
  const base = entityType === "game" ? "/games/browse" : "/anime/browse";
  return `${base}/${sorted.map((p) => `${p.dim}-${facetSlug(p.value)}`).join("/")}`;
}

/* ------------------------------------------------------- comparison pages */

/**
 * "X vs Y" pages, built from the similarity graph rather than every pair.
 *
 * Every pair of 20,000 titles is 200 million URLs, which is not a strategy,
 * it is a way to be removed from an index. Comparison pages are only worth
 * existing where someone would actually weigh one against the other, so a
 * pair qualifies only when:
 *
 *   - the two are already near-neighbours in the tag graph (they share
 *     enough that the comparison is meaningful), and
 *   - both carry a score, so the page has something to compare rather than
 *     two descriptions side by side, and
 *   - the pair is within MAX_PER_TITLE of each title, so one popular series
 *     does not spawn hundreds of pages.
 *
 * The pair is ordered by slug so one comparison has exactly one URL. Emitting
 * both /a-vs-b and /b-vs-a would be us manufacturing our own duplicates.
 */
const MAX_PER_TITLE = 3;
const MIN_SHARED = 3;

export function buildComparisonIndex(records, entityType) {
  const bySlug = new Map(records.map((r) => [r.slug, r]));
  const seen = new Set();
  const pairs = [];
  const perTitle = new Map();

  const budget = (slug) => (perTitle.get(slug) ?? 0) < MAX_PER_TITLE;
  const spend = (slug) => perTitle.set(slug, (perTitle.get(slug) ?? 0) + 1);

  for (const record of records) {
    const similar = record.meta?.derived?.similar ?? [];
    const ownScore = record.meta?.score ?? record.meta?.averageScore ?? null;
    if (ownScore === null) continue;

    for (const candidate of similar) {
      if (candidate.shared < MIN_SHARED) continue;
      const other = bySlug.get(candidate.slug);
      const otherScore = other?.meta?.score ?? other?.meta?.averageScore ?? null;
      if (!other || otherScore === null) continue;

      const [a, b] = [record.slug, other.slug].sort();
      const key = `${a}::${b}`;
      if (seen.has(key)) continue;
      if (!budget(a) || !budget(b)) continue;

      seen.add(key);
      spend(a);
      spend(b);
      pairs.push({
        a,
        b,
        shared: candidate.shared,
        path: comparisonPath(entityType, a, b),
      });
    }
  }

  return { entityType, pairs };
}

export function comparisonPath(entityType, a, b) {
  const [first, second] = [a, b].sort();
  const base = entityType === "game" ? "/compare/games" : "/compare/anime";
  return `${base}/${first}-vs-${second}`;
}
