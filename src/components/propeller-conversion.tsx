import { useEffect } from "react";

const AID = "3891393";

/**
 * PropellerAds postback: when a visitor lands with a ?subid=... in the URL,
 * fire a single background conversion ping. Guarded so client-side navigation
 * (or React strict-mode double effects) never sends it twice.
 */
export function PropellerConversion() {
  useEffect(() => {
    const subid = new URLSearchParams(window.location.search).get("subid");
    if (!subid) return;

    const key = `propeller-conversion:${subid}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode) — still fire once per mount.
    }

    const url = `https://ad.propellerads.com/conversion.php?aid=${AID}&tid=${encodeURIComponent(subid)}`;
    fetch(url, { mode: "no-cors", credentials: "omit", keepalive: true }).catch(() => {
      // Conversion pings are fire-and-forget; failures must never surface.
    });
  }, []);

  return null;
}
