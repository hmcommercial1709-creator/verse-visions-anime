import {
  codeSitemapExclusions,
  MIN_REVIEWS,
  type CodeSitemapCandidate,
} from "@/lib/code-quality-gate";
import type { CatalogEntity, CatalogFaq } from "./entity-catalog";
import { CODE_SITEMAP_PARTITIONS, type SitemapEntry } from "./sitemap";

type CatalogEntityRow = {
  slug: string | null;
  title: string | null;
  sample_review: string | null;
  target_market: string | null;
  target_language: string | null;
  aggregate_rating: string | number | null;
};

const CODE_SELECT = "slug, title, sample_review, target_market, target_language, aggregate_rating";

function localizedFaqs(
  name: string,
  market: string,
  language: string,
  review: string | null,
): CatalogFaq[] {
  const reviewHint = review || "the verified user review on this page";
  if (language.toLowerCase().startsWith("es")) {
    return [
      {
        question: `Como activo ${name} en ${market}?`,
        answer: `Consulta las instrucciones de activacion de tu plataforma y verifica que tu cuenta pertenezca a ${market}.`,
      },
      {
        question: `Es fiable este codigo de ${name}?`,
        answer: `Esta pagina combina los datos regionales de ${market} con ${reviewHint} para que puedas revisar la informacion antes de activar.`,
      },
    ];
  }
  if (language.toLowerCase().startsWith("fr")) {
    return [
      {
        question: `Comment activer ${name} pour ${market} ?`,
        answer: `Suivez les instructions de votre plateforme et verifiez que votre compte est eligible pour ${market}.`,
      },
      {
        question: `Les informations sur ${name} sont-elles verifiees ?`,
        answer: `Cette page combine les donnees regionales de ${market} avec ${reviewHint} afin de faciliter votre verification avant l activation.`,
      },
    ];
  }
  return [
    {
      question: `How do I activate ${name} in ${market}?`,
      answer: `Follow your platform's redemption instructions and confirm that your account is eligible for ${market}. The activation language for this listing is ${language}.`,
    },
    {
      question: `Is this ${name} listing verified?`,
      answer: `Review the regional details for ${market}, the ${language} activation guidance, and ${reviewHint} before redeeming.`,
    },
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
    review
      ? `User review: ${review}`
      : "User review: No review has been published yet; verify the listing details before activation.",
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

export async function loadEntityFromDb(
  kind: CatalogEntity["entity_type"],
  slug: string,
): Promise<CatalogEntity | null> {
  if (kind === "code") {
    try {
      const { supabaseServer } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseServer
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

export async function loadEntitiesFromDb(
  kind: CatalogEntity["entity_type"],
): Promise<CatalogEntity[]> {
  if (kind === "code") {
    try {
      const { supabaseServer } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseServer
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
        const next = await supabaseServer
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

export async function loadEntityPageFromDb(
  kind: CatalogEntity["entity_type"],
  page: number,
  pageSize = 36,
): Promise<{ entities: CatalogEntity[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize) || 36));

  if (kind !== "code") return { entities: [], total: 0, page: safePage, pageSize: safePageSize };

  try {
    const { supabaseServer } = await import("@/integrations/supabase/client.server");
    const from = (safePage - 1) * safePageSize;
    const { data, count, error } = await supabaseServer
      .from("game_nexus_matrix")
      .select(CODE_SELECT, { count: "exact" })
      .order("slug", { ascending: true })
      .range(from, from + safePageSize - 1);

    if (error || !data)
      return { entities: [], total: count || 0, page: safePage, pageSize: safePageSize };
    return {
      entities: (data as CatalogEntityRow[])
        .map(toCatalogEntity)
        .filter((entity): entity is CatalogEntity => entity !== null),
      total: count || 0,
      page: safePage,
      pageSize: safePageSize,
    };
  } catch {
    return { entities: [], total: 0, page: safePage, pageSize: safePageSize };
  }
}

/**
 * URLs per codes sitemap. Two partitions cover 50,000 rows, which is also the
 * per-file limit in the sitemaps.org spec, so a partition can never outgrow
 * what a crawler will accept.
 */
/**
 * A hard ceiling on how many code URLs may be advertised at all.
 *
 * The quality gate removes rows that carry nothing. This is the separate,
 * structural guarantee: however many rows pass that gate — and that number
 * lives in the database, not in this repository — the codes tier can never
 * again dominate the sitemap.
 *
 * It has to be structural because the failure was structural. 25,000 code URLs
 * against 658 catalog URLs is not a content problem that a filter fixes by
 * degrees; it is the site telling Google that its templated tier IS the site.
 * Google answered by indexing 137 pages out of 25,757 and crawling less of
 * everything.
 *
 * 5,000 is chosen against the catalog, not in the abstract: public.entities
 * holds 7,263 active rows today and grows nightly, so this keeps the
 * substantive pages the clear majority of what is submitted while still
 * advertising the best code pages. Rows are ordered by review count, so the
 * cap keeps the strongest ones rather than an arbitrary alphabetical slice.
 */
export const CODE_SITEMAP_MAX_URLS = 5000;

export const CODE_PARTITION_SIZE = 2500;

/**
 * Slugs for one codes partition.
 *
 * This used to call loadEntitiesFromDb("code"), which fetches the *whole*
 * table regardless of the partition asked for and turns every row into a full
 * CatalogEntity — generating FAQs and a description that embeds all of that
 * FAQ text — before throwing everything away except the slug. Measured over
 * 50,000 rows that is ~78MB of heap against a Cloudflare Worker's 128MB
 * ceiling, on top of ~50 buffered REST responses and the XML string itself.
 * sitemap-codes-1.xml (the larger partition) died there and served Google an
 * error, which is why it reported 0 discovered pages while codes-2, holding
 * only the 10,000-row remainder, kept succeeding.
 *
 * So: select one column, fetch only this partition's range, and build no
 * entities. The same 50,000 rows come to ~1.3MB of slugs.
 */
/**
 * How many codes sitemap partitions actually contain rows.
 *
 * A HEAD request with an exact count, so it costs one round trip and no rows.
 * The index uses this to avoid advertising an empty partition, which Google
 * reports as an erroring sitemap with 0 discovered URLs.
 */
/**
 * The PostgREST filter that narrows 50,000 code rows to the ones that could
 * plausibly pass the sitemap quality gate.
 *
 * It is deliberately looser than the gate itself: PostgREST cannot measure
 * string length, so rows with ANY sample review come back and
 * codeSitemapExclusions makes the real decision in JS. Filtering here anyway
 * matters because the alternative is pulling fifty thousand rows on every
 * sitemap fetch to discard most of them.
 */
const ADVERTISABLE_CODES = "sample_review.not.is.null,reviews_count.gte." + MIN_REVIEWS;

export async function countCodePartitions(): Promise<number> {
  const { supabaseServer } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseServer
    .from("game_nexus_matrix")
    .select("slug", { count: "exact", head: true })
    .or(ADVERTISABLE_CODES);
  if (error) throw new Error(`codes row count: ${error.message}`);
  // Counting the SAME filtered set the listing pages through, so the index
  // never advertises a partition the listing will render empty.
  const rows = Math.min(count ?? 0, CODE_SITEMAP_MAX_URLS);
  return Math.min(Math.ceil(rows / CODE_PARTITION_SIZE), CODE_SITEMAP_PARTITIONS);
}

export async function loadCodeSitemapEntries(partition: 1 | 2): Promise<SitemapEntry[]> {
  const { supabaseServer } = await import("@/integrations/supabase/client.server");

  const first = (partition - 1) * CODE_PARTITION_SIZE;
  // Never past the ceiling, whatever the table holds.
  const last = Math.min(first + CODE_PARTITION_SIZE - 1, CODE_SITEMAP_MAX_URLS - 1);
  const PAGE = 1000; // PostgREST caps a single response at 1000 rows

  const entries: SitemapEntry[] = [];
  let dropped = 0;
  if (first >= CODE_SITEMAP_MAX_URLS) return entries;
  for (let from = first; from <= last; from += PAGE) {
    const to = Math.min(from + PAGE - 1, last);
    // Ordered explicitly: range() over an unordered query has no stable row
    // order, so the two partitions could otherwise overlap or skip rows.
    const { data, error } = await supabaseServer
      .from("game_nexus_matrix")
      .select("slug, title, sample_review, reviews_count, aggregate_rating")
      .or(ADVERTISABLE_CODES)
      // Strongest first, so the ceiling above keeps the best code pages rather
      // than an alphabetical slice. slug breaks ties, which keeps the ordering
      // stable — range() over an unordered query can repeat or skip rows
      // between partitions.
      .order("reviews_count", { ascending: false, nullsFirst: false })
      .order("slug", { ascending: true })
      .range(from, to);

    // Deliberately not swallowed. Returning [] here produces a valid but empty
    // sitemap with a 200, and Google records "0 discovered pages" and drops
    // the URLs it had. Throwing surfaces a 5xx, which it retries instead.
    if (error) {
      throw new Error(
        `codes sitemap partition ${partition} (rows ${from}-${to}): ${error.message}`,
      );
    }
    if (!data || data.length === 0) break;

    for (const row of data as CodeSitemapCandidate[]) {
      const slug = row.slug?.trim();
      if (!slug) continue;
      // The gate decides, not the query: PostgREST cannot measure the review
      // length, so this is where a stub review is actually rejected.
      if (codeSitemapExclusions(row).length > 0) {
        dropped += 1;
        continue;
      }
      entries.push({ path: `/en/codes/${slug}`, changefreq: "weekly", priority: "0.7" });
    }
    if (data.length < PAGE) break;
  }

  if (dropped) {
    console.log(
      `codes sitemap partition ${partition}: ${entries.length} advertised, ${dropped} held back ` +
        `as carrying nothing beyond the listing.`,
    );
  }
  return entries;
}
