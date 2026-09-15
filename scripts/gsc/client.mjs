/**
 * Search Console Search Analytics, on the credentials this repo already has.
 *
 * scripts/ping-gsc.js authenticates a service account with the `webmasters`
 * scope and calls sitemaps.submit. That same scope covers searchanalytics.query,
 * so reading performance needs no new secret and no new consent screen — it
 * needs this file. That is the whole reason the winner-amplification engine is
 * cheap to build here: the expensive part was already done and never used.
 *
 * Three things this wrapper exists to get right:
 *
 *   Pagination. The API caps a response at 25,000 rows and gives no next-page
 *     token; you walk startRow yourself until a short page comes back. Missing
 *     that silently truncates a large site to its first page and every ranking
 *     below it looks like it vanished.
 *
 *   The data delay. Search Analytics lags roughly two to three days, and the
 *     most recent days are partial. Querying up to "today" therefore always
 *     shows a cliff, and a naive week-over-week diff reads that cliff as a
 *     collapse in rankings. Every window here ends at LAG_DAYS back.
 *
 *   Failing usefully. A 403 here almost always means one specific thing - the
 *     service account was never added as a user on the property - and saying
 *     so beats printing a stack trace.
 */

const ROW_LIMIT = 25000;
const MAX_ATTEMPTS = 4;

/**
 * Search Analytics is finalised about two days back, and the day or two before
 * that is still filling in. Ending a window here keeps a comparison honest.
 */
export const LAG_DAYS = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isRetryable = (error) => {
  const status = error?.code || error?.response?.status;
  return status === 429 || (typeof status === "number" && status >= 500);
};

/** YYYY-MM-DD, n days before `from` (default: today, UTC). */
export const dayOffset = (n, from = new Date()) =>
  new Date(from.getTime() - n * 86400000).toISOString().slice(0, 10);

/**
 * A window of `days` ending LAG_DAYS back, and the equally long window
 * immediately before it. Returned together so a caller cannot accidentally
 * compare windows of different lengths, which would make every delta wrong.
 */
export function comparisonWindows(days, from = new Date()) {
  const currentEnd = dayOffset(LAG_DAYS, from);
  const currentStart = dayOffset(LAG_DAYS + days - 1, from);
  const baselineEnd = dayOffset(LAG_DAYS + days, from);
  const baselineStart = dayOffset(LAG_DAYS + days * 2 - 1, from);
  return { currentStart, currentEnd, baselineStart, baselineEnd, days };
}

// Imported AND re-exported, not `export ... from`. A bare re-export makes the
// name available to importers of this module but does NOT bind it in this
// module's own scope, so searchConsoleClient below called an undefined
// identifier — which only shows up at runtime, and only on the one code path
// that needs credentials.
import { credentialsFromEnv } from "./private-key.mjs";

export { credentialsFromEnv };

export async function searchConsoleClient({ log = console.log } = {}) {
  const credentials = credentialsFromEnv();
  if (credentials.error) {
    log(
      `Search Console is not usable: ${credentials.error}\n` +
        "  Without it there is no performance feedback, so no page can be ranked\n" +
        "  by how it is actually doing. Nothing is guessed in its place.",
    );
    return null;
  }
  if (credentials.repaired) {
    log("  GSC_PRIVATE_KEY had damaged line breaks; repaired for this run.");
  }
  const { google } = await import("googleapis");
  const auth = new google.auth.JWT({
    email: credentials.email,
    key: credentials.privateKey,
    // Same scope ping-gsc.js already uses; it covers reads as well as submits.
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });
  return google.searchconsole({ version: "v1", auth });
}

/**
 * One searchanalytics.query, paged to completion.
 *
 * `dimensions` decides the grain: ["page"] for which pages to work on,
 * ["page","query"] for what the work should say.
 */
export async function queryAnalytics(
  searchconsole,
  {
    siteUrl,
    startDate,
    endDate,
    dimensions,
    rowLimit = ROW_LIMIT,
    maxRows = 100000,
    log = console.log,
  },
) {
  const rows = [];
  for (let startRow = 0; rows.length < maxRows; startRow += rowLimit) {
    let page = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await searchconsole.searchanalytics.query({
          siteUrl,
          requestBody: { startDate, endDate, dimensions, rowLimit, startRow, dataState: "final" },
        });
        page = response.data?.rows ?? [];
        break;
      } catch (error) {
        const status = error?.code || error?.response?.status;
        if (status === 403) {
          throw new Error(
            `Search Console returned 403 for ${siteUrl}.\n\n` +
              `  The service account is almost certainly not a user on this property.\n` +
              `  Search Console → Settings → Users and permissions → Add user:\n` +
              `    ${process.env.GSC_CLIENT_EMAIL}\n` +
              `  Full or Restricted is enough to read performance.\n\n` +
              `  Check GSC_SITE_URL too: a domain property is "sc-domain:gamecastle.store",\n` +
              `  a URL-prefix property is "https://gamecastle.store/" with the trailing slash.`,
          );
        }
        if (!isRetryable(error) || attempt === MAX_ATTEMPTS) throw error;
        const delay = 2 ** (attempt - 1) * 1000;
        log(`  Search Console ${status ?? "error"}; retrying in ${delay}ms.`);
        await wait(delay);
      }
    }
    if (!page?.length) break;
    rows.push(...page);
    // A short page is the end; the API offers no token to check instead.
    if (page.length < rowLimit) break;
  }
  return rows;
}

/** Flattens an API row into the shape the stats tables store. */
export const toRecord = (row, dimensions) => {
  const keys = row.keys ?? [];
  const record = {
    clicks: Math.round(row.clicks ?? 0),
    impressions: Math.round(row.impressions ?? 0),
    ctr: row.ctr ?? null,
    position: row.position ?? null,
  };
  dimensions.forEach((dimension, index) => {
    record[dimension] = keys[index] ?? null;
  });
  return record;
};
