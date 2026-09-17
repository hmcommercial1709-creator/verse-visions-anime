import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/sitemap-codes-2.xml")({ server: { handlers: { GET: async () => new Response("Gone. Use /sitemap.xml", { status: 410 }) } } });
