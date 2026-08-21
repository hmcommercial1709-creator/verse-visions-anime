import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/sitemap.xml')({
  loader: async () => {
    // 1. سحب كافة الأكواد والمنتجات والأنمي من قاعدة البيانات مهما بلغ عددها
    const { data: entities } = await supabase
      .from('entities')
      .select('slug, entity_type, updated_at')

    const baseUrl = 'https://gamecastle.store'

    // 2. بناء هيكل الـ XML ديناميكياً
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    // إضافة الصفحات الثابتة والرئيسية
    xml += `  <url><loc>${baseUrl}/</loc><changefreq>always</changefreq><priority>1.0</priority></url>\n`
    xml += `  <url><loc>${baseUrl}/codes</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>\n`

    // 3. حقن آلاف الصفحات المولدة تلقائياً من قاعدة البيانات
    entities?.forEach((item) => {
      const path = item.entity_type === 'anime' ? `anime` : item.entity_type === 'code' ? `codes` : `product`
      xml += `  <url>\n`
      xml += `    <loc>${baseUrl}/en/${path}/${item.slug}</loc>\n`
      xml += `    <lastmod>${item.updated_at || new Date().toISOString()}</lastmod>\n`
      xml += `    <changefreq>daily</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += `  </url>\n`
    })

    xml += `</urlset>`

    // إرجاع النتيجة كملف XML حقيقي لجوجل
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  },
})
