import { rewardWallpapers } from "@/lib/reward-wallpapers";

/**
 * The vault's prize pool. Every entry resolves to a file that actually
 * exists in this repository and downloads for real — the wallpapers come
 * straight from the same `rewardWallpapers` list that backs
 * /rewards/anime-wallpapers, and the resources are the generated files in
 * public/downloads. Nothing here is a placeholder or a promise of value
 * the site can't deliver, so descriptions quote real dimensions and real
 * page counts rather than marketing numbers.
 */

export type VaultPrize = {
  id: string;
  kind: "wallpaper" | "resource";
  title: string;
  /** Honest, specific detail — real resolution or real file description. */
  detail: string;
  series?: string;
  preview?: string;
  download: string;
  filename: string;
};

/** Files in public/downloads, described from their own README. */
const RESOURCE_PRIZES: VaultPrize[] = [
  {
    id: "resource-watchlist",
    kind: "resource",
    title: "Ultimate Anime Watchlist 2026",
    detail: "15-page spoiler-light PDF roadmap covering 23 catalog titles",
    download: "/downloads/ultimate-anime-watchlist-2026.pdf",
    filename: "gamecastle-ultimate-anime-watchlist-2026.pdf",
  },
  {
    id: "resource-tracker",
    kind: "resource",
    title: "Anime Tracker Template",
    detail: "Editable CSV tracker, prefilled with 23 titles",
    download: "/downloads/anime-tracker-template.csv",
    filename: "gamecastle-anime-tracker-template.csv",
  },
  {
    id: "resource-infographic",
    kind: "resource",
    title: "Starter Picks Infographic",
    detail: "1800 × 3200 PNG infographic of the 23-title starter set",
    download: "/downloads/top-50-anime-infographic.png",
    filename: "gamecastle-starter-picks-infographic.png",
  },
];

/**
 * lib/asset-url resolves bundled artwork to absolute gamecastle.store URLs,
 * which is fine for <img> but breaks the anchor `download` attribute —
 * browsers ignore it cross-origin, so a click would navigate instead of
 * saving. Collapsing our own origin back to a path keeps every prize
 * same-origin, so downloads behave identically in preview and production.
 */
function sameOriginPath(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?gamecastle\.store/i, "");
}

/**
 * public/rewards/wallpapers/giant-wall-battle-hd.webp is committed at 0
 * bytes, so it serves a 200 with an empty body — a visitor "winning" it
 * would download nothing. Excluded until the real artwork is restored;
 * delete this entry once the file has real content. (The same broken
 * asset is still offered on /rewards/anime-wallpapers.)
 */
const EMPTY_ASSETS = new Set(["/rewards/wallpapers/giant-wall-battle-hd.webp"]);

const WALLPAPER_PRIZES: VaultPrize[] = rewardWallpapers
  .filter((w) => !EMPTY_ASSETS.has(sameOriginPath(w.download)))
  .map((w) => ({
    id: `wallpaper-${w.id}`,
    kind: "wallpaper" as const,
    title: w.titleEn,
    detail: `${w.format} wallpaper · ${w.width} × ${w.height}`,
    series: w.seriesEn,
    preview: sameOriginPath(w.preview),
    download: sameOriginPath(w.download),
    filename: w.filename,
  }));

export const VAULT_PRIZES: VaultPrize[] = [...WALLPAPER_PRIZES, ...RESOURCE_PRIZES];

/** Picks a prize at random, avoiding an immediate repeat where possible. */
export function drawPrize(excludeId?: string): VaultPrize {
  const pool =
    VAULT_PRIZES.length > 1 && excludeId
      ? VAULT_PRIZES.filter((p) => p.id !== excludeId)
      : VAULT_PRIZES;
  return pool[Math.floor(Math.random() * pool.length)];
}
