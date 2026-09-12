import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { listGames, gameSlug } from "@/lib/catalog/freetogame";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const PATH = "/catalog/games";

export const Route = createFileRoute("/catalog/games/")({
  loader: async () => {
    const result = await listGames();
    if (!result.ok) {
      // A missing or malformed catalog is a 404; a rate limit or outage is
      // transient and must surface as an error, not a 404 Google will cache.
      if (result.reason === "not_found" || result.reason === "invalid_shape") throw notFound();
      throw new Error(`Game catalog unavailable (${result.reason})`);
    }
    return { games: result.data };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => {
    const count = loaderData?.games.length ?? 0;
    const title = "Free-to-Play Game Catalog | GameCastle";
    const description = count
      ? `Browse ${count.toLocaleString()} free-to-play games with platforms, genres, developers and release dates.`
      : "Browse free-to-play games with platforms, genres, developers and release dates.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(PATH) },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(PATH) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Game Catalog" }]),
          ),
        },
      ],
    };
  },
  component: GameCatalog,
});

function GameCatalog() {
  const { games } = Route.useLoaderData();
  const genres = [...new Set(games.map((g) => g.genre))].sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span> Game Catalog
      </nav>
      <h1 className="font-display text-4xl font-bold">Free-to-Play Game Catalog</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        {games.length.toLocaleString()} free-to-play titles with platforms, developers and release
        dates. Data from the{" "}
        <a href="https://www.freetogame.com" rel="noopener noreferrer nofollow" target="_blank" className="underline">
          FreeToGame
        </a>{" "}
        public API.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {genres.slice(0, 18).map((genre) => (
          <span key={genre} className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            {genre}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.id}
            to="/catalog/games/$slug"
            params={{ slug: gameSlug(game) }}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover"
          >
            <img
              src={game.thumbnail}
              alt={game.title}
              loading="lazy"
              width={640}
              height={360}
              className="aspect-video w-full object-cover"
            />
            <div className="p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{game.genre}</div>
              <h2 className="mt-1 font-semibold leading-snug group-hover:text-primary">{game.title}</h2>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{game.short_description}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">{game.platform}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
