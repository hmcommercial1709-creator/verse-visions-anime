/**
 * Shared SEO helpers for dynamic, high-volume routes.
 *
 * Brand: Verse Visions
 * Domain: gamecastle.store
 */

export const SITE_URL = "https://gamecastle.store";
export const SITE_NAME = "Verse Visions";
export const SITE_DESCRIPTION =
  "Verse Visions — anime, characters, episodes, guides, games, reviews and more.";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type Crumb = {
  path?: string;
  name: string;
};

/**
 * BreadcrumbList JSON-LD for dynamic pages.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path
        ? {
            item: absoluteUrl(crumb.path),
          }
        : {}),
    })),
  };
}

/**
 * FAQPage JSON-LD.
 *
 * Only use this when the questions and answers are
 * actually visible on the page.
 */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * Canonical + Open Graph URL.
 */
export function canonicalMeta(path: string) {
  const url = absoluteUrl(path);

  return {
    link: {
      rel: "canonical" as const,
      href: url,
    },
    meta: {
      property: "og:url",
      content: url,
    },
  };
}

/**
 * CollectionPage JSON-LD for category and hub pages.
 */
export function collectionSchema(opts: {
  path: string;
  name: string;
  description: string;
  items?: {
    path: string;
    name: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),

    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },

    ...(opts.items && opts.items.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: opts.items.length,
            itemListElement: opts.items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: absoluteUrl(item.path),
            })),
          },
        }
      : {}),
  };
}

/**
 * WebSite JSON-LD.
 *
 * Use once on the main site/root layout,
 * not repeatedly on every entity page.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}

/**
 * Article JSON-LD for editorial content.
 */
export function articleSchema(opts: {
  path: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.path),

    ...(opts.datePublished
      ? {
          datePublished: opts.datePublished,
        }
      : {}),

    ...(opts.dateModified
      ? {
          dateModified: opts.dateModified,
        }
      : {}),

    ...(opts.image
      ? {
          image: [absoluteUrl(opts.image)],
        }
      : {}),

    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(opts.path),
    },
  };
}

/**
 * Person JSON-LD for character/entity pages.
 */
export function personSchema(opts: {
  path: string;
  name: string;
  description?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    url: absoluteUrl(opts.path),

    ...(opts.description
      ? {
          description: opts.description,
        }
      : {}),

    ...(opts.image
      ? {
          image: absoluteUrl(opts.image),
        }
      : {}),
  };
}

/**
 * ItemList JSON-LD for browsable lists.
 */
export function itemListSchema(
  items: {
    path: string;
    name: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
