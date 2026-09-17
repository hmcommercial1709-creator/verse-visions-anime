/**
 * Single, crawl-budget-friendly sitemap for GameCastle.
 * Historical catalog partitions remain intentionally excluded.
 * New entity URLs are admitted only after the daily indexing gate approves them.
 */
import { supabase } from "@/integrations/supabase/client";

export const BASE_URL = "https://gamecastle.store";
export const DAILY_SITEMAP_LIMIT = 197;

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

function entityPath(entityType: string, slug: string): string | null {
  if (!slug) return null;
  if (entityType === "anime") return `/catalog/anime/${slug}`;
  if (entityType === "game") return `/catalog/games/${slug}`;
  if (entityType === "manga") return `/catalog/manga/${slug}`;
  return null;
}

export async function loadDailySitemapEntries(now = new Date()): Promise<SitemapEntry[]> {
  const { start, end } = utcDayBounds(now);
  const [{ data: rows, error: rowsError }, { data: approved, error: gateError }] = await Promise.all([
    supabase.from("entities").select("entity_type,slug,created_at").eq("status", "active").gte("created_at", start).lt("created_at", end).order("created_at", { ascending: false }).limit(DAILY_SITEMAP_LIMIT),
    supabase.from("daily_indexing_gate").select("path,status,source_created_at").eq("status", "approved").gte("source_created_at", start).lt("source_created_at", end),
  ]);

  if (rowsError || gateError) {
    console.error("Daily sitemap gate query failed.", rowsError?.message ?? gateError?.message);
    return [];
  }

  const approvedPaths = new Set((approved ?? []).map((entry) => entry.path));
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  for (const row of rows ?? []) {
    if (entries.length >= DAILY_SITEMAP_LIMIT) break;
    const path = entityPath(row.entity_type, row.slug);
    if (!path || seen.has(path) || !approvedPaths.has(path)) continue;
    seen.add(path);
    const createdAt = row.created_at ? new Date(row.created_at) : null;
    entries.push({ path, lastmod: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toISOString().slice(0, 10) : undefined, changefreq: "daily", priority: "0.8" });
  }
  return entries;
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
