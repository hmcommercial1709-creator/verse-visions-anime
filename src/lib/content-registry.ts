/**
 * Content Registry
 * ----------------
 * Central lookup surface for every content type in GameCastle Anime. Route
 * components and generators (sitemap, search, recommendations) should
 * import from here instead of poking at raw data files, so that:
 *
 *   - publication status is respected uniformly
 *   - reference integrity has a single place to be validated
 *   - future indexing (locales, taxonomies) plugs in without touching routes
 *
 * Publication model:
 *   Any content record MAY carry `publicationStatus`.  Records without
 *   the field are treated as `published` for backwards compatibility
 *   with existing seed data.  Public indexes (sitemap, search, catalog
 *   listings, recommendation rails) filter through `isPublished` — draft
 *   / review / archived records stay routable by direct URL but are not
 *   surfaced publicly.
 */

import { animes, type Anime } from "@/data/animes";
import { articles, authors, type Article } from "@/data/articles";
import { characters, type Character } from "@/data/characters";
import { studios, type Studio } from "@/data/studios";
import { genres, type Genre } from "@/data/genres";
import { episodes, type Episode } from "@/data/episodes";
import { franchises, watchOrders, type Franchise, type WatchOrder } from "@/data/franchises";
import { storyArcs, type StoryArc } from "@/data/arcs";
import { characterRelationships, type CharacterRelationship } from "@/data/relationships";
import { rankings, type Ranking } from "@/data/rankings";

export type PublicationStatus = "draft" | "review" | "published" | "archived";

export type WithMeta<T> = T & {
  publicationStatus?: PublicationStatus;
  editorialReview?: boolean;
  factChecked?: boolean;
  spoilerLevel?: "none" | "minor" | "major" | "ending";
  publishedAt?: string;
  updatedAt?: string;
  reviewer?: string;
  sources?: { label: string; url?: string }[];
  imageAttribution?: string;
};

export function isPublished(item: { publicationStatus?: PublicationStatus } | Record<string, unknown>): boolean {
  const status = (item as { publicationStatus?: PublicationStatus }).publicationStatus;
  return (status ?? "published") === "published";
}

// ---------------------------------------------------------------------
// Anime
// ---------------------------------------------------------------------

export const allAnime = (): Anime[] => animes;
export const publishedAnime = (): Anime[] => animes.filter(isPublished);
export const getAnimeBySlug = (slug: string): Anime | undefined =>
  animes.find((a) => a.slug === slug);

export const animeByGenre = (genreSlug: string): Anime[] =>
  publishedAnime().filter((a) => a.genres.includes(genreSlug));

export const animeByStudio = (studioSlug: string): Anime[] =>
  publishedAnime().filter((a) => a.studio === studioSlug);

export const animeByTheme = (theme: string): Anime[] => {
  const needle = theme.toLowerCase();
  return publishedAnime().filter((a) =>
    a.themes.some((t) => t.toLowerCase() === needle),
  );
};

// ---------------------------------------------------------------------
// Episodes
// ---------------------------------------------------------------------

export const allEpisodes = (): Episode[] => episodes;
export const publishedEpisodes = (): Episode[] => episodes.filter(isPublished);
export const episodesForAnime = (animeSlug: string): Episode[] =>
  publishedEpisodes()
    .filter((e) => e.animeSlug === animeSlug)
    .sort((a, b) => a.number - b.number);

export const getEpisode = (animeSlug: string, number: number): Episode | undefined =>
  episodes.find((e) => e.animeSlug === animeSlug && e.number === number);

// ---------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------

export const allCharacters = (): Character[] => characters;
export const publishedCharacters = (): Character[] => characters.filter(isPublished);
export const getCharacterBySlug = (slug: string): Character | undefined =>
  characters.find((c) => c.slug === slug);

export const charactersForAnime = (animeSlug: string): Character[] =>
  publishedCharacters().filter((c) => c.anime === animeSlug);

export const relationshipsForCharacter = (slug: string): CharacterRelationship[] =>
  characterRelationships.filter((r) => r.from === slug || r.to === slug);

// ---------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------

export const allArticles = (): Article[] => articles;
export const publishedArticles = (): Article[] => articles.filter(isPublished);
export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);

export const articlesForAnime = (animeSlug: string): Article[] =>
  publishedArticles().filter((a) => a.related.includes(animeSlug));

/** All legacy author slugs resolve to the single editorial desk byline. */
export const getAuthorBySlug = (_slug?: string) => authors[0];

// ---------------------------------------------------------------------
// Studios / Genres / Franchises / Arcs / Rankings / Watch orders
// ---------------------------------------------------------------------

