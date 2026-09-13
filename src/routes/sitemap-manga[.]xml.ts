import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { countDbCatalogPages, loadCatalogFromDb } from "@/lib/catalog/db-catalog";
import { urlsetXml, xmlResponse, sitemapUnavailable, type SitemapEntry } from "@/lib/sitemap";

/**
 * The manga catalog sitemap: the paginated archive plus every detail URL.
 *
 * Detail URLs are enumerated, unlike the anime catalog's, and the difference
 * is the data source rather than a change of mind. Anime listings are backed
 * by a rate-limited third party, so listing a thousand detail URLs there
 * would rate-limit the sitemap itself; manga comes entirely from our own
 * table, where the only cost is paging through rows we already hold.
 *
 * Returns 503 rather than an empty <urlset> when the ingest has not run.
 * Search Console reports an empty sitemap as an error, and "not built yet" is
 * exactly what a 503 means.
 */
const PAGE_SIZE = 36;
const DB_PAGE = 1000;
const MAX_URLS = 45000;

export const Route = createFileRoute("/sitemap-manga.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const pages = await countDbCatalogPages("manga", PAGE_SIZE);
          if (pages === 0) {
            return sitemapUnavailable(new Error("The manga catalog has not been ingested yet."));
          }

          const entries: SitemapEntry[] = [
            { path: "/manga", changefreq: "daily", priority: "0.9" },
          ];
          for (let page = 2; page <= pages; page++) {
            entries.push({ path: `/manga?page=${page}`, changefreq: "weekly", priority: "0.5" });
          }

          for (let page = 1; entries.length < MAX_URLS; page++) {
            const batch = await loadCatalogFromDb("manga", page, DB_PAGE);
            if (!batch || batch.items.length === 0) break;
            for (const item of batch.items) {
              entries.push({
                path: `/catalog/manga/${item.slug}`,
                changefreq: "weekly",
                priority: "0.6",
              });
            }
            if (batch.items.length < DB_PAGE) break;
          }

          return xmlResponse(urlsetXml(entries.slice(0, MAX_URLS)));
        } catch (error) {
          return sitemapUnavailable(error);
        }
      },
    },
  },
});
