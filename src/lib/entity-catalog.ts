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

export function entityPath(entityType: CatalogEntity["entity_type"], slug: string): string {
  switch (entityType) {
    case "code":
      return `/en/codes/${slug}`;
    case "product":
      return `/en/product/${slug}`;
    case "article":
      return `/en/articles/${slug}`;
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
    links: [{ rel: "canonical", href: `https://gamecastle.store${entityPath(entity.entity_type, entity.slug)}` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(entitySchema(entity)) }],
  };
}
