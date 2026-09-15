import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { publishedAnime } from '../src/lib/content-registry.ts';
import { animeGames } from '../src/data/gaming-hub.ts';
import { sectionsFor } from '../src/lib/anime-sections.ts';
import {
  MOODS, MOOD_TAGS, matchAnime, matchEditorial, matchFranchiseGame,
  gameTagsFor, daySeed, pickFrom,
} from '../src/lib/matchmaker.ts';
import { percentages, parseVotes, localTally } from '../src/lib/community-poll.ts';
import { parseRank, award, bandFor, crossesBand, POINTS, BANDS } from '../src/lib/battle-rank.ts';
import { parseReactions, addFace, addNote, MAX_NOTES, MAX_NOTE_LEN } from '../src/lib/reactions.ts';

/* ------------------------------------------------------------------ *
 * 1. Every mood asks for genres that exist.
 *
 * A mood mapped to an invented genre matches nothing, so its whole
 * bundle silently comes back empty — the feature looks broken rather
 * than looking wrong, which is the harder bug to notice.
 * ------------------------------------------------------------------ */

const realGenres = new Set(
  publishedAnime().flatMap((a) => (a.genres ?? []).map((g) => g.toLowerCase())),
);
const invented = MOOD_TAGS.filter((t) => !realGenres.has(t));
assert.deepEqual(invented, [], `mood tags absent from the anime data: ${invented.join(', ')}`);
assert.ok(MOODS.length >= 4, 'too few moods to be a choice');
assert.equal(new Set(MOODS.map((m) => m.id)).size, MOODS.length, 'duplicate mood ids');
for (const mood of MOODS) assert.ok(mood.tags.length > 0, `${mood.id} asks for no genres`);

/* ------------------------------------------------------------------ *
 * 2. Nothing is paired that is not genuinely related.
 * ------------------------------------------------------------------ */

let filledAnime = 0;
let checked = 0;
for (const mood of MOODS) {
  for (let day = 0; day < 40; day += 1) {
    const seed = daySeed() + day;
    const anime = matchAnime(mood.tags, seed);
    checked += 1;
    if (!anime.item) continue;
    filledAnime += 1;

    // The chosen series really carries every tag the slot claims.
    for (const tag of anime.allMatched ?? []) {
      assert.ok(mood.tags.includes(tag), `${anime.item.title} claims "${tag}", not in ${mood.id}`);
      assert.ok(
        anime.item.genres.includes(tag),
        `${anime.item.title} does not actually carry "${tag}"`,
      );
    }
    // And it is one of the STRONGEST matches, not merely an eligible one.
    const best = Math.max(
      ...publishedAnime().map(
        (a) => (a.genres ?? []).map((g) => g.toLowerCase()).filter((g) => mood.tags.includes(g)).length,
      ),
    );
    assert.equal(
      (anime.allMatched ?? []).length,
      best,
      `${mood.id} picked a ${(anime.allMatched ?? []).length}-tag match when a ${best}-tag one exists`,
    );

    // The editorial slot points at something that exists.
    const editorial = matchEditorial(anime.item, seed);
    if (editorial.item) {
      if (editorial.item.kind === 'section') {
        assert.ok(
          sectionsFor(editorial.item.slug).includes(editorial.item.section),
          `${editorial.item.slug} has no ${editorial.item.section} section written`,
        );
      } else {
        assert.ok(editorial.item.slug, 'an article slot with no slug links nowhere');
      }
    } else {
      assert.ok(editorial.emptyReason, 'an empty slot must say why');
    }

    // The franchise game really is that series' game.
    const game = matchFranchiseGame(anime.item);
    if (game.item) {
      assert.ok(
        animeGames.some((g) => g.name === game.item.name),
        'the game slot returned something not in gaming-hub.ts',
      );
      const hay = game.item.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
      for (const word of (game.allMatched ?? [])) {
        assert.ok(hay.includes(word), `"${word}" is not in ${game.item.name}`);
      }
    } else {
      assert.ok(game.emptyReason, 'an empty game slot must say why');
    }
  }
}
assert.equal(filledAnime, checked, 'every mood must fill its anime slot from real guides');

