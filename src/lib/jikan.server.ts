/**
 * Jikan (MyAnimeList) API access layer.
 *
 * Every helper is failure-tolerant on purpose: the site's pages are fully
 * rendered from the local content library, and this data is only ever an
 * enrichment layer. A network error, rate limit (Jikan allows ~3 req/s) or
 * timeout resolves to `null` so the page keeps its cached local content.
 */

const BASE = "https://api.jikan.moe/v4";
const TTL_MS = 6 * 60 * 60 * 1000; // 6h — MAL metadata changes slowly.

type CacheEntry = { at: number; value: unknown };
const cache = new Map<string, CacheEntry>();

async function cached<T>(key: string, loader: () => Promise<T>): Promise<T | null> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  try {
    const value = await loader();
    cache.set(key, { at: Date.now(), value });
    return value;
  } catch {
    // Serve stale data rather than nothing when the upstream API is unhappy.
    return hit ? (hit.value as T) : null;
  }
}

async function get(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`jikan ${res.status}`);
  return res.json();
}

export type AnimeEnrichment = {
  malId: number;
  url: string;
  image?: string;
  synopsis?: string;
  background?: string;
  score?: number;
  scoredBy?: number;
  rank?: number;
  members?: number;
  favorites?: number;
  aired?: string;
  broadcast?: string;
  season?: string;
  source?: string;
  duration?: string;
  ratingLabel?: string;
  trailerId?: string;
  studios: string[];
  producers: string[];
  themes: string[];
  streaming: { name: string; url: string }[];
  cast: { character: string; image?: string; role?: string; voiceActor?: string }[];
  episodes: { number: number; title: string; aired?: string; filler?: boolean }[];
};

function normalizeAnime(a: any): Omit<AnimeEnrichment, "cast" | "episodes"> {
  return {
    malId: a.mal_id,
    url: a.url,
    image: a.images?.webp?.large_image_url ?? a.images?.jpg?.large_image_url,
    synopsis: a.synopsis ?? undefined,
    background: a.background ?? undefined,
    score: a.score ?? undefined,
    scoredBy: a.scored_by ?? undefined,
    rank: a.rank ?? undefined,
    members: a.members ?? undefined,
    favorites: a.favorites ?? undefined,
    aired: a.aired?.string ?? undefined,
    broadcast: a.broadcast?.string ?? undefined,
    season: a.season && a.year ? `${a.season} ${a.year}` : undefined,
    source: a.source ?? undefined,
    duration: a.duration ?? undefined,
    ratingLabel: a.rating ?? undefined,
    trailerId: a.trailer?.youtube_id ?? undefined,
    studios: (a.studios ?? []).map((s: any) => s.name),
    producers: (a.producers ?? []).map((s: any) => s.name).slice(0, 6),
    themes: (a.themes ?? []).map((s: any) => s.name),
    streaming: (a.streaming ?? []).map((s: any) => ({ name: s.name, url: s.url })),
  };
}

/** Resolve a local title to a MAL entry, then pull cast + episode directory. */
export async function fetchAnimeEnrichment(
  title: string,
  year?: number,
): Promise<AnimeEnrichment | null> {
  return cached(`anime:${title}:${year ?? ""}`, async () => {
    const search = await get(`/anime?q=${encodeURIComponent(title)}&limit=1&sfw=true`);
    const hit = search?.data?.[0];
    if (!hit) throw new Error("no match");
    const base = normalizeAnime(hit);

    const [charsRes, epsRes] = await Promise.allSettled([
      get(`/anime/${base.malId}/characters`),
      get(`/anime/${base.malId}/episodes`),
    ]);

    const cast =
      charsRes.status === "fulfilled"
        ? (charsRes.value?.data ?? []).slice(0, 12).map((c: any) => ({
            character: c.character?.name,
            image: c.character?.images?.webp?.image_url ?? c.character?.images?.jpg?.image_url,
            role: c.role,
            voiceActor: (c.voice_actors ?? []).find((v: any) => v.language === "Japanese")?.person
              ?.name,
          }))
        : [];

    const episodes =
      epsRes.status === "fulfilled"
        ? (epsRes.value?.data ?? []).slice(0, 60).map((e: any) => ({
            number: e.mal_id,
            title: e.title,
            aired: e.aired ?? undefined,
            filler: Boolean(e.filler),
          }))
        : [];

    return { ...base, cast, episodes } satisfies AnimeEnrichment;
  });
}

export type CharacterEnrichment = {
  malId: number;
  url: string;
  image?: string;
  about?: string;
  favorites?: number;
  nicknames: string[];
  voiceActors: { name: string; language: string }[];
  appearances: { title: string; role?: string }[];
};

/** Resolve a character profile: bio, nicknames, voice cast and appearances. */
export async function fetchCharacterEnrichment(
  name: string,
): Promise<CharacterEnrichment | null> {
  return cached(`character:${name}`, async () => {
    const search = await get(`/characters?q=${encodeURIComponent(name)}&limit=1`);
    const hit = search?.data?.[0];
    if (!hit) throw new Error("no match");

    const full = await get(`/characters/${hit.mal_id}/full`).catch(() => null);
    const d = full?.data ?? hit;

    return {
      malId: d.mal_id,
      url: d.url,
      image: d.images?.webp?.image_url ?? d.images?.jpg?.image_url,
      about: typeof d.about === "string" ? d.about.slice(0, 1800) : undefined,
      favorites: d.favorites ?? undefined,
      nicknames: d.nicknames ?? [],
      voiceActors: (d.voices ?? [])
        .slice(0, 6)
        .map((v: any) => ({ name: v.person?.name, language: v.language }))
        .filter((v: any) => v.name),
      appearances: (d.anime ?? [])
        .slice(0, 10)
        .map((a: any) => ({ title: a.anime?.title, role: a.role }))
        .filter((a: any) => a.title),
    } satisfies CharacterEnrichment;
  });
}

/** Current-season titles for the /seasonal hub. */
export async function fetchSeasonNow(): Promise<
  { malId: number; title: string; image?: string; score?: number; url: string; type?: string; episodes?: number }[] | null
> {
  return cached("season:now", async () => {
    const res = await get(`/seasons/now?limit=24&sfw=true`);
    return (res?.data ?? []).slice(0, 24).map((a: any) => ({
      malId: a.mal_id,
      title: a.title_english || a.title,
      image: a.images?.webp?.large_image_url ?? a.images?.jpg?.large_image_url,
      score: a.score ?? undefined,
      url: a.url,
      type: a.type ?? undefined,
      episodes: a.episodes ?? undefined,
    }));
  });
}
