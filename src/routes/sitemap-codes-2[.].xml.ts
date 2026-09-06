import { createFileRoute } from '@tanstack/react-router';
import { xmlResponse, BASE_URL } from '@/lib/sitemap';

export const Route = createFileRoute('/sitemap-codes-2[.]xml')({
  loader: () => {
    const allPaths = [...]; // نفس مصفوفة الـ 80 ألف رابط
    const secondChunk = allPaths.slice(40000, 80000); // الـ 40 ألف الباقية

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...secondChunk.map(path => `  <url><loc>${BASE_URL}${path}</loc></url>`),
      `</urlset>`
    ].join('\n');

    return xmlResponse(xml);
  },
});
