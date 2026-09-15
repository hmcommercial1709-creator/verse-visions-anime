import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";

/**
 * Gone: this listing existed only to page through the fabricated code rows, and was the crawl path into all 50,000 of them.
 *
 * See src/lib/gone.ts for why this is a 410 rather than a 404, a noindex or
 * a redirect.
 */
export const Route = createFileRoute("/codes/")({
  server: { handlers: { GET: async () => goneResponse() } },
});
