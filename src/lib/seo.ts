/**
 * Shared SEO helpers for dynamic, high-volume routes.
 * Canonicals and og:url must be absolute and self-referencing.
 */
export const SITE_URL = "https://gamecastle.store";
export const SITE_NAME = "GameCastle Anime";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type Crumb = { path?: string; name: string };

/** BreadcrumbList JSON-LD for any dynamic template route. */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(c.path) } : {}),
    })),
  };
}

/** FAQPage JSON-LD from a simple question/answer list. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Canonical link + og:url pair for a route path. */
export function canonicalMeta(path: string) {
  const url = absoluteUrl(path);
  return {
    link: { rel: "canonical" as const, href: url },
    meta: { property: "og:url", content: url },
  };
}

/** CollectionPage JSON-LD for listing/hub routes. */
export function collectionSchema(opts: {
  path: string;
  name: string;
  description: string;
  items?: { path: string; name: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ...(opts.items && opts.items.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: opts.items.length,
            itemListElement: opts.items.map((it, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: it.name,
              url: absoluteUrl(it.path),
            })),
          },
        }
      : {}),
  };
}
