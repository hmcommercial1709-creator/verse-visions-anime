import { createFileRoute } from "@tanstack/react-router";
import { partitionEntries, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-products.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(urlsetXml(partitionEntries("products"))),
    },
  },
});
