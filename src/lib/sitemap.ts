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
import { allSectionPaths } from "@/lib/anime-sections";
import { AR_GUIDES } from "@/data/ar-guides";
import { storeProducts } from "@/data/store-products";
import { PARTITION_LASTMOD, NEWEST_LASTMOD } from "@/generated/lastmod";
import { EXPLORE_PAGES } from "@/data/explore-pages";
import {
  INDEXABLE_LOCALES,
  hasArabicEdition,
  DEFAULT_LOCALE,
  getLocale,
  localizePath,
  type LocaleCode,
} from "@/lib/i18n";

export const BASE_URL = "https://gamecastle.store";

/**
 * Entity-escapes a URL for use inside <loc> or an href attribute.
 *
 * The sitemaps.org spec requires this, and it is not cosmetic: a single
 * unescaped "&" in one slug makes the whole file fail to parse, so Google
 * rejects every URL in it, not just the offending one. Paths here are built
 * from database slugs, which we do not control, so the escape belongs at the
 * point of rendering rather than in a hope that upstream stays clean.
 */
export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapEntry {
  path: string;
  changefreq?: ChangeFreq;
  priority?: string;
  /**
   * Omitted rather than guessed. An absent lastmod tells a crawler nothing; a
   * wrong one tells it something false, and a build timestamp on every URL is
   * the fabricated freshness crawlers learn to ignore. See
   * scripts/build-lastmod.mjs - these come from git.
   */
  lastmod?: string;
}

/** The git date for a partition, or undefined when the map has no entry. */
export const partitionLastmod = (partition: string): string | undefined =>
  PARTITION_LASTMOD[partition];

/** Stamps a partition's date onto its entries, leaving any explicit one alone. */
export const withLastmod = (entries: SitemapEntry[], partition: string): SitemapEntry[] => {
  const lastmod = partitionLastmod(partition);
  return lastmod ? entries.map((e) => (e.lastmod ? e : { ...e, lastmod })) : entries;
};

export const PARTITIONS = [
  "pages",
  "products",
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
    "/anime/dandadan",
    "/anime/dandadan/episode-guide",
    "/anime/dandadan/characters",
    "/anime/dandadan/occult-world",
    "/anime/dandadan/watch-guide",
    "/anime/sakamoto-days",
    "/anime/sakamoto-days/episode-guide",
    "/anime/sakamoto-days/characters",
    "/anime/sakamoto-days/assassin-world",
    "/anime/sakamoto-days/watch-guide",
    "/resources",
    "/store",
    "/game-top-up",
    "/gaming-gift-cards",
    "/gaming-hub",
    "/gaming-hub/game-codes-deals",
    "/gaming-hub/region-currency-guide",
    "/gaming-hub/safe-game-credits-guide",
    "/gaming-hub/anime-games",
    "/gaming-hub/ultimate-gaming-secrets-guide",
    "/gaming-hub/genshin-impact-ultimate-guide",
    "/gaming-hub/honkai-star-rail-ultimate-guide",
    "/gaming-hub/ultimate-anime-gaming-hub-2026",
    "/gaming-hub/global-gaming-hub-2026",
    "/gaming-hub/releases-2026-2027",
    "/gaming-hub/game-comparisons-performance",
    "/gaming-hub/troubleshooting-performance",
    "/gaming-hub/pro-walkthroughs-endgame",
    "/authors",
    "/faq",
    "/gamer-card",
    "/character-quiz",
    "/my-list",
    "/matchmaker",
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
  { path: "/explore", changefreq: "weekly", priority: "0.9" },
  ...EXPLORE_PAGES.map((page) => ({
    path: `/explore/${page.slug}`,
    changefreq: "weekly" as const,
    priority: "0.8",
  })),
];

export function partitionEntries(partition: Partition): SitemapEntry[] {
  return withLastmod(partitionEntriesRaw(partition), partition);
}

