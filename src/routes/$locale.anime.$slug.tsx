import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";

/**
 * Gone: these pages came from anime_nexus_matrix, 31,250 rows titled 'One Piece - Neural Matrix Node 137 (Japan & East Asia)' and similar, carrying a market name and nothing else.
 *
 * See src/lib/gone.ts for why this is a 410 rather than a 404, a noindex or
 * a redirect.
 */
export const Route = createFileRoute("/$locale/anime/$slug")({
  server: { handlers: { GET: async () => goneResponse() } },
});
