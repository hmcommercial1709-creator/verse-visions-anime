import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { assessAnime, synopsisHash, publicationLinks } from "./quality.mjs";
import publishedLinks from "./published-links.json" with { type: "json" };

const ANILIST_URL = "https://graphql.anilist.co";
const PER_PAGE = 10;

const ANIME_QUERY = `
query ($page: Int!, $perPage: Int!) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      lastPage
      total
    }

    media(
      type: ANIME
      isAdult: false
      sort: POPULARITY_DESC
    ) {
      id
      isAdult
      characters(perPage: 12, sort: ROLE) { edges { role node { id name { full } } } }
      relations { edges { relationType node { id type isAdult seasonYear title { english romaji native } } } }
      externalLinks { site url type language }
      format
      status
      season
      seasonYear
      episodes
      duration
      averageScore
      popularity
      favourites

      title {
        romaji
        english
        native
      }

      description
      genres
      synonyms

      coverImage {
        extraLarge
        large
      }

      studios {
        nodes {
          id
          name
          isAnimationStudio
        }
      }
    }
  }
}
`;

type Anime = {
  id: number;
  isAdult: boolean;
  characters?: { edges: { role: string; node: { id: number; name: { full: string } } }[] };
  relations?: { edges: { relationType: string; node: { id: number; type: string; isAdult: boolean; seasonYear: number | null; title: Anime["title"] } }[] };
  externalLinks?: { site: string; url: string; type: string; language: string | null }[];
  format: string | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  averageScore: number | null;
  popularity: number | null;
  favourites: number | null;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  description: string | null;
  genres: string[];
  synonyms: string[];
  coverImage?: {
    extraLarge?: string | null;
    large?: string | null;
  };
  studios: {
    nodes: {
      id: number;
      name: string;
      isAnimationStudio: boolean;
    }[];
  };
};

