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

console.log("Ingestion batch dedupe (entity_type + slug) checks passed.");
