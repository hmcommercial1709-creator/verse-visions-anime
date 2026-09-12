import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getGame, listGames, idFromSlug, gameSlug } from "@/lib/catalog/freetogame";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/catalog/games/$slug")({
  loader: async ({ params }) => {
    const id = idFromSlug(params.slug);
    if (id === null) throw notFound();

    const game = await getGame(id);
    if (!game.ok) {
      if (game.reason === "not_found" || game.reason === "invalid_shape") throw notFound();
      throw new Error(`Game unavailable (${game.reason})`);
    }

    // Related titles come from the same cached list request the index uses,
    // so this costs no extra upstream call in practice.
    const all = await listGames();
    const related = all.ok
      ? all.data.filter((g) => g.id !== id && g.genre === game.data.genre).slice(0, 6)
      : [];

    return { game: game.data, related };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const g = loaderData.game;
    const url = absoluteUrl(`/catalog/games/${params.slug}`);
    const description =
      g.short_description?.slice(0, 300) ?? `${g.title} — free-to-play ${g.genre} game on ${g.platform}.`;

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
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
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
      ],
    };
  },
  component: GameDetail,
});

function GameDetail() {
  const { game, related } = Route.useLoaderData();
  const req = game.minimum_system_requirements;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span>
        <Link to="/catalog/games" className="hover:text-foreground">Game Catalog</Link>{" "}
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
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">{game.genre}</span>
            <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground">{game.platform}</span>
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
            {([["OS", req.os], ["Processor", req.processor], ["Memory", req.memory], ["Graphics", req.graphics], ["Storage", req.storage]] as const)
              .filter(([, value]) => !!value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
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

      <p className="mt-10 text-xs text-muted-foreground">
        Game data from the{" "}
        <a href={game.freetogame_profile_url} rel="noopener noreferrer nofollow" target="_blank" className="underline">
          FreeToGame
        </a>{" "}
        public API.
      </p>
    </div>
  );
}
