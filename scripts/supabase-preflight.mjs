/**
 * Checks the credentials before anything else runs.
 *
 * This exists because of a real failure that cost several runs. The metadata
 * probe reported "column MISSING" on every attempt, so the diagnosis was a
 * missing migration — and it was wrong. Once the probe stopped swallowing its
 * error the actual message appeared: "Unregistered API key". The service role
 * key in CI had been rotated and the new value never reached the GitHub
 * secret, so every query was being rejected before it ever reached a table.
 *
 * An invalid key makes EVERY probe fail, which makes every probe's answer
 * meaningless. Checking credentials first is therefore not a nicety: any
 * schema conclusion drawn before this passes is unreliable, and acting on one
 * sends someone to re-apply migrations that were already applied.
 *
 * Supabase's wording for the common cases:
 *   "Unregistered API key"  the key is not one this project knows — usually a
 *                           rotated key that was updated in one place only
 *   "Invalid API key"       malformed, truncated, or the wrong project's key
 *   "JWT expired"           a short-lived token used where the service role
 *                           key belongs
 */

const CREDENTIAL_HINTS = [
  [
    /unregistered api key/i,
    "The key is not registered with this Supabase project.\n" +
      "  This is what a rotated key looks like when only one copy was updated.\n" +
      "  Supabase → Settings → API → service_role, then update it EVERYWHERE it\n" +
      "  is stored: your local .env AND the SUPABASE_SERVICE_ROLE_KEY secret in\n" +
      "  GitHub (Settings → Secrets and variables → Actions).",
  ],
  [
    /invalid api key|invalid.*jwt|jws|malformed/i,
    "The key is malformed, truncated, or belongs to a different project.\n" +
      "  Copy the whole service_role key from Supabase → Settings → API.",
  ],
  [/jwt expired/i, "That is a short-lived token, not the service_role key."],
  [
    /permission denied|insufficient/i,
    "The key reached the database but is not permitted to read this table.\n" +
      "  Confirm it is the service_role key and not the publishable/anon key.",
  ],
];

/**
 * Verifies the credentials answer at all. Throws with an actionable message
 * when they do not; returns silently when they do.
 *
 * Uses the target table itself rather than a health endpoint: a key can be
 * valid and still not reach this table, and that distinction matters here.
 * `head: true` with an exact count reads no rows, so this stays cheap.
 */
export async function assertCredentials(supabase, table, { log = console.log } = {}) {
  const { error, count } = await supabase
    .from(table)
    .select("slug", { count: "exact", head: true });

  if (!error) {
    log(`Credentials OK — public.${table} is readable (${(count ?? 0).toLocaleString()} rows).`);
    return count ?? 0;
  }

  const message = `${error.message ?? ""} ${error.hint ?? ""}`.trim();
  const hint = CREDENTIAL_HINTS.find(([pattern]) => pattern.test(message))?.[1];

  throw new Error(
    `Supabase rejected the request before any schema check could run.\n\n` +
      `  ${error.code ? `[${error.code}] ` : ""}${error.message ?? "unknown error"}\n\n` +
      (hint ? `${hint}\n\n` : "") +
      `Nothing about the schema can be concluded until this is fixed: an\n` +
      `unusable key makes every column probe fail, whatever the schema holds.`,
  );
}
