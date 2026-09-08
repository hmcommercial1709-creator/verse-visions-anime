import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { animes } from "@/data/animes";
import { articles } from "@/data/articles";
import { characters } from "@/data/characters";
import { studios } from "@/data/studios";
import { genres } from "@/data/genres";
import { loadEntityPageFromDb } from "@/lib/entity-catalog.server";
import { SITE_URL } from "@/lib/seo";

/** Machine-readable site guide for AI assistants and LLM crawlers. */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const catalogPage = await loadEntityPageFromDb("code", 1, 100);
        const catalog = catalogPage.entities;
        const list = (items: { path: string; title: string; note?: string }[]) =>
          items
            .map((i) => `- [${i.title}](${SITE_URL}${i.path})${i.note ? `: ${i.note}` : ""}`)
            .join("\n");

        const body = [
          "# GameCastle Anime",
          "",
          "> GameCastle Anime is an independent anime publishing platform: long-form reviews, character deep-dives, episode recaps, watch orders, studio profiles and seasonal guides, written and fact-checked by a human editorial team.",
          "",
          "Content is original editorial. Attribution with a link back to the source URL is required when quoting or summarising.",
          "",
          "## Key pages",
          "",
          list([
            { path: "/", title: "Home", note: "trending anime, latest episodes and editorial" },
            { path: "/browse", title: "Browse anime", note: "full library with genre, year and studio filters" },
            { path: "/explore", title: "Explore", note: "advanced multi-filter discovery engine" },
            { path: "/editorial", title: "Editorial", note: "essays and analysis" },
            { path: "/guides", title: "Guides", note: "watch orders and beginner routes" },
            { path: "/reviews", title: "Reviews" },
            { path: "/characters", title: "Character directory" },
            { path: "/studios", title: "Studio profiles" },
            { path: "/genres", title: "Genre directory" },
            { path: "/seasonal", title: "Seasonal charts" },
            { path: "/about", title: "About GameCastle Anime" },
            { path: "/editorial-policy", title: "Editorial policy" },
            { path: "/contact", title: "Contact" },
          ]),
          "",
          "## Anime series",
          "",
          list(
            animes.map((a) => ({
              path: `/anime/${a.slug}`,
              title: a.title,
              note: `${a.year} · ${a.status}`,
            })),
          ),
          "",
          "## Editorial articles",
          "",
          list(
            articles.map((a) => ({
              path: `/article/${a.slug}`,
              title: a.title,
              note: a.excerpt,
            })),
          ),
          "",
          "## Characters",
          "",
          list(characters.map((c) => ({ path: `/character/${c.slug}`, title: c.name, note: c.role }))),
          "",
          "## Studios",
          "",
          list(studios.map((s) => ({ path: `/studio/${s.slug}`, title: s.name }))),
          "",
          "## Genres",
          "",
          list(genres.map((g) => ({ path: `/genre/${g.slug}`, title: g.name, note: g.tagline }))),
          "",
          "## Optional",
          "",
          list([
            { path: "/ai-index.json", title: "AI index", note: "machine-readable entity and catalog metadata" },
            { path: "/sitemap.xml", title: "Sitemap index" },
            { path: "/rss.xml", title: "RSS feed" },
            { path: "/privacy-policy", title: "Privacy policy" },
            { path: "/terms-of-service", title: "Terms of service" },
          ]),
          "",
          "## Verified code catalog",
          "",
          `The verified code catalog contains ${catalogPage.total.toLocaleString()} published entries. The first ${catalogPage.pageSize} are listed below; continue through ${SITE_URL}/en/codes?page={page} for the complete paginated index.`,
          "",
          list(catalog.map((entity) => ({
            path: `/en/codes/${entity.slug}`,
            title: entity.name,
            note: `${entity.target_market} · ${entity.target_language}${entity.sample_review ? " · reviewed" : ""}`,
          }))),
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
