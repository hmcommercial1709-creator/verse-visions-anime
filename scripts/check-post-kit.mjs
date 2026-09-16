import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { publishedArticleList, articleTags } from "@/data/articles";
import {
  POST_LIMITS,
  POST_PLATFORMS,
  clamp,
  draftFor,
  hashtag,
  isPosted,
  nextUnposted,
  parsePostLog,
  togglePosted,
} from "@/lib/post-kit";

/**
 * Exercises the post kit against every real article, rather than matching
 * source text.
 *
 * The Pinterest guard this replaces asserted that certain WORDS appeared in a
 * file, and passed happily against the comments describing the code after the
 * code itself was deleted. Running the thing cannot be fooled that way: these
 * build every caption for every page on every platform and check the results.
 *
 * Runs under tsx so it can import the site's own TypeScript data and the
 * library under test. Plain node cannot resolve the @/ alias.
 */

const SITE = "https://gamecastle.store";

const sources = publishedArticleList().map((article) => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  url: `${SITE}/article/${article.slug}`,
  image: article.ogImage?.startsWith("http")
    ? article.ogImage
    : article.ogImage
      ? `${SITE}${article.ogImage}`
      : undefined,
  tags: articleTags(article),
}));

assert.ok(sources.length > 0, "there must be published pages to promote");

