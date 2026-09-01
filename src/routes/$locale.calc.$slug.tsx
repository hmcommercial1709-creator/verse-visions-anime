import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/calc/$slug")({
  beforeLoad: () => { throw notFound(); },
  head: () => ({ meta: [{ name: "robots", content: "noindex, follow" }] }),
});
