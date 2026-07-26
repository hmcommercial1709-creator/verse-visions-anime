import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  publishedAnime,
  publishedArticles,
  publishedCharacters,
  publishedEpisodes,
} from "@/lib/content-registry";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";

const BASE_URL = "https://gamecastle.store";

type Changefreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq?: Changefreq;
  priority?: string;
};

// Static routes owned by the app shell. Content-driven URLs come from the
// registry and are automatically filtered by publicationStatus.
const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  ...[
    "/browse", "/trending", "/top", "/upcoming", "/new-releases", "/completed", "/classic",
    "/genres", "/studios", "/characters",
    "/news", "/reviews", "/guides", "/top-lists", "/editorial",
    "/manga-spoilers", "/power-scaling",
  ].map((path): SitemapEntry => ({ path, changefreq: "daily", priority: "0.9" })),
  ...[
    "/watch-order", "/timeline", "/recommendations",
    "/quotes", "/facts", "/soundtracks", "/openings", "/wallpapers",
    "/merch", "/events", "/streaming", "/awards", "/statistics", "/authors",
  ].map((path): SitemapEntry => ({ path, changefreq: "weekly", priority: "0.7" })),
  ...["/about", "/contact", "/faq", "/sitemap-page"].map(
    (path): SitemapEntry => ({ path, changefreq: "monthly", priority: "0.5" }),
  ),
  ...["/privacy-policy", "/terms-of-service", "/cookies", "/dmca", "/editorial-policy"].map(
    (path): SitemapEntry => ({ path, changefreq: "yearly", priority: "0.3" }),
  ),
];

function buildEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [...STATIC_ENTRIES];

  for (const g of genres) entries.push({ path: `/genre/${g.slug}`, changefreq: "weekly", priority: "0.8" });
  for (const s of studios) entries.push({ path: `/studio/${s.slug}`, changefreq: "monthly", priority: "0.6" });
  for (const a of publishedAnime()) entries.push({ path: `/anime/${a.slug}`, changefreq: "weekly", priority: "0.9" });
  for (const e of publishedEpisodes())
    entries.push({ path: `/anime/${e.animeSlug}/episode/${e.number}`, changefreq: "monthly", priority: "0.6" });
  for (const c of publishedCharacters())
    entries.push({ path: `/character/${c.slug}`, changefreq: "monthly", priority: "0.6" });
  for (const a of publishedArticles())
    entries.push({
      path: `/article/${a.slug}`,
      // Authored publication date — the only page-specific timestamp we have.
      lastmod: /^\d{4}-\d{2}-\d{2}$/.test(a.date) ? a.date : undefined,
      changefreq: "monthly",
      priority: "0.8",
    });

  return entries;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = buildEntries().map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
