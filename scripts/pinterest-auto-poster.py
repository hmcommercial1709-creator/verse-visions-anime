#!/usr/bin/env python3
"""Publish GameCastle pages to Pinterest.

WHAT THIS REPLACES
------------------
The file that stood here was named pinterest-auto-poster.py and contained no
Pinterest code whatsoever. It fetched /sitemap.xml, looked for <url> elements,
wrote whatever it found to latest_links.json, and printed a success line. It
had no access token, no board id, no API call, and nothing read its output.

It also could not have worked even as a link extractor: /sitemap.xml is a
sitemap INDEX whose children are <sitemap> elements, so findall('ns:url')
matched zero of them and the file it wrote was always "[]".

And because the whole body sat inside `except Exception as e: print(...)`, it
exited 0 every single time. The deploy log has been reporting "Run Pinterest
Auto Poster ✓" on every deploy for as long as the step has existed, while
nothing was ever posted. A step that cannot fail cannot tell you anything.

THIS VERSION
------------
Posts real pins through the Pinterest API v5, and is loud about every way it
can fail:

  * missing credentials stop the run with the exact variable name;
  * every non-2xx response prints the status AND the response body, because
    Pinterest puts the actual reason in the body ("board not found", "scope
    not granted") and the status alone tells you almost nothing;
  * the exit code is non-zero whenever a pin was attempted and failed.

--dry-run does everything except the POST, and needs no credentials, so the
queue, the dedupe and the payload can all be verified before a token exists.
"""

from __future__ import annotations

import argparse
import json
import os  # noqa: E402  (API below reads the environment at import time)
import sys
import time
import urllib.error
import urllib.request
from typing import NamedTuple

# Pinterest runs a separate sandbox whose tokens are NOT valid against
# production, and a sandbox token used here comes back as "InactiveConsumer"
# — indistinguishable from an unapproved app unless you know to look. Making
# the host a variable means testing that theory is one secret, not a patch.
PRODUCTION_API = "https://api.pinterest.com/v5"
SANDBOX_API = "https://api-sandbox.pinterest.com/v5"
QUEUE_FILE = "pinterest-queue.json"
TIMEOUT = 30

# Pinterest rate-limits pin creation. A second between posts keeps a normal
# run well under any published ceiling without needing to read headers.
DELAY_BETWEEN_PINS = 1.0


def normalize_api_base(raw: str) -> tuple[str, str]:
    """Turns whatever is in PINTEREST_API_BASE into a usable base URL + label.

    A secret is typed by a human into a web form, so it arrives with the
    mistakes a human makes: a trailing slash, surrounding quotes copied along
    with the value, a missing scheme, or the bare host without the /v5 that
    every path in this file assumes. Each of those turns every request into a
    404 or a 401 that reads like a credential problem and is not one, so they
    are repaired here rather than diagnosed later.

    The second return value is a LABEL, not the URL. The URL comes from a
    secret, so GitHub masks it in the log and printing it tells the reader
    nothing — a previous run ended with "API base in use: ***", which is the
    single fact needed to interpret an auth failure, redacted. "sandbox" and
    "production" are derived, not secret, and survive the masking.
    """
    base = raw.strip().strip('"').strip("'").strip().rstrip("/")
    if not base:
        return PRODUCTION_API, "production"
    if "://" not in base:
        base = f"https://{base}"
    if not base.endswith("/v5"):
        base = f"{base}/v5"
    host = base.split("://", 1)[1].split("/", 1)[0].lower()
    if host == "api.pinterest.com":
        return base, "production"
    if host == "api-sandbox.pinterest.com":
        return base, "sandbox"
    return base, "custom"


def clean_token(raw: str) -> str:
    """The token as Pinterest issued it, not as it was pasted.

    Two paste artefacts produce HTTP 401 "Authentication failed." from a token
    that is perfectly valid: quotes captured along with the value, and the word
    "Bearer" copied from the documentation's example header — which this script
    then prefixes again, sending "Bearer Bearer pina_...".
    """
    token = raw.strip().strip('"').strip("'").strip()
    if token.lower().startswith("bearer "):
        token = token[len("bearer ") :].strip()
    return token


API, API_KIND = normalize_api_base(os.environ.get("PINTEREST_API_BASE", ""))
# The hostname on its own is not the secret, so it survives GitHub's masking
# even when PINTEREST_API_BASE is stored as one.
API_HOST = API.split("://", 1)[1].split("/", 1)[0]


