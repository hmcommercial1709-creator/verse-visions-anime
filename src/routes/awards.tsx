import { createFileRoute, redirect } from "@tanstack/react-router";

/** The former commercial page has been permanently removed from GameCastle Anime. */
export const Route = createFileRoute("/awards")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", statusCode: 301 });
  },
});
