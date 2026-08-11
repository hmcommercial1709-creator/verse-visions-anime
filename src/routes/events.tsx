import { createFileRoute, redirect } from "@tanstack/react-router";

/** The former commercial page has been permanently removed from GameCastle Anime. */
export const Route = createFileRoute("/events")({
  beforeLoad: () => {
    throw redirect({ to: "/news", statusCode: 301 });
  },
});
