import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { loadMatrixIndex } from "@/lib/catalog/matrix";
import { urlsetXml, xmlResponse, sitemapUnavailable, type SitemapEntry } from "@/lib/sitemap";

/**
 * The programmatic matrix sitemap: every facet intersection and comparison
 * page the ingest pipeline judged worth publishing.
 *
 * Read straight from the stored index, which is the same source the routes
 * themselves use. That is deliberate and it is the property that matters: a
 * sitemap listing a URL the route would 404, or a route serving a page the
 * sitemap never mentions, are both ways of telling Google the site does not
 * know its own shape. One source means the two cannot disagree.
 *
 * Intersections below the inventory threshold never reach the index, so they
 * are absent here for free rather than needing a second filter that could
 * drift from the first.
 */

// Sitemaps are capped at 50,000 URLs. The matrix is nowhere near that today,
// but a catalog that grows tenfold should truncate deterministically rather
// than emit an invalid file.
const MAX_URLS = 45000;

export const Route = createFileRoute("/sitemap-matrix.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const entries: SitemapEntry[] = [];

          for (const type of ["anime", "game"] as const) {
            const index = await loadMatrixIndex(type);
            if (!index) continue;

            // Higher inventory first: the intersections with the most behind
            // them are the ones worth crawling soonest.
            const facets = Object.values(index.facets).sort((a, b) => b.count - a.count);
            for (const facet of facets) {
              entries.push({
                path: facet.path,
                changefreq: "weekly",
                // A one-dimension page (all Action anime) outranks a
                // three-dimension slice of it, and priority should say so.
                priority:
                  facet.parts.length === 1 ? "0.7" : facet.parts.length === 2 ? "0.6" : "0.5",
              });
            }

            for (const pair of index.comparisons) {
              entries.push({ path: pair.path, changefreq: "monthly", priority: "0.5" });
            }
          }

          if (entries.length === 0) {
            // An empty <urlset> is reported as an error in Search Console, and
            // that is the honest signal here: the pipeline has not built an
            // index yet, so there is nothing to advertise.
            return sitemapUnavailable(
              new Error("The catalog matrix index has not been built yet."),
            );
          }

          return xmlResponse(urlsetXml(entries.slice(0, MAX_URLS)));
        } catch (error) {
          return sitemapUnavailable(error);
        }
      },
    },
  },
});