const words = (text) => text.toLowerCase().match(/\p{L}[\p{L}\p{N}'’]*/gu) ?? [];

let checked = 0;
let pinnable = 0;

for (const source of sources) {
  // Everything a caption is allowed to say, drawn from the article itself.
  const vocabulary = new Set(words(`${source.title} ${source.excerpt} ${source.tags.join(" ")}`));

  for (const platform of POST_PLATFORMS) {
    const draft = draftFor(platform, source);
    const where = `${platform} / ${source.slug}`;

    /* --- 1. It fits. ------------------------------------------------- */

    assert.ok(draft.text.length > 0, `${where}: a caption must not be empty`);
    assert.equal(draft.length, draft.text.length, `${where}: reported length must be the real one`);
    assert.ok(
      draft.text.length <= draft.limit,
      `${where}: ${draft.text.length} characters exceeds the ${draft.limit} limit`,
    );

    // X counts every link as 23 characters however long it is, so a caption
    // that fits on its own can still be rejected once the URL is attached.
    if (platform === "x") {
      assert.ok(
        draft.text.length + 23 <= POST_LIMITS.x,
        `${where}: ${draft.text.length} + 23 for the link exceeds 280`,
      );
    }


    /* --- 2. It says nothing the article does not. --------------------- *
     *
     * The standing rule on this site is that nothing is invented. A caption
     * template that added "the best guide on the internet" would pass every
     * length check above and still be a fabrication, so every word is
     * checked against the article's own title, excerpt and tags.
     */

    // Every hashtag must be the hashtag of a tag this article actually
    // carries — checked by equality rather than by taking the caption apart,
    // because reversing "#HunterXHunter" into words guesses where the joins
    // were and reads "XHunter" as a word nobody wrote.
    const allowed = new Set(source.tags.map(hashtag).filter(Boolean));
    for (const tag of draft.text.match(/#\S+/g) ?? []) {
      assert.ok(allowed.has(tag), `${where}: ${tag} is not a tag on this article`);
    }

    const spoken = draft.text.replace(/https?:\/\/\S+/g, " ").replace(/#\S+/g, " ");

    for (const word of words(spoken)) {
      assert.ok(
        vocabulary.has(word),
        `${where}: caption says "${word}", which is in neither the title, the excerpt nor the tags`,
      );
    }

    /* --- 3. The composer is a real, tokenless endpoint. --------------- */

    const composer = new URL(draft.composer);
    assert.equal(composer.protocol, "https:", `${where}: a composer must be https`);
    assert.ok(
      composer.searchParams.toString().length > 0,
      `${where}: the composer must carry the post, not just open the site`,
    );
    assert.ok(
      draft.composer.includes(encodeURIComponent(source.url)) ||
        composer.searchParams.get("text")?.includes(source.url),
      `${where}: the composer must carry the page URL, or the post links nowhere`,
    );
    // The whole point of this replacement: no credential can be revoked.
    assert.doesNotMatch(
      draft.composer,
      /access_token|api_key|[?&]token=/i,
      `${where}: a composer URL must need no credential`,
    );

    checked += 1;
  }

  /* --- 4. Pinterest carries the image when there is one. ------------- */

  const pin = draftFor("pinterest", source);
  if (source.image) {
    pinnable += 1;
    assert.ok(
      pin.composer.includes(`media=${encodeURIComponent(source.image)}`),
      `${source.slug}: a page with an image must pass it to Pinterest`,
    );
    assert.equal(pin.caveat, undefined, `${source.slug}: an illustrated page needs no caveat`);
  } else {
    // Honest about the gap rather than silently posting an imageless pin.
    assert.ok(pin.caveat, `${source.slug}: a page with no image must say so`);
    assert.doesNotMatch(pin.composer, /media=/, `${source.slug}: media= must not be sent empty`);
  }
}

/* --- 1b. The limits are ENFORCED, not merely unreached. --------------
 *
 * Measured: the longest title in the catalogue is 105 characters and the
 * longest excerpt 199, so the longest Pinterest caption is 334 of its 500.
 * Nothing is ever truncated by real data, which means deleting the clamp
 * entirely would not fail one assertion above — the check would be theatre.
 * This fixture is deliberately far past every limit, so the trimming is
 * exercised rather than assumed.
 */

const oversized = {
  slug: "oversized-fixture",
  title: Array(120).fill("Nen").join(" "),
  excerpt: Array(300).fill("science").join(" "),
  url: `${SITE}/article/oversized-fixture`,
  image: `${SITE}/media/fixture.webp`,
  tags: ["science", "nen"],
};

for (const platform of POST_PLATFORMS) {
  const draft = draftFor(platform, oversized);
  assert.ok(
    draft.text.length <= draft.limit,
    `oversized / ${platform}: ${draft.text.length} characters survived a ${draft.limit} limit`,
  );
  if (platform === "x") {
    assert.ok(draft.text.length + 23 <= POST_LIMITS.x, "oversized / x: overflows once the link is counted");
  }
}

// And the trim keeps whole words: a caption that ends "Hunter x Hunt…" reads
// as a typo, so clamp drops the partial word rather than slicing through it.
const sentence = "Nen types vows and abilities explained in full";
const originalWords = sentence.split(" ");

// Every length, not one. A single chosen limit can land exactly on a space,
// where even a clamp that slices through words happens to produce a clean
// result — which is precisely how the first version of this check passed
// against a deliberately broken clamp.
for (let max = 8; max <= sentence.length; max += 1) {
  const cut = clamp(sentence, max);
  assert.ok(cut.length <= max, `clamp(${max}) returned ${cut.length} characters`);
  if (cut === sentence) continue;
  assert.ok(cut.endsWith("…"), `clamp(${max}) trimmed without saying so`);
  const kept = cut.slice(0, -1).trimEnd();
  const keptWords = kept ? kept.split(" ") : [];
  assert.deepEqual(
    keptWords,
    originalWords.slice(0, keptWords.length),
    `clamp(${max}) produced "${kept}", which cuts through a word`,
  );
}

assert.equal(clamp(sentence, sentence.length), sentence, "text that fits must come back untouched");

console.log(`  ${checked} captions built across ${sources.length} pages and ${POST_PLATFORMS.length} platforms`);
console.log(`  ${pinnable} of ${sources.length} pages carry an image Pinterest can pin directly`);

/* --- 5. Hashtags are built from the tag, not invented. --------------- */

assert.equal(hashtag("dr-stone"), "#DrStone", "a hyphenated tag must become one hashtag");
assert.equal(hashtag("science"), "#Science");
assert.equal(hashtag("!!!"), "", "a tag with no letters produces no hashtag");

/* --- 6. The posting log survives whatever is in storage. ------------- */

assert.deepEqual(parsePostLog(null), {}, "absent storage must read as an empty log");
assert.deepEqual(parsePostLog("not json"), {}, "corrupt storage must not throw");
assert.deepEqual(parsePostLog('"a string"'), {}, "a non-object must not become a log");
assert.deepEqual(parsePostLog('{"pinterest":[1,"ok",null]}'), { pinterest: ["ok"] });

const first = sources[0].slug;
let log = {};
assert.equal(isPosted(log, "pinterest", first), false);
log = togglePosted(log, "pinterest", first);
assert.equal(isPosted(log, "pinterest", first), true, "marking a page posted must stick");
assert.equal(
  isPosted(log, "facebook", first),
  false,
  "platforms must be tracked separately, or one post hides the page everywhere",
);
assert.notEqual(
  nextUnposted(log, "pinterest", sources)?.slug,
  first,
  "the next page must skip what is already posted",
);
assert.equal(
  nextUnposted(log, "facebook", sources)?.slug,
  sources[0].slug,
  "an untouched platform must start at the first page",
);
// Marking a page on one platform must not carry it onto another. Reading the
// log as one flat set passes every assertion above and still leaks: the leak
// only shows on the SECOND platform written.
const second = sources[1].slug;
const mixed = togglePosted(togglePosted({}, "pinterest", first), "facebook", second);
assert.deepEqual(mixed.facebook, [second], "a platform must hold only its own posts");
assert.deepEqual(mixed.pinterest, [first], "writing one platform must not rewrite another");

log = togglePosted(log, "pinterest", first);
assert.equal(isPosted(log, "pinterest", first), false, "marking twice must undo");

const everything = sources.reduce((acc, s) => togglePosted(acc, "telegram", s.slug), {});
assert.equal(
  nextUnposted(everything, "telegram", sources),
  null,
  "a finished platform must report nothing left rather than repeat",
);

/* --- 7. The token-based auto-posters stay removed. ------------------- *
 *
 * Both failed on an approval outside this repository — Pinterest's app review
 * and Telegram's bot activation — and neither could report it. The Pinterest
 * job went red on every schedule; the Telegram one printed "Published
 * successfully" without reading the API's response at all, so 87 green ticks
 * proved nothing. The Telegram script also picked a promotional headline at
 * random from a hardcoded list and attached it to whatever page it scraped,
 * captioning a chemistry explainer as a wallpaper post, and fell back to a
 * stock photo from someone else's library. That is the fabrication this site
 * does not ship.
 */

for (const path of [
  "../scripts/pinterest-auto-poster.py",
  "../scripts/build-pinterest-queue.mjs",
  "../.github/workflows/pinterest.yml",
  "../auto_publisher.py",
  "../.github/workflows/telegram_auto.yml",
]) {
  assert.ok(
    !existsSync(new URL(path, import.meta.url)),
    `${path} is back: it cannot publish, and it cannot report that it did not`,
  );
}

console.log("Post kit: every caption fits, says only what the page says, and needs no token.");
