#!/usr/bin/env node
/**
 * Renders every sitemap this site serves and validates it offline.
 *
 * check-sitemaps.mjs already checks the LIVE site, which is the right check
 * and the wrong time: it can only fail after a deploy. This one runs from the
 * source, so a malformed sitemap, a duplicate URL or an invented lastmod fails
 * the build instead of Search Console.
 *
 * What it enforces:
 *   - well-formed XML, correctly nested, correct namespace
 *   - every <loc> absolute, https, on the canonical host, properly escaped
 *   - no URL served by two different partitions (which splits its signals)
 *   - no duplicate <loc> inside one file
 *   - every <lastmod> a valid W3C date, and never in the future - a future
 *     date is the signature of a fabricated timestamp
 *   - every child the index names is one this app actually serves
 *   - priority in range, changefreq from the allowed set
 *   - hreflang alternates resolve to URLs the same file set contains
 */

import {
  PARTITIONS,
  partitionEntries,
  partitionSitemapPath,
  urlsetXml,
  arUrlsetXml,
  sitemapIndexXml,
  BASE_URL,
  AR_ENTRIES,
} from "../src/lib/sitemap.ts";
import { INDEXABLE_LOCALES } from "../src/lib/i18n.ts";

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.log(`  FAIL  ${message}`);
};
const ok = (message) => console.log(`  ok    ${message}`);

const CHANGEFREQ = new Set(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]);
const today = new Date().toISOString().slice(0, 10);

/** Minimal well-formedness pass: tags balance and nest. */
function checkWellFormed(label, xml) {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
    fail(`${label}: missing XML declaration`);
  const stack = [];
  for (const match of xml.matchAll(/<(\/?)([a-zA-Z][\w:.-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, name, , selfClosing] = match;
    if (selfClosing) continue;
    if (closing) {
      if (stack.pop() !== name) return fail(`${label}: tag <${name}> closes out of order`);
    } else {
      stack.push(name);
    }
  }
  if (stack.length) fail(`${label}: unclosed <${stack[stack.length - 1]}>`);
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/.test(xml)) fail(`${label}: unescaped ampersand`);
}

function checkUrlset(label, xml, seenGlobal) {
  checkWellFormed(label, xml);
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
    fail(`${label}: missing sitemap namespace`);

  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) fail(`${label}: no <loc> entries — an empty sitemap is a Search Console error`);

  const seenHere = new Set();
  for (const loc of locs) {
    if (!loc.startsWith(`${BASE_URL}/`) && loc !== BASE_URL)
      fail(`${label}: <loc> not on the canonical host: ${loc}`);
    if (!loc.startsWith("https://")) fail(`${label}: <loc> is not https: ${loc}`);
    if (/\s/.test(loc)) fail(`${label}: <loc> contains whitespace: ${loc}`);
    if (seenHere.has(loc)) fail(`${label}: duplicate <loc> inside the file: ${loc}`);
    seenHere.add(loc);
    const owner = seenGlobal.get(loc);
    if (owner && owner !== label)
      fail(`${label}: ${loc} is also served by ${owner} — one URL, two partitions`);
    else seenGlobal.set(loc, label);
  }

  for (const [, value] of xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`${label}: lastmod is not a W3C date: ${value}`);
    else if (value > today)
      fail(`${label}: lastmod is in the future (${value}) — that is a fabricated timestamp`);
  }
  for (const [, value] of xml.matchAll(/<priority>([^<]*)<\/priority>/g)) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 1) fail(`${label}: priority out of range: ${value}`);
  }
  for (const [, value] of xml.matchAll(/<changefreq>([^<]*)<\/changefreq>/g)) {
    if (!CHANGEFREQ.has(value)) fail(`${label}: invalid changefreq: ${value}`);
  }
  return locs;
}

console.log("\nRendering every sitemap from source\n");

const seenGlobal = new Map();
const unservable = [];
const files = new Map();
let totalUrls = 0;

