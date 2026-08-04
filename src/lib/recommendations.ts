import { animes, type Anime } from "@/data/animes";
import { characters, type Character } from "@/data/characters";
import { publishedArticleList, type Article } from "@/data/articles";

const articles = publishedArticleList();

// ---------- Anime → Anime ----------
// Score by curated similar list, shared genres, same studio, shared themes,
// and shared characters. Curated `similar` gets the biggest boost so editors
// can override the algorithm.
export function recommendAnime(slug: string, limit = 6): Anime[] {
  const src = animes.find((a) => a.slug === slug);
  if (!src) return [];
  const srcThemes = new Set(src.themes.map((t) => t.toLowerCase()));
  const srcGenres = new Set(src.genres);
  const srcChars = new Set(src.characters);
  const curated = new Set(src.similar);

  const scored = animes
    .filter((a) => a.slug !== slug)
    .map((a) => {
      let score = 0;
      if (curated.has(a.slug)) score += 8;
      score += a.genres.filter((g) => srcGenres.has(g)).length * 3;
      if (a.studio === src.studio) score += 2;
      score += a.themes.filter((t) => srcThemes.has(t.toLowerCase())).length * 2;
      score += a.characters.filter((c) => srcChars.has(c)).length * 4;
      // tiny popularity tiebreaker (lower rank = more popular)
      score += Math.max(0, 5 - a.popularity) * 0.1;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);

  return scored;
}

// ---------- Article → Article ----------
// "Readers also enjoyed": shared related anime, same tag, same section.
export function recommendArticles(slug: string, limit = 4): Article[] {
  const src = articles.find((a) => a.slug === slug);
  if (!src) return [];
  const rel = new Set(src.related);

  return articles
    .filter((a) => a.slug !== slug)
    .map((a) => {
      let score = 0;
      score += a.related.filter((r) => rel.has(r)).length * 4;
      if (a.tag === src.tag) score += 3;
      if (a.section === src.section) score += 2;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

// Anime recommended for an article — via the article's related list, then
// backfilled through recommendAnime on the top related entry.
export function articleAnimeRecs(slug: string, limit = 4): Anime[] {
  const src = articles.find((a) => a.slug === slug);
  if (!src) return [];
  const direct = src.related
    .map((r) => animes.find((a) => a.slug === r))
    .filter(Boolean) as Anime[];
  if (direct.length >= limit) return direct.slice(0, limit);
  const seed = direct[0];
  const backfill = seed ? recommendAnime(seed.slug, limit) : [];
  const seen = new Set(direct.map((a) => a.slug));
  for (const b of backfill) {
    if (seen.has(b.slug)) continue;
    direct.push(b);
    seen.add(b.slug);
    if (direct.length >= limit) break;
  }
  return direct.slice(0, limit);
}

// ---------- Character → Character ----------
// Same anime first, then shared personality traits across the whole cast.
export function recommendCharacters(slug: string, limit = 4): Character[] {
  const src = characters.find((c) => c.slug === slug);
  if (!src) return [];
  const traits = new Set(src.personality.map((p) => p.toLowerCase()));

  return characters
    .filter((c) => c.slug !== slug)
    .map((c) => {
      let score = 0;
      if (c.anime === src.anime) score += 5;
      score += c.personality.filter((p) => traits.has(p.toLowerCase())).length * 1.5;
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.c);
}

// Continue exploring from a character: their anime's recs.
export function characterAnimeRecs(slug: string, limit = 4): Anime[] {
  const c = characters.find((ch) => ch.slug === slug);
  if (!c) return [];
  return recommendAnime(c.anime, limit);
}