class PinterestError(RuntimeError):
    """An API call that came back non-2xx, carrying the body Pinterest sent."""


# Pinterest's own error codes, mapped to the thing that actually fixes them.
# The generic "check your token, board id and account" list is useless once
# the body has already told you which of the three it is.
#
# only_if_token_rejected marks advice that is only TRUE when the credential
# itself was refused. /boards/<id> answers 401 with the same body whether the
# token was rejected or the board is unreadable, so printing "this is not the
# board id" on the second case sends the reader to regenerate a credential
# that was never the problem. probe_token() settles which case it is, and
# these entries are withheld when it says the token authenticated.
class Diagnosis(NamedTuple):
    needle: str
    only_if_token_rejected: bool
    advice: str


PINTEREST_DIAGNOSES = (
    Diagnosis(
        needle="inactiveconsumer",
        only_if_token_rejected=True,
        advice=(
            "The TOKEN is fine; the APP that issued it is not active for production.\n"
            "  Fix one of these, in order of likelihood:\n"
            "   1. The app is still on Trial access. Open developers.pinterest.com ->\n"
            "      your app -> and request/enable Standard access, or confirm trial\n"
            "      access is actually switched on for the account that owns the board.\n"
            "   2. The token came from the SANDBOX. Sandbox tokens are rejected by\n"
            "      api.pinterest.com. Either generate a production token, or set the\n"
            "      secret PINTEREST_API_BASE to https://api-sandbox.pinterest.com/v5\n"
            "      to talk to the sandbox instead.\n"
            "   3. The app was disabled or its review was rejected. The app page will\n"
            "      say so."
        ),
    ),
    Diagnosis(
        needle="authentication failed",
        only_if_token_rejected=True,
        advice=(
            "The token was REJECTED OUTRIGHT. Pinterest never looked at the board\n"
            "  or the scopes, because it did not accept the credential first.\n"
            "  In order of likelihood:\n"
            "   1. The token and the host disagree. A sandbox token sent to\n"
            "      production, or a production token sent to the sandbox, fails\n"
            "      exactly like this. The `Host contacted` line above says which\n"
            "      one this run used; make the token match it.\n"
            "   2. The token expired or was revoked. Pinterest access tokens are\n"
            "      not permanent — generate a new one and update the\n"
            "      PINTEREST_ACCESS_TOKEN secret.\n"
            "   3. Only part of the token was pasted. They are long; a truncated\n"
            "      one is rejected the same way a wrong one is."
        ),
    ),
    Diagnosis(
        needle="scope",
        only_if_token_rejected=False,
        advice=(
            "The token is missing a scope. This script needs boards:read and\n"
            "  pins:write to publish, and user_accounts:read for the token probe.\n"
            "  Scopes are fixed at the moment a token is generated, so adding them\n"
            "  to the app is not enough — generate a NEW token after the scopes\n"
            "  are set."
        ),
    ),
    Diagnosis(
        needle="not found",
        only_if_token_rejected=False,
        advice=(
            "The board id does not exist for this account. List the boards this\n"
            "  token can see with:\n"
            "    curl -s -H \"Authorization: Bearer $PINTEREST_ACCESS_TOKEN\" \\\n"
            "      https://api.pinterest.com/v5/boards\n"
            "  and copy the `id` of the board you want."
        ),
    ),
)

# Printed when the token authenticated but the board still could not be read —
# the one case where nothing about the credential is worth changing.
BOARD_IS_THE_PROBLEM = (
    "The token authenticates, so the BOARD is what this run cannot reach.\n"
    "   1. PINTEREST_BOARD_ID belongs to a different account, or was copied\n"
    "      from a board URL rather than from the API. List the boards this\n"
    "      token can actually see with:\n"
    "        curl -s -H \"Authorization: Bearer $PINTEREST_ACCESS_TOKEN\" \\\n"
    "          $PINTEREST_API_BASE/boards\n"
    "      and copy the `id` field of the board you want.\n"
    "   2. The board is secret, or owned by a business account the token was\n"
    "      not issued for.\n"
    "   3. The token is missing boards:read. Scopes are fixed when a token is\n"
    "      generated, so a new token is required — editing the app is not\n"
    "      enough."
)


