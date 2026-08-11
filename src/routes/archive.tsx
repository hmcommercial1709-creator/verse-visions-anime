import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy archive URL — the canonical searchable archive lives at /blog. */
export const Route = createFileRoute("/archive")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", replace: true, statusCode: 301 });
  },
});
