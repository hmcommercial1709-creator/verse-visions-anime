import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy ranking URL — the richer canonical ranking lives at /top-rated. */
export const Route = createFileRoute("/top")({
  beforeLoad: () => {
    throw redirect({ to: "/top-rated", replace: true, statusCode: 301 });
  },
});
