import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Permanent redirect to /anime, which now serves this catalog.
 *
 * The same paginated list at two URLs is duplicate content, and /anime is the
 * better address: it is what the header and the homepage point at, and it is
 * where the in-depth guides live alongside the catalog. The detail pages at
 * /catalog/anime/<slug> are unaffected — only this index moves.
 */
const MAX_PAGE = 40;

export const Route = createFileRoute("/catalog/anime/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Math.min(MAX_PAGE, Math.max(1, Number(search?.page) || 1));
    return page > 1 ? { page } : {};
  },
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/anime",
      search: search.page && search.page > 1 ? { page: search.page } : {},
      statusCode: 301,
    });
  },
});
