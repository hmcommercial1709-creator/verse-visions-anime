import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

/**
 * Guards the Pinterest integration against the failure it already had.
 *
 * The script that stood here for months reported success on every deploy
 * while posting nothing: it had no API call at all, its sitemap parse matched
 * zero elements, and its whole body sat inside a bare `except` that printed
 * and returned normally. Nothing in CI could tell the difference between that
 * and a working integration, because the only signal it produced was exit 0.
 *
 * So these check the properties that make a failure VISIBLE, not the posting
 * itself — the live API cannot be exercised from CI without burning a real
 * pin on a real board.
 */

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const poster = read('../scripts/pinterest-auto-poster.py');
const queue = read('../scripts/build-pinterest-queue.mjs');
const workflow = read('../.github/workflows/pinterest.yml');
const deploy = read('../.github/workflows/deploy.yml');

/* --- 1. It must actually talk to Pinterest. --------------------------- */

assert.match(poster, /api\.pinterest\.com\/v5/, 'the poster must call the Pinterest API');
assert.match(poster, /"\/pins"/, 'the poster must create pins');
assert.match(poster, /media_source/, 'a pin needs an image; Pinterest has no text-only pin');
assert.match(poster, /Authorization.*Bearer/, 'the poster must authenticate');
assert.match(poster, /PINTEREST_ACCESS_TOKEN/, 'the token must be read from the environment');
assert.match(poster, /PINTEREST_BOARD_ID/, 'the board id must be read from the environment');

/* --- 2. It must not be able to fail silently. -------------------------
 *
 * This is the whole reason the old one went unnoticed. A bare
 * `except Exception: print(...)` at the top level turns every failure into a
 * green tick.
 */

assert.doesNotMatch(
  poster,
  /except\s+Exception\s+as\s+\w+:\s*\n\s*print\(/,
  'a top-level except-and-print is what made the previous script always exit 0',
);
assert.match(poster, /return 1/, 'failure paths must return a non-zero exit code');
assert.match(poster, /sys\.exit\(main\(\)\)/, 'the exit code must reach the shell');
// The response body carries the actual reason; the status alone does not.
assert.match(poster, /error\.read\(\)/, 'HTTP failures must log the response body');

/* --- 3. Credentials are named, not guessed at. ------------------------ */

assert.match(
  poster,
  /missing credentials/i,
  'absent credentials must be reported by name, not as an API "unauthorized"',
);

// Pinterest returns 401 for an inactive app, a missing scope and a revoked
// token alike, so the status cannot tell them apart and the body must be read.
// A real run hit "InactiveConsumer" and the generic advice sent the reader
// looking at the board id, which was fine.
//
// Anchored to the CODE, not to prose. A first attempt matched
// /inactiveconsumer/i and /PINTEREST_API_BASE/ anywhere in the file, and both
// passed happily against the comments that merely *describe* them — the same
// way the SQL guard earlier flagged its own explanatory comment. Deleting the
// real logic left the words behind, so the guard proved nothing.
assert.match(
  poster,
  /^\s*needle="inactiveconsumer",\s*$/m,
  'the known 401 causes must be diagnosed by name, in the lookup table',
);
assert.match(poster, /^def diagnose\(/m, 'error bodies must be mapped to a remedy');
assert.match(
  poster,
  /os\.environ\.get\("PINTEREST_API_BASE"/,
  'the sandbox host must be reachable without a code change',
);

// A second real run failed differently — HTTP 401 with
// {"code":2,"message":"Authentication failed."} — which matched none of the
// three needles and fell through to the generic advice all over again.
assert.match(
  poster,
  /^\s*needle="authentication failed",\s*$/m,
  'a rejected token reports "Authentication failed" and must be diagnosed too',
);

// That same 401 body is returned whether the credential was refused or the
// board cannot be read, so the body alone cannot decide. /user_account takes
// no board: it is the only thing that separates the two, and without it the
// advice contradicts itself on one of the two cases.
assert.match(poster, /^def probe_token\(/m, 'a rejected token must be told apart from a bad board');
assert.match(poster, /"\/user_account"/, 'the probe must use an endpoint that takes no board id');
assert.match(
  poster,
  /diagnose\(error, token_accepted\)/,
  'the diagnosis must depend on the probe, not contradict it',
);
assert.match(
  poster,
  /only_if_token_rejected and token_accepted/,
  'credential advice must be withheld once the token has authenticated',
);

// PINTEREST_API_BASE is stored as a secret, so GitHub replaced it with "***"
// and the failing run's own log could not say which host it had reached —
// the single fact needed to read an auth failure. A derived label is not the
// secret and survives the masking.
assert.match(poster, /^def normalize_api_base\(/m, 'the API base must be classified, not just read');
assert.match(
  poster,
  /Host contacted: \{API_KIND\}/,
  'the log must name the host by label; the raw URL is masked to "***"',
);
assert.doesNotMatch(
  poster,
  /API base in use: \{API\}/,
  'printing the secret URL logs "***" and tells the reader nothing',
);
assert.match(
  poster,
  /^def host_mismatch_hint\(/m,
  'a token/host mismatch must name the one secret to change',
);

// A secret is typed by a human, so it arrives with a human's typos. Each of
// these turns a valid credential into an indistinguishable 401 or 404.
assert.match(poster, /^def clean_token\(/m, 'a pasted "Bearer " prefix or quotes must not reach the header');
assert.match(poster, /rstrip\("\/"\)/, 'a trailing slash in the API base must be tolerated');
assert.match(poster, /endswith\("\/v5"\)/, 'an API base pasted without /v5 must still work');
assert.match(
  workflow,
  /^\s*PINTEREST_API_BASE:\s*\$\{\{/m,
  'the workflow must pass the API base through as a real env entry',
);

/* --- 4. The queue only offers pages that can actually be pinned. ------ */

assert.match(queue, /ogImage/, 'the queue must take images from ogImage');
// `cover` is a CSS gradient string on every article; sending it as an image
// URL is 14 guaranteed API failures per run.
assert.doesNotMatch(
  queue,
  /image:\s*\w*\.cover/,
  'cover is a CSS gradient, not an image URL',
);
assert.match(queue, /process\.exit\(1\)/, 'an empty queue must fail rather than pass quietly');

/* --- 5. The workflow passes the secrets and can be run on demand. ----- */

assert.match(workflow, /secrets\.PINTEREST_ACCESS_TOKEN/, 'the workflow must pass the token');
assert.match(workflow, /secrets\.PINTEREST_BOARD_ID/, 'the workflow must pass the board id');
assert.match(workflow, /workflow_dispatch/, 'a manual run is how the first test post happens');
assert.match(workflow, /build-pinterest-queue/, 'the queue must be built before posting');
// Two concurrent runs both read the same board state and both decide the same
// page is unpinned, which puts duplicates on the board.
assert.match(workflow, /concurrency:/, 'concurrent runs would duplicate pins');

/* --- 6. And it is no longer wired into the site deploy. --------------- */

assert.doesNotMatch(
  deploy,
  /run:\s*python\s+scripts\/pinterest-auto-poster\.py/,
  'posting to a social account must not be part of shipping the site',
);

assert.ok(existsSync(new URL('../scripts/build-pinterest-queue.mjs', import.meta.url)));

console.log('Pinterest integration posts for real and cannot fail silently: passed.');
