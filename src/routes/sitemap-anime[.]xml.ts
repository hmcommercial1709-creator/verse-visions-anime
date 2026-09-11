import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { partitionEntries, urlsetXml } from "@lib/sitemap";

export const Route = createFileRoute("/sitemap-anime.xml")({
  server: { 
    handlers: { 
      GET: async () => {
        const xmlContent = urlsetXml(partitionEntries("anime"));
        return new Response(xmlContent, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } 
    } 
  },
});
