import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://gamecastle.store";

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  );

  const { data, error } = await supabase
    .from('game_nexus_matrix')
    .select('slug, updated_at')
    .range(0, 9999);

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch sitemap data" });
  }

  const items = data.map((item: any) => {
    const lastmod = item.updated_at 
      ? new Date(item.updated_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${BASE_URL}/en/codes/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=3600");
  
  return xml;
});
