import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/promo/$slug")({
  beforeLoad: () => { throw notFound(); },
  head: () => ({ meta: [{ name: "robots", content: "noindex, follow" }] }),
});
