import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout for /anime and everything under it.
 *
 * Deliberately carries no head and no validateSearch. It used to hold the
 * archive listing, and because /anime/$slug and /anime/$slug/$section nest
 * beneath it, both leaked downward: every child page rendered a second
 * <link rel="canonical"> pointing at /anime alongside its own, and Google
 * ignores canonicals when a page declares conflicting ones, so 148 pages had
 * no usable canonical and were liable to be folded into /anime as duplicates.
 * The archive now lives in anime.index.tsx, which only renders at /anime.
 */
export const Route = createFileRoute("/anime")({
  component: () => <Outlet />,
});
