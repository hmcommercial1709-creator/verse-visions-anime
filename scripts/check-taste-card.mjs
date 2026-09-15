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

/* ------------------------------------------------------------------ *
 * 1. The card never states more than the picks support.
 *
 * This is the rule the whole tool rests on. A card that pads itself out
 * with a compliment when it has no data is the same failure as a growth
 * score that defaults a missing factor to zero: the output still looks
 * complete, and nothing in it tells you which half was made up.
 * ------------------------------------------------------------------ */

const pick = (slug, categories, entityType = 'anime') => ({
  slug,
  name: slug,
  categories,
  entityType,
});

// Below the minimum there is no pattern to describe, so there are no lines.
assert.deepEqual(insights([pick('a', ['Action']), pick('b', ['Action'])]), []);

// With no genre data at all, the genre lines are absent rather than blank.
const untagged = [pick('a', null), pick('b', []), pick('c', null)];
assert.deepEqual(insights(untagged), []);
assert.equal(focusScore(untagged), null);
assert.deepEqual(genreSpread(untagged), []);

// One genre across the picks is not enough to describe a shape.
assert.equal(rarityLabel([pick('a', ['Action']), pick('b', ['Action'])]), null);

// Every line that IS printed carries the evidence that produced it.
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

// The signature line reports a real count, and reports it grammatically.
const signature = lines.find((line) => line.label === 'Signature genre');
assert.equal(signature.value, 'Action');
assert.match(signature.basis, /3 of your 3 picks are tagged Action/);

const single = insights([
  pick('a', ['Action', 'Comedy']),
  pick('b', ['Comedy']),
  pick('c', ['Drama']),
]).find((line) => line.label === 'Signature genre');
assert.match(single.basis, /2 of your 3 picks are tagged Comedy/);
const lone = insights([pick('a', ['Action']), pick('b', ['Comedy']), pick('c', ['Drama'])]).find(
  (line) => line.label === 'Signature genre',
);
assert.match(lone.basis, /1 of your 3 picks is tagged Action/, 'one pick takes a singular verb');

// Focus is a real share of the tags, not a rating.
assert.equal(focusScore(shonen), 3 / 6);
assert.equal(focusScore([pick('a', ['Action']), pick('b', ['Action'])]), 1);

// Crossover only appears when the picks really do span catalogs.
const oneCatalog = insights(shonen).map((line) => line.label);
assert.ok(!oneCatalog.includes('Crossover'), 'one catalog is not a crossover');
const mixed = insights([
  pick('a', ['Action'], 'anime'),
  pick('b', ['Action'], 'game'),
  pick('c', ['RPG'], 'game'),
]).map((line) => line.label);
assert.ok(mixed.includes('Crossover'), 'picks across two catalogs are a crossover');

// The share caption names real picks and never invents a superlative.
assert.equal(shareCaption(shonen), 'My taste card: Action — a, b, c');
assert.doesNotMatch(shareCaption(shonen), /elite|legendary|rare|top \d/i);

assert.ok(MIN_PICKS >= 3 && MAX_PICKS > MIN_PICKS);

console.log('Taste card states only what the picks support: passed.');

/* ------------------------------------------------------------------ *
 * 2. The invitation is in the header, and is not a floating overlay.
 *
 * It began as a fixed bottom-right button gated on a 700px scroll
 * threshold — longer than the viewport on a 1366x768 laptop, so it
 * never appeared in normal use — and it needed live rect maths to stay
 * clear of ad boxes. In the header it is on every page from the first
 * paint, and normal flow makes the accidental-click problem impossible
 * rather than merely handled.
 * ------------------------------------------------------------------ */

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const header = read('../src/components/site-header.tsx');
assert.match(header, /to="\/gamer-card"/, 'the header must link to the Taste Card');
assert.match(header, /taste-cta-pulse/, 'the header link must carry the attention pulse');
assert.match(
  header,
  /aria-label="Build your Taste Card"/,
  'the icon-only form on small screens needs an accessible name',
);

// Never a floating overlay again: a fixed element over the page is the
// accidental-click risk AdSense holds the publisher responsible for.
const headerLink = header.slice(header.indexOf('to="/gamer-card"') - 400, header.indexOf('to="/gamer-card"') + 400);
assert.doesNotMatch(headerLink, /\bfixed\b/, 'the Taste Card link must not be fixed-positioned');
assert.equal(
  existsSync(new URL('../src/components/taste-card-cta.tsx', import.meta.url)),
  false,
  'the floating CTA component must stay deleted',
);
const root = read('../src/routes/__root.tsx');
assert.doesNotMatch(root, /TasteCardCta/, 'the root route must not mount a floating CTA');

console.log('Taste Card invitation sits in the header, never floating: passed.');

/* ------------------------------------------------------------------ *
 * 3. The wiring the tool depends on stays wired.
 *
 * DeferredScripts was written, reviewed and never mounted, so AdSense
 * never loaded on any page. The same mistake here costs less but is
 * just as invisible, so each connection is asserted rather than
 * assumed.
 * ------------------------------------------------------------------ */

const styles = read('../src/styles.css');
assert.match(
  styles,
  /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\.taste-cta-pulse/,
  'the pulse must be gated on prefers-reduced-motion, not merely dimmed',
);
assert.match(styles, /@keyframes taste-cta-pulse/);

const route = read('../src/routes/gamer-card.tsx');
assert.match(
  route,
  /rel: "canonical", href: URL/,
  'the picks query string must collapse to one canonical URL',
);

// The page has to be reachable without JavaScript and without a scroll,
// or it ranks on nothing but its own sitemap line.
const footer = read('../src/components/site-footer.tsx');
assert.match(footer, /"\/gamer-card"/, 'the footer must carry a crawlable link to the tool');
const sitemap = read('../src/lib/sitemap.ts');
assert.match(sitemap, /"\/gamer-card"/, 'the tool must be listed in the sitemap');

// Drawing cover art from another origin taints the canvas and makes
// toDataURL throw, which would break the download button for exactly the
// picks that have artwork. The card is text-only on purpose.
const canvas = read('../src/components/taste-card-canvas.ts');
assert.doesNotMatch(canvas, /drawImage/, 'the card must not draw cross-origin images');
assert.match(canvas, /toDataURL/);

console.log('Taste card wiring, canonical, crawl path and canvas safety: passed.');
