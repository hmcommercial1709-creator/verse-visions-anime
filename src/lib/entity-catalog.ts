export type CatalogEntity = {
  slug: string;
  name: string;
  description: string;
  image_url: string;
  entity_type: "code" | "product" | "article";
  status: string;
  source_name: string | null;
  source_url: string | null;
  aggregate_rating: number | null;
  target_market: string;
  target_language: string;
  sample_review: string | null;
  localized_faqs: CatalogFaq[];
};

export type CatalogFaq = {
  question: string;
  answer: string;
};

/**
 * Canonical path for an entity — the URL the sitemap lists, the page's
 * canonical tag points at, and internal links should use.
 *
 * Every branch used to carry an "/en" prefix, which was wrong three different
 * ways. The default locale carries no prefix (see localizePath), so /en/codes
 * fought the /codes canonical the sitemap advertises. /en/articles/<slug>
 * matched no route at all — only a /$locale/articles/ index exists — so those
 * links were plain 404s, and the same broken URL went into the JSON-LD @id.
 * And products live at /store/<slug>, which is what the sitemap has always
 * listed.
 */
export function entityPath(entityType: CatalogEntity["entity_type"], slug: string): string {
  switch (entityType) {
    case "code":
      return `/codes/${slug}`;
    case "product":
      return `/store/${slug}`;
    case "article":
      return `/article/${slug}`;
  }
}

function entitySchema(entity: CatalogEntity): Record<string, unknown> {
  const productId = `${entityPath(entity.entity_type, entity.slug)}#product`;
  const product = {
    "@type": "Product",
    "@id": `https://gamecastle.store${productId}`,
    name: entity.name,
    description: entity.description,
    image: entity.image_url,
    sku: entity.slug,
    brand: { "@type": "Brand", name: "GameCastle" },
    aggregateRating: entity.aggregate_rating
      ? {
          "@type": "AggregateRating",
          ratingValue: entity.aggregate_rating,
          bestRating: 5,
          ratingCount: 1,
        }
      : undefined,
    review: entity.sample_review
      ? {
          "@type": "Review",
          reviewBody: entity.sample_review,
          author: { "@type": "Organization", name: entity.source_name || "GameCastle" },
        }
      : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      product,
      {
        "@type": "FAQPage",
        mainEntity: entity.localized_faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function entityHead(entity: CatalogEntity | null | undefined) {
  if (!entity) {
    return {
      meta: [
        { title: "Content unavailable | GameCastle" },
        { name: "robots", content: "noindex, follow" },
      ],
    };
  }

  return {
    meta: [
      { title: `${entity.name} · GameCastle Anime` },
      { name: "description", content: entity.description.slice(0, 160) },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: entity.name },
      { property: "og:description", content: entity.description.slice(0, 160) },
      { property: "og:image", content: entity.image_url },
    ],
    links: [
      {
        rel: "canonical",
        href: `https://gamecastle.store${entityPath(entity.entity_type, entity.slug)}`,
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(entitySchema(entity)) }],
  };
}
