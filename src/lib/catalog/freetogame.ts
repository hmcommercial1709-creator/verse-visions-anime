import { z } from "zod";
import { fetchValidated, type FetchOutcome } from "./http";

/**
 * FreeToGame — free, keyless public API covering free-to-play titles.
 * https://www.freetogame.com/api-doc
 *
 * Schemas below were written from the published docs and have NOT been
 * checked against a live response (this build environment has no outbound
 * network access). Run `node scripts/verify-catalog-apis.mjs` from a
 * machine with internet to confirm them before enabling the routes.
 * Optional fields are marked optional deliberately, so a missing extra
 * doesn't nuke an otherwise-valid record.
 */

const BASE = "https://www.freetogame.com/api";

export const freeToGameListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  thumbnail: z.string().url(),
  short_description: z.string(),
  game_url: z.string().url(),
  genre: z.string(),
  platform: z.string(),
  publisher: z.string(),
  developer: z.string(),
  release_date: z.string(),
  freetogame_profile_url: z.string().url(),
});

export const freeToGameDetailSchema = freeToGameListItemSchema.extend({
  description: z.string().optional(),
  minimum_system_requirements: z
    .object({
      os: z.string().optional().nullable(),
      processor: z.string().optional().nullable(),
      memory: z.string().optional().nullable(),
      graphics: z.string().optional().nullable(),
      storage: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  screenshots: z.array(z.object({ id: z.number(), image: z.string().url() })).optional(),
});

export type FreeToGameListItem = z.infer<typeof freeToGameListItemSchema>;
export type FreeToGameDetail = z.infer<typeof freeToGameDetailSchema>;

const listSchema = z.array(freeToGameListItemSchema);

export function listGames(): Promise<FetchOutcome<FreeToGameListItem[]>> {
  return fetchValidated(`${BASE}/games`, listSchema);
}

export function getGame(id: number): Promise<FetchOutcome<FreeToGameDetail>> {
  return fetchValidated(`${BASE}/game?id=${id}`, freeToGameDetailSchema);
}

/**
 * Title search. FreeToGame has no search endpoint, so this filters the full
 * list — which is one cached request for roughly 400 games, cheap enough to do
 * per query at the edge.
 */
export async function searchGames(
  query: string,
  limit = 6,
): Promise<FetchOutcome<FreeToGameListItem[]>> {
  const q = query.trim().toLowerCase();
  if (!q) return { ok: true, data: [] };
  const all = await listGames();
  if (!all.ok) return all;
  return {
    ok: true,
    data: all.data.filter((g) => g.title.toLowerCase().includes(q)).slice(0, limit),
  };
}

/** Stable URL slug that keeps the id authoritative but stays readable. */
export function gameSlug(game: { id: number; title: string }): string {
  const name = game.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${game.id}-${name}`;
}

export function idFromSlug(slug: string): number | null {
  const id = Number.parseInt(slug.split("-")[0] ?? "", 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}
