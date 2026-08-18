/**
 * CDN asset URL resolver.
 *
 * `.asset.json` pointers store root-relative paths (`/__l5e/assets-v1/...`)
 * that only resolve when the site is served by Lovable's own infrastructure.
 * When the build is deployed elsewhere (Netlify, Vercel, static hosts) those
 * paths 404 and every image breaks, so we always emit the absolute CDN origin.
 */
const CDN_ORIGIN = "https://gamecastle.store";

const ASSET_PREFIX = "/__l5e/";

export function assetUrl(url: string): string {
  return url.startsWith(ASSET_PREFIX) ? `${CDN_ORIGIN}${url}` : url;
}
