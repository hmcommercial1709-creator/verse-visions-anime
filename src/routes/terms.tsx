import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path — the canonical terms document lives at /terms-of-service. */
export const Route = createFileRoute("/terms")({
  beforeLoad: () => {
    throw redirect({ to: "/terms-of-service", statusCode: 301 });
  },
});
