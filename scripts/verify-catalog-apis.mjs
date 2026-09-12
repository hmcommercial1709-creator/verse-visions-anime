#!/usr/bin/env node
/**
 * Verifies the public catalog APIs against the schemas in
 * src/lib/catalog/*.ts. Run this from a machine with internet access:
 *
 *     node scripts/verify-catalog-apis.mjs
 *
 * It exists because the schemas were written from API documentation and
 * could not be checked against live responses in the build environment
 * (no outbound network). Until this passes, treat the catalog routes as
 * unverified — they are wired to fail closed (404) on a shape mismatch
 * rather than render a broken page, but a clean pass here is what proves
 * the field names are actually right.
 *
 * Exits non-zero if any check fails.
 */

const CHECKS = [
  {
    name: "FreeToGame — list",
    url: "https://www.freetogame.com/api/games",
    required: ["id", "title", "thumbnail", "short_description", "game_url", "genre", "platform", "publisher", "developer", "release_date"],
    pick: (json) => (Array.isArray(json) ? json[0] : null),
    note: (json) => `${Array.isArray(json) ? json.length : 0} games returned`,
  },
  {
    name: "FreeToGame — detail",
    url: "https://www.freetogame.com/api/game?id=540",
    required: ["id", "title", "thumbnail", "genre", "platform"],
    pick: (json) => json,
    note: (json) => `screenshots: ${Array.isArray(json?.screenshots) ? json.screenshots.length : "absent"}`,
  },
  {
    name: "Jikan — anime detail",
    url: "https://api.jikan.moe/v4/anime/1",
    required: ["mal_id", "url", "title", "images", "genres", "studios"],
    pick: (json) => json?.data,
    note: (json) => `title: ${json?.data?.title ?? "?"}`,
  },
  {
    name: "Jikan — top anime",
    url: "https://api.jikan.moe/v4/top/anime?page=1&limit=25",
    required: ["mal_id", "title", "images"],
    pick: (json) => (Array.isArray(json?.data) ? json.data[0] : null),
    note: (json) => `${json?.data?.length ?? 0} entries, last page ${json?.pagination?.last_visible_page ?? "?"}`,
  },
];

let failures = 0;

for (const check of CHECKS) {
  process.stdout.write(`\n▸ ${check.name}\n  ${check.url}\n`);
  try {
    const res = await fetch(check.url, {
      headers: { Accept: "application/json", "User-Agent": "GameCastle/1.0 (+https://gamecastle.store)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.log(`  ✗ HTTP ${res.status}`);
      failures++;
      continue;
    }
    const json = await res.json();
    const sample = check.pick(json);
    if (!sample || typeof sample !== "object") {
      console.log("  ✗ no usable record in response");
      failures++;
      continue;
    }
    const missing = check.required.filter((field) => !(field in sample));
    console.log(`  ${missing.length ? "✗" : "✓"} HTTP ${res.status} · ${check.note(json)}`);
    if (missing.length) {
      console.log(`  ✗ missing expected fields: ${missing.join(", ")}`);
      console.log(`    keys present: ${Object.keys(sample).join(", ")}`);
      failures++;
    }
  } catch (error) {
    console.log(`  ✗ ${error.message}`);
    failures++;
  }
  // Stay well inside Jikan's ~3 req/sec limit.
  await new Promise((r) => setTimeout(r, 1200));
}

console.log(
  failures === 0
    ? "\nAll catalog API schemas match live responses. Safe to enable the routes.\n"
    : `\n${failures} check(s) failed — update the zod schemas in src/lib/catalog/ before enabling the routes.\n`,
);
process.exit(failures === 0 ? 0 : 1);
