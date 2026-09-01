import assert from 'node:assert/strict';
import { localeEntryPath, hasArabicEdition } from '../src/lib/i18n.ts';
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
console.log('Passed 13 locale and reward regression checks.');
