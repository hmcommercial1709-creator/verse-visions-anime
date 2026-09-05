import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  loader: async () => {
    const baseUrl = "https://gamecastle.store";
    
    // قائمة السيتامب الفرعية الموجودة في مشروعك
    const subSitemaps = [
      "sitemap-anime.xml",
      "sitemap-ar.xml",
      "sitemap-articles.xml",
      "sitemap-characters.xml",
      "sitemap-episodes.xml",
      "sitemap-pages.xml",
      "sitemap-products.xml",
      "sitemap-taxonomy.xml"
    ];

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${subSitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

    return new Response(xmlContent, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  },
});
