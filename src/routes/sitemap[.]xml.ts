import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap";
import { loadMatrixIndex } from "@/lib/catalog/matrix";
import { countDbCatalogPages } from "@/lib/catalog/db-catalog";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // The codes partitions used to be counted here so an empty one was
        // never advertised. They are gone entirely now: the pages they listed
        // were machine-fabricated and answer 410.
        //
        // The rule they demonstrated still governs the two children below.
        // Advertise a child only once the table behind it holds rows —
        // a missing child is invisible to Google, while an advertised child
        // that errors is reported against the whole index.
        let hasMatrix = false;
        try {
          const [anime, game] = await Promise.all([
            loadMatrixIndex("anime"),
            loadMatrixIndex("game"),
          ]);
          hasMatrix =
            Object.keys(anime?.facets ?? {}).length > 0 ||
            Object.keys(game?.facets ?? {}).length > 0;
        } catch {
          /* leave it unadvertised */
        }

        let hasManga = false;
        try {
          hasManga = (await countDbCatalogPages("manga", 36)) > 0;
        } catch {
          /* leave it unadvertised */
        }

        return xmlResponse(sitemapIndexXml(hasMatrix, hasManga));
      },
    },
  },
});