function cleanText(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

function titleOf(anime: Anime): string {
  return (
    cleanText(anime.title.english) ||
    cleanText(anime.title.romaji) ||
    cleanText(anime.title.native) ||
    `Anime ${anime.id}`
  );
}

function descriptionOf(anime: Anime): string {
  const original = cleanText(anime.description);

  if (original.length >= 100) {
    return original.slice(0, 1800);
  }

  return ""; // Missing source text is never replaced with SEO filler.
}

async function getSourceId(
  supabase: ReturnType<typeof createClient>,
): Promise<string> {
  const result = await supabase
    .from("data_sources")
    .select("id")
    .eq("name", "AniList")
    .limit(1)
    .maybeSingle();

  if (result.error) throw result.error;

  if (!result.data?.id) {
    throw new Error(
      "AniList is missing from data_sources.",
    );
  }

  return result.data.id;
}

async function getPage(
  supabase: ReturnType<typeof createClient>,
): Promise<number> {
  const result = await supabase
    .from("automation_state")
    .select("value")
    .eq("key", "anilist_quality_page_v2")
    .maybeSingle();

  if (result.error) throw result.error;

  const page = Number(result.data?.value ?? "1");

  return Number.isFinite(page) && page > 0
    ? Math.floor(page)
    : 1;
}

async function setPage(
  supabase: ReturnType<typeof createClient>,
  page: number,
) {
  const result = await supabase
    .from("automation_state")
    .upsert(
      {
        key: "anilist_quality_page_v2",
        value: String(page),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "key",
      },
    );

  if (result.error) throw result.error;
}

async function saveSourceRecord(
  supabase: ReturnType<typeof createClient>,
  sourceId: string,
  anime: Anime,
) {
  const result = await supabase
    .from("source_records")
    .upsert(
      {
        source_id: sourceId,
        external_id: String(anime.id),
        entity_type: "anime",
        raw_data: anime,
        content_hash: null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "source_id,external_id",
      },
    );

  if (result.error) throw result.error;
}

async function getOrCreateEntity(
  supabase: ReturnType<typeof createClient>,
  anime: Anime,
): Promise<string> {
  const title = titleOf(anime);
  const description = descriptionOf(anime);
  const slugBase = slugify(title);
  const slug =
    slugBase.length > 0
      ? slugBase
      : `anime-${anime.id}`;

  const existing = await supabase
    .from("entities")
    .select("id, status, slug")
    .eq("entity_type", "anime")
    .eq("source_name", "AniList")
    .filter(
      "source_data->>external_id",
      "eq",
      String(anime.id),
    )
    .limit(1)
    .maybeSingle();

  if (existing.error) throw existing.error;

  const metadata = {
    anilist_id: anime.id,
    format: anime.format,
    status: anime.status,
    season: anime.season,
    season_year: anime.seasonYear,
    episodes: anime.episodes,
    duration: anime.duration,
    average_score: anime.averageScore,
    popularity: anime.popularity,
    favourites: anime.favourites,
    genres: anime.genres,
    synonyms: anime.synonyms,
    studios: anime.studios.nodes,
  };

  const sourceData = {
    external_id: String(anime.id),
    anilist_id: anime.id,
  };

  const payload = {
    entity_type: "anime",
    slug: existing.data?.slug ?? `${slug}-${anime.id}`,
    name: title,
    description,
    image_url:
      anime.coverImage?.extraLarge ??
      anime.coverImage?.large ??
      null,
    metadata,
    source_data: sourceData,
    source_name: "AniList",
    source_url: `https://anilist.co/anime/${anime.id}`,
    source_license: "AniList",
    status: existing.data?.status ?? "draft",
    updated_at: new Date().toISOString(),
  };

  if (existing.data?.id) {
    const update = await supabase
      .from("entities")
      .update(payload)
      .eq("id", existing.data.id)
      .select("id")
      .single();

    if (update.error) throw update.error;

    return update.data.id;
  }

  const insert = await supabase
    .from("entities")
    .insert(payload)
    .select("id")
    .single();

  if (insert.error) throw insert.error;

  return insert.data.id;
}

async function processAnime(
  supabase: ReturnType<typeof createClient>,
  sourceId: string,
  anime: Anime,
) {
  await saveSourceRecord(supabase, sourceId, anime);
  const entityId = await getOrCreateEntity(supabase, anime);
  const assessment = assessAnime(anime);
  const related = publicationLinks(anime, publishedLinks);
  const hash = await synopsisHash(anime.description);
  const existing = await supabase.from("anime_content_drafts").select("id,status")
    .eq("entity_id", entityId).eq("locale", "en").maybeSingle();
  if (existing.error) throw existing.error;
  // Never overwrite a human-reviewed version.
  if (existing.data && ["approved", "rejected"].includes(existing.data.status)) return "preserved";
  const duplicates = await supabase.from("anime_content_drafts").select("id")
    .eq("synopsis_hash", hash).neq("entity_id", entityId).limit(1);
  if (duplicates.error) throw duplicates.error;
  const duplicate = cleanText(anime.description).length > 0 && (duplicates.data?.length ?? 0) > 0;
  const status = duplicate ? "duplicate" : assessment.readyForReview ? "ready_for_review" : "needs_data";
  const entity = await supabase.from("entities").select("slug").eq("id", entityId).single();
  if (entity.error) throw entity.error;
  const result = await supabase.from("anime_content_drafts").upsert({
    entity_id: entityId, source_id: anime.id, locale: "en", title: titleOf(anime),
    canonical_path: related.canonical ?? `/en/anime/${encodeURIComponent(entity.data.slug)}`,
    content: { ...assessment.content, internal_links: related.links, source_checked_at: new Date().toISOString() }, synopsis_hash: hash, status,
    completeness: { passed: assessment.readyForReview && !duplicate, facts: assessment.factCount,
      issues: [...assessment.reasons, ...(duplicate ? ["duplicate_synopsis"] : [])],
      editorial_approved: false },
    updated_at: new Date().toISOString(),
  }, { onConflict: "entity_id,locale" });
  if (result.error) throw result.error;
  return status;
}

Deno.serve(async () => {
  try {
    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY",
      );

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json(
        {
          ok: false,
          error:
            "Supabase environment variables are missing.",
        },
        { status: 500 },
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const sourceId =
      await getSourceId(supabase);

    const page =
      await getPage(supabase);

    const response = await fetch(
      ANILIST_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          query: ANIME_QUERY,
          variables: {
            page,
            perPage: PER_PAGE,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `AniList HTTP ${response.status}`,
      );
    }

    const result = await response.json();

    if (result.errors?.length) {
      throw new Error(
        JSON.stringify(result.errors),
      );
    }

    const pageData =
      result.data?.Page;

    const media: Anime[] =
      pageData?.media ?? [];

    let processed = 0;
    const outcomes: Record<string, number> = {};

    for (const anime of media) {
      const outcome = await processAnime(
        supabase,
        sourceId,
        anime,
      );

      outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
      processed++;
    }

    const hasNext =
      pageData?.pageInfo?.hasNextPage === true;

    const nextPage =
      hasNext ? page + 1 : 1;

    await setPage(
      supabase,
      nextPage,
    );

    await supabase
      .from("data_sources")
      .update({
        last_import_at:
          new Date().toISOString(),
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", sourceId);

    return Response.json({
      ok: true,
      source: "AniList",
      page,
      nextPage,
      processed,
      generatedPages: 0,
      draftOutcomes: outcomes,
      generatorVersion: 2,
      hasNext,
      message: hasNext
        ? `Page ${page} complete. Next run continues from page ${nextPage}.`
        : "AniList reached the end and will restart from page 1.",
    });
  } catch (error) {
    console.error(
      "import-anime error:",
      error,
    );

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      },
      { status: 500 },
    );
  }
});
