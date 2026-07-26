import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collectSitemapPaths } from "@/lib/content-registry";

const BASE_URL = "";

// Static routes owned by the app shell — kept here so that sitemap
// generation stays a pure data-plus-routes function. Content-driven
// URLs come from the registry and are automatically filtered by
// publicationStatus.
const STATIC_PATHS = [
  "/", "/browse", "/trending", "/top", "/upcoming", "/new-releases", "/completed", "/classic",
  "/genres", "/studios", "/characters",
  "/news", "/reviews", "/guides", "/top-lists", "/editorial", "/authors",
  "/manga-spoilers", "/power-scaling",
  "/watch-order", "/timeline", "/recommendations",
  "/quotes", "/facts", "/soundtracks", "/openings", "/wallpapers",
  "/merch", "/events", "/streaming", "/awards", "/statistics",
  "/about", "/contact", "/faq",
  "/privacy-policy", "/terms-of-service", "/cookies", "/dmca", "/editorial-policy", "/sitemap-page",
];


export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [...STATIC_PATHS, ...collectSitemapPaths()];
        const urls = paths.map(
          (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
