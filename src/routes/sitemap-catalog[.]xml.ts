import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listGames, gameSlug } from "@/lib/catalog/freetogame";
import { urlsetXml, xmlResponse, type SitemapEntry } from "@/lib/sitemap";

/**
 * Catalog sitemap.
 *
 * Games enumerate fully: FreeToGame returns its whole list in one request,
 * which the edge caches, so listing every detail URL costs one upstream
 * call.
 *
 * Anime deliberately lists only the paginated index pages, not the ~1,000
 * detail URLs behind them. Enumerating those would take ~40 Jikan calls
 * per sitemap fetch against a ~3 req/sec limit — it would rate-limit
 * itself and serve a truncated sitemap. Googlebot reaches every detail
 * page by following the index pages instead, which is the normal way to
 * expose a large paginated catalog.
 *
 * If the games API is unavailable the static entries are still returned,
 * so a transient upstream failure degrades the sitemap rather than
 * breaking it.
 */

const ANIME_INDEX_PAGES = 40; // matches MAX_PAGE in catalog.anime.index.tsx

export const Route = createFileRoute("/sitemap-catalog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/catalog/anime", changefreq: "daily", priority: "0.8" },
          { path: "/catalog/games", changefreq: "daily", priority: "0.8" },
        ];

        for (let page = 2; page <= ANIME_INDEX_PAGES; page++) {
          entries.push({ path: `/catalog/anime?page=${page}`, changefreq: "weekly", priority: "0.5" });
        }

        const games = await listGames();
        if (games.ok) {
          for (const game of games.data) {
            entries.push({
              path: `/catalog/games/${gameSlug(game)}`,
              changefreq: "weekly",
              priority: "0.6",
            });
          }
        } else {
          console.error(`Catalog sitemap: game list unavailable (${games.reason})`);
        }

        return xmlResponse(urlsetXml(entries));
      },
    },
  },
});
