import assert from 'node:assert/strict';
import { localeEntryPath, hasArabicEdition, localeCatchAll } from '../src/lib/i18n.ts';
import { readFileSync, existsSync } from 'node:fs';
import { clampRewardProgress, addVisibleBrowsingTime, REWARD_THRESHOLD_MS } from '../src/lib/visitor-reward.ts';

assert.equal(localeEntryPath('/ar/anime', 'en'), '/browse');
assert.equal(localeEntryPath('/anime/dandadan', 'ar'), '/ar/anime');
assert.equal(localeEntryPath('/en/anime/1-cho', 'ar'), '/ar/anime');
assert.equal(localeEntryPath('/anime/naruto', 'ar'), '/ar/anime/naruto');
assert.equal(localeEntryPath('/ar/explore', 'en'), '/explore');
assert.equal(localeEntryPath('/explore', 'ar'), '/ar/explore');
assert.equal(localeEntryPath('/browse', 'fr'), '/browse');
assert.equal(hasArabicEdition('/anime/1-cho'), false);
assert.equal(hasArabicEdition('/anime/naruto'), true);
assert.equal(clampRewardProgress('invalid'), 0);
assert.equal(clampRewardProgress(-1), 0);
assert.equal(addVisibleBrowsingTime(0, 60_000), 5_000);
assert.equal(addVisibleBrowsingTime(REWARD_THRESHOLD_MS - 500, 1_000), REWARD_THRESHOLD_MS);

// The /$locale/* catch-all. Its first line used to be an isLocaleCode guard,
// and a refactor that replaced the route with a blanket 410 dropped it — so
// /favicon.ico, which matches this route with locale="favicon.ico" and an
// empty splat, answered "410 Gone" to every browser and to Googlebot on every
// page load. A path that is not under a locale is not ours to declare gone.
assert.deepEqual(localeCatchAll('favicon.ico', ''), { kind: 'not-found' });
assert.deepEqual(localeCatchAll('robots.txt', ''), { kind: 'not-found' });
assert.deepEqual(localeCatchAll('some-typo', 'deep/path'), { kind: 'not-found' });
assert.deepEqual(localeCatchAll(undefined, ''), { kind: 'not-found' });

// A locale with no translated content sends the reader to the English original.
assert.deepEqual(localeCatchAll('fr', 'anime'), { kind: 'redirect', to: '/anime' });
assert.deepEqual(localeCatchAll('de', ''), { kind: 'redirect', to: '/' });

// The Arabic entry point, and everything else under a ready locale.
assert.deepEqual(localeCatchAll('ar', ''), { kind: 'redirect', to: '/ar/anime' });
assert.deepEqual(localeCatchAll('ar', 'codes/omni-us-supreme-node-1'), { kind: 'gone' });
assert.deepEqual(localeCatchAll('en', 'anime/whatever'), { kind: 'gone' });

// Every icon the root route advertises must actually exist, or each page load
// pays for a 404 that can never succeed. Four dead icon links shipped this way.
const root = readFileSync(new URL('../src/routes/__root.tsx', import.meta.url), 'utf8');
for (const [, href] of root.matchAll(/href: "(\/[^"]+?)(?:\?v=\d+)?"/g)) {
  if (!/\.(svg|png|ico|webmanifest)$/.test(href)) continue;
  const file = new URL(`../public${href}`, import.meta.url);
  assert.ok(existsSync(file), `__root.tsx links ${href}, which does not exist in public/`);
}

console.log('Passed 22 locale, reward, catch-all and icon regression checks.');
