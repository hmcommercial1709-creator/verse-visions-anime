import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Permanent redirect to /catalog/games.
 *
 * This page read game_nexus_matrix and presented it as "games". That table
 * holds redemption codes — slug, title, target market, target language,
 * sample review — so /games was a second, worse rendering of /codes, and
 * every entry on it linked to a code page. Meanwhile the actual games
 * catalog, ~400 free-to-play titles from FreeToGame, already had a working
 * page at /catalog/games that nothing in the main flow pointed at.
 *
 * So this is not a page being removed; it is a page that was showing the
 * wrong data being pointed at the right data. /catalog/games is canonical —
 * it is what the header links to and what the sitemap has listed — so this
 * redirects rather than duplicating it.
 */
export const Route = createFileRoute("/games")({
  beforeLoad: () => {
    throw redirect({ to: "/catalog/games", statusCode: 301 });
  },
});
