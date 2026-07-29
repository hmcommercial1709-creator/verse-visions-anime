/**
 * Visual Media Engine — one unique illustration per title.
 *
 * Every anime and every article maps to its own dedicated artwork file. There
 * are no shared genre placeholders: the maps below are 1:1, so no two cards on
 * a page can ever render the same image.
 */
import pNaruto from "@/assets/art/naruto.webp.asset.json";
import pOnePiece from "@/assets/art/one-piece.webp.asset.json";
import pAttackOnTitan from "@/assets/art/attack-on-titan.webp.asset.json";
import pDemonSlayer from "@/assets/art/demon-slayer.webp.asset.json";
import pJujutsuKaisen from "@/assets/art/jujutsu-kaisen.webp.asset.json";
import pDeathNote from "@/assets/art/death-note.webp.asset.json";
import pFullmetalAlchemistBrotherhood from "@/assets/art/fullmetal-alchemist-brotherhood.webp.asset.json";
import pHunterXHunter from "@/assets/art/hunter-x-hunter.webp.asset.json";
import pChainsawMan from "@/assets/art/chainsaw-man.webp.asset.json";
import pSoloLeveling from "@/assets/art/solo-leveling.webp.asset.json";
import pFrieren from "@/assets/art/frieren.webp.asset.json";
import pSpyXFamily from "@/assets/art/spy-x-family.webp.asset.json";
import pDragonBallZ from "@/assets/art/dragon-ball-z.webp.asset.json";
import pBleach from "@/assets/art/bleach.webp.asset.json";
import pMyHeroAcademia from "@/assets/art/my-hero-academia.webp.asset.json";
import pJojosBizarreAdventure from "@/assets/art/jojos-bizarre-adventure.webp.asset.json";
import pOnePunchMan from "@/assets/art/one-punch-man.webp.asset.json";
import pMobPsycho100 from "@/assets/art/mob-psycho-100.webp.asset.json";
import pHaikyuu from "@/assets/art/haikyuu.webp.asset.json";
import pBlueLock from "@/assets/art/blue-lock.webp.asset.json";
import pBlackClover from "@/assets/art/black-clover.webp.asset.json";
import pDrStone from "@/assets/art/dr-stone.webp.asset.json";
import pYuYuHakusho from "@/assets/art/yu-yu-hakusho.webp.asset.json";
import bWhyFrierenWon2024 from "@/assets/art/why-frieren-won-2024.webp.asset.json";
import bOnePieceWanoRecap from "@/assets/art/one-piece-wano-recap.webp.asset.json";
import bBeginnerGuideModernShonen from "@/assets/art/beginner-guide-modern-shonen.webp.asset.json";
import bReviewJujutsuKaisenS2 from "@/assets/art/review-jujutsu-kaisen-s2.webp.asset.json";
import bTop10Anime2026 from "@/assets/art/top-10-anime-2026.webp.asset.json";
import bChainsawManRezeArcPreview from "@/assets/art/chainsaw-man-reze-arc-preview.webp.asset.json";
import bSoloLevelingS2Review from "@/assets/art/solo-leveling-s2-review.webp.asset.json";
import bSpyXFamilyCruiseArc from "@/assets/art/spy-x-family-cruise-arc.webp.asset.json";
import bBestAction2026 from "@/assets/art/best-action-thriller-anime-2026.webp.asset.json";
import bGames2026 from "@/assets/art/top-upcoming-anime-open-world-games-2026.webp.asset.json";
import artLimitless from "@/assets/media/art-limitless.webp.asset.json";
import artLimitlessSm from "@/assets/media/art-limitless-800.webp.asset.json";
import artShibuya from "@/assets/media/art-shibuya.webp.asset.json";
import artShibuyaSm from "@/assets/media/art-shibuya-800.webp.asset.json";
import artClans from "@/assets/media/art-clans.webp.asset.json";
import artClansSm from "@/assets/media/art-clans-800.webp.asset.json";
import artTrailer from "@/assets/media/art-trailer.webp.asset.json";
import artTrailerSm from "@/assets/media/art-trailer-800.webp.asset.json";