export const allStudios = (): Studio[] => studios;
export const getStudioBySlug = (slug: string): Studio | undefined =>
  studios.find((s) => s.slug === slug);

export const allGenres = (): Genre[] => genres;
export const getGenreBySlug = (slug: string): Genre | undefined =>
  genres.find((g) => g.slug === slug);

export const allFranchises = (): Franchise[] => franchises;
export const getFranchiseBySlug = (slug: string): Franchise | undefined =>
  franchises.find((f) => f.slug === slug);

export const franchiseInChronologicalOrder = (slug: string): Franchise["entries"] => {
  const f = getFranchiseBySlug(slug);
  if (!f) return [];
  return [...f.entries].sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
};

export const allWatchOrders = (): WatchOrder[] => watchOrders;
export const getWatchOrder = (slug: string): WatchOrder | undefined =>
  watchOrders.find((w) => w.slug === slug);

export const allStoryArcs = (): StoryArc[] => storyArcs;
export const arcsForAnime = (animeSlug: string): StoryArc[] =>
  storyArcs.filter((a) => a.animeSlug === animeSlug);

export const allRankings = (): Ranking[] => rankings;
export const publishedRankings = (): Ranking[] => rankings.filter(isPublished);
export const getRankingBySlug = (slug: string): Ranking | undefined =>
  rankings.find((r) => r.slug === slug);

// ---------------------------------------------------------------------
// Unified search index
// ---------------------------------------------------------------------

export type SearchEntry = {
  slug: string;
  title: string;
  subtitle?: string;
  kind: "anime" | "character" | "studio" | "genre" | "article" | "episode" | "franchise" | "ranking";
  href: string;
  keywords: string[];
};

export function buildSearchIndex(): SearchEntry[] {
  const idx: SearchEntry[] = [];
  for (const a of publishedAnime()) {
    idx.push({
      slug: a.slug, title: a.title, subtitle: `${a.year} · ${a.status}`,
      kind: "anime", href: `/anime/${a.slug}`,
      keywords: [a.title, a.japaneseTitle ?? "", a.tagline, ...a.themes, ...a.genres],
    });
  }
  for (const c of publishedCharacters()) {
    idx.push({
      slug: c.slug, title: c.name, subtitle: c.role,
      kind: "character", href: `/character/${c.slug}`,
      keywords: [c.name, c.role, ...c.personality],
    });
  }
  for (const s of studios) {
    idx.push({
      slug: s.slug, title: s.name, subtitle: "Studio",
      kind: "studio", href: `/studio/${s.slug}`,
      keywords: [s.name, s.country],
    });
  }
  for (const g of genres) {
    idx.push({
      slug: g.slug, title: g.name, subtitle: "Genre",
      kind: "genre", href: `/genre/${g.slug}`,
      keywords: [g.name],
    });
  }
  for (const a of publishedArticles()) {
    idx.push({
      slug: a.slug, title: a.title, subtitle: a.tag,
      kind: "article", href: `/article/${a.slug}`,
      keywords: [a.title, a.excerpt, a.tag, a.section],
    });
  }
  for (const e of publishedEpisodes()) {
    idx.push({
      slug: `${e.animeSlug}-ep-${e.number}`,
      title: `Ep. ${e.number} — ${e.title}`,
      subtitle: `${e.animeSlug} · ${e.arc}`,
      kind: "episode",
      href: `/anime/${e.animeSlug}/episode/${e.number}`,
      keywords: [e.title, e.arc, e.animeSlug, ...e.themes],
    });
  }
  for (const f of franchises) {
    idx.push({
      slug: f.slug, title: f.name, subtitle: "Franchise",
      kind: "franchise", href: `/watch-order#${f.slug}`,
      keywords: [f.name],
    });
  }
  for (const r of publishedRankings()) {
    idx.push({
      slug: r.slug, title: r.title, subtitle: "Ranking",
      kind: "ranking", href: `/top-lists#${r.slug}`,
      keywords: [r.title, r.summary],
    });
  }
  return idx;
}

// ---------------------------------------------------------------------
// Sitemap paths (published only)
// ---------------------------------------------------------------------

export function collectSitemapPaths(): string[] {
  const paths: string[] = [];
  for (const a of publishedAnime()) paths.push(`/anime/${a.slug}`);
  for (const e of publishedEpisodes()) paths.push(`/anime/${e.animeSlug}/episode/${e.number}`);
  for (const c of publishedCharacters()) paths.push(`/character/${c.slug}`);
  for (const s of studios) paths.push(`/studio/${s.slug}`);
  for (const g of genres) paths.push(`/genre/${g.slug}`);
  for (const a of publishedArticles()) paths.push(`/article/${a.slug}`);
  return paths;
}

