import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { publishedAnime, publishedArticles } from "@/lib/content-registry";

const BASE_URL = "https://gamecastle.store";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const articleItems = publishedArticles().map((article) => ({
          title: article.title,
          path: `/article/${article.slug}`,
          description: article.excerpt,
          category: article.tag,
          date: new Date(`${article.date}T00:00:00Z`),
        }));
        const animeItems = publishedAnime().map((anime) => ({
          title: anime.title,
          path: `/anime/${anime.slug}`,
          description: anime.synopsis,
          category: "Anime guide",
          date: new Date(`${anime.year}-01-01T00:00:00Z`),
        }));
        const items = [...articleItems, ...animeItems]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 50)
          .map((a) =>
            [
              `  <item>`,
              `    <title>${escapeXml(a.title)}</title>`,
              `    <link>${BASE_URL}${a.path}</link>`,
              `    <guid isPermaLink="true">${BASE_URL}${a.path}</guid>`,
              `    <description>${escapeXml(a.description)}</description>`,
              `    <category>${escapeXml(a.category)}</category>`,
              `    <pubDate>${a.date.toUTCString()}</pubDate>`,
              `  </item>`,
            ].join("\n"),
          );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
          `<channel>`,
          `  <title>GameCastle Anime — Anime Reviews, Guides &amp; Culture</title>`,
          `  <link>${BASE_URL}/</link>`,
          `  <description>Reviews, character deep-dives, watch orders and long-form anime editorial from GameCastle Anime.</description>`,
          `  <language>en</language>`,
          `  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
          ...items,
          `</channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
            "CDN-Cache-Control": "public, max-age=900, stale-while-revalidate=86400",
            "X-Robots-Tag": "all",
          },
        });
      },
    },
  },
});
