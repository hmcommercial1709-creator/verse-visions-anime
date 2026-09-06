export type CatalogEntity = {
  slug: string;
  name: string;
  description: string;
  image_url: string;
  entity_type: "code" | "product" | "article";
  status: string;
  source_name: string | null;
  source_url: string | null;
  aggregate_rating: number;
  target_market: string;
  target_language: string;
  sample_review: string | null;
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

export function entityHead(entity: CatalogEntity | null | undefined) {
  if (!entity) {
    return {
      meta: [{ name: "robots", content: "noindex, follow" }],
    };
  }

  return {
    meta: [
      { title: `${entity.name} · GameCastle Anime` },
      { name: "description", content: entity.description.slice(0, 160) },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `https://gamecastle.store${entityPath(entity.entity_type, entity.slug)}` }],
  };
}
