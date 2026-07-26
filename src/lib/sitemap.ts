/**
 * Shared sitemap model. The index at /sitemap.xml points at partitioned
 * child sitemaps so the site can scale past the 50k-URL / 50MB limits while
 * keeping each partition small and fast for crawlers to re-fetch.
 */
import {
  publishedAnime,
  publishedArticles,
  publishedCharacters,
  publishedEpisodes,
  allGenres,
  allStudios,
} from "@/lib/content-registry";
import { categorySlugs } from "@/data/categories";

export const BASE_URL = "https://gamecastle.store";

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapEntry {
  path: string;
  changefreq?: ChangeFreq;
  priority?: string;
}

export const PARTITIONS = [
  "pages",
  "anime",
  "episodes",
  "articles",
  "characters",
  "taxonomy",
] as const;
export type Partition = (typeof PARTITIONS)[number];

const PAGE_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  ...[
    "/browse", "/explore", "/seasonal", "/trending", "/top", "/top-rated", "/top-lists",
    "/new-releases", "/upcoming", "/completed", "/classic", "/recommendations",
    "/genres", "/studios", "/characters", "/streaming",
  ].map((path) => ({ path, changefreq: "daily" as const, priority: "0.9" })),
  ...[
    "/blog", "/news", "/reviews", "/guides", "/editorial", "/watch-order", "/power-scaling",
    "/manga-spoilers", "/timeline", "/quotes", "/facts", "/statistics", "/awards", "/events",
    "/openings", "/soundtracks", "/wallpapers", "/merch", "/authors", "/faq",
  ].map((path) => ({ path, changefreq: "weekly" as const, priority: "0.8" })),
  ...["/about", "/contact", "/sitemap-page"].map((path) => ({
    path, changefreq: "monthly" as const, priority: "0.6",
  })),
  ...["/privacy-policy", "/terms-of-service", "/cookies", "/dmca", "/editorial-policy"].map((path) => ({
    path, changefreq: "yearly" as const, priority: "0.4",
  })),
];

export function partitionEntries(partition: Partition): SitemapEntry[] {
  switch (partition) {
    case "pages":
      return PAGE_ENTRIES;
    case "anime":
      return publishedAnime().map((a) => ({
        path: `/anime/${a.slug}`, changefreq: "weekly" as const, priority: "0.9",
      }));
    case "episodes":
      return publishedEpisodes().map((e) => ({
        path: `/anime/${e.animeSlug}/episode/${e.number}`, changefreq: "monthly" as const, priority: "0.7",
      }));
    case "articles":
      return publishedArticles().map((a) => ({
        path: `/article/${a.slug}`, changefreq: "weekly" as const, priority: "0.8",
      }));
    case "characters":
      return publishedCharacters().map((c) => ({
        path: `/character/${c.slug}`, changefreq: "monthly" as const, priority: "0.7",
      }));
    case "taxonomy":
      return [
        ...categorySlugs().map((slug) => ({ path: `/category/${slug}`, changefreq: "daily" as const, priority: "0.8" })),
        ...allGenres().map((g) => ({ path: `/genre/${g.slug}`, changefreq: "weekly" as const, priority: "0.7" })),
        ...allStudios().map((s) => ({ path: `/studio/${s.slug}`, changefreq: "weekly" as const, priority: "0.7" })),
      ];
  }
}

export function urlsetXml(entries: SitemapEntry[]): string {
  const seen = new Set<string>();
  const urls = entries
    .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ].filter(Boolean).join("\n"),
    );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export function sitemapIndexXml(): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...PARTITIONS.map((p) => `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${p}.xml</loc>\n  </sitemap>`),
    `</sitemapindex>`,
  ].join("\n");
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "all",
    },
  });
}
