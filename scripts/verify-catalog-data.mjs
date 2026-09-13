#!/usr/bin/env node
/**
 * Operational verification for the catalog in public.entities.
 *
 *   npm run verify:catalog              # full check, includes a write probe
 *   npm run verify:catalog -- --read-only   # never writes
 *   npm run verify:catalog -- --sample=5000 # cap the duplicate scan
 *
 * Runs in order, stopping early only when the connection itself is unusable:
 *
 *   1. Is the connection configured and the table reachable?
 *   2. Does the (entity_type, slug) unique index actually exist? Without it
 *      the ingester silently degrades to read-then-write, which races.
 *   3. Are there duplicate (entity_type, slug) pairs in the table today?
 *      The scan pages through every row — a single request is capped
 *      server-side, so a one-shot read would report a false "zero".
 *   4. Inventory: exact totals per entity_type and status.
 *   5. Do rows marked 'active' still satisfy the quality gate? Re-tested
 *      against the same rules the ingester applied, so drift surfaces here
 *      rather than as thin content on the live site. Bounded sample.
 *   6. Does an ingestion batch containing a known duplicate still land as
 *      exactly one row? (the write probe — skipped by --read-only)
 *   7. Does the publishable key see active rows and not incomplete ones?
 *      This is what visitors and Googlebot get.
 *
 * Checks 2 and 6 need the service role key and report as skipped without it.
 * A failure never stops the remaining checks, so one run reports everything
 * that is wrong rather than only the first problem.
 *
 * Config comes from the environment, falling back to .env in the repo root,
 * exactly as scripts/ingest-catalog.mjs resolves it. Reads need only the
 * publishable key; the write probe and the index check need the service role
 * key, and are reported as skipped rather than failed when it is absent.
 *
 * Exit code is 0 only when every check that ran passed.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

let createClient;
try {
  ({ createClient } = await import("@supabase/supabase-js"));
} catch (error) {
  if (error?.code === "ERR_MODULE_NOT_FOUND") {
    console.error(
      "\nCannot load @supabase/supabase-js. Install dependencies from the repo root:\n" +
        "    npm install\n",
    );
    process.exit(1);
  }
  throw error;
}

/* ----------------------------------------------------------- configuration */

const TABLE = "entities";
const KEY_COLUMNS = ["entity_type", "slug"];
const MIN_SUMMARY_CHARS = 120; // must match scripts/ingest-catalog.mjs
const PAGE_SIZE = 1000; // PostgREST caps a single response; page through it
const SENTINEL_TYPE = "__verify_probe__";

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const READ_ONLY = args.has("read-only");
const SAMPLE_LIMIT = Number(args.get("sample") ?? 0) || Infinity;

const DEFAULT_SUPABASE_URL = "https://saddhtpsomxtazrgeyed.supabase.co";

/**
 * Minimal .env loader, resolved relative to this file rather than the working
 * directory so it finds the repo's .env wherever the script is invoked from.
 * Existing environment variables always win.
 */
