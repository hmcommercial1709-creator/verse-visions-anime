import type { ZodType } from "zod";

/**
 * Boundary for the public catalog APIs (Jikan, FreeToGame).
 *
 * These are third-party endpoints we don't control and can't pin, so every
 * response is validated against a schema before it reaches a route. If the
 * shape drifts, the parse fails and the caller renders a 404 — a missing
 * page rather than one full of `undefined`. That matters more than usual
 * here: the upstream shapes were written from documentation, not from a
 * live call, so the validator is what proves them right or wrong.
 */

export type FetchOutcome<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_found" | "rate_limited" | "upstream_error" | "invalid_shape" | "network" };

const DEFAULT_TIMEOUT_MS = 8000;

export async function fetchValidated<T>(
  url: string,
  schema: ZodType<T>,
  init?: { timeoutMs?: number; revalidateSeconds?: number },
): Promise<FetchOutcome<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init?.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "GameCastle/1.0 (+https://gamecastle.store)" },
      // Cloudflare honours this for subrequest caching, which is what keeps
      // us under Jikan's 3 req/sec limit when a crawler walks the catalog.
      cf: { cacheTtl: init?.revalidateSeconds ?? 86400, cacheEverything: true },
    } as RequestInit);

    if (response.status === 404) return { ok: false, reason: "not_found" };
    if (response.status === 429) return { ok: false, reason: "rate_limited" };
    if (!response.ok) return { ok: false, reason: "upstream_error" };

    const parsed = schema.safeParse(await response.json());
    if (!parsed.success) {
      console.error(`Catalog shape mismatch for ${url}:`, parsed.error.issues.slice(0, 3));
      return { ok: false, reason: "invalid_shape" };
    }
    return { ok: true, data: parsed.data };
  } catch (error) {
    console.error(`Catalog fetch failed for ${url}:`, error);
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}

/** Cache headers for catalog pages — long edge TTL, since upstream data is slow-moving. */
export const CATALOG_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  "CDN-Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};
