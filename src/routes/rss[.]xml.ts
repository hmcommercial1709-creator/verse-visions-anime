import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { publishedArticles } from "@/lib/content-registry";

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
        const items = [...publishedArticles()]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 50)
          .map((a) =>
            [
              `  <item>`,
              `    <title>${escapeXml(a.title)}</title>`,
              `    <link>${BASE_URL}/article/${a.slug}</link>`,
              `    <guid isPermaLink="true">${BASE_URL}/article/${a.slug}</guid>`,
              `    <description>${escapeXml(a.excerpt)}</description>`,
              `    <category>${escapeXml(a.tag)}</category>`,
              `    <pubDate>${new Date(`${a.date}T00:00:00Z`).toUTCString()}</pubDate>`,
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
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
