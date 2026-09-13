import type { ZodType, output as ZodOutput } from "zod";

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
  | {
      ok: false;
      reason: "not_found" | "rate_limited" | "upstream_error" | "invalid_shape" | "network";
    };

const DEFAULT_TIMEOUT_MS = 8000;

// Bound to the schema rather than to a bare T: with ZodType<T>, TypeScript
// infers T across both the input and output sides, so any field carrying a
// .default() made the two disagree and every call site reported a mismatch.
// Keying off the schema's output type is what the callers actually receive.
const MAX_RATE_LIMIT_RETRIES = 1;

export async function fetchValidated<S extends ZodType>(
  url: string,
  schema: S,
  init?: { timeoutMs?: number; revalidateSeconds?: number },
  attempt = 0,
): Promise<FetchOutcome<ZodOutput<S>>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init?.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "GameCastle/1.0 (+https://gamecastle.store)",
      },
      // Cloudflare honours this for subrequest caching, which is what keeps
      // us under Jikan's 3 req/sec limit when a crawler walks the catalog.
      cf: { cacheTtl: init?.revalidateSeconds ?? 86400, cacheEverything: true },
    } as RequestInit);

    if (response.status === 404) return { ok: false, reason: "not_found" };

    // Jikan allows roughly 3 requests a second. A burst — a crawler on the
    // paginated catalog, or the catalog sitemap building while someone loads
    // page 1 — trips that, and the routes turn any non-404 failure into a 500,
    // which tells Google the page is broken rather than busy. The limit
    // clears in about a second, so waiting it out once turns the most common
    // catalog failure into a rendered page. The wait is idle I/O, not CPU, so
    // it does not count against the Worker's CPU budget.
    if (response.status === 429) {
      if (attempt >= MAX_RATE_LIMIT_RETRIES) return { ok: false, reason: "rate_limited" };
      const retryAfter = Number(response.headers.get("retry-after"));
      const waitMs =
        Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 3000) : 1200;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return fetchValidated(url, schema, init, attempt + 1);
    }

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
