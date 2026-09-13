/**
 * Probing for public.entities.metadata, and deciding what to do without it.
 *
 * Two things were wrong with how this was done inline in each ingester.
 *
 * 1. The probe swallowed the error. `select("metadata")` failing was reported
 *    as "column MISSING" no matter why it failed — a network blip, a
 *    permissions problem, or PostgREST still serving a cached schema that
 *    predates the ALTER TABLE. The third is not hypothetical: PostgREST caches
 *    the schema and needs a reload notification after DDL, so a migration that
 *    was applied correctly can probe as absent for a few seconds afterwards.
 *    Reporting all three identically sends someone to re-apply a migration
 *    that is already applied.
 *
 * 2. Refusing to import at all when the column is absent was an
 *    over-correction of mine. Rows without metadata still carry name,
 *    description, image_url, categories and source_url — which is exactly the
 *    quality level the catalog had before the extras existed, and it is
 *    useful. Blocking the whole import leaves the catalog EMPTY, which is
 *    strictly worse than a catalog without the derived facts. "No extras" and
 *    "unacceptably thin" are not the same thing, and conflating them stopped
 *    the pipeline dead.
 *
 * So: a missing column now degrades — loudly, and with the exact SQL to fix
 * it — rather than stopping. --require-metadata remains for a caller that
 * genuinely wants all-or-nothing.
 */

const RELOAD_WAIT_MS = 4000;

/** PostgREST's codes for "that column is not in my schema". */
const MISSING_COLUMN_CODES = new Set(["PGRST204", "42703"]);

const namesTheColumn = (message = "", column) =>
  message.toLowerCase().includes(column.toLowerCase());

/**
 * Returns { present, absent, error } — three states, not two.
 *
 * `absent` means the database really does not have the column. `error` means
 * the probe could not answer, which is a different problem and must not be
 * silently treated as absence.
 */
export async function probeColumn(supabase, table, column, { log = console.log } = {}) {
  const attempt = async () => supabase.from(table).select(column).limit(1);

  let { error } = await attempt();
  if (!error) return { present: true, absent: false, error: null };

  const isMissing = MISSING_COLUMN_CODES.has(error.code) || namesTheColumn(error.message, column);

  if (isMissing) {
    // The stale-schema-cache case: the column exists, PostgREST has not
    // noticed yet. One retry costs four seconds and prevents sending someone
    // to re-run a migration they already ran.
    log(`  ${table}.${column} not visible; retrying in ${RELOAD_WAIT_MS / 1000}s in case`);
    log(`  PostgREST is still serving a schema cached from before the migration…`);
    await new Promise((r) => setTimeout(r, RELOAD_WAIT_MS));
    ({ error } = await attempt());
    if (!error) {
      log(`  ${table}.${column} is present after the retry (the cache had been stale).`);
      return { present: true, absent: false, error: null };
    }
    return { present: false, absent: true, error };
  }

  return { present: false, absent: false, error };
}

/**
 * Probes, reports, and says whether the caller may continue.
 *
 * Throws only for the two cases where continuing would be wrong: a probe that
 * could not answer at all, and an explicit --require-metadata.
 */
export async function resolveMetadataColumn(
  supabase,
  table,
  { requireMetadata = false, log = console.log } = {},
) {
  const result = await probeColumn(supabase, table, "metadata", { log });

  if (result.present) {
    log("metadata column present — extras and derived facts will be stored.");
    return true;
  }

  if (!result.absent) {
    // Not "the column is missing" — the probe itself failed. Guessing here
    // could mean skipping extras on a database that has the column, so the
    // run stops and says what actually happened.
    throw new Error(
      `Could not determine whether ${table}.metadata exists.\n` +
        `  ${result.error?.code ? `[${result.error.code}] ` : ""}${result.error?.message ?? "unknown error"}\n` +
        `This is not a missing column — it is a failed query. Check the service role\n` +
        `key and that ${table} is reachable, then re-run.`,
    );
  }

  const instructions =
    `public.${table} has no metadata column, so this run cannot store the extras\n` +
    `(characters, tags, relations) or the derived cross-catalog facts, and the\n` +
    `programmatic matrix will not be built.\n\n` +
    `To enable them, run this once in the Supabase SQL editor:\n\n` +
    `    alter table public.entities add column if not exists metadata jsonb;\n` +
    `    grant select (metadata) on public.entities to anon, authenticated;\n` +
    `    create index if not exists entities_metadata_gin\n` +
    `      on public.entities using gin (metadata jsonb_path_ops);\n` +
    `    notify pgrst, 'reload schema';\n`;

  if (requireMetadata) {
    throw new Error(`--require-metadata was set.\n\n${instructions}`);
  }

  log("");
  log("WARNING ─────────────────────────────────────────────────────────────");
  log(instructions);
  log("The catalog import itself continues: rows still carry name, description,");
  log("image, categories and source. That is the quality level the catalog had");
  log("before the extras existed, and it beats importing nothing at all.");
  log("──────────────────────────────────────────────────────────────────────");
  log("");

  // GitHub Actions surfaces this in the run summary, so a degraded run is
  // visible without reading the whole log.
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(
      `::warning title=Catalog extras skipped::public.${table} has no metadata column. ` +
        `Rows were imported, but characters, tags, relations, derived facts and the ` +
        `programmatic matrix were not. Apply the metadata migration to enable them.`,
    );
  }

  return false;
}

/* ------------------------------------------------------- optional columns */

/**
 * Which of these columns public.entities actually has.
 *
 * scripts/ingest-catalog.mjs has always treated `categories` and `updated_at`
 * as optional, probing before writing them. The AniList and Steam ingesters
 * did not carry that over and always sent `categories`, which is why a run
 * that had already fetched 5,000 titles, derived every fact and passed 4,571
 * through the quality gate then failed on:
 *
 *     Could not find the 'categories' column of 'entities' in the schema cache
 *
 * PostgREST rejects the whole request for one unknown key rather than
 * ignoring it, so a single absent column loses the entire batch. Probing once
 * and stripping what is not there costs three queries and makes the write
 * work against whatever shape the table is in.
 */
export async function resolveOptionalColumns(supabase, table, columns, { log = console.log } = {}) {
  const present = new Set();
  const missing = [];

  for (const column of columns) {
    const result = await probeColumn(supabase, table, column, { log: () => {} });
    if (result.present) {
      present.add(column);
    } else if (result.absent) {
      missing.push(column);
    } else {
      throw new Error(
        `Could not determine whether ${table}.${column} exists.\n` +
          `  ${result.error?.code ? `[${result.error.code}] ` : ""}${result.error?.message ?? "unknown error"}`,
      );
    }
  }

  log(`Optional columns present: ${[...present].join(", ") || "none"}`);
  if (missing.length)
    log(`Optional columns MISSING (values will not be written): ${missing.join(", ")}`);
  return { present, missing };
}

/** Drops keys the table does not have, so PostgREST never sees an unknown one. */
export function stripAbsentColumns(rows, optionalColumns, present) {
  for (const row of rows) {
    for (const column of optionalColumns) {
      if (!present.has(column)) delete row[column];
    }
  }
  return rows;
}
