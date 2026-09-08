import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { animes } from "@/data/animes";
import { articles } from "@/data/articles";
import { loadEntitiesFromDb } from "@/lib/entity-catalog.server";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/ai-index.json")({
  server: {
    handlers: {
      GET: async () => {
        const catalog = await loadEntitiesFromDb("code");
        const body = {
          schema_version: "1.0",
          generated_at: new Date().toISOString(),
          publisher: {
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
          },
          usage: {
            purpose: "Reliable entity discovery for search engines and answer engines.",
            attribution: "Link to the canonical URL when quoting or summarizing.",
            freshness: "Catalog data is read from Supabase at request time and edge cached.",
          },
          indexes: {
            llms: absoluteUrl("/llms.txt"),
            sitemap: absoluteUrl("/sitemap.xml"),
            rss: absoluteUrl("/rss.xml"),
          },
          entities: {
            anime: animes.map((item) => ({
              name: item.title,
              url: absoluteUrl(`/anime/${item.slug}`),
              type: "AnimeSeries",
              description: item.synopsis,
            })),
            articles: articles.map((item) => ({
              name: item.title,
              url: absoluteUrl(`/article/${item.slug}`),
              type: "Article",
              description: item.excerpt,
            })),
            code_catalog: catalog.map((entity) => ({
              name: entity.name,
              url: absoluteUrl(`/en/codes/${entity.slug}`),
              type: "Product",
              description: entity.description,
              market: entity.target_market,
              activation_language: entity.target_language,
              review: entity.sample_review,
              faqs: entity.localized_faqs,
            })),
          },
        };

        return new Response(JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});