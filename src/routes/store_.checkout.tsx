import { createFileRoute, redirect } from "@tanstack/react-router";

/** The former commercial page has been permanently removed from GameCastle Anime. */
export const Route = createFileRoute("/store_/checkout")({
  beforeLoad: () => {
    throw redirect({ to: "/wallpapers", statusCode: 301 });
  },
});
