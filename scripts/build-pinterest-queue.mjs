import { writeFileSync } from "node:fs";

import { publishedArticleList } from "@/data/articles";
import { EXPLORE_PAGES } from "@/data/explore-pages";

/**
 * Builds the queue of things that can actually be pinned.
 *
 * Pinterest requires an IMAGE for every pin — there is no text-only pin — so
 * the queue is not "our pages", it is "our pages that have a real image URL".
 * Of 24 published articles, 10 carry an `ogImage`; the rest carry a `cover`
 * that is a CSS gradient string, which is not an image and cannot be pinned.
 * Feeding those to the API would produce 14 failed requests per run.
 *
 * This runs under tsx so it can read the site's own TypeScript data rather
 * than scraping the rendered site. That means titles and descriptions are the
 * editorial ones, not a slug with the hyphens replaced by spaces.
 */

const SITE = "https://gamecastle.store";
const OUTPUT = "pinterest-queue.json";

/** Pinterest truncates hard; these are its documented field limits. */
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 500;

const clamp = (value, max) => {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  // Cut on a word boundary so a pin never ends mid-word.
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

const absolute = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${SITE}${url}`;
  return null;
};

const candidates = [];

for (const article of publishedArticleList()) {
  // ogImage only. `cover` is a CSS gradient on every article.
  const image = absolute(article.ogImage);
  if (!image) continue;
  candidates.push({
    kind: "article",
    url: `${SITE}/article/${article.slug}`,
    image,
    title: clamp(article.title, MAX_TITLE),
    description: clamp(article.excerpt, MAX_DESCRIPTION),
  });
}

for (const page of EXPLORE_PAGES) {
  // Explore pages carry no image field of their own, so they are only
  // pinnable once one exists. Listed here as the obvious place to extend.
  void page;
}

const seen = new Set();
const queue = candidates.filter((row) => {
  if (seen.has(row.url)) return false;
  seen.add(row.url);
  return Boolean(row.title && row.description && row.image);
});

writeFileSync(OUTPUT, JSON.stringify(queue, null, 2), "utf8");

console.log(`[queue] ${queue.length} pinnable page(s) written to ${OUTPUT}`);
if (!queue.length) {
  console.error(
    "[queue] Nothing is pinnable. Every candidate needs an absolute image URL; " +
      "articles carry that in `ogImage`, and a CSS gradient in `cover` is not one.",
  );
  process.exit(1);
}
for (const row of queue) console.log(`  · ${row.title}`);
