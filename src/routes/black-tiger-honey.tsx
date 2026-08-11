import { createFileRoute, redirect } from "@tanstack/react-router";

/** The former commercial page has been permanently removed from GameCastle Anime. */
export const Route = createFileRoute("/black-tiger-honey")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
