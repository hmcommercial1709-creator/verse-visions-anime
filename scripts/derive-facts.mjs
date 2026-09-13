/**
 * Derived catalog facts — how a generated page earns its own reason to exist.
 *
 * Importing a description from AniList or Steam and rendering it gives every
 * site that does the same the identical page. Google has seen that blurb on
 * the source and on every other importer, and there is no reason to prefer
 * ours. Inventing prose to differentiate is worse: it fabricates claims about
 * real works, and scaled generated content is a spam signal in its own right.
 *
 * The way out is neither. Everything here is COMPUTED from the catalog as a
 * whole: where a title places among its genre, how its length compares with
 * the median of that genre, how large its season's cohort was, which other
 * titles share its tag fingerprint. Every statement is a fact about our data
 * set, true by construction, specific to one page, and published nowhere else
 * — because nowhere else holds this exact collection. Nothing is invented and
 * nothing is copied.
 *
 * The similarity and franchise links are the second purpose: they turn a flat
 * import into a connected graph, which is what gives a crawler a reason to go
 * deeper than the first page of a listing.
 *
 * Runs once per ingest over the whole set, and the result is stamped into
 * each row. The Worker then renders stored facts instead of scanning
 * thousands of rows per request.
 */

/**
 * The generic shape the aggregates read, so anime and games share one engine.
 *
 * An anime's "maker" is its animation studio and a game's is its developer; an
 * anime's cohort is its broadcast season and a game's is its release year.
 * The arithmetic — rank within a genre, size of a cohort, distance from a
 * median — is identical, and only the wording differs, which is the
 * presenter's job rather than this file's.
 */
const norm = (meta = {}) => ({
  sourceId: meta.sourceId ?? meta.anilistId ?? meta.steamAppId ?? null,
  score: meta.score ?? meta.averageScore ?? null,
  makers: meta.makers ?? meta.studios ?? [],
  cohort: meta.cohort ?? null,
  size: meta.size ?? null,
  tags: meta.tags ?? [],
  relations: meta.relations ?? [],
});

/** Tags this common say nothing about a title, and their postings lists are
 *  huge. Skipping them makes similarity both faster and more discriminating. */
const MAX_TAG_POSTINGS = 400;
const SIMILAR_LIMIT = 8;
const TOP_TAGS = 6;

/** Relations worth walking: the ones a viewer would actually follow. */
const FRANCHISE_RELATIONS = new Set([
  "PREQUEL",
  "SEQUEL",
  "PARENT",
  "SIDE_STORY",
  "ALTERNATIVE",
  "SPIN_OFF",
]);

