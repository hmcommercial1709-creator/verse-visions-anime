import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://gamecastle.store";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const Route = createFileRoute("/sitemap-codes-1.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await supabase
          .from('game_nexus_matrix')
          .select('slug, updated_at')
          .range(0, 9999);

        if (error || !data) {
          throw new Error("Failed to fetch sitemap data");
        }

        const items = data.map((item: any) => {
          const lastmod = item.updated_at 
            ? new Date(item.updated_at).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];
          return `
  <url>
    <loc>${BASE_URL}/en/codes/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }).join("");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          items,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
