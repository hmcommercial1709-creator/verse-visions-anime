import { useEffect, useState } from "react";

/**
 * Lightweight, privacy-friendly geo/pricing targeting.
 *
 * We never call an IP lookup service (that would cost a round trip and block
 * the ad request). Instead we derive the region from the browser locale +
 * timezone, which is enough to pick a pricing tier for floor targeting.
 */

export type GeoTier = "tier1" | "tier2" | "tier3";

export interface GeoTarget {
  country: string;
  region: string;
  tier: GeoTier;
  currency: string;
}

const TIER1 = new Set(["US", "CA", "GB", "AU", "NZ", "DE", "CH", "NO", "SE", "DK", "NL", "IE", "JP", "SG", "AT", "FI", "BE", "LU"]);
const TIER2 = new Set(["FR", "IT", "ES", "PT", "KR", "IL", "AE", "SA", "QA", "KW", "PL", "CZ", "GR", "TW", "HK", "CL", "MX", "BR", "TR", "MY", "ZA"]);

const REGIONS: Record<string, string> = {
  US: "NA", CA: "NA", MX: "NA",
  GB: "EU", IE: "EU", DE: "EU", FR: "EU", IT: "EU", ES: "EU", PT: "EU", NL: "EU", BE: "EU",
  SE: "EU", NO: "EU", DK: "EU", FI: "EU", PL: "EU", CZ: "EU", AT: "EU", CH: "EU", GR: "EU", TR: "EU",
  JP: "APAC", KR: "APAC", TW: "APAC", HK: "APAC", SG: "APAC", MY: "APAC", ID: "APAC", PH: "APAC",
  IN: "APAC", TH: "APAC", VN: "APAC", AU: "OCE", NZ: "OCE",
  AE: "MENA", SA: "MENA", QA: "MENA", KW: "MENA", EG: "MENA", MA: "MENA", IL: "MENA",
  BR: "LATAM", AR: "LATAM", CL: "LATAM", CO: "LATAM", PE: "LATAM",
  ZA: "AF", NG: "AF", KE: "AF",
};

const CURRENCIES: Record<string, string> = {
  NA: "USD", EU: "EUR", APAC: "USD", OCE: "AUD", MENA: "USD", LATAM: "USD", AF: "USD",
};

function countryFromEnvironment(): string {
  if (typeof navigator === "undefined") return "US";
  const locales = [navigator.language, ...(navigator.languages ?? [])];
  for (const loc of locales) {
    const region = loc?.split(/[-_]/)[1];
    if (region && region.length === 2) return region.toUpperCase();
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (tz.startsWith("America/")) return "US";
    if (tz.startsWith("Europe/")) return "DE";
    if (tz.startsWith("Asia/Tokyo")) return "JP";
    if (tz.startsWith("Australia/")) return "AU";
  } catch {
    /* ignore */
  }
  return "US";
}

export function tierFor(country: string): GeoTier {
  if (TIER1.has(country)) return "tier1";
  if (TIER2.has(country)) return "tier2";
  return "tier3";
}

export function geoTargetFor(country: string): GeoTarget {
  const region = REGIONS[country] ?? "GLOBAL";
  return { country, region, tier: tierFor(country), currency: CURRENCIES[region] ?? "USD" };
}

/** SSR-safe: renders a neutral default, then upgrades after hydration. */
export function useGeoTarget(): GeoTarget {
  const [geo, setGeo] = useState<GeoTarget>(() => geoTargetFor("US"));

  useEffect(() => {
    setGeo(geoTargetFor(countryFromEnvironment()));
  }, []);

  return geo;
}

/** Key/value pairs handed to the ad request for floor + creative targeting. */
export function adTargetingAttributes(geo: GeoTarget, slotId: string) {
  return {
    "data-geo-country": geo.country,
    "data-geo-region": geo.region,
    "data-geo-tier": geo.tier,
    "data-geo-currency": geo.currency,
    "data-ad-targeting": `slot=${slotId};country=${geo.country};region=${geo.region};tier=${geo.tier}`,
  } as const;
}
