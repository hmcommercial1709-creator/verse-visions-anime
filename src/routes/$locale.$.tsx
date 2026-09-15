import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { goneResponse } from "@/lib/gone";
import { localeCatchAll } from "@/lib/i18n";

/**
 * Catch-all under a locale prefix.
 *
 * The decision lives in localeCatchAll so it can be tested: a path that is
 * not under a real locale must 404, never 410. This route once served
 * fabricated anime_nexus_matrix rows, and replacing it with a blanket 410
 * made /favicon.ico answer "gone" to every browser and to Googlebot.
 */
export const Route = createFileRoute("/$locale/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const outcome = localeCatchAll(params.locale, params._splat ?? "");
        if (outcome.kind === "not-found") return new Response("Not found", { status: 404 });
        if (outcome.kind === "redirect") {
          return new Response(null, {
            status: 301,
            headers: { Location: outcome.to, "Cache-Control": "public, max-age=3600" },
          });
        }
        return goneResponse();
      },
    },
  },
});
