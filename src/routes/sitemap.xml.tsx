import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/sitemap/xml')({
  loader: async ({ request }) => {
    try {
      // استخراج رقم الصفحة من الـ URL (مثلاً ?page=1) لو أردنا التصفح
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = 40000; // حجم آمن جداً للضغط
      const offset = (page - 1) * pageSize;

      // جلب البيانات من سوبابيس مع التقسيم لمنع أي ضغط على السيرفر
      const { data: entities, error } = await supabase
        .from('entities')
        .select('slug, updated_at')
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error('Sitemap fetch error:', error);
        return new Response('Error generating sitemap', { status: 500 });
      }

      // بناء الـ XML
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      if (entities && entities.length > 0) {
        entities.forEach((entity) => {
          const lastMod = entity.updated_at ? new Date(entity.updated_at).toISOString() : new Date().toISOString();
          xml += `  <url>\n`;
          xml += `    <loc>https://gamecastle.store/anime/${entity.slug}</loc>\n`;
          xml += `    <lastmod>${lastMod}</lastmod>\n`;
          xml += `    <changefreq>daily</changefreq>\n`;
          xml += `    <priority>0.8</priority>\n`;
          xml += `  </url>\n`;
        });
      }

      xml += `</urlset>`;

      // إرسال الرد بصيغة XML صحيحة
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      });
    } catch (err) {
      console.error('Sitemap generation error:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});
