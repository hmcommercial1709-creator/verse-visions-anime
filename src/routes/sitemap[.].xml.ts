import { createFileRoute } from '@tanstack/react-router';
import { sitemapIndexXml, xmlResponse } from '@/lib/sitemap';

export const Route = createFileRoute('/sitemap[.]xml')({
  server: {
    handlers: {
      GET: async () => {
        return xmlResponse(sitemapIndexXml());
      },
    },
  },
});
