import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { characters } from '../src/data/characters.ts';
import { QUIZ, QUIZ_TRAITS, scoreQuiz, traitsForAnswers, quizShareText } from '../src/lib/character-quiz.ts';
import { SHARE_TARGETS } from '../src/lib/share-targets.ts';
import {
  parseWatchlist, upsertEntry, removeEntry, toggleStatus, statusOf,
  countByStatus, encodeListParam, decodeListParam, MAX_ENTRIES,
} from '../src/lib/watchlist.ts';
import { merchForTitle, franchiseKeys } from '../src/lib/franchise-merch.ts';

/* ------------------------------------------------------------------ *
 * 1. The quiz answers with real data or not at all.
 *
 * The usual "which character are you" quiz is a lookup table someone
 * invented. This one scores against the personality traits our editors
 * wrote in characters.ts, so the result card can name the traits it
 * matched. That only holds while every trait the quiz awards is a real
 * one — a nice-sounding trait invented for an answer would score
 * against nothing and quietly skew every result.
 * ------------------------------------------------------------------ */

const realTraits = new Set(characters.flatMap((c) => c.personality));
const invented = QUIZ_TRAITS.filter((t) => !realTraits.has(t));
assert.deepEqual(invented, [], `quiz traits not present in characters.ts: ${invented.join(', ')}`);

// Every question must offer a real choice, and no option may be empty.
assert.ok(QUIZ.length >= 5, 'too few questions to discriminate');
for (const q of QUIZ) {
  assert.ok(q.options.length >= 3, `${q.id} needs at least three options`);
  const ids = new Set(q.options.map((o) => o.id));
  assert.equal(ids.size, q.options.length, `${q.id} has duplicate option ids`);
  for (const o of q.options) assert.ok(o.traits.length > 0, `${q.id}/${o.id} awards no traits`);
}

// No answers, no result — never a default character.
assert.equal(scoreQuiz({}), null);
assert.deepEqual(traitsForAnswers({}), []);
// An unknown option id is ignored rather than scored.
assert.deepEqual(traitsForAnswers({ [QUIZ[0].id]: 'not-an-option' }), []);

// A full set of answers must produce a match whose traits are really the
// character's, and the share line must state the basis.
const full = Object.fromEntries(QUIZ.map((q) => [q.id, q.options[0].id]));
const result = scoreQuiz(full);
assert.ok(result, 'a complete answer set should match someone');
assert.ok(result.matched.length > 0, 'a match with zero shared traits is not a match');
for (const trait of result.matched) {
  assert.ok(
    result.character.personality.includes(trait),
    `${result.character.name} does not actually carry "${trait}"`,
  );
}
assert.equal(result.outOf, result.character.personality.length);
assert.match(quizShareText(result), new RegExp(result.character.name));
assert.match(quizShareText(result), /of their \d+ traits/);

// Determinism: the same answers must always give the same character.
assert.equal(scoreQuiz(full).character.slug, scoreQuiz(full).character.slug);

// The quiz has to discriminate. One character winning nearly everything is
// a personality test in name only.
{
  const combos = [];
  const walk = (i, acc) => {
    if (i === QUIZ.length) return combos.push({ ...acc });
    for (const o of QUIZ[i].options) walk(i + 1, { ...acc, [QUIZ[i].id]: o.id });
  };
  walk(0, {});
  const winners = new Map();
  for (const c of combos) {
    const r = scoreQuiz(c);
    if (r) winners.set(r.character.slug, (winners.get(r.character.slug) ?? 0) + 1);
  }
  assert.ok(winners.size >= 12, `only ${winners.size} distinct results across ${combos.length} answer sets`);
  const top = Math.max(...winners.values()) / combos.length;
  assert.ok(top <= 0.25, `one character wins ${(top * 100).toFixed(1)}% of answer sets`);
}

console.log('Character quiz scores against real editorial traits, and discriminates: passed.');

/* ------------------------------------------------------------------ *
 * 2. Share links are links, not SDKs.
 * ------------------------------------------------------------------ */

