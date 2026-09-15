import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";

/**
 * Gone: this redirected to /codes, which is itself gone.
 *
 * See src/lib/gone.ts for why this is a 410 rather than a 404, a noindex or
 * a redirect.
 */
export const Route = createFileRoute("/$locale/codes/")({
  server: { handlers: { GET: async () => goneResponse() } },
});
