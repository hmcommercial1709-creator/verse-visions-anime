import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  getGame,
  listGames,
  idFromSlug,
  gameSlug,
  type FreeToGameDetail,
} from "@/lib/catalog/freetogame";
import {
  loadCatalogItemFromDb,
  upstreamIdFromSourceUrl,
  type DbCatalogItem,
} from "@/lib/catalog/db-catalog";
import { parseMeta, generatedFaq, type CatalogMeta } from "@/lib/catalog/catalog-facts";
import { CatalogSections } from "@/components/catalog-sections";
import { CatalogRewards } from "@/components/catalog-rewards";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";

/**
 * Renders a stored row in the shape the page already expects.
 *
 * Rows now arrive from two sources with different shapes: FreeToGame stored a
 * genre and a platform as its two categories, while Steam stores its genres
 * as categories and everything else — developer, publisher, platforms, price,
 * Metacritic — under metadata. Reading both here keeps the component below
 * unchanged.
 */
function fromDbRow(row: DbCatalogItem, meta: CatalogMeta | null): FreeToGameDetail {
  const platforms: Record<string, string> = {
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
  };
  return {
    id: meta?.steamAppId ?? 0,
    title: row.name,
    thumbnail: row.image_url ?? "",
    short_description: row.description ?? "",
    game_url: row.source_url ?? "",
    genre: row.categories?.[0] ?? "",
    platform:
      meta?.platforms?.map((os) => platforms[os] ?? os).join(", ") || row.categories?.[1] || "",
    publisher: meta?.publishers?.[0] ?? "",
    developer: meta?.developers?.[0] ?? "",
    release_date: meta?.releaseDate ?? "",
    freetogame_profile_url: row.source_url ?? "",
  } as FreeToGameDetail;
}

export const Route = createFileRoute("/catalog/games/$slug")({
  loader: async ({ params }) => {
    // The database is consulted first for a stored row, for the same reason as
    // the anime route: a slug beginning with a number would otherwise parse to
    // a false upstream id and could render a different game.
    const row = await loadCatalogItemFromDb("game", params.slug);
    const id = row ? upstreamIdFromSourceUrl(row.source_url) : idFromSlug(params.slug);

    if (id !== null) {
      const game = await getGame(id);
      if (game.ok) {
        // Related titles come from the same cached list request the index
        // uses, so this costs no extra upstream call in practice.
        const all = await listGames();
        const related = all.ok
          ? all.data.filter((g) => g.id !== id && g.genre === game.data.genre).slice(0, 6)
          : [];
        return { game: game.data, related, meta: null as CatalogMeta | null };
      }
      // Fall through to the database rather than failing.
    }

    // A row we hold beats a 404 Google caches or a 500 on a transient upstream
    // error.
    if (!row) throw notFound();
    const meta = parseMeta(row.metadata);
    return { game: fromDbRow(row, meta), related: [], meta };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const g = loaderData.game;
    const faq = generatedFaq(loaderData.meta, g.title, "game");
    const url = absoluteUrl(`/catalog/games/${params.slug}`);
    const description =
      g.short_description?.slice(0, 300) ??
      `${g.title} — free-to-play ${g.genre} game on ${g.platform}.`;

    return {
      meta: [
        { title: `${g.title} — Free-to-Play ${g.genre} | GameCastle` },
        { name: "description", content: description },
        { property: "og:title", content: g.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:image", content: g.thumbnail },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: g.title,
            url,
            description,
            image: g.thumbnail,
            genre: g.genre,
            gamePlatform: g.platform,
            publisher: { "@type": "Organization", name: g.publisher },
            author: { "@type": "Organization", name: g.developer },
            ...(g.release_date && /^\d{4}-\d{2}-\d{2}$/.test(g.release_date)
              ? { datePublished: g.release_date }
              : {}),
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { path: "/", name: "Home" },
              { path: "/catalog/games", name: "Game Catalog" },
              { name: g.title },
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
  component: GameDetail,
});

function GameDetail() {
  const { game, related, meta } = Route.useLoaderData();
  const req = game.minimum_system_requirements;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        <span className="mx-1">/</span>
        <Link to="/catalog/games" className="hover:text-foreground">
          Game Catalog
        </Link>{" "}
        <span className="mx-1">/</span> {game.title}
      </nav>

      <div className="grid gap-8 md:grid-cols-[320px_1fr]">
        <img
          src={game.thumbnail}
          alt={game.title}
          width={640}
          height={360}
          className="w-full rounded-2xl border border-border/60 object-cover"
        />
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{game.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">
              {game.genre}
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground">
              {game.platform}
            </span>
            {game.release_date && (
              <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground">
                Released {game.release_date}
              </span>
            )}
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {game.description || game.short_description}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Developer</dt>
              <dd className="font-medium">{game.developer}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Publisher</dt>
              <dd className="font-medium">{game.publisher}</dd>
            </div>
          </dl>
          <a
            href={game.game_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Play free →
          </a>
        </div>
      </div>

      {req && (req.os || req.processor || req.memory || req.graphics) && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Minimum system requirements</h2>
          <dl className="mt-3 grid gap-2 rounded-2xl border border-border/60 bg-card/40 p-4 text-sm sm:grid-cols-2">
            {(
              [
                ["OS", req.os],
                ["Processor", req.processor],
                ["Memory", req.memory],
                ["Graphics", req.graphics],
                ["Storage", req.storage],
              ] as const
            )
              .filter(([, value]) => !!value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">More {game.genre} games</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/catalog/games/$slug"
                params={{ slug: gameSlug(r) }}
                className="rounded-xl border border-border/60 bg-card/40 p-3 text-sm font-medium card-hover"
              >
                {r.title}
                <span className="mt-0.5 block text-xs text-muted-foreground">{r.platform}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CatalogSections meta={meta} name={game.title} kind="game" />

      <CatalogRewards />

      <p className="mt-10 text-xs text-muted-foreground">
        Game data from{" "}
        <a
          href={game.freetogame_profile_url}
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="underline"
        >
          {meta?.steamAppId ? "Steam" : "the FreeToGame public API"}
        </a>
        {meta?.steamAppId ? "." : "."} Placement, cohort and similarity figures on this page are
        computed across the GameCastle catalog.
      </p>
    </div>
  );
}
