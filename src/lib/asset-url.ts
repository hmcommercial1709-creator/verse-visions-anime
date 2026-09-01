/** Original artwork is bundled with the site, independent of the old host. */
const SITE_ORIGIN = "https://gamecastle.store";
const ASSET_PREFIX = "/__l5e/assets-v1/";

export function assetUrl(url: string): string {
  return url.startsWith(ASSET_PREFIX)
    ? `${SITE_ORIGIN}/media/${url.slice(ASSET_PREFIX.length)}`
    : url;
}