const median = (sorted) => {
  if (sorted.length === 0) return null;
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

/**
 * One pass over every record, building the indexes the per-record facts are
 * read out of. Records are the pre-write shape: { slug, categories, meta }.
 */
export function buildAggregates(records) {
  /** genre -> [{slug, score}] , later sorted desc by score */
  const byGenre = new Map();
  /** studio -> [{slug, score}] */
  const byStudio = new Map();
  /** "SPRING 2020" -> count */
  const bySeason = new Map();
  /** tag name -> [slug] */
  const byTag = new Map();
  /** genre -> [episode counts] */
  const episodesByGenre = new Map();
  /** anilist id -> slug, so relations can resolve to URLs we actually serve */
  const idToSlug = new Map();
  /** slug -> display name, so a link can carry a title rather than a slug */
  const slugToName = new Map();

  const push = (map, key, value) => {
    if (!key) return;
    const list = map.get(key);
    if (list) list.push(value);
    else map.set(key, [value]);
  };

  for (const r of records) {
    const m = norm(r.meta);
    const score = typeof m.score === "number" ? m.score : null;
    if (m.sourceId) idToSlug.set(String(m.sourceId), r.slug);
    slugToName.set(r.slug, r.name);

    for (const genre of r.categories ?? []) {
      push(byGenre, genre, { slug: r.slug, score });
      if (m.size && typeof m.size.value === "number" && m.size.value > 0) {
        push(episodesByGenre, genre, m.size.value);
      }
    }
    for (const maker of m.makers) {
      if (maker?.name) push(byStudio, maker.name, { slug: r.slug, score });
    }
    if (m.cohort?.key) {
      bySeason.set(m.cohort.key, (bySeason.get(m.cohort.key) ?? 0) + 1);
    }
    for (const tag of m.tags) if (tag?.name) push(byTag, tag.name, r.slug);
  }

  // Sorted once, so every per-record lookup is an index-of rather than a sort.
  const rankIndex = (map) => {
    const ranks = new Map();
    for (const [key, list] of map) {
      const scored = list.filter((e) => e.score !== null).sort((a, b) => b.score - a.score);
      const positions = new Map();
      scored.forEach((e, i) => positions.set(e.slug, i + 1));
      ranks.set(key, { positions, total: list.length, scoredTotal: scored.length });
    }
    return ranks;
  };

  const medianEpisodes = new Map();
  for (const [genre, list] of episodesByGenre) {
    medianEpisodes.set(genre, median([...list].sort((a, b) => a - b)));
  }

  return {
    genreRanks: rankIndex(byGenre),
    studioRanks: rankIndex(byStudio),
    bySeason,
    byTag,
    medianEpisodes,
    idToSlug,
    slugToName,
    total: records.length,
  };
}

/**
 * Titles sharing the most tags and genres with this one, by overlap count.
 *
 * Walks the tag postings lists rather than comparing every pair — the naive
 * form is quadratic and 20,000 titles would be 400 million comparisons.
 * Tags carried by more than MAX_TAG_POSTINGS titles are skipped: they cost
 * the most and distinguish the least.
 */
function similarTo(record, agg) {
  const own = record.slug;
  const counts = new Map();
  const keys = [
    ...norm(record.meta)
      .tags.map((t) => t?.name)
      .filter(Boolean),
    ...(record.categories ?? []),
  ];

  for (const key of keys) {
    const postings = agg.byTag.get(key);
    if (!postings || postings.length > MAX_TAG_POSTINGS) continue;
    for (const slug of postings) {
      if (slug === own) continue;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, SIMILAR_LIMIT)
    .map(([slug, shared]) => ({ slug, shared, name: agg.slugToName.get(slug) ?? slug }));
}

/**
 * The facts for one record. Every field is optional: a title with no score,
 * no studio or no season simply gets fewer sections, and the page never
 * claims something the data does not support.
 */
export function deriveFacts(record, agg) {
  const m = norm(record.meta);
  const facts = {};

  // The genre placement worth showing is the one where the title stands out
  // most — highest percentile, not the first genre in the list.
  let best = null;
  for (const genre of record.categories ?? []) {
    const entry = agg.genreRanks.get(genre);
    const rank = entry?.positions.get(record.slug);
    if (!rank || entry.scoredTotal < 5) continue;
    const percentile = rank / entry.scoredTotal;
    if (!best || percentile < best.percentile) {
      best = { genre, rank, total: entry.scoredTotal, percentile };
    }
  }
  if (best) {
    facts.genreRank = { genre: best.genre, rank: best.rank, total: best.total };
  }

  // The studio that animated it, or the studio that developed it — whichever
  // the source marks as primary, falling back to the first named.
  const maker = m.makers.find((x) => x?.primary) ?? m.makers[0];
  if (maker?.name) {
    const entry = agg.studioRanks.get(maker.name);
    const rank = entry?.positions.get(record.slug);
    if (entry && entry.total > 1) {
      facts.maker = {
        name: maker.name,
        total: entry.total,
        ...(rank ? { rank, scoredTotal: entry.scoredTotal } : {}),
      };
    }
  }

  if (m.cohort?.key) {
    const size = agg.bySeason.get(m.cohort.key) ?? 0;
    if (size > 1) {
      facts.cohort = { key: m.cohort.key, label: m.cohort.label ?? m.cohort.key, size };
    }
  }

  if (m.size && typeof m.size.value === "number" && m.size.value > 0 && best) {
    const med = agg.medianEpisodes.get(best.genre);
    if (med) {
      const ratio = m.size.value / med;
      facts.size = {
        value: m.size.value,
        unit: m.size.unit ?? "episodes",
        genre: best.genre,
        median: med,
        verdict: ratio >= 1.5 ? "longer" : ratio <= 0.67 ? "shorter" : "typical",
      };
    }
  }

  const tags = m.tags
    .filter((t) => typeof t.rank === "number" && t.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, TOP_TAGS)
    .map((t) => ({ name: t.name, rank: t.rank }));
  if (tags.length) facts.tags = tags;

  // Only relations we can actually link to. A chain entry pointing at a URL
  // the site does not serve is a 404 waiting to be crawled, so unresolved
  // ids are dropped rather than rendered.
  const franchise = [];
  for (const rel of m.relations) {
    if (!FRANCHISE_RELATIONS.has(rel.relationType)) continue;
    const slug = agg.idToSlug.get(String(rel.id));
    if (!slug || slug === record.slug) continue;
    if (franchise.some((f) => f.slug === slug)) continue;
    franchise.push({
      slug,
      relation: rel.relationType,
      title: agg.slugToName.get(slug) || rel.title,
    });
  }
  if (franchise.length) facts.franchise = franchise;

  const franchiseSlugs = new Set(franchise.map((f) => f.slug));
  const similar = similarTo(record, agg).filter((s) => !franchiseSlugs.has(s.slug));
  if (similar.length) facts.similar = similar;

  return facts;
}

/** Convenience: aggregate once, then stamp facts onto every record. */
export function annotate(records) {
  const agg = buildAggregates(records);
  for (const r of records) {
    r.meta = { ...(r.meta ?? {}), derived: deriveFacts(r, agg) };
  }
  return records;
}
