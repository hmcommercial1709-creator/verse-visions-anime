/**
 * Single, crawl-budget-friendly sitemap for GameCastle.
 *
 * Only the homepage and the newest active entity pages created today are
 * eligible. The historical catalog is intentionally excluded. YouTube-linked
 * rows are included when present; all selected rows remain strictly ordered
 * by created_at descending and the total is capped at 200 daily URLs.
 */
import { supabase } from "@/integrations/supabase/client";

export const BASE_URL = "https://gamecastle.store";
export const DAILY_SITEMAP_LIMIT = 200;

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function utcDayBounds(now = new Date()): { start: string; end: string } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

function entityPath(entityType: string, slug: string): string | null {
  if (!slug) return null;
  if (entityType === "anime") return `/catalog/anime/${slug}`;
  if (entityType === "game") return `/catalog/games/${slug}`;
  if (entityType === "manga") return `/catalog/manga/${slug}`;
  return null;
}

export async function loadDailySitemapEntries(now = new Date()): Promise<SitemapEntry[]> {
  const { start, end } = utcDayBounds(now);
  const baseQuery = () =>
    supabase
      .from("entities")
      .select("entity_type, slug, source_name, created_at")
      .eq("status", "active")
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: false })
      .limit(DAILY_SITEMAP_LIMIT);

  const [youtubeResult, newestResult] = await Promise.all([
    baseQuery().or("source_name.ilike.%youtube%,source_name.ilike.%yt%"),
    baseQuery(),
  ]);

  if (youtubeResult.error) {
    console.warn("Daily sitemap YouTube query failed; continuing with the bounded daily query.", youtubeResult.error.message);
  }
  if (newestResult.error) {
    console.error("Daily sitemap query failed.", newestResult.error.message);
    return [];
  }

  const rows = [...(youtubeResult.data ?? []), ...(newestResult.data ?? [])]
    .sort((a, b) => {
      const byCreated = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (byCreated !== 0) return byCreated;
      const aYouTube = /youtube|yt/i.test(a.source_name ?? "") ? 1 : 0;
      const bYouTube = /youtube|yt/i.test(b.source_name ?? "") ? 1 : 0;
      return bYouTube - aYouTube;
    });

  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];

  for (const row of rows) {
    if (entries.length >= DAILY_SITEMAP_LIMIT) break;
    const path = entityPath(row.entity_type, row.slug);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    const createdAt = row.created_at ? new Date(row.created_at) : null;
    entries.push({
      path,
      lastmod: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toISOString().slice(0, 10) : undefined,
      changefreq: "daily",
      priority: "0.8",
    });
  }

  return entries;
}

export async function buildDailySitemapXml(now = new Date()): Promise<string> {
  const entries = await loadDailySitemapEntries(now);
  return urlsetXml([{ path: "/", changefreq: "daily", priority: "1.0" }, ...entries]);
}

export function urlsetXml(entries: SitemapEntry[]): string {
  const seen = new Set<string>();
  const urls = entries
    .filter((entry) => {
      if (!entry.path || seen.has(entry.path)) return false;
      seen.add(entry.path);
      return true;
    })
    .map((entry) => [
      "  <url>",
      `    <loc>${xmlEscape(BASE_URL + entry.path)}</loc>`,
      entry.lastmod ? `    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : null,
      entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
      entry.priority ? `    <priority>${entry.priority}</priority>` : null,
      "  </url>",
    ].filter(Boolean).join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
    },
  });
}
