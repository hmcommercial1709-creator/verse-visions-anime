import type { CatalogEntity } from "./entity-catalog";

export async function loadEntityFromDb(kind: CatalogEntity["entity_type"], slug: string): Promise<CatalogEntity | null> {
  if (kind === "code") {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("game_nexus_matrix")
        .select("slug, title, sample_review, target_market, target_language, aggregate_rating")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) return null;

      const market = data.target_market || "Global Market";
      const lang = data.target_language || "EN";
      const rating = Number(data.aggregate_rating) || 4.9;

      const richDescription = `
        Complete activation guide, secure region keys, and verified user insights for ${data.title}.
        Engineered specifically for ${market} (${lang}) users.
        ${data.sample_review || "Redeem instantly to unlock official digital rewards, high-speed regional server access, and premium gaming perks."}
        Verified safety protocols, instant delivery code mapping, and step-by-step redemption instructions included.
      `.trim();

      return {
        slug: data.slug,
        name: data.title ?? data.slug,
        description: richDescription,
        image_url: "https://gamecastle.store/og-codes-nexus.jpg",
        entity_type: "code" as const,
        status: "active" as const,
        source_name: "GameCastle Nexus Engine",
        source_url: null,
        aggregate_rating: rating,
        target_market: market,
        target_language: lang,
        sample_review: data.sample_review,
      };
    } catch {
      return null;
    }
  }

  return null;
}

export async function loadEntitiesFromDb(kind: CatalogEntity["entity_type"]): Promise<CatalogEntity[]> {
  if (kind === "code") {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("game_nexus_matrix")
        .select("slug, title, sample_review, target_market, target_language, aggregate_rating")
        .range(0, 99);

      if (error || !data) return [];

      return data.map((row) => {
        const market = row.target_market || "Global Market";
        const lang = row.target_language || "EN";
        const rating = Number(row.aggregate_rating) || 4.9;
        return {
          slug: row.slug,
          name: row.title ?? row.slug,
          description: row.sample_review || `${row.title} — verified digital code with instant delivery.`,
          image_url: "https://gamecastle.store/og-codes-nexus.jpg",
          entity_type: "code" as const,
          status: "active" as const,
          source_name: "GameCastle Nexus Engine",
          source_url: null,
          aggregate_rating: rating,
          target_market: market,
          target_language: lang,
          sample_review: row.sample_review,
        };
      });
    } catch {
      return [];
    }
  }

  return [];
}
