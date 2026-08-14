import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ar/rewards/anime-wallpapers")({
  beforeLoad: () => {
    throw redirect({ to: "/rewards/anime-wallpapers", statusCode: 301 });
  },
});
