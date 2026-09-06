import { createFileRoute } from '@tanstack/react-router';
import { xmlResponse, BASE_URL } from '@/lib/sitemap';

export const Route = createFileRoute('/sitemap-codes-1[.]xml')({
  loader: () => {
    let urls = '';
    for (let i = 1; i <= 40000; i++) {
      urls += `  <url><loc>${BASE_URL}/gaming-hub/code-${i}</loc></url>\n`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>`;
    return xmlResponse(xml);
  },
});
