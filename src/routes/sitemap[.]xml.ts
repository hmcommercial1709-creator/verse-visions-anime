import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { characters } from "@/data/characters";
import { articles } from "@/data/articles";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/", "/browse", "/trending", "/top", "/upcoming", "/new-releases", "/completed", "/classic",
          "/genres", "/studios", "/characters",
          "/news", "/reviews", "/guides", "/top-lists", "/editorial", "/authors",
          "/watch-order", "/timeline", "/recommendations",
          "/quotes", "/facts", "/soundtracks", "/openings", "/wallpapers",
          "/merch", "/events", "/streaming", "/awards", "/statistics",
          "/about", "/contact", "/faq",
          "/privacy", "/terms", "/cookies", "/dmca", "/editorial-policy", "/sitemap-page",
          ...animes.map(a => `/anime/${a.slug}`),
          ...genres.map(g => `/genre/${g.slug}`),
          ...studios.map(s => `/studio/${s.slug}`),
          ...characters.map(c => `/character/${c.slug}`),
          ...articles.map(a => `/article/${a.slug}`),
        ];
        const urls = paths.map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
