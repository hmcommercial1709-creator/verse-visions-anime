import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/sitemap.xml')({
  loader: async () => {
    try {
      // 1. جلب الكيانات من قاعدة البيانات بأمان
      const { data: entities, error } = await supabase
        .from('entities')
        .select('slug, entity_type, updated_at')
        .limit(1000)

      if (error) {
        console.error('Sitemap fetch error:', error)
      }

      const baseUrl = 'https://gamecastle.store'

      // 2. بناء هيكل الـ XML النظامي
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

      // الصفحات الأساسية
      xml += `  <url><loc>${baseUrl}/</loc><changefreq>always</changefreq><priority>1.0</priority></url>\n`
      xml += `  <url><loc>${baseUrl}/codes</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>\n`

      // حقن الصفحات الديناميكية المسحوبة من قاعدة البيانات
      if (entities && entities.length > 0) {
        entities.forEach((item) => {
          let path = 'codes'
          if (item.entity_type === 'anime') path = 'anime'
          else if (item.entity_type === 'product') path = 'product'

          const lastMod = item.updated_at ? new Date(item.updated_at).toISOString() : new Date().toISOString()

          xml += `  <url>\n`
          xml += `    <loc>${baseUrl}/en/${path}/${item.slug}</loc>\n`
          xml += `    <lastmod>${lastMod}</lastmod>\n`
          xml += `    <changefreq>daily</changefreq>\n`
          xml += `    <priority>0.8</priority>\n`
          xml += `  </url>\n`
        })
      }

      xml += `</urlset>`

      return new Response(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      })
    } catch (err) {
      console.error('Sitemap generation error:', err)
      return new Response('Error generating sitemap', { status: 500 })
    }
  },
})
