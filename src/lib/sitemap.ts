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
  populatedGenres,
  populatedStudios,
  populatedCategorySlugs,
} from "@/lib/content-registry";
import { AR_GUIDES } from "@/data/ar-guides";
import { storeProducts } from "@/data/store-products";
import { EXPLORE_PAGES } from "@/data/explore-pages";
import {
  INDEXABLE_LOCALES,
  DEFAULT_LOCALE,
  getLocale,
  localizePath,
  type LocaleCode,
} from "@/lib/i18n";

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
    "/browse",
    "/seasonal",
    "/trending",
    "/top-rated",
    "/top-lists",
    "/new-releases",
    "/upcoming",
    "/completed",
    "/classic",
    "/genres",
    "/studios",
    "/characters",
    "/streaming",
  ].map((path) => ({ path, changefreq: "daily" as const, priority: "0.9" })),

  ...[
    "/blog",
    "/reviews",
    "/guides",
    "/editorial",
    "/watch-order",
    "/power-scaling",
    "/manga-spoilers",
    "/timeline",
    "/wallpapers",
    "/rewards/anime-wallpapers",
    "/resources",
    "/store",
    "/game-top-up",
    "/gaming-gift-cards",
    "/gaming-hub",
    "/gaming-hub/game-codes-deals",
    "/gaming-hub/region-currency-guide",
    "/gaming-hub/safe-game-credits-guide",
    "/gaming-hub/anime-games",
    "/authors",
    "/faq",
  ].map((path) => ({ path, changefreq: "weekly" as const, priority: "0.8" })),
  ...["/about", "/contact", "/sitemap-page"].map((path) => ({
    path,
    changefreq: "monthly" as const,
    priority: "0.6",
  })),
  ...["/privacy-policy", "/terms-of-service", "/cookies", "/dmca", "/editorial-policy"].map(
    (path) => ({
      path,
      changefreq: "yearly" as const,
      priority: "0.4",
    }),
  ),
  ...storeProducts
    .filter((product) => product.indexable !== false)
    .map((product) => ({
      path: `/store/${product.slug}`,
      changefreq: "weekly" as const,
      priority: "0.8",
    })),
  { path: "/explore", changefreq: "weekly", priority: "0.9" },
  ...EXPLORE_PAGES.map((page) => ({
    path: `/explore/${page.slug}`,
    changefreq: "weekly" as const,
    priority: "0.8",
  })),
];

export function partitionEntries(partition: Partition): SitemapEntry[] {
  switch (partition) {
    case "pages":
      return PAGE_ENTRIES;
    case "anime":
      return publishedAnime().map((a) => ({
        path: `/anime/${a.slug}`,
        changefreq: "weekly" as const,
        priority: "0.9",
      }));
    case "episodes":
      return publishedEpisodes().map((e) => ({
        path: `/anime/${e.animeSlug}/episode/${e.number}`,
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
    case "articles":
      return publishedArticles().map((a) => ({
        path: `/article/${a.slug}`,
        changefreq: "weekly" as const,
        priority: "0.8",
      }));
    case "characters":
      return publishedCharacters().map((c) => ({
        path: `/character/${c.slug}`,
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
    case "taxonomy":
      return [
        ...populatedCategorySlugs().map((slug) => ({
          path: `/category/${slug}`,
          changefreq: "daily" as const,
          priority: "0.8",
        })),
        ...populatedGenres().map((g) => ({
          path: `/genre/${g.slug}`,
          changefreq: "weekly" as const,
          priority: "0.7",
        })),
        ...populatedStudios().map((s) => ({
          path: `/studio/${s.slug}`,
          changefreq: "weekly" as const,
          priority: "0.7",
        })),
      ];
  }
}

/**
 * Renders a urlset for one locale. Every <url> carries xhtml:link alternates
 * for each locale with indexable content (self-referencing alternate
 * included, as required by the hreflang spec).
 */
export function urlsetXml(entries: SitemapEntry[], locale: LocaleCode = DEFAULT_LOCALE): string {
  const withAlternates = INDEXABLE_LOCALES.length > 1;
  const seen = new Set<string>();
  const urls = entries
    .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${localizePath(e.path, locale)}</loc>`,
        ...(withAlternates
          ? INDEXABLE_LOCALES.map(
              (code) =>
                `    <xhtml:link rel="alternate" hreflang="${getLocale(code).hrefLang}" href="${BASE_URL}${localizePath(e.path, code)}" />`,
            ).concat([
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${e.path}" />`,
            ])
          : []),
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n"),
    );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

/** Child sitemap path for a partition in a given locale. */
export function partitionSitemapPath(
  partition: Partition,
  locale: LocaleCode = DEFAULT_LOCALE,
): string {
  return locale === DEFAULT_LOCALE
    ? `/sitemap-${partition}.xml`
    : `/sitemap/${locale}/${partition}.xml`;
}

export function sitemapIndexXml(): string {
  const children = [
    ...INDEXABLE_LOCALES.flatMap((locale) =>
      PARTITIONS.map((p) => partitionSitemapPath(p, locale)),
    ),
    // Arabic cornerstone edition: real localized content, its own child sitemap.
    "/sitemap-ar.xml",
  ];
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...children.map((path) => `  <sitemap>\n    <loc>${BASE_URL}${path}</loc>\n  </sitemap>`),
    `</sitemapindex>`,
  ].join("\n");
}

/**
 * Arabic edition URLs: the anime hub, localized guides and the fully translated
 * reward gallery. Only paths with real Arabic content are advertised.
 */
export const AR_ENTRIES: SitemapEntry[] = [
  { path: "/ar/anime", changefreq: "weekly", priority: "0.9" },
  { path: "/ar/rewards/anime-wallpapers", changefreq: "weekly", priority: "0.8" },
  ...AR_GUIDES.map((g) => ({
    path: `/ar/anime/${g.slug}`,
    changefreq: "monthly" as const,
    priority: "0.8",
  })),
];

/** urlset for the Arabic edition, with hreflang pairs to the English original. */
export function arUrlsetXml(): string {
  const urls = AR_ENTRIES.map((e) => {
    const guide = AR_GUIDES.find((g) => `/ar/anime/${g.slug}` === e.path);
    const enPath =
      e.path === "/ar/rewards/anime-wallpapers"
        ? "/rewards/anime-wallpapers"
        : guide?.enPath;
    return [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}${e.path}" />`,
      ...(enPath
        ? [
            `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${enPath}" />`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${enPath}" />`,
          ]
        : []),
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n");
  });
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
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
