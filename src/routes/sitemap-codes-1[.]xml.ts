import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";

/**
 * Gone. This sitemap advertised up to 2,500 fabricated /codes/ URLs.
 *
 * Kept as a 410 rather than deleted: Search Console has already read this
 * file and tracks it as a child of the index. A route that simply vanished
 * would 404, which Google re-checks for months; 410 tells it the file is
 * permanently gone and clears it from the report.
 */
export const Route = createFileRoute("/sitemap-codes-1.xml")({
  server: { handlers: { GET: async () => goneResponse() } },
});
