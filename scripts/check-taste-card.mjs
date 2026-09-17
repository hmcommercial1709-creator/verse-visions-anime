import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  MAX_PICKS,
  MIN_PICKS,
  focusScore,
  genreSpread,
  insights,
  rarityLabel,
  shareCaption,
} from '../src/lib/gamer-card.ts';

const pick = (slug, categories, entityType = 'anime') => ({ slug, name: slug, categories, entityType });

assert.deepEqual(insights([pick('a', ['Action']), pick('b', ['Action'])]), []);
const untagged = [pick('a', null), pick('b', []), pick('c', null)];
assert.deepEqual(insights(untagged), []);
assert.equal(focusScore(untagged), null);
assert.deepEqual(genreSpread(untagged), []);
assert.equal(rarityLabel([pick('a', ['Action']), pick('b', ['Action'])]), null);

const shonen = [
  pick('a', ['Action', 'Shounen']),
  pick('b', ['Action', 'Adventure']),
  pick('c', ['Action', 'Shounen']),
];
const lines = insights(shonen);
assert.ok(lines.length >= 3, 'three tagged picks should produce several lines');
for (const line of lines) {
  assert.ok(line.basis && line.basis.length > 0, `line "${line.label}" must carry its basis`);
  assert.ok(line.value && line.value.length > 0, `line "${line.label}" must carry a value`);
}
const signature = lines.find((line) => line.label === 'Signature genre');
assert.equal(signature.value, 'Action');
assert.match(signature.basis, /3 of your 3 picks are tagged Action/);
const single = insights([
  pick('a', ['Action', 'Comedy']), pick('b', ['Comedy']), pick('c', ['Drama']),
]).find((line) => line.label === 'Signature genre');
assert.match(single.basis, /2 of your 3 picks are tagged Comedy/);
const lone = insights([pick('a', ['Action']), pick('b', ['Comedy']), pick('c', ['Drama'])]).find(
  (line) => line.label === 'Signature genre',
);
assert.match(lone.basis, /1 of your 3 picks is tagged Action/, 'one pick takes a singular verb');
assert.equal(focusScore(shonen), 3 / 6);
assert.equal(focusScore([pick('a', ['Action']), pick('b', ['Action'])]), 1);

const oneCatalog = insights(shonen).map((line) => line.label);
assert.ok(!oneCatalog.includes('Crossover'), 'one catalog is not a crossover');
const mixed = insights([
  pick('a', ['Action'], 'anime'), pick('b', ['Action'], 'game'), pick('c', ['RPG'], 'game'),
]).map((line) => line.label);
assert.ok(mixed.includes('Crossover'), 'picks across two catalogs are a crossover');
assert.equal(shareCaption(shonen), 'My taste card: Action — a, b, c');
assert.doesNotMatch(shareCaption(shonen), /elite|legendary|rare|top \d/i);
assert.ok(MIN_PICKS >= 3 && MAX_PICKS > MIN_PICKS);
console.log('Taste card states only what the picks support: passed.');

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const header = read('../src/components/site-header.tsx');
assert.match(header, /to="\/gamer-card"/, 'the header must link to the Taste Card');
assert.match(header, /taste-cta-pulse/, 'the header link must carry the attention pulse');
assert.match(header, /aria-label="Build your Taste Card"/, 'the icon-only form on small screens needs an accessible name');
const headerLink = header.slice(header.indexOf('to="/gamer-card"') - 400, header.indexOf('to="/gamer-card"') + 400);
assert.doesNotMatch(headerLink, /\bfixed\b/, 'the Taste Card link must not be fixed-positioned');
assert.equal(existsSync(new URL('../src/components/taste-card-cta.tsx', import.meta.url)), false, 'the floating CTA component must stay deleted');
const root = read('../src/routes/__root.tsx');
assert.doesNotMatch(root, /TasteCardCta/, 'the root route must not mount a floating CTA');
console.log('Taste Card invitation sits in the header, never floating: passed.');

const styles = read('../src/styles.css');
assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\.taste-cta-pulse/, 'the pulse must be gated on prefers-reduced-motion, not merely dimmed');
assert.match(styles, /@keyframes taste-cta-pulse/);
const route = read('../src/routes/gamer-card.tsx');
assert.match(route, /rel: "canonical", href: URL/, 'the picks query string must collapse to one canonical URL');
const footer = read('../src/components/site-footer.tsx');
assert.match(footer, /"\/gamer-card"/, 'the footer must carry a crawlable link to the tool');

// The XML sitemap is intentionally bounded to the homepage plus today's
// Supabase records. The HTML sitemap owns the broader crawlable page index.
const htmlSitemap = read('../src/routes/sitemap-page.tsx');
assert.match(htmlSitemap, /"\/gamer-card"/, 'the Taste Card must be listed in the HTML sitemap');
const xmlSitemap = read('../src/routes/sitemap.xml.ts');
assert.match(xmlSitemap, /buildDailySitemapXml/, 'the XML sitemap must use the bounded daily generator');
assert.doesNotMatch(xmlSitemap, /PARTITIONS|partitionEntries|sitemapIndexXml/, 'the XML route must not depend on retired partition exports');

const canvas = read('../src/components/taste-card-canvas.ts');
assert.doesNotMatch(canvas, /drawImage/, 'the card must not draw cross-origin images');
assert.match(canvas, /toDataURL/);
console.log('Taste card wiring, canonical, crawl paths and sitemap separation: passed.');
