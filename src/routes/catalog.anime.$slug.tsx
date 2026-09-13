import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAnime, malIdFromSlug, displayTitle, type JikanAnime } from "@/lib/catalog/jikan";
import {
  loadCatalogItemFromDb,
  upstreamIdFromSourceUrl,
  type DbCatalogItem,
} from "@/lib/catalog/db-catalog";
import {
  parseMeta,
  positioningStatements,
  groupedTags,
  orderedFranchise,
  sortedCharacters,
  generatedFaq,
  relationLabel,
  type CatalogMeta,
} from "@/lib/catalog/catalog-facts";
import { CatalogRewards } from "@/components/catalog-rewards";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { publishedAnime } from "@/lib/content-registry";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Finds one of our own 25 hand-written guides for this series, if we have
 * one. Syndicated catalog data is thin on its own; linking it to original
 * editorial is what makes the page worth landing on.
 */
function ownGuideFor(titles: string[]) {
  const keys = titles.filter(Boolean).map(normalize);
  return publishedAnime().find((a) => {
    const candidates = [normalize(a.title), normalize(a.slug)];
    return keys.some((k) => candidates.includes(k));
  });
}

/**
 * Renders a stored row in the shape the page already expects.
 *
 * public.entities predates the ingest script and holds slugs that carry no
 * MAL id — "a-wild-last-boss-appeared" rather than "52505-a-wild-last-boss".
 * This route used to 404 the moment a slug had no leading number, so every
 * such row in the listing led to a dead page. Adapting the row here keeps the
 * component untouched; the fields the database does not carry (score, episode
 * count, genres) simply do not render.
 */
function fromDbRow(row: DbCatalogItem, meta: CatalogMeta | null): JikanAnime {
  return {
    mal_id: meta?.malId ?? 0,
    url: row.source_url ?? "https://anilist.co/",
    title: row.name,
    title_japanese: meta?.titles?.native ?? undefined,
    synopsis: row.description ?? null,
    images: {
      jpg: { image_url: row.image_url ?? null, large_image_url: row.image_url ?? null },
    },
    // The stored categories are the source's genres, so they render in the
    // same place. Discarding them was what left these pages with a title, an
    // image and nothing else.
    genres: (row.categories ?? []).map((name, i) => ({ mal_id: i + 1, name })),
    themes: [],
    studios: (meta?.studios ?? []).map((s) => ({ mal_id: s.id, name: s.name })),
    // AniList scores out of 100; the badge and the schema below both expect
    // the 10-point scale the rest of the catalog uses.
    score:
      typeof meta?.averageScore === "number"
        ? Number((meta.averageScore / 10).toFixed(2))
        : undefined,
    episodes: meta?.episodes ?? undefined,
    status: meta?.status ? meta.status.replace(/_/g, " ").toLowerCase() : undefined,
    type: meta?.format ?? undefined,
    year: meta?.seasonYear ?? meta?.startYear ?? undefined,
  };
}

