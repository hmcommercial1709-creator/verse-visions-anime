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
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://api.pinterest.com/v5"
QUEUE_FILE = "pinterest-queue.json"
TIMEOUT = 30

# Pinterest rate-limits pin creation. A second between posts keeps a normal
# run well under any published ceiling without needing to read headers.
DELAY_BETWEEN_PINS = 1.0


class PinterestError(RuntimeError):
    """An API call that came back non-2xx, carrying the body Pinterest sent."""


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
        log("[pinterest] DRY RUN — nothing will be posted.")
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
    token = os.environ.get("PINTEREST_ACCESS_TOKEN", "").strip()
    board_id = os.environ.get("PINTEREST_BOARD_ID", "").strip()
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

    try:
        board = request("GET", f"/boards/{board_id}", token)
        log(f"[pinterest] Board OK: {board.get('name', board_id)}")
    except PinterestError as error:
        log(f"[pinterest] FAILED — cannot read the board.\n  {error}")
        log(
            "[pinterest] Usual causes: the token lacks boards:read, the board id is wrong,\n"
            "            or the token belongs to a different Pinterest account."
        )
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
        time.sleep(DELAY_BETWEEN_PINS)

    log(f"[pinterest] done — {created} created, {failed} failed")
    # A run that attempted work and failed must not report success. The old
    # script's silent exit 0 is the reason this went unnoticed for so long.
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