// Titles with no licensed game must not borrow one.
for (const title of ['Death Note', 'Spy x Family', 'Haikyuu!!']) {
  const out = matchFranchiseGame({ slug: 'x', title, synopsis: '', genres: [] });
  assert.equal(out.item, null, `${title} must not be paired with someone else's game`);
}
// And the three that do have one must find it.
for (const [title, expected] of [
  ['Dragon Ball Z', 'DRAGON BALL: Sparking! ZERO'],
  ['Naruto', 'NARUTO X BORUTO Ultimate Ninja STORM CONNECTIONS'],
  ['One Piece', 'ONE PIECE ODYSSEY'],
]) {
  const out = matchFranchiseGame({ slug: 'x', title, synopsis: '', genres: [] });
  assert.equal(out.item?.name, expected, `${title} should pair with ${expected}`);
}

// No series to match against means no bundle, not a default one.
assert.equal(matchEditorial(null, 1).item, null);
assert.equal(matchFranchiseGame(null).item, null);
assert.equal(pickFrom([], 3), null);

// The catalog tag normalisation has to survive a round trip, or the game
// query silently matches nothing.
assert.deepEqual(gameTagsFor(['fantasy', 'horror']), ['Fantasy', 'Horror']);

console.log('Every bundle slot is genuinely related, or honestly empty: passed.');

/* ------------------------------------------------------------------ *
 * 3. Poll bars add up, and never claim a scope they do not have.
 * ------------------------------------------------------------------ */

for (const counts of [{ a: 1, b: 1, c: 1 }, { a: 2, b: 1 }, { a: 7, b: 11, c: 3 }, { a: 1 }]) {
  const ids = Object.keys(counts);
  const shares = percentages(counts, ids);
  const sum = ids.reduce((n, id) => n + shares[id], 0);
  // A bar chart that visibly does not add up is the fastest way to make a
  // real number look invented.
  assert.equal(sum, 100, `shares for ${JSON.stringify(counts)} sum to ${sum}`);
}
assert.deepEqual(percentages({}, ['a', 'b']), { a: 0, b: 0 });

assert.deepEqual(parseVotes(null), {});
assert.deepEqual(parseVotes('not json'), {});
assert.deepEqual(parseVotes('[1,2]'), {});
assert.deepEqual(parseVotes('{"p":"o","bad":3}'), { p: 'o' });

// A local tally must never present itself as global.
assert.equal(localTally('p', { p: 'a' }).scope, 'local');
assert.equal(localTally('p', {}).total, 0);

const pollSrc = readFileSync(new URL('../src/components/community-poll.tsx', import.meta.url), 'utf8');
assert.match(
  pollSrc,
  /tally\.scope === "global"/,
  'the caption must be derived from the tally scope, not hard-coded',
);
assert.match(pollSrc, /this browser only/, 'a local tally must say it is local');

console.log('Poll shares sum to 100 and are labelled for what they count: passed.');

/* ------------------------------------------------------------------ *
 * 4. Battle rank counts real actions and survives any stored value.
 * ------------------------------------------------------------------ */

assert.deepEqual(parseRank(null), { points: 0, actions: {} });
assert.deepEqual(parseRank('garbage'), { points: 0, actions: {} });
assert.deepEqual(parseRank('[1]'), { points: 0, actions: {} });
assert.deepEqual(parseRank('{"points":-5}'), { points: 0, actions: {} });
assert.equal(parseRank('{"points":12.7,"actions":{"vote":3}}').points, 12);
assert.deepEqual(parseRank('{"points":5,"actions":{"vote":"x"}}').actions, {});

let state = { points: 0, actions: {} };
state = award(state, 'deploy');
assert.equal(state.points, POINTS.deploy);
assert.equal(state.actions.deploy, 1);
assert.equal(bandFor(0).name, BANDS[0].name);
assert.ok(bandFor(1000).next === null, 'the top band has nothing after it');
// Promotion is what earns the boom, so it has to be detected exactly once.
assert.equal(crossesBand({ points: 9, actions: {} }, { points: 10, actions: {} }), true);
assert.equal(crossesBand({ points: 10, actions: {} }, { points: 11, actions: {} }), false);

