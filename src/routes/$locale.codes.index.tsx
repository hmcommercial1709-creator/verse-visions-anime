import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Permanent redirect to /codes, the canonical listing.
 *
 * This route only ever served the "en" locale — it threw notFound for anything
 * else — so the /$locale prefix bought nothing while splitting the listing
 * away from the /codes/<slug> pages it links to. Redirecting rather than
 * deleting keeps any existing link or bookmark working and tells Google which
 * URL supersedes this one.
 */
export const Route = createFileRoute("/$locale/codes/")({
  beforeLoad: ({ search }) => {
    const page = (search as { page?: number }).page;
    throw redirect({
      to: "/codes",
      search: page && page > 1 ? { page } : {},
      statusCode: 301,
    });
  },
});
