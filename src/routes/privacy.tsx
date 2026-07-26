import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path — the canonical privacy document lives at /privacy-policy. */
export const Route = createFileRoute("/privacy")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-policy", statusCode: 301 });
  },
});
