/**
 * Single, crawl-budget-friendly sitemap for GameCastle.
 * Historical catalog partitions remain intentionally excluded.
 * New entity URLs are admitted only after the daily indexing gate approves them.
 * The sitemap is driven by the gate itself so an approved page can never be
 * crowded out by an unapproved row earlier in the entity query.
 */
import { supabase } from "@/integrations/supabase/client";

export const BASE_URL = "https://gamecastle.store";
export const DAILY_SITEMAP_LIMIT = 1000;

const ESSENTIAL_SITEMAP_PATHS = ["/character-quiz", "/my-list", "/matchmaker"] as const;

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export function xmlEscape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

function utcDayBounds(now = new Date()): { start: string; end: string } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return { start: start.toISOString(), end: new Date(start.getTime() + 86400000).toISOString() };
}

export async function loadDailySitemapEntries(now = new Date()): Promise<SitemapEntry[]> {
  const { start, end } = utcDayBounds(now);
  const { data: approved, error } = await supabase
    .from("daily_indexing_gate")
    .select("path,status,source_created_at")
    .eq("status", "approved")
    .gte("source_created_at", start)
    .lt("source_created_at", end)
    .order("source_created_at", { ascending: false })
    .limit(DAILY_SITEMAP_LIMIT);

  if (error) {
    console.error("Daily sitemap gate query failed.", error.message);
    return [];
  }

  const seen = new Set<string>();
  return (approved ?? [])
    .filter((entry) => {
      if (!entry.path || seen.has(entry.path)) return false;
      seen.add(entry.path);
      return true;
    })
    .map((entry) => {
      const createdAt = entry.source_created_at ? new Date(entry.source_created_at) : null;
      return {
        path: entry.path,
        lastmod: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toISOString().slice(0, 10) : undefined,
        changefreq: "daily" as const,
        priority: "0.8",
      };
    });
}

export async function buildDailySitemapXml(now = new Date()): Promise<string> {
  const entries = await loadDailySitemapEntries(now);
  const essential = ESSENTIAL_SITEMAP_PATHS.map((path) => ({ path, changefreq: "weekly" as const, priority: "0.6" }));
  return urlsetXml([{ path: "/", changefreq: "daily", priority: "1.0" }, ...essential, ...entries]);
}

export function urlsetXml(entries: SitemapEntry[]): string {
  const seen = new Set<string>();
  const urls = entries.filter((entry) => {
    if (!entry.path || seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  }).map((entry) => ["  <url>", `    <loc>${xmlEscape(BASE_URL + entry.path)}</loc>`, entry.lastmod ? `    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : null, entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null, entry.priority ? `    <priority>${entry.priority}</priority>` : null, "  </url>"].filter(Boolean).join("\n"));
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, "</urlset>"].join("\n");
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600", "CDN-Cache-Control": "public, max-age=900, stale-while-revalidate=3600", "X-Robots-Tag": "all" } });
}
