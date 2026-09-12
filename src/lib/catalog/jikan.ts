import { z } from "zod";
import { fetchValidated, type FetchOutcome } from "./http";

/**
 * Jikan v4 — free, keyless REST wrapper over MyAnimeList.
 * https://docs.api.jikan.moe
 *
 * As with the FreeToGame client, these schemas come from the docs and are
 * unverified against a live response here (no outbound network). Run
 * scripts/verify-catalog-apis.mjs before enabling the routes.
 *
 * Rate limits are the real operational constraint: roughly 3 requests/sec
 * and 60/min. A crawler walking thousands of pages would blow straight
 * through that, so catalog responses are cached hard at the edge
 * (see CATALOG_HEADERS) and a 429 surfaces as a retryable error rather
 * than a rendered page with holes in it.
 */

const BASE = "https://api.jikan.moe/v4";

const namedEntry = z.object({ mal_id: z.number(), name: z.string(), url: z.string().url().optional() });

export const jikanAnimeSchema = z.object({
  mal_id: z.number(),
  url: z.string().url(),
  title: z.string(),
  title_english: z.string().nullable().optional(),
  title_japanese: z.string().nullable().optional(),
  synopsis: z.string().nullable().optional(),
  background: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  episodes: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  rating: z.string().nullable().optional(),
  score: z.number().nullable().optional(),
  scored_by: z.number().nullable().optional(),
  rank: z.number().nullable().optional(),
  year: z.number().nullable().optional(),
  season: z.string().nullable().optional(),
  images: z.object({
    jpg: z.object({
      image_url: z.string().url().nullable().optional(),
      large_image_url: z.string().url().nullable().optional(),
    }),
    webp: z
      .object({
        image_url: z.string().url().nullable().optional(),
        large_image_url: z.string().url().nullable().optional(),
      })
      .optional(),
  }),
  aired: z
    .object({ from: z.string().nullable().optional(), to: z.string().nullable().optional() })
    .optional(),
  genres: z.array(namedEntry).default([]),
  themes: z.array(namedEntry).default([]),
  studios: z.array(namedEntry).default([]),
});

export type JikanAnime = z.infer<typeof jikanAnimeSchema>;

const singleEnvelope = z.object({ data: jikanAnimeSchema });
const listEnvelope = z.object({
  data: z.array(jikanAnimeSchema),
  pagination: z
    .object({
      last_visible_page: z.number().optional(),
      has_next_page: z.boolean().optional(),
      current_page: z.number().optional(),
    })
    .optional(),
});

export async function getAnime(malId: number): Promise<FetchOutcome<JikanAnime>> {
  const result = await fetchValidated(`${BASE}/anime/${malId}`, singleEnvelope);
  return result.ok ? { ok: true, data: result.data.data } : result;
}

export async function getTopAnime(page = 1): Promise<FetchOutcome<JikanAnime[]>> {
  const result = await fetchValidated(`${BASE}/top/anime?page=${page}&limit=25`, listEnvelope);
  return result.ok ? { ok: true, data: result.data.data } : result;
}

/** Best display title, preferring English when MAL has one. */
export function displayTitle(anime: JikanAnime): string {
  return anime.title_english?.trim() || anime.title;
}

export function animeSlug(anime: { mal_id: number; title: string }): string {
  const name = anime.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${anime.mal_id}-${name}`;
}

export function malIdFromSlug(slug: string): number | null {
  const id = Number.parseInt(slug.split("-")[0] ?? "", 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}