export const Route = createFileRoute("/catalog/anime/$slug")({
  loader: async ({ params }) => {
    const result = (anime: JikanAnime, fromApi: boolean, meta: CatalogMeta | null = null) => {
      const guide = ownGuideFor([anime.title, anime.title_english ?? ""]);
      return {
        anime,
        fromApi,
        // The stored extras and the cross-catalog block computed at ingest
        // time. Present for AniList-ingested rows; null for everything else,
        // and every section below is written to render nothing without it.
        meta,
        guideSlug: guide?.slug ?? null,
        guideTitle: guide?.title ?? null,
      };
    };

    // The database is consulted first for a stored row, because it is
    // authoritative about what this URL is. Deriving the id from the slug
    // first was wrong: "100-meters" parses to 100, a real and unrelated MAL
    // entry, so a title beginning with a number could have rendered the wrong
    // anime entirely.
    const row = await loadCatalogItemFromDb("anime", params.slug);

    if (row) {
      const meta = parseMeta(row.metadata);
      // Enrich from Jikan using the id the row was ingested from, which is
      // exact. The API carries score, episode count, studios and the
      // Japanese title that the table does not.
      const upstreamId = upstreamIdFromSourceUrl(row.source_url);
      if (upstreamId !== null) {
        const live = await getAnime(upstreamId);
        if (live.ok) return result(live.data, true, meta);
      }
      return result(fromDbRow(row, meta), false, meta);
    }

    // Not stored: a slug we only know how to resolve through the API.
    const malId = malIdFromSlug(params.slug);
    if (malId === null) throw notFound();
    const live = await getAnime(malId);
    if (!live.ok) {
      if (live.reason === "not_found" || live.reason === "invalid_shape") throw notFound();
      throw new Error(`Anime unavailable (${live.reason})`);
    }
    return result(live.data, true);
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const a = loaderData.anime;
    const title = displayTitle(a);
    const faq = generatedFaq(loaderData.meta, title);
    const url = absoluteUrl(`/catalog/anime/${params.slug}`);
    const image =
      a.images.webp?.large_image_url ||
      a.images.jpg.large_image_url ||
      a.images.jpg.image_url ||
      undefined;
    const description =
      a.synopsis?.slice(0, 300) ??
      `${title}${a.year ? ` (${a.year})` : ""} — episodes, studios, genres and where it ranks.`;

    return {
      meta: [
        { title: `${title}${a.year ? ` (${a.year})` : ""} | GameCastle Anime Catalog` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "video.tv_show" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            // schema.org has no "AnimeSeries" type — TVSeries is the correct one.
            "@type": "TVSeries",
            name: title,
            alternateName: a.title_japanese || undefined,
            url,
            description,
            image,
            ...(a.episodes ? { numberOfEpisodes: a.episodes } : {}),
            ...(a.year ? { datePublished: String(a.year) } : {}),
            genre: [...a.genres.map((g) => g.name), ...a.themes.map((t) => t.name)],
            ...(a.studios.length
              ? {
                  productionCompany: a.studios.map((s) => ({
                    "@type": "Organization",
                    name: s.name,
                  })),
                }
              : {}),
            ...(a.score && a.scored_by
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: a.score,
                    ratingCount: a.scored_by,
                    bestRating: 10,
                    worstRating: 1,
                  },
                }
              : {}),
            sameAs: a.url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { path: "/", name: "Home" },
              { path: "/anime", name: "Anime Catalog" },
              { name: title },
            ]),
          ),
        },
        // Only published when the stored data actually answered something, so
        // the markup never carries a question the page does not display.
        ...(faq.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify(
                  faqSchema(faq.map((item) => ({ q: item.question, a: item.answer }))),
                ),
              },
            ]
          : []),
      ],
    };
  },
  component: AnimeDetail,
});

