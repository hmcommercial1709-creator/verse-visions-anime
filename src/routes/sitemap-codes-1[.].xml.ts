import { createAPIFileRoute } from '@tanstack/start/api';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const APIRoute = createAPIFileRoute('/sitemap-codes-1.xml')({
  GET: async () => {
    const { data, error } = await supabase
      .from('game_nexus_matrix')
      .select('slug, updated_at')
      .range(0, 9999);

    if (error || !data) {
      return new Response('Error loading sitemap data', { status: 500 });
    }

    const urlsXml = data
      .map((item: any) => `
  <url>
    <loc>https://gamecastle.store/en/codes/${item.slug}</loc>
    <lastmod>${item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

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
});
