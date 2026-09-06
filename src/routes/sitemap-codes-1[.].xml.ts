import { createFileRoute } from '@tanstack/react-router';
import { xmlResponse, BASE_URL } from '@/lib/sitemap';

export const Route = createFileRoute('/sitemap-codes-1[.]xml')({
  loader: () => {
    const urls: string[] = [];
    for (let i = 1; i <= 40000; i++) {
      urls.push(`/gaming-hub/code-${i}`);
    }

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...urls.map(path => `  <url><loc>${BASE_URL}${path}</loc></url>`),
      `</urlset>`
    ].join('\n');

    return xmlResponse(xml);
  },
});
