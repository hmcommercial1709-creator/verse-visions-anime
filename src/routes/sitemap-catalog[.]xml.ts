import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listGames, gameSlug } from "@/lib/catalog/freetogame";
import { countDbCatalogPages, listAllCatalogSlugs } from "@/lib/catalog/db-catalog";
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

// Jikan's bound when the catalog is served live. Once public.entities is
// filled the real page count comes from there instead, so the sitemap grows
// with the catalog rather than stopping at 40.
const API_ANIME_INDEX_PAGES = 40;
const ANIME_PAGE_SIZE = 25;

export const Route = createFileRoute("/sitemap-catalog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          // The anime catalog index moved to /anime; /catalog/anime now 301s
          // there, and a sitemap must list the final URL.
          { path: "/anime", changefreq: "daily", priority: "0.9" },
          { path: "/catalog/games", changefreq: "daily", priority: "0.8" },
        ];

        const dbPages = await countDbCatalogPages("anime", ANIME_PAGE_SIZE);
        const animePages = dbPages > 0 ? dbPages : API_ANIME_INDEX_PAGES;
        for (let page = 2; page <= animePages; page++) {
          entries.push({ path: `/anime?page=${page}`, changefreq: "weekly", priority: "0.5" });
        }

        // Anime DETAIL pages, not just the paginated index.
        //
        // The comment above explains why these were once left out: enumerating
        // them meant ~40 Jikan calls per sitemap fetch against a 3/sec limit.
        // That reasoning expired when the nightly ingest started filling
        // public.entities — 6,016 active anime rows at last count, every one of
        // them already served by /catalog/anime/$slug from the database, and
        // reachable now in a handful of paged queries against our own table
        // rather than forty calls to someone else's API.
        //
        // Leaving them out cost more than it saved: Search Console showed 137
        // pages indexed against 25,757 submitted, while the substantive pages
        // were the ones not being advertised.
        for (const slug of await listAllCatalogSlugs("anime")) {
          entries.push({ path: `/catalog/anime/${slug}`, changefreq: "weekly", priority: "0.7" });
        }

        // Games come from BOTH sources, deduplicated.
        //
        // This used to list only what the FreeToGame API returned, which meant
        // the Steam rows the nightly ingest writes to public.entities had
        // working pages at /catalog/games/{slug} that no sitemap advertised —
        // roughly 780 of them at the time this was found, growing every night.
        // /catalog/games/$slug already serves from the database, so those
        // pages were live and simply unreachable to a crawler.
        const seen = new Set<string>();
        const addGame = (slug: string) => {
          if (!slug || seen.has(slug)) return;
          seen.add(slug);
          entries.push({ path: `/catalog/games/${slug}`, changefreq: "weekly", priority: "0.6" });
        };

        const dbGameSlugs = await listAllCatalogSlugs("game");
        for (const slug of dbGameSlugs) addGame(slug);

        const games = await listGames();
        if (games.ok) {
          for (const game of games.data) addGame(gameSlug(game));
        } else if (!dbGameSlugs.length) {
          // Only worth reporting when it leaves the sitemap with no games at
          // all; otherwise the database already covered it.
          console.error(`Catalog sitemap: game list unavailable (${games.reason})`);
        }

        // Manga is NOT listed here: sitemap-manga.xml already enumerates
        // /catalog/manga/{slug}. Listing it in both would put one URL in two
        // sitemaps, which splits its signals — the exact thing
        // scripts/check-sitemap-xml.mjs fails the build over.

        return xmlResponse(urlsetXml(entries));
      },
    },
  },
});
