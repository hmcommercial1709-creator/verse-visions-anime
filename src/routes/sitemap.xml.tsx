import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/sitemap/xml')({
  loader: async ({ request }) => {
    try {
      const url = new URL(request.url);
      const pageParam = url.searchParams.get('page');

      // حجم الدفعة الواحدة (آمن جداً لسرعة السيرفر واستجابة غوغل)
      const pageSize = 10000;

      // إذا لم يتم تحديد رقم صفحة، سنقوم بإنشاء "سيماب إندكس" (Sitemap Index) أوتوماتيكي يربط كل الصفحات ببعضها مهما بلغت
      if (!pageParam) {
        // جلب العدد الإجمالي للصفحات في جدول الـ entities لتحديد عدد الملفات المطلوبة أوتوماتيكياً
        const { count, error: countError } = await (supabase as any)
          .from('entities')
          .select('*', { count: 'exact', head: true });

        const totalItems = (!countError && count) ? count : 8000; // افتراضي احتياطي لو حدث خطأ في العد
        const totalPages = Math.ceil(totalItems / pageSize) || 1;

        // بناء خريطة الفهرس الرئيسية التي تجمع كل الأجزاء القادمة والمستقبلية حتى لو وصلت لمليون صفحة
        let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // توليد الروابط الفرعية أوتوماتيكياً بناءً على عدد الصفحات المتنامي
        for (let i = 1; i <= totalPages; i++) {
          indexXml += `  <sitemap>\n`;
          indexXml += `    <loc>https://gamecastle.store/sitemap.xml?page=${i}</loc>\n`;
          indexXml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
          indexXml += `  </sitemap>\n`;
        }

        indexXml += `</sitemapindex>`;

        return new Response(indexXml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=1800, s-maxage=1800',
          },
        });
      }

      // في حال طلب صفحة معينة من الخريطة (مثلاً ?page=1 أو ?page=2)
      const page = parseInt(pageParam, 10) || 1;
      const offset = (page - 1) * pageSize;

      const { data: entities, error } = await (supabase as any)
        .from('entities')
        .select('slug, updated_at')
        .range(offset, offset + pageSize - 1);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      const baseUrl = 'https://gamecastle.store';
      
      // إضافة الصفحة الرئيسية في أول صفحة فقط
      if (page === 1) {
        xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
      }

      if (entities && entities.length > 0) {
        entities.forEach((item: any) => {
          if (!item.slug) return;
          const lastMod = item.updated_at ? new Date(item.updated_at).toISOString() : new Date().toISOString();
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/anime/${item.slug}</loc>\n`;
          xml += `    <lastmod>${lastMod}</lastmod>\n`;
          xml += `    <changefreq>daily</changefreq>\n`;
          xml += `    <priority>0.8</priority>\n`;
          xml += `  </url>\n`;
        });
      }

      xml += `</urlset>`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    } catch (err) {
      console.error('Sitemap generation error:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});
