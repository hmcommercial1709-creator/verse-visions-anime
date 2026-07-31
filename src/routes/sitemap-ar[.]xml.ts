import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { arUrlsetXml, xmlResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-ar/xml")({
  server: { handlers: { GET: async () => xmlResponse(arUrlsetXml()) } },
});
