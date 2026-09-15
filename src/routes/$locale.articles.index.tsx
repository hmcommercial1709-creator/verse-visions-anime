import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Permanent redirect to /blog, which is where articles actually live.
 *
 * This route paged through loadEntityPage({ kind: "article" }), which only
 * ever read game_nexus_matrix — the fabricated table — and returned nothing
 * for "article". So it rendered an empty listing under a real-looking title,
 * on every page, forever. A 301 to the real article index is what the URL
 * should always have done.
 */
export const Route = createFileRoute("/$locale/articles/")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", statusCode: 301 });
  },
});