def diagnose(error: Exception, token_accepted: bool | None = None) -> str | None:
    """Turns a Pinterest error body into the one step that fixes it.

    Matched against the message Pinterest sends, not the HTTP status: 401 is
    returned for an inactive app, a missing scope and a revoked token alike,
    so the status on its own cannot tell them apart. The body can — and where
    the body is still ambiguous, token_accepted (from probe_token) decides.
    """
    text = str(error).lower()
    for entry in PINTEREST_DIAGNOSES:
        if entry.needle not in text:
            continue
        if entry.only_if_token_rejected and token_accepted:
            continue
        return entry.advice
    return BOARD_IS_THE_PROBLEM if token_accepted else None


def host_mismatch_hint() -> str:
    """The single change to make, given the host this run actually reached.

    Generic advice ("check the token, check the board") is what sent the reader
    to inspect a board id that was correct. Once the host is known, the fix for
    a rejected token is one specific edit, so this names it.
    """
    if API_KIND == "sandbox":
        return (
            "This run reached the SANDBOX, where a production token is rejected.\n"
            "            If the token came from developers.pinterest.com, DELETE the\n"
            "            PINTEREST_API_BASE secret so runs go back to production."
        )
    if API_KIND == "production":
        return (
            "This run reached PRODUCTION, where a sandbox token is rejected.\n"
            "            If the token came from the sandbox, set the PINTEREST_API_BASE\n"
            f"            secret to {SANDBOX_API}; otherwise generate a\n"
            "            production token."
        )
    return (
        "This run reached a host that is neither Pinterest endpoint. Unset the\n"
        "            PINTEREST_API_BASE secret for production, or set it to exactly\n"
        f"            {SANDBOX_API} for the sandbox."
    )


def log(message: str) -> None:
    print(message, flush=True)


def request(method: str, path: str, token: str, payload: dict | None = None) -> dict:
    """One API call, with the response body preserved on failure.

    urllib raises HTTPError for non-2xx and the body is readable from the
    exception exactly once — so it is read here and attached to the message.
    Without that, a 400 tells you a request was rejected but not which field
    Pinterest objected to, which is the only part worth knowing.
    """
    url = f"{API}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as error:
        detail = ""
        try:
            detail = error.read().decode("utf-8")
        except Exception:  # noqa: BLE001 - the body is best-effort
            detail = "<no response body>"
        raise PinterestError(
            f"{method} {path} -> HTTP {error.code} {error.reason}\n  body: {detail}"
        ) from error
    except urllib.error.URLError as error:
        raise PinterestError(f"{method} {path} -> network error: {error.reason}") from error


def probe_token(token: str) -> tuple[bool, str]:
    """Is the TOKEN accepted by this host, independent of any board?

    A 401 on /boards/<id> is ambiguous: it is returned for a rejected token and
    it is what a reader mistakes for a wrong board id. /user_account takes no
    board, so its answer separates the two — and a 403 there still means the
    token authenticated (it was recognised, then refused for scope), which is
    why the status is read rather than just the success of the call.
    """
    try:
        body = request("GET", "/user_account", token)
    except PinterestError as error:
        if "HTTP 401" in str(error):
            return False, "rejected — /user_account also returns 401, so it is the token"
        return (
            True,
            "accepted — /user_account did not return 401, so the token itself is\n"
            f"            valid and the board is the problem.\n  {error}",
        )
    username = body.get("username")
    who = f"@{username}" if username else "an account with no username in the response"
    return True, f"accepted — the token belongs to {who}, so the board is the problem"


def load_queue() -> list[dict]:
    if not os.path.exists(QUEUE_FILE):
        raise SystemExit(
            f"{QUEUE_FILE} is missing. Run `npm run pinterest:queue` first — it reads the\n"
            "site's own article data and writes the pages that have a real image."
        )
    with open(QUEUE_FILE, encoding="utf-8") as handle:
        queue = json.load(handle)
    if not isinstance(queue, list) or not queue:
        raise SystemExit(f"{QUEUE_FILE} holds no pinnable pages.")
    return queue


def already_pinned(token: str, board_id: str) -> set[str]:
    """Destination links already on the board.

    Deduping against the board itself rather than against a state file: a file
    committed from CI drifts the moment a pin is deleted by hand, and it turns
    every run into a commit. The board is the source of truth about what is on
    the board.
    """
    links: set[str] = set()
    bookmark: str | None = None
    pages = 0
    while pages < 20:
        path = f"/boards/{board_id}/pins?page_size=100"
        if bookmark:
            path += f"&bookmark={bookmark}"
        body = request("GET", path, token)
        for item in body.get("items", []) or []:
            link = item.get("link")
            if link:
                links.add(link.split("?")[0])
        bookmark = body.get("bookmark")
        pages += 1
        if not bookmark:
            break
    return links


