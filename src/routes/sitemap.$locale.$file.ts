import { createFileRoute } from "@tanstack/react-router";

/** All localized sitemap partitions are retired; /sitemap.xml is canonical. */
export const Route = createFileRoute("/sitemap/$locale/$file")({
  server: {
    handlers: {
      GET: async () => new Response("Gone. Use /sitemap.xml", { status: 410 }),
    },
  },
});
