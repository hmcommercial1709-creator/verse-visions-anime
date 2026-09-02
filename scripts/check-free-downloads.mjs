import assert from 'node:assert/strict';
import { parseFreeVideoFiles, downloadSearchUrl } from '../src/lib/free-video-downloads.ts';
import { parseFreeGames } from '../src/lib/free-games.ts';
const record = { title: 'File:Example.webm', imageinfo: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Example.webm', descriptionurl: 'https://commons.wikimedia.org/wiki/File:Example.webm', mime: 'video/webm', size: 100, extmetadata: { ImageDescription: { value: 'An animated film' }, LicenseShortName: { value: 'Public domain' }, Artist: { value: '<b>Creator</b>' } } }] };
const wrap = (record) => ({ query: { pages: { 1: record } } });
assert.equal(parseFreeVideoFiles(wrap(record))[0].author, 'Creator');
for (const license of ['', 'All rights reserved', 'CC BY-NC 4.0']) {
 const invalid = structuredClone(record); invalid.imageinfo[0].extmetadata.LicenseShortName.value = license;
 assert.equal(parseFreeVideoFiles(wrap(invalid)).length, 0);
}
const invalid = structuredClone(record); invalid.imageinfo[0].url = 'https://upload.wikimedia.org.evil.test/video.webm';
assert.equal(parseFreeVideoFiles(wrap(invalid)).length, 0);
assert.deepEqual(parseFreeVideoFiles({ batchcomplete: '' }), []);
assert.throws(() => parseFreeVideoFiles({ error: {} }));
assert.throws(() => downloadSearchUrl(' '));
assert.equal(new URL(downloadSearchUrl('Naruto')).searchParams.get('gsrsearch'), 'intitle:"Naruto" filetype:video');
const game = { id: 1, title: 'Game', game_url: 'https://www.freetogame.com/open/game', thumbnail: 'https://www.freetogame.com/g/1/thumbnail.jpg' };
assert.equal(parseFreeGames([game]).length, 1);
assert.equal(parseFreeGames([{ ...game, game_url: 'javascript:alert(1)' }]).length, 0);
assert.equal(parseFreeGames([{ ...game, game_url: 'https://untrusted.test/game.exe' }]).length, 0);
console.log('Download search, source URLs, license filtering and game-link checks passed.');

assert.equal(parseFreeVideoFiles(wrap({ ...record, title: 'File:Naruto Trailer.webm' })).length, 0);
