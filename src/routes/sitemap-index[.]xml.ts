import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL } from "@/lib/sitemap";

/**
 * Permanent redirect to /sitemap.xml, which robots.txt advertises and which is
 * therefore the canonical index.
 *
 * This used to serve its own copy of sitemapIndexXml() — byte-identical output
 * at a second URL. Both were submitted to Search Console, which then tracked
 * one set of child sitemaps twice and reported two different discovery counts
 * for the same content. Redirecting rather than deleting keeps the already
 * submitted URL working: a 404 here would surface as a fresh error in Search
 * Console, while a 301 tells it (and any tooling that defaults to the
 * sitemap-index.xml convention) which URL supersedes this one.
 */
export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: {
            Location: `${BASE_URL}/sitemap.xml`,
            "Cache-Control": "public, max-age=86400",
          },
        }),
    },
  },
});