def create_pin(token: str, board_id: str, row: dict) -> str:
    body = request(
        "POST",
        "/pins",
        token,
        {
            "board_id": board_id,
            "title": row["title"],
            "description": row["description"],
            "link": row["url"],
            "media_source": {"source_type": "image_url", "url": row["image"]},
        },
    )
    return body.get("id", "<no id returned>")


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish GameCastle pages to Pinterest.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build and print the payloads without posting. Needs no credentials.",
    )
    parser.add_argument("--limit", type=int, default=5, help="Maximum pins to create per run.")
    args = parser.parse_args()

    queue = load_queue()
    log(f"[pinterest] {len(queue)} pinnable page(s) in {QUEUE_FILE}")

    if args.dry_run:
        log(f"[pinterest] DRY RUN — nothing will be posted. Host: {API_KIND} ({API_HOST})")
        for row in queue[: args.limit]:
            log(
                "\n  POST /v5/pins\n"
                f"    title      : {row['title']}\n"
                f"    link       : {row['url']}\n"
                f"    image      : {row['image']}\n"
                f"    description: {row['description'][:120]}…"
            )
        log(f"\n[pinterest] Dry run OK. {min(args.limit, len(queue))} pin(s) would be created.")
        return 0

    # Credentials are checked together and reported by name. "Unauthorized"
    # from the API is a much worse first clue than "you did not set this".
    token = clean_token(os.environ.get("PINTEREST_ACCESS_TOKEN", ""))
    board_id = os.environ.get("PINTEREST_BOARD_ID", "").strip().strip('"').strip("'").strip()
    missing = [
        name
        for name, value in (
            ("PINTEREST_ACCESS_TOKEN", token),
            ("PINTEREST_BOARD_ID", board_id),
        )
        if not value
    ]
    if missing:
        log("[pinterest] FAILED — missing credentials: " + ", ".join(missing))
        log(
            "[pinterest] Set them as GitHub repository secrets, or export them locally.\n"
            "            Run with --dry-run to test everything except the post."
        )
        return 1

    # Printed before anything can fail, and printed as a label rather than the
    # URL: PINTEREST_API_BASE is a secret, so the URL comes out of GitHub's log
    # as "***" and the one fact needed to read an auth failure is lost.
    log(f"[pinterest] Host contacted: {API_KIND} ({API_HOST})")

    try:
        board = request("GET", f"/boards/{board_id}", token)
        log(f"[pinterest] Board OK: {board.get('name', board_id)}")
    except PinterestError as error:
        log(f"[pinterest] FAILED — cannot read the board.\n  {error}")
        # The probe runs BEFORE the advice, because the advice depends on it.
        # /user_account takes no board, so its answer is the only thing that
        # separates "the credential was refused" from "the board cannot be
        # read" — two states Pinterest reports with the identical 401 body.
        token_accepted, detail = probe_token(token)
        log(f"[pinterest] Token check: {detail}")
        advice = diagnose(error, token_accepted)
        if advice:
            log(f"[pinterest] What this means:\n  {advice}")
        if not token_accepted:
            log(f"[pinterest] Next step: {host_mismatch_hint()}")
        return 1

    try:
        existing = already_pinned(token, board_id)
        log(f"[pinterest] {len(existing)} link(s) already pinned to this board")
    except PinterestError as error:
        log(f"[pinterest] FAILED — cannot list existing pins.\n  {error}")
        return 1

    pending = [row for row in queue if row["url"].split("?")[0] not in existing]
    if not pending:
        log("[pinterest] Every pinnable page is already on the board. Nothing to do.")
        return 0

    log(f"[pinterest] {len(pending)} new page(s); posting up to {args.limit}")

    created = 0
    failed = 0
    for row in pending[: args.limit]:
        try:
            pin_id = create_pin(token, board_id, row)
            created += 1
            log(f"[pinterest] pinned {pin_id} — {row['title']}")
        except PinterestError as error:
            failed += 1
            log(f"[pinterest] FAILED to pin {row['url']}\n  {error}")
            advice = diagnose(error)
            if advice:
                log(f"[pinterest] What this means:\n  {advice}")
        time.sleep(DELAY_BETWEEN_PINS)

    log(f"[pinterest] done — {created} created, {failed} failed")
    # A run that attempted work and failed must not report success. The old
    # script's silent exit 0 is the reason this went unnoticed for so long.
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
