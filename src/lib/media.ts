/**
 * Visual Media Engine — deterministic art resolution.
 *
 * Every anime, article and hub gets artwork with no possibility of a missing
 * image: explicit overrides first, then a genre/keyword heuristic, then a
 * deterministic hash-picked fallback from the pool. All art is original
 * AnimeVerse-commissioned illustration served as WebP from the CDN.
 */
import artLimitless from "@/assets/media/art-limitless.webp.asset.json";
import artLimitlessSm from "@/assets/media/art-limitless-800.webp.asset.json";
import artShibuya from "@/assets/media/art-shibuya.webp.asset.json";
import artShibuyaSm from "@/assets/media/art-shibuya-800.webp.asset.json";
import artClans from "@/assets/media/art-clans.webp.asset.json";
import artClansSm from "@/assets/media/art-clans-800.webp.asset.json";
import artTrailer from "@/assets/media/art-trailer.webp.asset.json";
import artTrailerSm from "@/assets/media/art-trailer-800.webp.asset.json";
import backdropCity from "@/assets/media/backdrop-city.webp.asset.json";
import backdropCitySm from "@/assets/media/backdrop-city-800.webp.asset.json";
import backdropEnergy from "@/assets/media/backdrop-energy.webp.asset.json";
import backdropEnergySm from "@/assets/media/backdrop-energy-800.webp.asset.json";
import posterAction from "@/assets/media/poster-action.webp.asset.json";
import posterActionSm from "@/assets/media/poster-action-800.webp.asset.json";
import posterDark from "@/assets/media/poster-dark.webp.asset.json";
import posterDarkSm from "@/assets/media/poster-dark-800.webp.asset.json";
import posterSports from "@/assets/media/poster-sports.webp.asset.json";
import posterSportsSm from "@/assets/media/poster-sports-800.webp.asset.json";
import posterFantasy from "@/assets/media/poster-fantasy.webp.asset.json";
import posterFantasySm from "@/assets/media/poster-fantasy-800.webp.asset.json";

export type MediaArt = {
  /** Full-size WebP CDN url. */
  src: string;
  /** Responsive srcset with a half-width variant. */
  srcSet: string;
  width: number;
  height: number;
};

const art = (full: { url: string }, small: { url: string }, width: number, height: number): MediaArt => ({
  src: full.url,
  srcSet: `${small.url} ${Math.round(width / 2)}w, ${full.url} ${width}w`,
  width,
  height,
});

/** Wide 16:9 backdrops — heroes, section headers, video posters. */
export const backdrops = {
  limitless: art(artLimitless, artLimitlessSm, 1600, 912),
  shibuya: art(artShibuya, artShibuyaSm, 1600, 912),
  clans: art(artClans, artClansSm, 1600, 912),
  trailer: art(artTrailer, artTrailerSm, 1600, 912),
  city: art(backdropCity, backdropCitySm, 1600, 900),
  energy: art(backdropEnergy, backdropEnergySm, 1600, 900),
} satisfies Record<string, MediaArt>;

/** Vertical 2:3 posters — anime cards. */
export const posters = {
  action: art(posterAction, posterActionSm, 1024, 1536),
  dark: art(posterDark, posterDarkSm, 1024, 1536),
  sports: art(posterSports, posterSportsSm, 1024, 1536),
  fantasy: art(posterFantasy, posterFantasySm, 1024, 1536),
} satisfies Record<string, MediaArt>;

const backdropPool: MediaArt[] = [
  backdrops.limitless,
  backdrops.shibuya,
  backdrops.clans,
  backdrops.city,
  backdrops.energy,
  backdrops.trailer,
];
const posterPool: MediaArt[] = [posters.action, posters.dark, posters.sports, posters.fantasy];

/** Stable, SSR-safe hash so server and client resolve the same artwork. */
const hash = (key: string): number => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const pick = (pool: MediaArt[], key: string): MediaArt => pool[hash(key) % pool.length];

/** Explicit editorial artwork per slug. Anything absent falls back gracefully. */
const overrides: Record<string, MediaArt> = {
  "gojo-satoru-limitless-technique-explained": backdrops.limitless,
  "shibuya-incident-timeline": backdrops.shibuya,
  "three-great-sorcerer-families": backdrops.clans,
  "jujutsu-kaisen": backdrops.limitless,
};

const posterOverrides: Record<string, MediaArt> = {
  "jujutsu-kaisen": posters.dark,
};

const keywordPoster = (haystack: string): MediaArt | undefined => {
  const s = haystack.toLowerCase();
  if (/(sport|volleyball|basketball|football|soccer|haikyu|blue lock|slam dunk)/.test(s)) return posters.sports;
  if (/(fantasy|magic|isekai|frieren|witch|elf|alchem)/.test(s)) return posters.fantasy;
  if (/(horror|curse|demon|dark|supernatural|death|vampire|jujutsu|titan|chainsaw)/.test(s)) return posters.dark;
  if (/(action|shonen|battle|fight|hero|ninja|pirate|dragon)/.test(s)) return posters.action;
  return undefined;
};

/**
 * Poster (2:3) artwork for an anime or hub item.
 * Guaranteed non-null — never renders an empty image slot.
 */
export const posterFor = (slug: string, hints: string[] = []): MediaArt =>
  posterOverrides[slug] ?? keywordPoster([slug, ...hints].join(" ")) ?? pick(posterPool, slug);

/**
 * Backdrop (16:9) artwork for an article, hero slide or section header.
 * Guaranteed non-null — this is the fallback engine for all future content.
 */
export const backdropFor = (slug: string, hints: string[] = []): MediaArt =>
  overrides[slug] ??
  (() => {
    const s = [slug, ...hints].join(" ").toLowerCase();
    if (/(curse|jujutsu|domain|sorcer|shibuya)/.test(s)) return backdrops.energy;
    if (/(city|tokyo|slice of life|school|romance)/.test(s)) return backdrops.city;
    return undefined;
  })() ??
  pick(backdropPool, slug);

/** Descriptive alt text — original art, so it is described rather than credited. */
export const artAlt = (title: string, kind: "poster" | "backdrop" = "backdrop"): string =>
  kind === "poster"
    ? `Original AnimeVerse poster illustration representing ${title}`
    : `Original AnimeVerse key-visual artwork for ${title}`;