const input = { url: 'https://gamecastle.store/gamer-card?picks=a,b', text: 'Ten & Twenty', image: 'https://gamecastle.store/x.png' };
for (const target of SHARE_TARGETS) {
  const href = target.build(input);
  assert.match(href, /^https:\/\//, `${target.id} must build an https link`);
  // The URL has to survive encoding: an unescaped & or ? silently truncates
  // the shared link at the first query separator.
  assert.ok(
    href.includes(encodeURIComponent(input.url)),
    `${target.id} does not encode the shared URL`,
  );
  assert.doesNotMatch(href, /undefined|null/, `${target.id} leaked an empty value into the link`);
}
// Pinterest is the only one taking an image, and it must omit it rather than
// pass an empty media parameter.
const pin = SHARE_TARGETS.find((t) => t.id === 'pinterest');
assert.doesNotMatch(pin.build({ url: input.url, text: 't' }), /media=/);
assert.match(pin.build(input), /media=/);

const shareBar = readFileSync(new URL('../src/components/share-bar.tsx', import.meta.url), 'utf8');
assert.doesNotMatch(
  shareBar,
  /platform\.twitter\.com|connect\.facebook\.net|assets\.pinterest\.com|redditstatic/,
  'share buttons must not load a third-party SDK',
);
assert.match(shareBar, /min-h-11/, 'share buttons need a touch-sized target');

console.log('Share targets build encoded intent links with no third-party SDK: passed.');

/* ------------------------------------------------------------------ *
 * 3. The watchlist survives whatever is in storage.
 * ------------------------------------------------------------------ */

assert.deepEqual(parseWatchlist(null), []);
assert.deepEqual(parseWatchlist('not json'), []);
assert.deepEqual(parseWatchlist('{"not":"an array"}'), []);
assert.deepEqual(parseWatchlist('[1,2,3]'), []);
// A half-valid list keeps the good rows and drops the bad ones.
assert.equal(
  parseWatchlist(JSON.stringify([
    { slug: 'naruto', title: 'Naruto', status: 'watching', addedAt: 1 },
    { slug: 'bad', status: 'watching', addedAt: 2 },
    { slug: 'x', title: 'X', status: 'not-a-status', addedAt: 3 },
  ])).length,
  1,
);
// Duplicates collapse.
assert.equal(
  parseWatchlist(JSON.stringify([
    { slug: 'a', title: 'A', status: 'watching', addedAt: 1 },
    { slug: 'a', title: 'A again', status: 'completed', addedAt: 2 },
  ])).length,
  1,
);

let list = [];
list = upsertEntry(list, { slug: 'a', title: 'A', status: 'watching' });
list = upsertEntry(list, { slug: 'b', title: 'B', status: 'completed' });
assert.equal(list.length, 2);
assert.equal(list[0].slug, 'b', 'newest entry comes first');
assert.equal(statusOf(list, 'a'), 'watching');
assert.equal(statusOf(list, 'missing'), null);
assert.equal(countByStatus(list, 'completed'), 1);

// Re-tapping the status a title already has removes it — the only undo a
// phone user has.
const toggled = toggleStatus(list, { slug: 'a', title: 'A' }, 'watching');
assert.equal(statusOf(toggled, 'a'), null);
// Tapping the OTHER status moves it rather than removing it.
const moved = toggleStatus(list, { slug: 'a', title: 'A' }, 'completed');
assert.equal(statusOf(moved, 'a'), 'completed');
assert.equal(removeEntry(list, 'b').length, 1);

// The list is bounded, so a runaway loop cannot fill a reader's storage.
let big = [];
for (let i = 0; i < MAX_ENTRIES + 50; i += 1) {
  big = upsertEntry(big, { slug: `s${i}`, title: `T${i}`, status: 'watching' });
}
assert.equal(big.length, MAX_ENTRIES);

// Share params only ever carry things that could be a real page.
assert.equal(encodeListParam([{ slug: 'one-piece', title: 'x', status: 'watching', addedAt: 1 }]), 'one-piece');
assert.equal(encodeListParam([{ slug: 'BAD SLUG', title: 'x', status: 'watching', addedAt: 1 }]), '');
assert.deepEqual(decodeListParam('one-piece,naruto'), ['one-piece', 'naruto']);
assert.deepEqual(decodeListParam('one-piece,one-piece'), ['one-piece']);
assert.deepEqual(decodeListParam("';drop table--"), []);
assert.deepEqual(decodeListParam(undefined), []);
assert.equal(decodeListParam(Array.from({ length: 200 }, (_, i) => `a${i}`).join(',')).length, 60);

console.log('Watchlist tolerates any stored value and bounds what it shares: passed.');

/* ------------------------------------------------------------------ *
 * 4. Related merchandise is related, or absent.
 *
 * The failure mode worth guarding is a Naruto page showing a Jujutsu
 * Kaisen figure under a heading that says Naruto. Empty beats wrong.
 * ------------------------------------------------------------------ */

for (const [title, expected] of [['Naruto', 'naruto'], ['Demon Slayer', 'demon slayer'], ['My Hero Academia', 'my hero academia']]) {
  const matches = merchForTitle([title]);
  assert.ok(matches.length > 0, `${title} should match real merchandise`);
  for (const m of matches) {
    const haystack = `${m.product.title} ${m.product.shortTitle} ${m.product.categories.join(' ')}`.toLowerCase();
    assert.ok(
      haystack.replace(/[^a-z0-9]+/g, ' ').includes(m.matchedOn),
      `${m.product.slug} was matched on "${m.matchedOn}" which is not in its own title`,
    );
    assert.equal(m.matchedOn, expected, `${title} matched on the wrong phrase`);
  }
}
// A series with no merchandise shows none rather than something else's.
for (const title of ['Frieren', 'Vinland Saga', 'Steins Gate']) {
  assert.deepEqual(merchForTitle([title]), [], `${title} must not borrow another franchise's products`);
}
// Short words are too generic to match on: "One" must not pull in One Punch
// Man, Ranking of Kings and half the catalog.
assert.ok(!franchiseKeys('One Piece').includes('one'));
assert.ok(franchiseKeys('One Piece').includes('one piece'));

console.log('Related merchandise matches the franchise by name, or shows nothing: passed.');

/* ------------------------------------------------------------------ *
 * 5. The wiring stays wired, and the shared views stay out of the index.
 * ------------------------------------------------------------------ */

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const detail = read('../src/routes/catalog.anime.$slug.tsx');
assert.match(detail, /<WatchlistButtons/, 'the anime page must render the watchlist buttons');
assert.match(detail, /<RelatedMerch/, 'the anime page must render the merchandise section');

const myList = read('../src/routes/my-list.tsx');
// A shared list is one reader's arbitrary slugs. Indexing those mints an
// unbounded set of near-identical pages competing with the tool itself.
assert.match(myList, /shared \? "noindex, follow" : "index, follow"/);
assert.match(myList, /rel: "canonical", href: URL/);

const quiz = read('../src/routes/character-quiz.tsx');
assert.match(quiz, /rel: "canonical", href: URL/);
assert.match(quiz, /role="progressbar"/, 'the quiz needs a real progress indicator');

const tool = read('../src/components/taste-card-tool.tsx');
assert.match(tool, /role="progressbar"/, 'the Taste Card needs a progress bar');
assert.match(tool, /<ShareBar/, 'the Taste Card needs the share row');

// Reachable without JavaScript, or they rank on their sitemap line alone.
const footer = read('../src/components/site-footer.tsx');
for (const path of ['/character-quiz', '/my-list']) {
  assert.ok(footer.includes(`"${path}"`), `the footer must link ${path}`);
}
const sitemap = read('../src/lib/sitemap.ts');
for (const path of ['/character-quiz', '/my-list']) {
  assert.ok(sitemap.includes(`"${path}"`), `the sitemap must list ${path}`);
}

assert.ok(existsSync(new URL('../src/lib/watchlist.ts', import.meta.url)));

console.log('Engagement features are mounted, crawlable, and shared views stay unindexed: passed.');
