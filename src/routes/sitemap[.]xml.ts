import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import sitemapXml from "../content/sitemap.xml?raw";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(sitemapXml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            "X-Robots-Tag": "all",
          },
        }),
    },
  },
});
