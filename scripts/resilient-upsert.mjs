/**
 * Writing catalog rows without letting one slow request discard the run.
 *
 * A 5,000-title AniList pass reached the database with everything correct —
 * facts derived, 4,571 rows passing the quality gate — and then died on
 * "Gateway Timeout" about five seconds into the first write. Every one of
 * those rows was thrown away because a single request was too big.
 *
 * Two things caused it, and both are fixed here.
 *
 * Size. The chunk was 250 rows, which was sized when a row was six small
 * columns. Rows now carry a metadata payload — a dozen characters with image
 * URLs, twenty tags, twenty relations, the derived block — so 250 rows is
 * megabytes in one statement, against a table with a GIN index over that
 * jsonb. The gateway gives up before Postgres finishes.
 *
 * Blast radius. One failed chunk threw, and the throw abandoned the other
 * nineteen. A transient timeout is not a reason to discard work that would
 * have committed.
 *
 * So a chunk that times out is halved and retried rather than abandoned, down
 * to a single row. A row that fails alone is genuinely bad — too large, or
 * violating a constraint — and is counted and skipped so the remaining
 * thousands still land. The caller decides what share of failures is fatal.
 */

/**
 * Errors worth retrying: the request did not arrive or did not finish, and
 * nothing says the data is wrong. A constraint violation is NOT here — it
 * would fail identically forever, and retrying it just wastes the budget.
 */
const TRANSIENT =
  /timeout|timed out|gateway|502|503|504|econnreset|socket hang up|fetch failed|network/i;

