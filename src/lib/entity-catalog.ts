import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type EntityKind = "anime" | "article" | "product" | "code";
export type CatalogEntity = {
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  entity_type: EntityKind;
  status: string;
  source_name: string | null;
  source_url: string | null;
};
type CatalogDatabase = {
  public: {
    Tables: { entities: { Row: CatalogEntity; Insert: CatalogEntity; Update: Partial<CatalogEntity>; Relationships: [] } };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
const catalog = supabase as unknown as SupabaseClient<CatalogDatabase>;
export function entityPath(kind: EntityKind, slug: string): string {
  const section = { anime: "anime", article: "articles", product: "product", code: "codes" }[kind];
  return `/en/${section}/${encodeURIComponent(slug)}`;
}
export async function loadEntity(kind: EntityKind, slug: string) {
  const { data, error } = await catalog.from("entities")
    .select("slug, name, description, image_url, entity_type, status, source_name, source_url")
    .eq("status", "active").eq("entity_type", kind).eq("slug", slug).maybeSingle();
  if (error) throw new Error("The catalog is temporarily unavailable. Please try again later.");
  return data?.name && data.description?.trim() ? data : null;
}
export async function loadEntities(kind: EntityKind) {
  const { data, error } = await catalog.from("entities")
    .select("slug, name, description, image_url, entity_type, status, source_name, source_url")
    .eq("status", "active").eq("entity_type", kind).order("slug").limit(100);
  if (error) throw new Error("The catalog is temporarily unavailable. Please try again later.");
  return (data ?? []).filter((item) => item.name && item.description?.trim());
}
export function entityHead(entity: CatalogEntity | undefined) {
  if (!entity) return { meta: [{ name: "robots", content: "noindex, follow" }] };
  const title = `${entity.name} · GameCastle Anime`;
  const description = entity.description ?? "";
  const url = `https://gamecastle.store${entityPath(entity.entity_type, entity.slug)}`;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://gamecastle.store"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": entity.name,
            "item": url
          }
        ]
      },
      ...(entity.source_url ? [{
        "@type": "VideoObject",
        "name": entity.name,
        "description": description.slice(0, 300),
        "thumbnailUrl": entity.image_url ?? "https://gamecastle.store/og-image.jpg",
        "uploadDate": new Date().toISOString().split('T')[0] + "T00:00:00+00:00",
        "contentUrl": entity.source_url,
        "embedUrl": entity.source_url
      }] : [])
    ]
  };

  return {
    meta: [
      { title }, 
      { name: "description", content: description.slice(0, 160) },
      { property: "og:title", content: title }, 
      { property: "og:description", content: description.slice(0, 160) },
      { property: "og:url", content: url },
      { name: "robots", content: description.trim().split(/\s+/).length >= 100 ? "index, follow" : "noindex, follow" }
    ],
    links: [
      { rel: "canonical", href: url },
      ...(entity.image_url ? [{ rel: "preload", as: "image", href: entity.image_url, fetchpriority: "high" }] : [])
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(schemaData),
      },
    ],
  };
}