// ---------------------------------------------------------------------
// Reference integrity — used by scripts/validate-content.ts
// ---------------------------------------------------------------------

export type ValidationIssue = { level: "error" | "warn"; kind: string; message: string };

export function validateReferences(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const animeSlugs = new Set(animes.map((a) => a.slug));
  const characterSlugs = new Set(characters.map((c) => c.slug));
  const studioSlugs = new Set(studios.map((s) => s.slug));
  const genreSlugs = new Set(genres.map((g) => g.slug));

  // Duplicate slugs across each collection
  const dupCheck = (label: string, list: { slug: string }[]) => {
    const seen = new Set<string>();
    for (const item of list) {
      if (seen.has(item.slug))
        issues.push({ level: "error", kind: "duplicate-slug", message: `${label}: duplicate slug "${item.slug}"` });
      seen.add(item.slug);
    }
  };
  dupCheck("anime", animes);
  dupCheck("character", characters);
  dupCheck("studio", studios);
  dupCheck("genre", genres);
  dupCheck("article", articles);
  dupCheck("franchise", franchises);
  dupCheck("ranking", rankings);

  // Anime references
  for (const a of animes) {
    if (!studioSlugs.has(a.studio))
      issues.push({ level: "error", kind: "missing-ref", message: `anime "${a.slug}" → studio "${a.studio}" not found` });
    for (const g of a.genres)
      if (!genreSlugs.has(g))
        issues.push({ level: "error", kind: "missing-ref", message: `anime "${a.slug}" → genre "${g}" not found` });
    for (const c of a.characters)
      if (!characterSlugs.has(c))
        issues.push({ level: "warn", kind: "missing-ref", message: `anime "${a.slug}" → character "${c}" not found` });
    for (const s of a.similar)
      if (!animeSlugs.has(s))
        issues.push({ level: "warn", kind: "missing-ref", message: `anime "${a.slug}" → similar "${s}" not found` });
  }

  // Character references
  for (const c of characters) {
    if (!animeSlugs.has(c.anime))
      issues.push({ level: "error", kind: "missing-ref", message: `character "${c.slug}" → anime "${c.anime}" not found` });
  }

  // Episode references + duplicates + missing anime
  const epKey = new Set<string>();
  for (const e of episodes) {
    if (!animeSlugs.has(e.animeSlug))
      issues.push({ level: "error", kind: "missing-ref", message: `episode ${e.number} → anime "${e.animeSlug}" not found` });
    const key = `${e.animeSlug}#${e.number}`;
    if (epKey.has(key))
      issues.push({ level: "error", kind: "duplicate-episode", message: `duplicate episode "${key}"` });
    epKey.add(key);
  }

  // Article related anime
  for (const a of articles) {
    for (const r of a.related)
      if (!animeSlugs.has(r))
        issues.push({ level: "warn", kind: "missing-ref", message: `article "${a.slug}" → related anime "${r}" not found` });
  }

  // Relationships reference known characters
  for (const r of characterRelationships) {
    if (!characterSlugs.has(r.from))
      issues.push({ level: "error", kind: "missing-ref", message: `relationship → character "${r.from}" not found` });
    if (!characterSlugs.has(r.to))
      issues.push({ level: "error", kind: "missing-ref", message: `relationship → character "${r.to}" not found` });
  }

  // Story arcs
  for (const arc of storyArcs) {
    if (!animeSlugs.has(arc.animeSlug))
      issues.push({ level: "error", kind: "missing-ref", message: `arc "${arc.slug}" → anime "${arc.animeSlug}" not found` });
  }

  // Franchises
  for (const f of franchises) {
    for (const e of f.entries) {
      if (e.animeSlug && !animeSlugs.has(e.animeSlug))
        issues.push({ level: "warn", kind: "missing-ref", message: `franchise "${f.slug}" → entry "${e.title}" references unknown anime "${e.animeSlug}"` });
    }
  }

  return issues;
}

// ---------------------------------------------------------------------
// Stats — for the honest final report and validation output
// ---------------------------------------------------------------------

export function contentStats() {
  return {
    anime: { total: animes.length, published: publishedAnime().length },
    episodes: { total: episodes.length, published: publishedEpisodes().length },
    characters: { total: characters.length, published: publishedCharacters().length },
    articles: { total: articles.length, published: publishedArticles().length },
    studios: studios.length,
    genres: genres.length,
    franchises: franchises.length,
    rankings: { total: rankings.length, published: publishedRankings().length },
    watchOrders: watchOrders.length,
    storyArcs: storyArcs.length,
    relationships: characterRelationships.length,
    sitemapUrls: collectSitemapPaths().length,
  };
}
