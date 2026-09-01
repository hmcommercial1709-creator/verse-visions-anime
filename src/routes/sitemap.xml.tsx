import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap/xml")({
  beforeLoad: () => { throw redirect({ href: "/sitemap.xml", statusCode: 301 }); },
});
