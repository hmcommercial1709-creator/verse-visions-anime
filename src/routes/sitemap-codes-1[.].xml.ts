import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const Route = createFileRoute('/sitemap-codes-1[.]xml')({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = 'https://gamecastle.store';
        let allCodes: { slug: string; updated_at?: string }[] = [];
        let page = 0;
        const pageSize = 10000;
        let fetchMore = true;

        while (fetchMore && allCodes.length < 40000) {
          const { data, error } = await supabase
            .from('game_nexus_matrix') // تم التعديل هنا لاستخدام الجدول الصحيح
            .select('slug, updated_at')
            .range(page * pageSize, (page + 1) * pageSize - 1);

          if (error || !data || data.length === 0) {
            fetchMore = false;
          } else {
            allCodes.push(...data);
            if (data.length < pageSize || allCodes.length >= 40000) {
              fetchMore = false;
            } else {
              page++;
            }
          }
        }

        const urlsXml = allCodes
          .map((item) => {
            const loc = `${baseUrl}/en/codes/${item.slug}`;
            const lastmod = item.updated_at 
              ? new Date(item.updated_at).toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0];
            return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          })
          .join('');

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
