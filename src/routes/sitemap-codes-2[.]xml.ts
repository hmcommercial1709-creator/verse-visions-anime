import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { loadCodeSitemapEntries } from "@/lib/entity-catalog.server";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-codes-2.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(urlsetXml(await loadCodeSitemapEntries(2))),
    },
  },
});