/**
 * Brolexy wholesale digital-products API (server only).
 *
 * Auth per Brolexy docs: publicKey + unix `time` header plus a `signature`
 * header that is base64(hex(HmacSHA256(secretKey, time))).
 * Note: Brolexy enforces an IP whitelist, so requests only succeed from
 * whitelisted egress addresses. Every failure falls back to a curated list so
 * the storefront never renders an empty section in production.
 */

import type {
  BrolexyProduct,
  FeaturedProduct,
} from "./brolexy-types";

export type { BrolexyProduct, FeaturedProduct };

/** Retail markup applied on top of wholesale cost. */
const MARKUP = 1.25;

async function hmacHexBase64(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return btoa(hex);
}

const FALLBACK: FeaturedProduct[] = [
  { id: "psn-10-us", name: "PlayStation Store 10 USD (US)", category: "PSN", region: "US", price: 12.5, currency: "USD", inStock: 12, live: false },
  { id: "steam-20-global", name: "Steam Wallet 20 USD (Global)", category: "Steam", region: "GLOBAL", price: 24.9, currency: "USD", inStock: 20, live: false },
  { id: "xbox-gamepass-1m", name: "Xbox Game Pass Ultimate 1 Month", category: "Xbox", region: "GLOBAL", price: 17.99, currency: "USD", inStock: 8, live: false },
  { id: "roblox-800-robux", name: "Roblox 800 Robux Gift Card", category: "Roblox", region: "GLOBAL", price: 11.75, currency: "USD", inStock: 30, live: false },
  { id: "netflix-25-us", name: "Netflix Gift Card 25 USD (US)", category: "Netflix", region: "US", price: 28.4, currency: "USD", inStock: 14, live: false },
  { id: "nintendo-20-us", name: "Nintendo eShop 20 USD (US)", category: "Nintendo", region: "US", price: 23.6, currency: "USD", inStock: 9, live: false },
  { id: "pubg-660-uc", name: "PUBG Mobile 660 UC", category: "PUBG", region: "GLOBAL", price: 10.5, currency: "USD", inStock: 40, live: false },
  { id: "spotify-3m", name: "Spotify Premium 3 Months", category: "Spotify", region: "US", price: 32.9, currency: "USD", inStock: 6, live: false },
];

export function fallbackFeaturedProducts(limit: number): FeaturedProduct[] {
  return FALLBACK.slice(0, limit);
}

export async function fetchBrolexyFeatured(
  limit: number,
): Promise<FeaturedProduct[]> {
  const publicKey = process.env["BROLEXY_PUBLIC_KEY"];
  const secretKey = process.env["BROLEXY_SECRET_KEY"];
  const base = process.env["BROLEXY_API_BASE"] ?? "https://app.brolexy.com/api";

  if (!publicKey || !secretKey) return fallbackFeaturedProducts(limit);

  try {
    const time = String(Math.floor(Date.now() / 1000));
    const signature = await hmacHexBase64(secretKey, time);
    const response = await fetch(`${base}/products`, {
      headers: {
        publicKey,
        time,
        signature,
        Accept: "application/json",
        "User-Agent": "GameCastle/1.0 (+https://gamecastle.store)",
      },
    });

    if (!response.ok) return fallbackFeaturedProducts(limit);
    const raw = (await response.json()) as BrolexyProduct[] | unknown;
    if (!Array.isArray(raw) || raw.length === 0)
      return fallbackFeaturedProducts(limit);

    const mapped = (raw as BrolexyProduct[])
      .filter((p) => p && p.name && Number(p.inStock) > 0)
      .sort((a, b) => Number(b.inStock) - Number(a.inStock))
      .slice(0, limit)
      .map<FeaturedProduct>((p) => ({
        id: String(p.productId),
        name: p.name,
        category: p.category ?? "Digital",
        region: p.region ?? "GLOBAL",
        price: Number((Number(p.price || 0) * MARKUP).toFixed(2)),
        currency: p.priceCurrency || "USD",
        inStock: Number(p.inStock) || 0,
        live: true,
      }));

    return mapped.length > 0 ? mapped : fallbackFeaturedProducts(limit);
  } catch {
    return fallbackFeaturedProducts(limit);
  }
}
