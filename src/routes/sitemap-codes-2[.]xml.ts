import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { loadCodeSitemapEntries } from "@/lib/entity-catalog.server";
import { urlsetXml, xmlResponse, sitemapUnavailable } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-codes-2.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return xmlResponse(urlsetXml(await loadCodeSitemapEntries(2)));
        } catch (error) {
          return sitemapUnavailable(error);
        }
      },
    },
  },
});