for (const locale of INDEXABLE_LOCALES) {
  for (const partition of PARTITIONS) {
    const path = partitionSitemapPath(partition, locale);
    const entries = partitionEntries(partition);
    // urlsetXml filters English-only paths out of a non-English locale, so a
    // partition can be non-empty overall and still render nothing here. That
    // file must not be served at all - checked against the route below.
    const xml = urlsetXml(entries, locale);
    if (!/<loc>/.test(xml)) {
      unservable.push(path);
      continue;
    }
    files.set(path, xml);
    const locs = checkUrlset(path, xml, seenGlobal);
    totalUrls += locs.length;
    const withLastmod = (xml.match(/<lastmod>/g) ?? []).length;
    console.log(
      `  ${path.padEnd(34)} ${String(locs.length).padStart(5)} urls, ${withLastmod} lastmod`,
    );
  }
}

const arXml = arUrlsetXml();
files.set("/sitemap-ar.xml", arXml);
const arLocs = checkUrlset("/sitemap-ar.xml", arXml, seenGlobal);
totalUrls += arLocs.length;
console.log(
  `  ${"/sitemap-ar.xml".padEnd(34)} ${String(arLocs.length).padStart(5)} urls, ${(arXml.match(/<lastmod>/g) ?? []).length} lastmod`,
);

console.log(`\n  ${totalUrls} URL(s) across ${files.size} rendered file(s).`);
if (unservable.length) {
  console.log(
    `  ${unservable.length} partition/locale pair(s) render no URLs and must 404 rather than serve an empty urlset:`,
  );
  for (const path of unservable) console.log(`    ${path}`);
}
console.log("");

console.log("Sitemap index");
const indexXml = sitemapIndexXml(2, true, true);
checkWellFormed("/sitemap.xml", indexXml);
if (!indexXml.includes("<sitemapindex")) fail("/sitemap.xml: not a sitemapindex");

const children = [...indexXml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) =>
  m[1].replace(BASE_URL, ""),
);
const childLastmods = [...indexXml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
console.log(`  ${children.length} child sitemap(s), ${childLastmods.length} with lastmod`);

if (childLastmods.length !== children.length) {
  fail(`only ${childLastmods.length} of ${children.length} children carry a lastmod`);
} else ok("every child carries a lastmod");

for (const value of childLastmods) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`index lastmod is not a W3C date: ${value}`);
  else if (value > today) fail(`index lastmod is in the future: ${value}`);
}
if (new Set(children).size !== children.length) fail("the index names the same child twice");
else ok("no duplicate children");

// Every child must be something the app serves: a rendered partition file, or
// a route-backed dynamic child. Advertising anything else is the exact failure
// this repository already documents for the codes partitions.
const DYNAMIC = new Set([
  "/sitemap-codes-1.xml",
  "/sitemap-codes-2.xml",
  "/sitemap-catalog.xml",
  "/sitemap-matrix.xml",
  "/sitemap-manga.xml",
]);
let unresolved = 0;
for (const child of children) {
  if (!files.has(child) && !DYNAMIC.has(child)) {
    fail(`the index names ${child}, which nothing renders or serves`);
    unresolved += 1;
  }
}
if (!unresolved) ok("every child resolves to something the app serves");

const advertisedEmpty = children.filter((child) => unservable.includes(child));
if (advertisedEmpty.length)
  fail(
    `the index advertises ${advertisedEmpty.length} child(ren) that render no URLs: ${advertisedEmpty.join(", ")}`,
  );
else ok("the index never advertises an empty child");

console.log("\nhreflang alternates");
const allLocs = new Set([...seenGlobal.keys()]);
let danglingAlternates = 0;
for (const [path, xml] of files) {
  for (const [, href] of xml.matchAll(/hreflang="[^"]*" href="([^"]*)"/g)) {
    if (!allLocs.has(href)) {
      if (danglingAlternates < 5)
        fail(`${path}: alternate points at ${href}, which no sitemap contains`);
      danglingAlternates += 1;
    }
  }
}
if (!danglingAlternates) ok("every alternate resolves to a URL the sitemaps contain");
else fail(`${danglingAlternates} dangling alternate(s) in total`);

console.log(failures ? `\n${failures} sitemap problem(s).\n` : "\nAll sitemap checks passed.\n");
process.exit(failures ? 1 : 0);
