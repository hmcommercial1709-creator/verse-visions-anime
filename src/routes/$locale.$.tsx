import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";

/**
 * Gone: the catch-all fell through to the same fabricated anime_nexus_matrix rows.
 *
 * See src/lib/gone.ts for why this is a 410 rather than a 404, a noindex or
 * a redirect.
 */
export const Route = createFileRoute("/$locale/$")({
  server: { handlers: { GET: async () => goneResponse() } },
});