function loadDotEnv() {
  let text;
  try {
    text = readFileSync(new URL("../.env", import.meta.url), "utf8");
  } catch {
    return false;
  }
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    let value = match[2].trim().replace(/\s+#.*$/, "");
    if (/^(".*"|'.*')$/s.test(value)) value = value.slice(1, -1);
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
  return true;
}

const resolveUrl = () =>
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;

/** Never print a key. Shape alone is enough to diagnose the usual mix-ups. */
function describeKey(key) {
  if (!key) return "absent";
  if (key.startsWith("sb_secret_")) return "service role (sb_secret_…)";
  if (key.startsWith("sb_publishable_")) return "publishable (sb_publishable_…)";
  if (key.startsWith("eyJ")) return "legacy JWT (eyJ…)";
  return "unrecognised prefix";
}

/* ------------------------------------------------------------------ report */

const results = [];
const log = (...m) => console.log(...m);

function record(status, name, detail) {
  results.push({ status, name, detail });
  const mark = { pass: "  ok  ", fail: " FAIL ", warn: " warn ", skip: " skip " }[status];
  log(`[${mark}] ${name}`);
  if (detail) for (const line of String(detail).split("\n")) log(`          ${line}`);
}

const pass = (n, d) => record("pass", n, d);
const fail = (n, d) => record("fail", n, d);
const warn = (n, d) => record("warn", n, d);
const skip = (n, d) => record("skip", n, d);

/* ------------------------------------------------------------------ checks */

/**
 * Reads every (entity_type, slug, status) triple, paging past the PostgREST
 * row cap — a single request is capped server-side (1000 by default), so a
 * one-shot read would silently scan only the first page and report a false
 * "zero duplicates". Status rides along so the inventory is exact without
 * costing another round trip.
 */
async function fetchKeyPairs(client) {
  const rows = [];
  for (let from = 0; rows.length < SAMPLE_LIMIT; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await client
      .from(TABLE)
      .select([...KEY_COLUMNS, "status"].join(","))
      .order("slug", { ascending: true })
      .range(from, to);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }
  return rows.slice(0, SAMPLE_LIMIT === Infinity ? undefined : SAMPLE_LIMIT);
}

/**
 * The same gate scripts/ingest-catalog.mjs applies. Kept in sync by hand;
 * the point is to catch rows that were marked 'active' but no longer (or
 * never) satisfied it.
 */
function gateFailures(row) {
  const reasons = [];
  if (!row.slug) reasons.push("missing slug");
  if (!row.name?.trim()) reasons.push("missing name");
  if (!row.description || row.description.trim().length < MIN_SUMMARY_CHARS) {
    reasons.push(`summary under ${MIN_SUMMARY_CHARS} chars`);
  }
  if (!row.image_url || !/^https?:\/\//i.test(row.image_url)) reasons.push("missing image");
  return reasons;
}

/** Groups key pairs and returns only those appearing more than once. */
export function findDuplicates(rows) {
  const counts = new Map();
  for (const row of rows) {
    const key = `${row.entity_type}::${row.slug}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .map(([key, n]) => ({ key, count: n }))
    .sort((a, b) => b.count - a.count);
}

/** Tallies rows by entity_type and status for the inventory summary. */
export function summarise(rows) {
  const byType = new Map();
  for (const row of rows) {
    const bucket = byType.get(row.entity_type) ?? { total: 0, active: 0, incomplete: 0, other: 0 };
    bucket.total++;
    if (row.status === "active") bucket.active++;
    else if (row.status === "incomplete") bucket.incomplete++;
    else bucket.other++;
    byType.set(row.entity_type, bucket);
  }
  return byType;
}

/* -------------------------------------------------------------------- main */

async function main() {
  const dotEnvFound = loadDotEnv();
  const url = resolveUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey =
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || null;

  log("\nCatalog verification\n====================");
  log(`  url         ${url}`);
  log(`  .env        ${dotEnvFound ? "loaded from repo root" : "not found (using environment)"}`);
  log(`  service key ${describeKey(serviceKey)}`);
  log(`  public key  ${describeKey(publishableKey)}`);
  log(`  mode        ${READ_ONLY ? "read-only" : "read + write probe"}`);
  log("");

  const readKey = serviceKey || publishableKey;
  if (!readKey) {
    fail(
      "Credentials present",
      "Neither SUPABASE_SERVICE_ROLE_KEY nor VITE_SUPABASE_ANON_KEY is set.\n" +
        "Copy .env.example to .env and fill it in (.env is gitignored).",
    );
    return finish();
  }

  const opts = { auth: { persistSession: false, autoRefreshToken: false } };
  const client = createClient(url, readKey, opts);
  const admin = serviceKey ? createClient(url, serviceKey, opts) : null;

  /* 1. reachability ------------------------------------------------------ */
  const { error: reachError, count } = await client
    .from(TABLE)
    .select("*", { count: "exact", head: true });
  if (reachError) {
    fail(
      `Table public.${TABLE} reachable`,
      `${reachError.message}\n` +
        "Everything below depends on this, so nothing else was attempted.",
    );
    return finish();
  }
  pass(`Table public.${TABLE} reachable`, `${count ?? "unknown"} row(s) visible to this key`);

  if ((count ?? 0) === 0) {
    warn(
      "Catalog is populated",
      "The table is empty, so the duplicate and quality checks have nothing to\n" +
        "inspect. Run: npm run ingest:catalog -- --source=all",
    );
  }

  /* 2. unique index ------------------------------------------------------ */
  // Probed rather than read from pg_indexes, because PostgREST exposes no
  // catalog view: an upsert naming the conflict target either works or comes
  // back 42P10, which is the exact condition the ingester cares about.
  if (!admin) {
    skip(
      `Unique index on (${KEY_COLUMNS.join(", ")})`,
      "Needs SUPABASE_SERVICE_ROLE_KEY — the publishable key cannot write.",
    );
  } else {
    const probe = {
      slug: `verify-index-${Date.now()}`,
      name: "verification probe",
      entity_type: SENTINEL_TYPE,
      status: "incomplete",
    };
    const { error } = await admin.from(TABLE).upsert([probe], {
      onConflict: KEY_COLUMNS.join(","),
    });
    if (!error) {
      pass(
        `Unique index on (${KEY_COLUMNS.join(", ")})`,
        "ON CONFLICT accepted, so upserts take the fast path.",
      );
      await admin.from(TABLE).delete().eq("entity_type", SENTINEL_TYPE);
    } else if (error.code === "42P10" || /no unique or exclusion constraint/i.test(error.message)) {
      fail(
        `Unique index on (${KEY_COLUMNS.join(", ")})`,
        "Missing. The ingester still works, but falls back to read-then-write,\n" +
          "which is slower and races if two ingests overlap. Apply:\n" +
          "  supabase/migrations/20260913000000_entities_unique_type_slug.sql",
      );
    } else {
      fail(`Unique index on (${KEY_COLUMNS.join(", ")})`, error.message);
    }
  }

  /* 3. duplicate scan ---------------------------------------------------- */
  let keyRows = [];
  try {
    keyRows = await fetchKeyPairs(client);
    const duplicates = findDuplicates(keyRows);
    if (duplicates.length === 0) {
      pass(
        "Zero duplicate (entity_type, slug) pairs",
        `${keyRows.length} row(s) scanned, ${new Set(keyRows.map((r) => `${r.entity_type}::${r.slug}`)).size} distinct key(s).`,
      );
    } else {
      const shown = duplicates
        .slice(0, 10)
        .map((d) => `  ${d.key} × ${d.count}`)
        .join("\n");
      fail(
        "Zero duplicate (entity_type, slug) pairs",
        `${duplicates.length} duplicated key(s) across ${keyRows.length} row(s):\n${shown}` +
          (duplicates.length > 10 ? `\n  … and ${duplicates.length - 10} more` : "") +
          "\nThese block the unique index. Remove the older copy of each before applying it.",
      );
    }
  } catch (error) {
    fail("Zero duplicate (entity_type, slug) pairs", error.message);
  }

  /* 4. inventory --------------------------------------------------------- */
  // Derived from the fully-paged scan above, so these totals are exact rather
  // than a first-page sample.
  if (keyRows.length > 0) {
    const byType = summarise(keyRows);
    const inventory = [...byType.entries()]
      .map(
        ([type, b]) =>
          `${type}: ${b.total} total · ${b.active} active · ${b.incomplete} incomplete` +
          (b.other ? ` · ${b.other} other status` : ""),
      )
      .join("\n");
    pass("Inventory", inventory);
  }

  /* 5. quality gate ------------------------------------------------------ */
  // Bounded sample: this one needs description and image_url for every row,
  // which is far heavier than the key scan, so it is explicitly a spot check.
  try {
    const sampleSize = Math.min(SAMPLE_LIMIT, PAGE_SIZE);
    const { data: rows, error } = await client
      .from(TABLE)
      .select("slug,name,description,image_url,entity_type,status")
      .limit(sampleSize);
    if (error) throw new Error(error.message);

    const activeInSample = rows.filter((r) => r.status === "active").length;
    const scope =
      rows.length < (keyRows.length || rows.length)
        ? `sample of ${rows.length} of ${keyRows.length} row(s)`
        : `all ${rows.length} row(s)`;

    const misgraded = rows
      .filter((r) => r.status === "active")
      .map((r) => ({ slug: r.slug, reasons: gateFailures(r) }))
      .filter((r) => r.reasons.length > 0);

    if (misgraded.length === 0) {
      pass(
        "Rows marked 'active' satisfy the quality gate",
        `${activeInSample} active row(s) re-tested (${scope}).`,
      );
    } else {
      const shown = misgraded
        .slice(0, 5)
        .map((m) => `  ${m.slug}: ${m.reasons.join(", ")}`)
        .join("\n");
      fail(
        "Rows marked 'active' satisfy the quality gate",
        `${misgraded.length} of ${activeInSample} active row(s) would not pass the gate today ` +
          `(${scope}):\n${shown}` +
          (misgraded.length > 5 ? `\n  … and ${misgraded.length - 5} more` : "") +
          "\nThese are publicly visible but thin. Re-run the ingester to re-grade them.",
      );
    }
  } catch (error) {
    fail("Rows marked 'active' satisfy the quality gate", error.message);
  }

  /* 6. write probe ------------------------------------------------------- */
  if (READ_ONLY) {
    skip("Ingestion round-trip with a duplicated key", "--read-only was passed.");
  } else if (!admin) {
    skip("Ingestion round-trip with a duplicated key", "Needs SUPABASE_SERVICE_ROLE_KEY.");
  } else {
    await writeProbe(admin);
  }

  /* 7. public visibility ------------------------------------------------- */
  if (!publishableKey) {
    skip(
      "Public key sees active rows and not incomplete ones",
      "Set VITE_SUPABASE_ANON_KEY to check what visitors and Googlebot see.",
    );
  } else if (publishableKey === serviceKey) {
    skip("Public key sees active rows and not incomplete ones", "Same key configured for both.");
  } else {
    const anon = createClient(url, publishableKey, opts);
    const { count: activeSeen, error: e1 } = await anon
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    const { count: incompleteSeen, error: e2 } = await anon
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "incomplete");
    if (e1 || e2) {
      fail("Public key sees active rows and not incomplete ones", (e1 ?? e2).message);
    } else if ((incompleteSeen ?? 0) > 0) {
      fail(
        "Public key sees active rows and not incomplete ones",
        `${incompleteSeen} incomplete row(s) are publicly readable. The active_catalog_read\n` +
          "policy is meant to hide them — thin records would be indexable.",
      );
    } else {
      pass(
        "Public key sees active rows and not incomplete ones",
        `${activeSeen ?? 0} active visible, incomplete hidden.`,
      );
    }
  }

  return finish();
}

/**
 * Writes a batch that deliberately repeats one key, which is what Jikan's
 * shifting pagination produces. A batch that reached the database unchanged
 * would fail with 21000; the ingester collapses it first, so this proves both
 * that the dedupe holds and that a real insert/update round-trip works.
 */
async function writeProbe(admin) {
  const { rowKey, dedupeByKey } = await import("./ingest-catalog.mjs");
  const name = "Ingestion round-trip with a duplicated key";
  const slug = `verify-roundtrip-${Date.now()}`;
  const base = { slug, entity_type: SENTINEL_TYPE, status: "incomplete" };
  const batch = [
    { ...base, name: "probe (first copy)" },
    { ...base, name: "probe (second copy)" },
  ];

  try {
    const deduped = dedupeByKey(batch);
    if (deduped.length !== 1) {
      fail(
        name,
        `dedupeByKey returned ${deduped.length} rows for one key — the fix is not active.`,
      );
      return;
    }
    if (rowKey(batch[0]) !== `${SENTINEL_TYPE}::${slug}`) {
      fail(name, "rowKey no longer composes (entity_type, slug).");
      return;
    }

    let viaFallback = false;
    const { error } = await admin.from(TABLE).upsert(deduped, {
      onConflict: KEY_COLUMNS.join(","),
    });
    if (error) {
      const noIndex =
        error.code === "42P10" || /no unique or exclusion constraint/i.test(error.message);
      if (!noIndex) {
        fail(
          name,
          `${error.code ?? ""} ${error.message}`.trim() +
            (error.code === "21000"
              ? "\nThe batch still repeated a key on the way to Postgres."
              : ""),
        );
        return;
      }
      // Mirror the ingester: with no index it degrades to a plain insert
      // rather than stopping, so ingestion genuinely still works here. The
      // index check above already reported the missing index.
      viaFallback = true;
      const { error: insertError } = await admin.from(TABLE).insert(deduped);
      if (insertError) {
        fail(name, `fallback insert failed: ${insertError.message}`);
        return;
      }
    }

    const { data, error: readError } = await admin
      .from(TABLE)
      .select("slug,name")
      .eq("entity_type", SENTINEL_TYPE)
      .eq("slug", slug);
    if (readError) {
      fail(name, readError.message);
      return;
    }
    if (data.length !== 1) {
      fail(name, `expected exactly 1 row after the upsert, found ${data.length}.`);
      return;
    }
    const summary =
      "A 2-row batch sharing one key was collapsed, written, and read back as\n" +
      "exactly 1 row (last occurrence kept).";
    if (viaFallback) {
      warn(
        name,
        `${summary}\nWritten via the read-then-write fallback, because the index is missing.`,
      );
    } else {
      pass(name, summary);
    }
  } finally {
    // Always clear the sentinels, including on an early return above.
    const { error } = await admin.from(TABLE).delete().eq("entity_type", SENTINEL_TYPE);
    if (error) {
      warn(
        "Probe cleanup",
        `Could not delete sentinel rows (entity_type = '${SENTINEL_TYPE}'): ${error.message}\n` +
          "Remove them by hand so they do not show up in counts.",
      );
    }
  }
}

function finish() {
  const failed = results.filter((r) => r.status === "fail");
  const warned = results.filter((r) => r.status === "warn");
  const skipped = results.filter((r) => r.status === "skip");
  const passed = results.filter((r) => r.status === "pass");

  log(
    `\n${passed.length} passed · ${failed.length} failed · ${warned.length} warning(s) · ${skipped.length} skipped`,
  );
  if (failed.length === 0) {
    log(
      skipped.length === 0 && warned.length === 0
        ? "Catalog is operational.\n"
        : "No failures. Review the warnings and skipped checks above.\n",
    );
  } else {
    log(`Not operational — ${failed.map((f) => f.name).join("; ")}\n`);
  }
  process.exitCode = failed.length === 0 ? 0 : 1;
}

// Only run when invoked directly, so the checks in
// scripts/check-ingest-dedupe.mjs can import the pure helpers above without
// opening a connection.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
