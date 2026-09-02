import assert from 'node:assert/strict';
import { parseTrailerPage, uniqueVideos, validYoutubeId, twitchEmbedUrl } from '../src/lib/video-feed.ts';
assert.equal(validYoutubeId('uHGShqcAHlQ'), true);
for (const id of ['../bad', '<script>', 'https://evil.test', null, '']) assert.equal(validYoutubeId(id), false);
const page = parseTrailerPage({ data: [
  { title: 'No trailer', trailer: null },
  { title: 'First', trailer: { youtube_id: 'uHGShqcAHlQ' } },
  { title: 'Duplicate', trailer: { youtube_id: 'uHGShqcAHlQ' } },
  { title: 'Invalid', trailer: { youtube_id: 'bad" onload="' } },
], pagination: { has_next_page: true } });
assert.equal(page.videos.length, 1);
assert.equal(page.hasNext, true);
assert.equal(uniqueVideos([...page.videos, ...page.videos]).length, 1);
assert.equal(parseTrailerPage({ data: [], pagination: { has_next_page: false } }).hasNext, false);
assert.throws(() => parseTrailerPage({ error: 'upstream unavailable' }));
const url = new URL(twitchEmbedUrl('crunchyroll', 'www.gamecastle.store'));
assert.equal(url.origin, 'https://player.twitch.tv');
assert.equal(url.searchParams.get('parent'), 'www.gamecastle.store');
assert.equal(url.searchParams.get('channel'), 'crunchyroll');
assert.throws(() => twitchEmbedUrl('foo&parent=evil.test', 'gamecastle.store'));
console.log('Video ID validation, deduplication, pagination and Twitch parent checks passed.');
