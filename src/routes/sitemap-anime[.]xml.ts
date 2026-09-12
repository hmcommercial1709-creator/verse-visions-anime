import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { partitionEntries, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-anime.xml")({
  server: { handlers: { GET: async () => xmlResponse(urlsetXml(partitionEntries("anime"))) } },
});
