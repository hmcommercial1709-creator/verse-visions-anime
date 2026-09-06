import { createFileRoute } from '@tanstack/react-router';
import { xmlResponse, BASE_URL } from '@/lib/sitemap';

export const Route = createFileRoute('/sitemap-codes-1[.]xml')({
  loader: () => {
    const allPaths = [...]; // مصفوفة الـ 80 ألف رابط كاملة لديك
    const firstChunk = allPaths.slice(0, 40000); // أول 40 ألف

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...firstChunk.map(path => `  <url><loc>${BASE_URL}${path}</loc></url>`),
      `</urlset>`
    ].join('\n');

    return xmlResponse(xml);
  },
});
