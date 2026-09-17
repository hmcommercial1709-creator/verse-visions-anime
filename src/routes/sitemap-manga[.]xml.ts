import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/sitemap-manga.xml")({ server: { handlers: { GET: async () => new Response("Gone. Use /sitemap.xml", { status: 410 }) } } });
