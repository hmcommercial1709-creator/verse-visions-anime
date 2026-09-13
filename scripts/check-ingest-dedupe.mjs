#!/usr/bin/env node
/**
 * Guards the batch dedupe in scripts/ingest-catalog.mjs.
 *
 * Postgres raises 21000 — "ON CONFLICT DO UPDATE command cannot affect row a
 * second time" — when one INSERT ... ON CONFLICT carries the same conflict key
 * twice, because it will not update a single row twice in one command. The
 * ingester hits this for real: Jikan's paginated /top/anime can return the same
 * mal_id on two different pages when the ranking shifts between requests.
 *
 * These assertions pin the two properties that keep that from recurring: the
 * key matches the ON CONFLICT target (entity_type, slug), and a batch handed to
 * the database never repeats one.
 */
import assert from "node:assert/strict";
import { rowKey, dedupeByKey } from "./ingest-catalog.mjs";

const row = (entity_type, slug, name) => ({ entity_type, slug, name });

// The key must match CONFLICT_TARGET, or dedupe collapses the wrong rows.
assert.equal(rowKey(row("anime", "21-one-piece", "One Piece")), "anime::21-one-piece");

// The batch that produced 21000: the same mal_id returned on two pages.
const repeated = [
  row("anime", "1535-death-note", "Death Note"),
  row("anime", "21-one-piece", "One Piece"),
  row("anime", "1535-death-note", "Death Note (v2)"),
];
const deduped = dedupeByKey(repeated);
assert.equal(deduped.length, 2);
assert.equal(new Set(deduped.map(rowKey)).size, deduped.length, "batch still repeats a key");

// Last occurrence wins, so the freshest payload from upstream is the one kept.
assert.equal(deduped.find((r) => r.slug === "1535-death-note").name, "Death Note (v2)");

// Surviving rows keep their first-seen order, so the resume cursor stays honest.
assert.deepEqual(
  deduped.map((r) => r.slug),
  ["1535-death-note", "21-one-piece"],
);

// Scoping by entity_type is load-bearing: Jikan (mal_id) and FreeToGame (id)
// both issue small integers, so the same slug legitimately arises from each.
assert.equal(dedupeByKey([row("anime", "21-x", "a"), row("game", "21-x", "g")]).length, 2);

// Degenerate inputs.
assert.deepEqual(dedupeByKey([]), []);
assert.equal(dedupeByKey([row("anime", "a", "A"), row("anime", "b", "B")]).length, 2);

/* ------------------------------------------------- verify-catalog-data.mjs */

// The verifier reports on the same key. Its scan must agree with the dedupe
// above, or the two could disagree about whether the catalog is clean.
const { findDuplicates, summarise } = await import("./verify-catalog-data.mjs");

assert.deepEqual(findDuplicates([]), []);
assert.deepEqual(findDuplicates([row("anime", "a"), row("anime", "b")]), []);

// The same slug under two entity_types is not a duplicate, matching dedupeByKey.
assert.deepEqual(findDuplicates([row("anime", "21-x"), row("game", "21-x")]), []);

const dupes = findDuplicates([
  row("anime", "a"),
  row("anime", "a"),
  row("anime", "a"),
  row("game", "b"),
  row("game", "b"),
]);
assert.deepEqual(dupes, [
  { key: "anime::a", count: 3 },
  { key: "game::b", count: 2 },
]);

// A batch dedupeByKey has collapsed must leave the verifier nothing to report.
assert.deepEqual(findDuplicates(dedupeByKey(repeated)), []);

const tally = summarise([
  { entity_type: "anime", status: "active" },
  { entity_type: "anime", status: "incomplete" },
  { entity_type: "anime", status: "draft" },
  { entity_type: "game", status: "active" },
]);
assert.deepEqual(tally.get("anime"), { total: 3, active: 1, incomplete: 1, other: 1 });
assert.deepEqual(tally.get("game"), { total: 1, active: 1, incomplete: 0, other: 0 });

/* ------------------------------------------------ catalog-quality-gate.mjs */

// The gate decides what the public sees, so it is pinned here rather than
// trusted to stay correct while two scripts import it.
const { incompletenessReasons, MIN_SUMMARY_CHARS } = await import("./catalog-quality-gate.mjs");

const summary = "x".repeat(MIN_SUMMARY_CHARS);
const complete = {
  slug: "1-a",
  name: "A Series",
  description: summary,
  image_url: "https://cdn.example.com/a.jpg",
  categories: ["Action"],
};
assert.deepEqual(incompletenessReasons(complete), []);

// Each rule fires on its own, and only its own.
assert.deepEqual(incompletenessReasons({ ...complete, slug: "" }), ["missing slug"]);
assert.deepEqual(incompletenessReasons({ ...complete, name: "   " }), ["missing name"]);
assert.deepEqual(incompletenessReasons({ ...complete, categories: [] }), ["no categories"]);
assert.deepEqual(incompletenessReasons({ ...complete, image_url: null }), ["missing image"]);

// A non-http image is not an image: protocol-relative and javascript: URLs
// must not count as present.
assert.deepEqual(incompletenessReasons({ ...complete, image_url: "//cdn/a.jpg" }), [
  "missing image",
]);
assert.deepEqual(incompletenessReasons({ ...complete, image_url: "javascript:alert(1)" }), [
  "missing image",
]);

// The summary boundary is inclusive at MIN_SUMMARY_CHARS, and whitespace does
// not pad a short summary past it.
assert.deepEqual(incompletenessReasons({ ...complete, description: summary.slice(1) }), [
  `summary under ${MIN_SUMMARY_CHARS} chars`,
]);
assert.deepEqual(incompletenessReasons({ ...complete, description: `  ${summary.slice(2)}   ` }), [
  `summary under ${MIN_SUMMARY_CHARS} chars`,
]);

// checkCategories:false is what the verifier passes, because the column is
// optional and a rule it cannot evaluate must not be reported as a failure.
assert.deepEqual(incompletenessReasons({ ...complete, categories: undefined }), ["no categories"]);
assert.deepEqual(
  incompletenessReasons({ ...complete, categories: undefined }, { checkCategories: false }),
  [],
);
// Opting out of categories must not silence any other rule.
assert.deepEqual(
  incompletenessReasons({ ...complete, image_url: null }, { checkCategories: false }),
  ["missing image"],
);

// Several gaps are all reported, so one run shows the whole picture.
assert.deepEqual(
  incompletenessReasons({ slug: "1-a", name: "", description: "", image_url: "", categories: [] }),
  ["missing name", `summary under ${MIN_SUMMARY_CHARS} chars`, "missing image", "no categories"],
);

console.log("Ingestion batch dedupe (entity_type + slug) checks passed.");
console.log("Catalog verification helpers (duplicate scan, inventory) checks passed.");
console.log("Shared quality gate checks passed.");
