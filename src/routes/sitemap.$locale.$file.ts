import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { partitionEntries, PARTITIONS, urlsetXml, xmlResponse, type Partition } from "@/lib/sitemap";
import { INDEXABLE_LOCALES, isLocaleCode, type LocaleCode } from "@/lib/i18n";

/**
 * Per-locale child sitemaps: /sitemap/<locale>/<partition>.xml
 * Only locales with indexable content are served; anything else 404s so the
 * index never advertises a placeholder edition.
 */
export const Route = createFileRoute("/sitemap/$locale/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const locale = params.locale;
        const partition = params.file.replace(/\.xml$/, "") as Partition;
        if (
          !isLocaleCode(locale) ||
          !INDEXABLE_LOCALES.includes(locale as LocaleCode) ||
          !PARTITIONS.includes(partition)
        ) {
          return new Response("Not found", { status: 404 });
        }
        return xmlResponse(urlsetXml(partitionEntries(partition), locale as LocaleCode));
      },
    },
  },
});
