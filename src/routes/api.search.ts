import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { searchAnime, animeSlug, displayTitle } from "@/lib/catalog/jikan";
import { searchGames, gameSlug } from "@/lib/catalog/freetogame";

/**
 * Catalog search for the site search box.
 *
 * The box only ever searched the 23 hand-written series in src/data, so a
 * query for almost any real title came back empty — the catalog it should
 * have been searching (thousands of anime via Jikan, ~400 games via
 * FreeToGame) was never consulted.
 *
 * A plain JSON route rather than a server function: both upstreams are
 * fetched server-side and cached at the edge, and this keeps the contract
 * something you can curl.
 *
 * A failure in either half returns that half empty instead of failing the
 * whole search — a partly populated box beats an error — so this answers 200
 * with whatever it has.
 */
export interface CatalogSearchHit {
  kind: "anime" | "game";
  title: string;
  path: string;
  image: string | null;
  meta: string | null;
}

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const query = (new URL(request.url).searchParams.get("q") ?? "").trim();
        if (query.length < 2) return json([]);

        const [anime, games] = await Promise.all([searchAnime(query, 8), searchGames(query, 6)]);
        const hits: CatalogSearchHit[] = [];

        if (anime.ok) {
          for (const a of anime.data) {
            hits.push({
              kind: "anime",
              title: displayTitle(a),
              path: `/catalog/anime/${animeSlug(a)}`,
              image: a.images.jpg.image_url ?? null,
              meta:
                [a.type, a.year, a.score ? `★ ${a.score}` : null].filter(Boolean).join(" · ") ||
                null,
            });
          }
        }

        if (games.ok) {
          for (const g of games.data) {
            hits.push({
              kind: "game",
              title: g.title,
              path: `/catalog/games/${gameSlug(g)}`,
              image: g.thumbnail ?? null,
              meta: [g.genre, g.platform].filter(Boolean).join(" · ") || null,
            });
          }
        }

        return json(hits);
      },
    },
  },
});

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Same edge cache the catalog pages rely on to stay inside Jikan's
      // rate limit when many people search at once.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