// Reactions survive whatever is in storage, and stay bounded.
assert.deepEqual(parseReactions(null), { faces: {}, notes: {} });
assert.deepEqual(parseReactions('nope'), { faces: {}, notes: {} });
assert.deepEqual(parseReactions('[]'), { faces: {}, notes: {} });
assert.deepEqual(parseReactions('{"faces":{"t":{"x":"bad"}}}').faces, {});
assert.deepEqual(parseReactions('{"notes":{"t":[{"id":1}]}}').notes, {});
assert.equal(parseReactions('{"faces":{"t":{"🔥":3}}}').faces.t['🔥'], 3);

let rs = { faces: {}, notes: {} };
rs = addFace(rs, 'pack', '🔥');
rs = addFace(rs, 'pack', '🔥');
assert.equal(rs.faces.pack['🔥'], 2);
// Empty input must not create a note.
assert.equal(addNote(rs, 'pack', '   ').notes.pack, undefined);
for (let i = 0; i < MAX_NOTES + 5; i += 1) rs = addNote(rs, 'pack', `note ${i}`);
assert.equal(rs.notes.pack.length, MAX_NOTES, 'notes must stay bounded');
assert.ok(
  addNote(rs, 'pack', 'x'.repeat(500)).notes.pack[0].body.length <= MAX_NOTE_LEN,
  'a note must be truncated, not stored whole',
);

console.log('Battle rank and reactions are bounded and parse-safe: passed.');

/* ------------------------------------------------------------------ *
 * 5. The hype layer stays polite, and the wiring stays wired.
 * ------------------------------------------------------------------ */

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const hype = read('../src/lib/hype.ts');
// Silence until asked. A content site that makes noise at someone who did not
// ask is hostile, and browser autoplay policy agrees.
assert.match(hype, /if \(!soundEnabled\(\)\) return;/, 'play() must be silent by default');
assert.match(hype, /localStorage\.getItem\(SOUND_PREF_KEY\) === "on"/, 'sound is opt-in');
// Synthesised, not downloaded.
assert.doesNotMatch(hype, /\.mp3|\.wav|\.ogg|new Audio\(/, 'cues must be synthesised, not files');
assert.match(hype, /createOscillator/, 'cues are built from oscillators');
// Haptics are feature-detected: navigator.vibrate does not exist on iOS.
assert.match(hype, /typeof navigator\.vibrate === "function"/, 'vibrate must be detected');
assert.match(hype, /prefers-reduced-motion: reduce/, 'motion must respect the preference');

const burst = read('../src/components/particle-burst.tsx');
assert.match(burst, /if \(!motionAllowed\(\)\) return;/, 'the burst must obey reduced motion');
assert.match(burst, /pointer-events-none/, 'the overlay must never block a tap');

const route = read('../src/routes/matchmaker.tsx');
assert.match(route, /rel: "canonical", href: URL/);
assert.match(route, /<ParticleBurst/);
assert.match(route, /<CommunityPoll/);
assert.match(route, /<QuickReactions/);
assert.match(route, /role="progressbar"/, 'battle rank needs a real progress indicator');
assert.match(route, /min-h-11/, 'buttons need touch-sized targets');
// No leaderboard: there is no shared score store to build one from.
assert.doesNotMatch(route, /leaderboard.*top \d|rank #\d/i);

const footer = read('../src/components/site-footer.tsx');
assert.ok(footer.includes('"/matchmaker"'), 'the footer must link the Loadout');
const header = read('../src/components/site-header.tsx');
assert.ok(header.includes('"/matchmaker"'), 'the header must link the Loadout');
const sitemap = read('../src/lib/sitemap.ts');
assert.ok(sitemap.includes('"/matchmaker"'), 'the sitemap must list the Loadout');

// The optional migration must stay paste-safe in the SQL editor.
const sql = read('../supabase/setup-community-polls.sql');
// Comments stripped first: this file explains in prose why it avoids
// CONCURRENTLY, and matching the raw text flags its own explanation.
const sqlStatements = sql
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');
assert.doesNotMatch(
  sqlStatements,
  /CREATE INDEX CONCURRENTLY/i,
  'CREATE INDEX CONCURRENTLY cannot run inside the SQL editor transaction',
);
assert.match(sql, /drop policy if exists/i, 'policies must be re-runnable');
assert.match(sql, /create table if not exists/i);
assert.ok(existsSync(new URL('../src/lib/community-poll.ts', import.meta.url)));

console.log('Hype layer is opt-in and accessible; routing and migration are sound: passed.');
