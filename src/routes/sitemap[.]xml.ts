import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sitemapIndexXml, xmlResponse, CODE_SITEMAP_PARTITIONS } from "@/lib/sitemap";
import { countCodePartitions } from "@/lib/entity-catalog.server";
import { loadMatrixIndex } from "@/lib/catalog/matrix";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // How many codes partitions actually hold rows. Listing an empty one
        // makes Google report the index as having an erroring child with 0
        // URLs, so the index adapts to the table rather than assuming it is
        // full. If the count cannot be read, list them all: a child that then
        // 503s is retried, whereas omitting a live partition would silently
        // drop 25,000 URLs from the index.
        let codePartitions = CODE_SITEMAP_PARTITIONS;
        try {
          codePartitions = await countCodePartitions();
        } catch {
          /* fall through to listing every partition */
        }
        // Same rule for the matrix child: advertise it only when the ingest
        // has built an index for it. Unreadable counts as absent — a missing
        // child is invisible, whereas an advertised child that errors is
        // reported against the whole index.
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

        return xmlResponse(sitemapIndexXml(codePartitions, hasMatrix));
      },
    },
  },
});