function AnimeDetail() {
  const { anime, fromApi, meta, guideSlug, guideTitle } = Route.useLoaderData();
  const title = displayTitle(anime);
  const image =
    anime.images.webp?.large_image_url ||
    anime.images.jpg.large_image_url ||
    anime.images.jpg.image_url;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        <span className="mx-1">/</span>
        <Link to="/anime" className="hover:text-foreground">
          Anime Catalog
        </Link>{" "}
        <span className="mx-1">/</span> {title}
      </nav>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {image && (
          <img
            src={image}
            alt={title}
            width={425}
            height={600}
            className="w-full rounded-2xl border border-border/60 object-cover"
          />
        )}
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {anime.title_japanese && (
            <p className="mt-1 text-sm text-muted-foreground">{anime.title_japanese}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {anime.type && (
              <span className="rounded-full border border-border/60 px-3 py-1">{anime.type}</span>
            )}
            {anime.episodes && (
              <span className="rounded-full border border-border/60 px-3 py-1">
                {anime.episodes} episodes
              </span>
            )}
            {anime.status && (
              <span className="rounded-full border border-border/60 px-3 py-1">{anime.status}</span>
            )}
            {anime.score && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">
                ⭐ {anime.score}
              </span>
            )}
          </div>

          {anime.synopsis && (
            <p className="mt-5 leading-relaxed text-muted-foreground">{anime.synopsis}</p>
          )}

          {guideSlug && (
            <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/10 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Our full guide
              </div>
              <Link
                to="/anime/$slug"
                params={{ slug: guideSlug }}
                className="mt-1 block font-bold hover:underline"
              >
                Read the GameCastle guide to {guideTitle} →
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                Watch order, arc breakdowns, characters and power systems — written by our editorial
                desk.
              </p>
            </div>
          )}
        </div>
      </div>

      {(anime.genres.length > 0 || anime.studios.length > 0) && (
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          {anime.genres.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold">Genres</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...anime.genres, ...anime.themes].map((g) => (
                  <span
                    key={`${g.mal_id}-${g.name}`}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {anime.studios.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold">Studios</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {anime.studios.map((s) => (
                  <span
                    key={s.mal_id}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <CatalogSections meta={meta} name={title} />

      <CatalogRewards />

      <p className="mt-10 text-xs text-muted-foreground">
        {fromApi ? (
          <>
            Catalog data from the{" "}
            <a
              href={anime.url}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="underline"
            >
              MyAnimeList
            </a>{" "}
            database via the Jikan public API.
          </>
        ) : (
          // Saying "via the Jikan public API" on a page rendered from our own
          // stored copy would simply be untrue, and so would naming
          // MyAnimeList for a row that came from AniList.
          <>
            Catalog entry from the GameCastle catalog
            {anime.url && /anilist\.co/.test(anime.url) ? (
              <>
                , sourced from{" "}
                <a
                  href={anime.url}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="underline"
                >
                  AniList
                </a>
              </>
            ) : (
              <>, sourced from MyAnimeList</>
            )}
            . Placement, cohort and similarity figures on this page are computed across the
            GameCastle catalog.
          </>
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ rich sections */

function SectionBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="my-10 scroll-mt-24">
      <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

/**
 * The sections an imported title earns from its own data.
 *
 * Each one renders only when its inputs exist. A title with no cast has no
 * cast section rather than an empty heading, because an empty section is a
 * thin-content signal and a heading with nothing under it is worse than no
 * heading at all.
 */
function CatalogSections({ meta, name }: { meta: CatalogMeta | null; name: string }) {
  const statements = positioningStatements(meta, name);
  const tagGroups = groupedTags(meta);
  const chain = orderedFranchise(meta?.derived);
  const cast = sortedCharacters(meta);
  const faq = generatedFaq(meta, name);
  const similar = meta?.derived?.similar ?? [];

  return (
    <>
      {statements.length > 0 && (
        <SectionBlock id="placement" title="Where it sits in this catalog">
          {/* Computed across the whole catalog at ingest time, so the numbers
              are specific to this collection and exist on no other site. */}
          <ul className="space-y-2 text-muted-foreground">
            {statements.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SectionBlock>
      )}

      {chain.length > 0 && (
        <SectionBlock id="chronology" title="Franchise chronology">
          <p className="mb-4 text-sm text-muted-foreground">
            Every related entry this catalog holds, in watch order.
          </p>
          <ol className="space-y-2">
            {chain.map((entry) => (
              <li key={entry.slug}>
                <Link
                  to="/catalog/anime/$slug"
                  params={{ slug: entry.slug }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 hover:border-primary/60"
                >
                  <span className="font-semibold">{entry.title}</span>
                  <span className="shrink-0 rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                    {relationLabel(entry.relation)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </SectionBlock>
      )}

      {cast.length > 0 && (
        <SectionBlock id="characters" title="Characters">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cast.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  {c.native && (
                    <div className="truncate text-xs text-muted-foreground">{c.native}</div>
                  )}
                  {c.role && (
                    <div className="text-xs uppercase tracking-wider text-primary">
                      {c.role.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {tagGroups.length > 0 && (
        <SectionBlock id="themes" title="Themes and content profile">
          <p className="mb-4 text-sm text-muted-foreground">
            Percentages are AniList community tag rankings — how strongly voters associate each
            theme with this title.
          </p>
          <div className="space-y-5">
            {tagGroups.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.category}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="rounded-full border border-border/60 px-3 py-1 text-xs"
                    >
                      {tag.name}
                      {tag.rank !== null && (
                        <span className="ml-1.5 text-muted-foreground">{tag.rank}%</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {faq.length > 0 && (
        <SectionBlock id="faq" title="Frequently asked questions">
          {/* Answers are read out of stored values, never generated prose, so
              the FAQ schema below never publishes a guess. */}
          <div className="space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-border/60 bg-card/40 p-4"
              >
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {similar.length > 0 && (
        <SectionBlock id="similar" title="Closest titles by shared themes">
          <p className="mb-4 text-sm text-muted-foreground">
            Ranked by how many tags and genres they share with {name} in this catalog.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <Link
                key={s.slug}
                to="/catalog/anime/$slug"
                params={{ slug: s.slug }}
                className="rounded-xl border border-border/60 bg-card/40 p-3 hover:border-primary/60"
              >
                <div className="line-clamp-2 text-sm font-semibold">{s.name ?? s.slug}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {s.shared} shared {s.shared === 1 ? "theme" : "themes"}
                </div>
              </Link>
            ))}
          </div>
        </SectionBlock>
      )}
    </>
  );
}
