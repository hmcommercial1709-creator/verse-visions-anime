/**
 * Content validation script.
 *
 *   bun run scripts/validate-content.ts
 *
 * Verifies referential integrity across the content registry and
 * reports duplicate slugs, missing references, duplicate episodes,
 * and other structural problems that would create broken pages or
 * empty rails at runtime.
 *
 * Exits with code 1 when any error-level issue is found so it can be
 * wired into CI later.
 */

import { validateReferences, contentStats } from "../src/lib/content-registry";

function main() {
  const issues = validateReferences();
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  const stats = contentStats();

  console.log("GameCastle Anime — content validation report");
  console.log("======================================\n");
  console.log("Stats:");
  console.log(JSON.stringify(stats, null, 2));
  console.log("");

  if (warns.length) {
    console.log(`Warnings (${warns.length}):`);
    for (const w of warns) console.log(`  - [${w.kind}] ${w.message}`);
    console.log("");
  }

  if (errors.length) {
    console.log(`Errors (${errors.length}):`);
    for (const e of errors) console.log(`  - [${e.kind}] ${e.message}`);
    console.log("");
    console.error("Content validation FAILED.");
    process.exit(1);
  }

  console.log(`Content validation passed. (${warns.length} warning(s), 0 error(s))`);
}

main();
