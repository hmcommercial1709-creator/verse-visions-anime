const ANILIST_URL = "https://graphql.anilist.co";

const ANILIST_QUERY = `
query ($page: Int!, $perPage: Int!) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
    }
    media(type: ANIME, isAdult: false, sort: ID_DESC) {
      id
      type
      format
      status
      season
      seasonYear
      episodes
      duration
      countryOfOrigin
      averageScore
      popularity
      favourites
      trending
      title {
        romaji
        english
        native
      }
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      genres
      synonyms
      tags {
        id
        name
        description
        category
        rank
      }
      studios {
        nodes {
          id
          name
          isAnimationStudio
        }
      }
      relations {
        edges {
          relationType
          node {
            id
            type
            format
            title {
              romaji
              english
              native
            }
          }
        }
      }
      characters(perPage: 25, sort: ROLE) {
        edges {
          role
          node {
            id
            name {
              full
              native
            }
            description
            gender
            age
          }
        }
      }
    }
  }
}
`;

type ImportEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function supabaseRequest(
  env: ImportEnv,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Supabase ${response.status}: ${text.slice(0, 1000)}`,
    );
  }

  return response;
}

async function getAniListSourceId(env: ImportEnv) {
  const response = await supabaseRequest(
    env,
    "data_sources?name=eq.AniList&select=id&limit=1",
  );

  const rows = (await response.json()) as Array<{ id: string }>;

  if (!rows[0]?.id) {
    throw new Error(
      "AniList is not present in data_sources. Add AniList first.",
    );
  }

  return rows[0].id;
}

async function fetchAniListPage(page: number, perPage: number) {
  for (;;) {
    const response = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: {
          page,
          perPage,
        },
      }),
    });

    if (response.status === 429) {
      await sleep(30000);
      continue;
    }

    if (!response.ok) {
      throw new Error(`AniList returned HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.errors?.length) {
      throw new Error(
        `AniList GraphQL error: ${JSON.stringify(json.errors).slice(0, 1000)}`,
      );
    }

    return json.data.Page;
  }
}

async function saveAnime(
  env: ImportEnv,
  sourceId: string,
  anime: any,
) {
  const rawData = {
    source: "AniList",
    imported_at: new Date().toISOString(),
    ...anime,
  };

  const externalId = String(anime.id);
  const contentHash = await sha256(JSON.stringify(rawData));

  const existingResponse = await supabaseRequest(
    env,
    `source_records?source_id=eq.${encodeURIComponent(sourceId)}&external_id=eq.${encodeURIComponent(externalId)}&entity_type=eq.anime&select=id&limit=1`,
  );

  const existing = (await existingResponse.json()) as Array<{
    id: string;
  }>;

  const payload = {
    source_id: sourceId,
    external_id: externalId,
    entity_type: "anime",
    raw_data: rawData,
    content_hash: contentHash,
    updated_at: new Date().toISOString(),
    imported_at: new Date().toISOString(),
  };

  if (existing[0]?.id) {
    await supabaseRequest(
      env,
      `source_records?id=eq.${existing[0].id}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      },
    );
  } else {
    await supabaseRequest(env, "source_records", {
      method: "POST",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
  }
}

export async function importAnimeBatch(
  env: ImportEnv,
  options: {
    startPage?: number;
    maxPages?: number;
    perPage?: number;
  } = {},
) {
  const startPage = options.startPage ?? 1;
  const maxPages = Math.min(options.maxPages ?? 1, 5);
  const perPage = Math.min(options.perPage ?? 25, 25);

  const sourceId = await getAniListSourceId(env);

  let page = startPage;
  let imported = 0;
  let hasNextPage = true;

  while (hasNextPage && page < startPage + maxPages) {
    const result = await fetchAniListPage(page, perPage);

    for (const anime of result.media ?? []) {
      await saveAnime(env, sourceId, anime);
      imported++;
    }

    hasNextPage = Boolean(result.pageInfo?.hasNextPage);
    page++;

    await sleep(2500);
  }

  await supabaseRequest(
    env,
    `data_sources?id=eq.${encodeURIComponent(sourceId)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        last_import_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    },
  );

  return {
    ok: true,
    imported,
    firstPage: startPage,
    lastPage: page - 1,
    hasNextPage,
  };
}