function partitionEntriesRaw(partition: Partition): SitemapEntry[] {
  switch (partition) {
    case "pages":
      return PAGE_ENTRIES;
    case "products":
      return storeProducts
        .filter((product) => product.indexable !== false)
        .map((product) => ({
          path: `/store/${product.slug}`,
          changefreq: "weekly" as const,
          priority: "0.8",
        }));
    case "anime":
      return [
        ...publishedAnime().map((a) => ({
          path: `/anime/${a.slug}`,
          changefreq: "weekly" as const,
          priority: "0.9",
        })),
        // Section pages only exist where the series actually carries that
        // content, so allSectionPaths() never advertises an empty shell.
        ...allSectionPaths().map(({ slug, section }) => ({
          path: `/anime/${slug}/${section}`,
          changefreq: "monthly" as const,
          priority: "0.7",
        })),
      ];
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
  const englishOnly = (path: string) =>
    !hasArabicEdition(path) || path === "/anime/dandadan" || path === "/anime/sakamoto-days";
  const seen = new Set<string>();
  const urls = entries
    .filter((e) => !englishOnly(e.path) || locale === "en")
    .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
    .map((e) => {
      const locales = englishOnly(e.path) ? ["en" as const] : INDEXABLE_LOCALES;
      return [
        `  <url>`,
        `    <loc>${xmlEscape(BASE_URL + localizePath(e.path, locale))}</loc>`,
        ...(withAlternates && locales.length > 1
          ? locales
              .map(
                (code) =>
                  `    <xhtml:link rel="alternate" hreflang="${getLocale(code).hrefLang}" href="${xmlEscape(BASE_URL + localizePath(e.path, code))}" />`,
              )
              .concat([
                `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(BASE_URL + e.path)}" />`,
              ])
          : []),
        e.lastmod ? `    <lastmod>${xmlEscape(e.lastmod)}</lastmod>` : null,
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

/** Child sitemap path for a partition in a given locale. */
export function partitionSitemapPath(
  partition: Partition,
  locale: LocaleCode = DEFAULT_LOCALE,
): string {
  return locale === DEFAULT_LOCALE
    ? `/sitemap-${partition}.xml`
    : `/sitemap/${locale}/${partition}.xml`;
}

/**
 * Builds the index.
 *
 * Every child listed here must answer with a non-empty <urlset>. Google
 * reports an empty sitemap as an error with 0 discovered URLs against the
 * whole index, so `hasMatrix` and `hasManga` gate their children on the table
 * actually holding rows rather than on the pipeline being expected to run.
 */
/**
 * Maps a child sitemap path back to the partition whose git date describes it.
 * Falls back to the newest date in the map for children with no partition of
 * their own, and to undefined when the map is empty - never to today.
 */
function lastmodForChild(path: string): string | undefined {
  // Two shapes are served: /sitemap/<locale>/<partition>.xml for the localized
  // partitions, and /sitemap-<name>.xml for everything else. Getting the first
  // wrong is silent - it simply falls through to the newest date and every
  // localized child claims the same day.
  const localized = path.match(/^\/sitemap\/[a-z-]+\/([a-z0-9-]+)\.xml$/i);
  if (localized) return PARTITION_LASTMOD[localized[1]] ?? NEWEST_LASTMOD;

  const flat = path.match(/^\/sitemap-([a-z0-9-]+)\.xml$/i);
  if (!flat) return NEWEST_LASTMOD;
  return PARTITION_LASTMOD[flat[1]] ?? NEWEST_LASTMOD;
}

export function sitemapIndexXml(hasMatrix = false, hasManga = false): string {
  const children = [
    ...INDEXABLE_LOCALES.flatMap((locale) =>
      PARTITIONS.filter(
        (p) =>
          locale === "en" ||
          partitionEntries(p).some(
            (e) =>
              hasArabicEdition(e.path) &&
              e.path !== "/anime/dandadan" &&
              e.path !== "/anime/sakamoto-days",
          ),
      ).map((p) => partitionSitemapPath(p, locale)),
    ),
    // Arabic cornerstone edition: real localized content, its own child sitemap.
    "/sitemap-ar.xml",
    // The two codes partitions stood here. They advertised up to 5,000 URLs
    // built from fabricated rows — an invented rating, an invented review
    // count, and one of four hardcoded review sentences repeated across
    // thousands of pages. Capping them was treating the symptom; the pages
    // themselves now answer 410, so there is nothing left to advertise.
    // API-backed catalog: game detail URLs plus the paginated anime index.
    "/sitemap-catalog.xml",
    // The programmatic matrix, but only once the ingest has actually built an
    // index for it to serve. Advertising it before then is the same mistake
    // the codes partitions above already document: Google fetches the child,
    // gets an error, and reports the whole index as having a failing member —
    // which is precisely the sitemap-codes-1.xml error this site spent weeks
    // clearing. It appears on its own the first time the pipeline runs.
    ...(hasMatrix ? ["/sitemap-matrix.xml"] : []),
    // Same rule again: advertised only once the manga ingest has put rows in
    // the table, so the index never names a child that answers with an error.
    ...(hasManga ? ["/sitemap-manga.xml"] : []),
  ];
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...children.map((path) => {
      const lastmod = lastmodForChild(path);
      return [
        `  <sitemap>`,
        `    <loc>${xmlEscape(BASE_URL + path)}</loc>`,
        lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : null,
        `  </sitemap>`,
      ]
        .filter(Boolean)
        .join("\n");
    }),
    `</sitemapindex>`,
  ].join("\n");
}

/**
 * Arabic edition URLs: the anime hub and localized guides. Only paths with
 * real Arabic content are advertised.
 */
export const AR_ENTRIES: SitemapEntry[] = [
  { path: "/ar/anime", changefreq: "weekly", priority: "0.9" },
  { path: "/ar/blog/roblox-syria-guide", changefreq: "monthly", priority: "0.7" },
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
    const enPath = guide?.enPath;
    return [
      `  <url>`,
      `    <loc>${xmlEscape(BASE_URL + e.path)}</loc>`,
      ...(partitionLastmod("ar")
        ? [`    <lastmod>${xmlEscape(partitionLastmod("ar")!)}</lastmod>`]
        : []),
      `    <xhtml:link rel="alternate" hreflang="ar" href="${xmlEscape(BASE_URL + e.path)}" />`,
      ...(enPath
        ? [
            `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(BASE_URL + enPath)}" />`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(BASE_URL + enPath)}" />`,
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

/**
 * 503 for a sitemap whose data source failed.
 *
 * The alternative — catching the error and serving an empty <urlset> with a
 * 200 — is worse than it looks: Google treats that as an authoritative "these
 * URLs are gone", records 0 discovered pages, and can drop what it had already
 * indexed. A 503 with Retry-After is a transient signal it comes back to, so
 * the previously discovered URLs survive the outage.
 */
export function sitemapUnavailable(error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`sitemap unavailable: ${message}`);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<!-- sitemap temporarily unavailable -->`,
    {
      status: 503,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Retry-After": "3600",
        "Cache-Control": "no-store",
      },
    },
  );
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
    },
  });
}
