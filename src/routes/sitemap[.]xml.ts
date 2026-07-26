import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  publishedAnime,
  publishedArticles,
  publishedCharacters,
  publishedEpisodes,
  allGenres,
  allStudios,
} from "@/lib/content-registry";
import { categorySlugs } from "@/data/categories";

const BASE_URL = "https://gamecastle.store";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

/** Public, indexable static routes. Redirect-only paths (/privacy, /terms) are omitted. */
const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  // Collection / browse hubs
  ...[
    "/browse",
    "/trending",
    "/top",
    "/top-rated",
    "/top-lists",
    "/new-releases",
    "/upcoming",
    "/completed",
    "/classic",
    "/recommendations",
    "/genres",
    "/studios",
    "/characters",
    "/streaming",
  ].map((path) => ({ path, changefreq: "daily" as const, priority: "0.9" })),
  // Editorial hubs
  ...[
    "/blog",
    "/news",
    "/reviews",
    "/guides",
    "/editorial",
    "/watch-order",
    "/power-scaling",
    "/manga-spoilers",
    "/timeline",
    "/quotes",
    "/facts",
    "/statistics",
    "/awards",
    "/events",
    "/openings",
    "/soundtracks",
    "/wallpapers",
    "/merch",
    "/authors",
    "/faq",
  ].map((path) => ({ path, changefreq: "weekly" as const, priority: "0.8" })),
  // Company & compliance
  ...["/about", "/contact", "/sitemap-page"].map((path) => ({
    path,
    changefreq: "monthly" as const,
    priority: "0.6",
  })),
  ...["/privacy-policy", "/terms-of-service", "/cookies", "/dmca", "/editorial-policy"].map((path) => ({
    path,
    changefreq: "yearly" as const,
    priority: "0.4",
  })),
];

function dynamicEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const a of publishedAnime())
    entries.push({ path: `/anime/${a.slug}`, changefreq: "weekly", priority: "0.9" });
  for (const e of publishedEpisodes())
    entries.push({ path: `/anime/${e.animeSlug}/episode/${e.number}`, changefreq: "monthly", priority: "0.7" });
  for (const a of publishedArticles())
    entries.push({ path: `/article/${a.slug}`, changefreq: "weekly", priority: "0.8" });
  for (const c of publishedCharacters())
    entries.push({ path: `/character/${c.slug}`, changefreq: "monthly", priority: "0.7" });
  for (const slug of categorySlugs())
    entries.push({ path: `/category/${slug}`, changefreq: "daily", priority: "0.8" });
  for (const g of allGenres())
    entries.push({ path: `/genre/${g.slug}`, changefreq: "weekly", priority: "0.7" });
  for (const s of allStudios())
    entries.push({ path: `/studio/${s.slug}`, changefreq: "weekly", priority: "0.7" });
  return entries;
}

function buildXml(): string {
  const seen = new Set<string>();
  const entries = [...STATIC_ROUTES, ...dynamicEntries()].filter((e) => {
    if (seen.has(e.path)) return false;
    seen.add(e.path);
    return true;
  });

  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            "X-Robots-Tag": "all",
          },
        }),
    },
  },
});
