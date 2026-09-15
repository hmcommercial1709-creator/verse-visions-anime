import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";

/**
 * Gone: every /codes/<slug> page was built from a fabricated row in game_nexus_matrix - an invented rating, an invented review count, and one of four hardcoded review sentences.
 *
 * See src/lib/gone.ts for why this is a 410 rather than a 404, a noindex or
 * a redirect.
 */
export const Route = createFileRoute("/codes/$slug")({
  server: { handlers: { GET: async () => goneResponse() } },
});
