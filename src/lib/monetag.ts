/**
 * Monetag in-page inventory only.
 *
 * STRICT POLICY: only In-Feed / Native / Display *banner* zones may be listed
 * here. Popunder, OnClick, Vignette, Interstitial and Direct-Link zones are
 * forbidden — they are popunder-class formats and must never be loaded.
 *
 * Add banner zone IDs (from Monetag dashboard → Banner / Native / In-Page)
 * either here or through the VITE_MONETAG_BANNER_ZONES env var
 * (comma-separated). When the list is empty, every slot simply serves AdSense.
 */
const ENV_ZONES = (import.meta.env.VITE_MONETAG_BANNER_ZONES as string | undefined) ?? "";

/** Hard-coded banner/native zones. Keep popunder zones OUT of this array. */
const STATIC_ZONES: string[] = [];

export const MONETAG_BANNER_ZONES: string[] = [
  ...STATIC_ZONES,
  ...ENV_ZONES.split(",")
    .map((z) => z.trim())
    .filter(Boolean),
];

export const hasMonetagBanners = () => MONETAG_BANNER_ZONES.length > 0;

/** Deterministic zone pick so SSR and hydration agree, then rotates on refresh. */
export function pickMonetagZone(seed: number) {
  if (!MONETAG_BANNER_ZONES.length) return null;
  return MONETAG_BANNER_ZONES[Math.abs(seed) % MONETAG_BANNER_ZONES.length];
}
