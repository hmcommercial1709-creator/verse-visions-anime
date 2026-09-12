import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

/**
 * Alias for /sitemap.xml. Some crawlers and tooling default to the
 * sitemap-index.xml convention, so this must serve the same live index
 * rather than a stale static file.
 */
export const Route = createFileRoute("/sitemap-index.xml")({
  server: { handlers: { GET: async () => xmlResponse(sitemapIndexXml()) } },
});
