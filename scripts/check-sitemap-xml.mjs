#!/usr/bin/env node
/** Validate the one sitemap served by GameCastle. */
import { buildDailySitemapXml, BASE_URL, DAILY_SITEMAP_LIMIT } from "../src/lib/sitemap.ts";

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.error(`FAIL: ${message}`);
};
const ok = (message) => console.log(`ok: ${message}`);

const xml = await buildDailySitemapXml();
if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) fail("missing XML declaration");
if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) fail("missing urlset namespace");
if (xml.includes("<sitemapindex") || xml.includes("sitemap-") || xml.includes("/sitemap/")) fail("legacy sitemap index/partition marker found");

const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
const maxUrls = DAILY_SITEMAP_LIMIT + 1; // homepage + daily window
if (!locs.length) fail("sitemap is empty");
if (locs.length > maxUrls) fail(`sitemap has ${locs.length} URLs; maximum is ${maxUrls}`);
if (locs[0] !== `${BASE_URL}/`) fail("homepage is not the first URL");
if (new Set(locs).size !== locs.length) fail("duplicate URLs found");
for (const loc of locs) {
  if (!loc.startsWith(`${BASE_URL}/`) && loc !== BASE_URL) fail(`URL outside canonical host: ${loc}`);
  if (!loc.startsWith("https://")) fail(`non-HTTPS URL: ${loc}`);
  if (/\s/.test(loc)) fail(`URL contains whitespace: ${loc}`);
}

const today = new Date().toISOString().slice(0, 10);
for (const [, value] of xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) {
  if (value > today) fail(`future lastmod: ${value}`);
}

const legacyTokens = [
  "/sitemap-pages.xml",
  "/sitemap-products.xml",
  "/sitemap-anime.xml",
  "/sitemap-episodes.xml",
  "/sitemap-articles.xml",
  "/sitemap-characters.xml",
  "/sitemap-taxonomy.xml",
  "/sitemap-catalog.xml",
  "/sitemap-matrix.xml",
  "/sitemap-manga.xml",
  "/sitemap-ar.xml",
  "/sitemap-codes-1.xml",
  "/sitemap-codes-2.xml",
];
for (const token of legacyTokens) if (xml.includes(token)) fail(`legacy URL advertised: ${token}`);

if (!failures) ok(`single sitemap valid: ${locs.length} URL(s), bounded at ${maxUrls}`);
process.exit(failures ? 1 : 0);