export type MediaArt = {
  /** Full-size WebP CDN url. */
  src: string;
  /** Responsive srcset (a half-width variant when one exists). */
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

const one = (full: { url: string }, width: number, height: number): MediaArt => ({
  src: full.url,
  srcSet: `${full.url} ${width}w`,
  width,
  height,
});

/** Wide 16:9 key visuals used by heroes, article headers and video posters. */
export const backdrops = {
  limitless: art(artLimitless, artLimitlessSm, 1600, 912),
  shibuya: art(artShibuya, artShibuyaSm, 1600, 912),
  clans: art(artClans, artClansSm, 1600, 912),
  trailer: art(artTrailer, artTrailerSm, 1600, 912),
} satisfies Record<string, MediaArt>;

/** One dedicated 2:3 poster per series — unique, never shared. */
const animePosters: Record<string, MediaArt> = {
  "naruto": one(pNaruto, 1024, 1536),
  "one-piece": one(pOnePiece, 1024, 1536),
  "attack-on-titan": one(pAttackOnTitan, 1024, 1536),
  "demon-slayer": one(pDemonSlayer, 1024, 1536),
  "jujutsu-kaisen": one(pJujutsuKaisen, 1024, 1536),
  "death-note": one(pDeathNote, 1024, 1536),
  "fullmetal-alchemist-brotherhood": one(pFullmetalAlchemistBrotherhood, 1024, 1536),
  "hunter-x-hunter": one(pHunterXHunter, 1024, 1536),
  "chainsaw-man": one(pChainsawMan, 1024, 1536),
  "solo-leveling": one(pSoloLeveling, 1024, 1536),
  "frieren": one(pFrieren, 1024, 1536),
  "spy-x-family": one(pSpyXFamily, 1024, 1536),
  "dragon-ball-z": one(pDragonBallZ, 1024, 1536),
  "bleach": one(pBleach, 1024, 1536),
  "my-hero-academia": one(pMyHeroAcademia, 1024, 1536),
  "jojos-bizarre-adventure": one(pJojosBizarreAdventure, 1024, 1536),
  "one-punch-man": one(pOnePunchMan, 1024, 1536),
  "mob-psycho-100": one(pMobPsycho100, 1024, 1536),
  "haikyuu": one(pHaikyuu, 1024, 1536),
  "blue-lock": one(pBlueLock, 1024, 1536),
  "black-clover": one(pBlackClover, 1024, 1536),
  "dr-stone": one(pDrStone, 1024, 1536),
  "yu-yu-hakusho": one(pYuYuHakusho, 1024, 1536),
};

/** One dedicated 16:9 key visual per article. */
const articleBackdrops: Record<string, MediaArt> = {
  "gojo-satoru-limitless-technique-explained": backdrops.limitless,
  "shibuya-incident-timeline": backdrops.shibuya,
  "three-great-sorcerer-families": backdrops.clans,
  "why-frieren-won-2024": one(bWhyFrierenWon2024, 1536, 864),
  "one-piece-wano-recap": one(bOnePieceWanoRecap, 1536, 864),
  "beginner-guide-modern-shonen": one(bBeginnerGuideModernShonen, 1536, 864),
  "review-jujutsu-kaisen-s2": one(bReviewJujutsuKaisenS2, 1536, 864),
  "top-10-anime-2026": one(bTop10Anime2026, 1536, 864),
  "chainsaw-man-reze-arc-preview": one(bChainsawManRezeArcPreview, 1536, 864),
  "solo-leveling-s2-review": one(bSoloLevelingS2Review, 1536, 864),
  "spy-x-family-cruise-arc": one(bSpyXFamilyCruiseArc, 1536, 864),
  "best-action-thriller-anime-2026": one(bBestAction2026, 1536, 864),
  "top-upcoming-anime-open-world-games-2026": one(bGames2026, 1536, 864),
};

/** Stable, SSR-safe hash so server and client resolve the same artwork. */
const hash = (key: string): number => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const posterLibrary = Object.values(animePosters);
const backdropLibrary = Object.values(articleBackdrops);

/** Poster (2:3) artwork for an anime or hub item. */
export const posterFor = (slug: string, _hints: string[] = []): MediaArt =>
  animePosters[slug] ?? posterLibrary[hash(slug) % posterLibrary.length];

/** Backdrop (16:9) artwork for an article, hero slide or section header. */
export const backdropFor = (slug: string, _hints: string[] = []): MediaArt =>
  articleBackdrops[slug] ?? animePosters[slug] ?? backdropLibrary[hash(slug) % backdropLibrary.length];

/** Descriptive alt text — original art, so it is described rather than credited. */
export const artAlt = (title: string, kind: "poster" | "backdrop" = "backdrop"): string =>
  kind === "poster"
    ? `Original AnimeVerse poster illustration representing ${title}`
    : `Original AnimeVerse key-visual artwork for ${title}`;
