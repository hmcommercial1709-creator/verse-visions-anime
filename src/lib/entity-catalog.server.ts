import type { CatalogEntity, CatalogFaq } from "./entity-catalog";
import type { SitemapEntry } from "./sitemap";

type CatalogEntityRow = {
  slug: string | null;
  title: string | null;
  sample_review: string | null;
  target_market: string | null;
  target_language: string | null;
  aggregate_rating: string | number | null;
};

const CODE_SELECT = "slug, title, sample_review, target_market, target_language, aggregate_rating";

function localizedFaqs(name: string, market: string, language: string, review: string | null): CatalogFaq[] {
  const reviewHint = review || "the verified user review on this page";
  if (language.toLowerCase().startsWith("es")) {
    return [
      { question: `Como activo ${name} en ${market}?`, answer: `Consulta las instrucciones de activacion de tu plataforma y verifica que tu cuenta pertenezca a ${market}.` },
      { question: `Es fiable este codigo de ${name}?`, answer: `Esta pagina combina los datos regionales de ${market} con ${reviewHint} para que puedas revisar la informacion antes de activar.` },
    ];
  }
  if (language.toLowerCase().startsWith("fr")) {
    return [
      { question: `Comment activer ${name} pour ${market} ?`, answer: `Suivez les instructions de votre plateforme et verifiez que votre compte est eligible pour ${market}.` },
      { question: `Les informations sur ${name} sont-elles verifiees ?`, answer: `Cette page combine les donnees regionales de ${market} avec ${reviewHint} afin de faciliter votre verification avant l activation.` },
    ];
  }
  return [
    { question: `How do I activate ${name} in ${market}?`, answer: `Follow your platform's redemption instructions and confirm that your account is eligible for ${market}. The activation language for this listing is ${language}.` },
    { question: `Is this ${name} listing verified?`, answer: `Review the regional details for ${market}, the ${language} activation guidance, and ${reviewHint} before redeeming.` },
  ];
}

function toCatalogEntity(row: CatalogEntityRow): CatalogEntity | null {
  const name = row.title?.trim();
  const slug = row.slug?.trim();
  const market = row.target_market?.trim();
  const language = row.target_language?.trim();
  if (!slug || !name || !market || !language) return null;

  const review = row.sample_review?.trim() || null;
  const rating = Number(row.aggregate_rating);
  const aggregateRating = Number.isFinite(rating) && rating > 0 ? rating : null;
  const faqs = localizedFaqs(name, market, language, review);
  const description = [
    `${name} activation guide for the ${market} market.`,
    `Redeem with ${language} instructions and verify regional eligibility before activation.`,
    review ? `User review: ${review}` : "User review: No review has been published yet; verify the listing details before activation.",
    `Frequently asked questions for ${name}: ${faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" ")}`,
  ].join(" ");

  return {
    slug,
    name,
    description,
    image_url: "https://gamecastle.store/og-codes-nexus.jpg",
    entity_type: "code",
    status: "active",
    source_name: "GameCastle Nexus Engine",
    source_url: null,
    aggregate_rating: aggregateRating,
    target_market: market,
    target_language: language,
    sample_review: review,
    localized_faqs: faqs,
  };
}

export async function loadEntityFromDb(kind: CatalogEntity["entity_type"], slug: string): Promise<CatalogEntity | null> {
  if (kind === "code") {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("game_nexus_matrix")
        .select(CODE_SELECT)
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) return null;
      return toCatalogEntity(data as CatalogEntityRow);
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
        .select(CODE_SELECT)
        .range(0, 999);

      if (error || !data) return [];

      const entities: CatalogEntity[] = [];
      let rows = data as CatalogEntityRow[];
      let offset = 0;
      while (rows.length > 0 && offset < 1_000_000) {
        for (const row of rows) {
          const entity = toCatalogEntity(row);
          if (entity) entities.push(entity);
        }
        if (rows.length < 1000) break;
        offset += 1000;
        const next = await supabaseAdmin
          .from("game_nexus_matrix")
          .select(CODE_SELECT)
          .range(offset, offset + 999);
        if (next.error || !next.data) break;
        rows = next.data as CatalogEntityRow[];
      }
      return entities;
    } catch {
      return [];
    }
  }

  return [];
}

export async function loadCodeSitemapEntries(partition: 1 | 2): Promise<SitemapEntry[]> {
  const entities = await loadEntitiesFromDb("code");
  const partitionSize = 40000;
  const start = (partition - 1) * partitionSize;
  return entities.slice(start, start + partitionSize).map((entity) => ({
    path: `/en/codes/${entity.slug}`,
    changefreq: "weekly" as const,
    priority: "0.7",
  }));
}