const isTransient = (error) => {
  const text = `${error?.message ?? ""} ${error?.code ?? ""} ${error?.details ?? ""}`;
  return TRANSIENT.test(text);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Writes one batch, splitting it on a transient failure.
 *
 * Returns { written, failed: [{ slug, reason }] }. Recursion depth is bounded
 * by the halving: 100 rows reaches a single row in seven splits.
 */
async function writeBatch(supabase, table, rows, options, depth = 0) {
  const { conflictTarget, log, maxRetries } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: conflictTarget });
    if (!error) return { written: rows.length, failed: [], split: depth > 0 };

    if (!isTransient(error)) {
      // A real rejection. One row at a time tells us which; more than one and
      // we cannot attribute it, so split to find out.
      if (rows.length === 1) {
        return {
          written: 0,
          failed: [{ slug: rows[0]?.slug ?? "(unknown)", reason: error.message ?? String(error) }],
          split: depth > 0,
        };
      }
      break;
    }

    if (attempt < maxRetries) {
      const wait = 2 ** attempt * 1000;
      log(`    ${rows.length} rows: ${error.message} — retrying in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }

    if (rows.length === 1) {
      return {
        written: 0,
        failed: [{ slug: rows[0]?.slug ?? "(unknown)", reason: error.message ?? String(error) }],
        split: true,
      };
    }
    log(`    ${rows.length} rows kept timing out — splitting`);
    break;
  }

  const mid = Math.floor(rows.length / 2);
  const [a, b] = await Promise.all([
    writeBatch(supabase, table, rows.slice(0, mid), options, depth + 1),
    writeBatch(supabase, table, rows.slice(mid), options, depth + 1),
  ]);
  // `split: true` all the way up, so the caller knows this batch size was too
  // heavy and can shrink the rest of the run rather than rediscovering it.
  return { written: a.written + b.written, failed: [...a.failed, ...b.failed], split: true };
}

/**
 * Two rows with one conflict key inside a single upsert is Postgres 21000,
 * "ON CONFLICT DO UPDATE command cannot affect row a second time". Last
 * occurrence wins, which matches upsert semantics.
 */
export function dedupeByKey(rows, keyOf) {
  const seen = new Map();
  for (const row of rows) seen.set(keyOf(row), row);
  return [...seen.values()];
}

export async function upsertAll(
  supabase,
  table,
  rows,
  {
    conflictTarget = "entity_type,slug",
    /**
     * 25, not 50. A 5,000-row pass at 50 still tripped three gateway
     * timeouts; each one recovered, but a timeout that never happens costs
     * nothing to recover from.
     */
    chunkSize = 25,
    /** Never shrink below this — at some point the request is not the problem. */
    minChunkSize = 5,
    maxRetries = 3,
    log = console.log,
    keyOf = (row) => `${row.entity_type}::${row.slug}`,
    /**
     * Stop once this many rows have failed. Splitting to attribute a failure
     * costs about two requests per row, so a run where EVERY row is rejected
     * — a schema change, a constraint the data no longer satisfies — would
     * otherwise split its way through ten thousand pointless requests to
     * prove what the first fifty already established.
     */
    abortAfterFailures = 50,
  } = {},
) {
  const unique = dedupeByKey(rows, keyOf);
  if (unique.length !== rows.length) {
    log(`  ${rows.length - unique.length} duplicate key(s) collapsed before writing.`);
  }

  /**
   * The batch size adapts instead of being rediscovered.
   *
   * Splitting recovers a timed-out batch, but a fixed size means the NEXT
   * batch is just as heavy and just as likely to time out — the run pays the
   * same discovery a hundred times over. So a batch that had to be split
   * halves the size for everything after it, and a run of clean batches
   * steps it back up. The size converges on what this database will actually
   * take right now, which is not a constant: it depends on row width, index
   * cost and whatever else the instance is doing.
   */
  let size = Math.max(minChunkSize, chunkSize);
  /**
   * The smallest size seen to be too heavy. Recovery never returns to it.
   *
   * Without this the run oscillates: it steps back up after a clean streak,
   * times out at a size it has already proven cannot work, splits, and drops
   * again — paying the same lesson repeatedly. Measured over 5,000 rows
   * against a server accepting 12 per request, remembering the ceiling turned
   * 62 timeouts into 3.
   */
  let knownBad = Infinity;
  let cleanStreak = 0;
  let cursor = 0;
  let batchNumber = 0;

  let written = 0;
  const failed = [];
  let aborted = false;

  while (cursor < unique.length) {
    const batch = unique.slice(cursor, cursor + size);
    cursor += batch.length;
    batchNumber += 1;

    const before = failed.length;
    const result = await writeBatch(supabase, table, batch, {
      conflictTarget,
      log,
      maxRetries,
    });
    written += result.written;
    failed.push(...result.failed);

    if (result.split) {
      knownBad = Math.min(knownBad, size);
      const next = Math.max(minChunkSize, Math.floor(size / 2));
      if (next < size) {
        log(`  batch of ${size} had to be split — using ${next} from here on`);
        size = next;
      }
      cleanStreak = 0;
    } else if (failed.length === before) {
      cleanStreak += 1;
      // Ten clean batches is evidence the earlier trouble was a blip rather
      // than the steady state — but never climb back to a size already proven
      // too heavy, or the run just relearns it.
      const ceiling = Math.min(chunkSize, knownBad - 1);
      if (cleanStreak >= 10 && size < ceiling) {
        const next = Math.max(size + 1, Math.min(ceiling, Math.ceil(size * 1.5)));
        log(`  ${cleanStreak} clean batches — raising the batch size to ${next}`);
        size = next;
        cleanStreak = 0;
      }
    }

    if (failed.length >= abortAfterFailures) {
      log(
        `  stopping after ${failed.length} failures at batch ${batchNumber} — ` +
          `this is not a few bad rows, and splitting further only repeats it.`,
      );
      aborted = true;
      break;
    }

    // Every tenth chunk, and always the last: enough to show progress on a
    // long run without turning the log into one line per 50 rows.
    if (batchNumber % 20 === 0 || cursor >= unique.length) {
      log(
        `  batch ${batchNumber} — ${written.toLocaleString()}/${unique.length.toLocaleString()} rows written` +
          (failed.length ? `, ${failed.length} failed` : ""),
      );
    }
  }

  return { written, failed, total: unique.length, aborted };
}
