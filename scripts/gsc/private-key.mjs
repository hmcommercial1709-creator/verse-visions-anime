/**
 * Normalising and validating the Search Console service-account private key.
 *
 * This exists because of a real failure. The nightly job died with:
 *
 *   GSC sitemap submission failed (status ERR_OSSL_UNSUPPORTED):
 *   error:1E08010C:DECODER routines::unsupported
 *
 * which is OpenSSL saying "this is not a key I can read" and nothing else. It
 * names no cause, no field and no fix, and it looks like a Google or a network
 * problem when it is neither — the credential never got as far as being sent.
 *
 * Four different ways of storing the key produce that identical error, and the
 * old handling (`key.replace(/\\n/g, "\n")`) only covered the first:
 *
 *   1. literal \n escapes, as GitHub stores a pasted one-line secret
 *   2. the whole value wrapped in double quotes, because it was copied
 *      straight out of the service-account JSON including its quotes
 *   3. newlines collapsed to spaces, which some paste targets do
 *   4. the base64 body with its line wrapping stripped
 *
 * All four are recoverable without guessing: the base64 body and the PEM
 * header are still present in every one of them, so the key can be rebuilt
 * exactly. What is NOT recoverable — a truncated key, the wrong field, a
 * passphrase-protected key — is reported as itself instead of as an OpenSSL
 * code.
 *
 * Nothing here weakens verification: the result is parsed with
 * crypto.createPrivateKey before it is returned, so a key that reaches the
 * caller is one that actually works.
 */

import { createPrivateKey } from "node:crypto";

const HEADER = /-----BEGIN ([A-Z ]*PRIVATE KEY)-----/;
const FOOTER = /-----END ([A-Z ]*PRIVATE KEY)-----/;

/** Re-wraps a base64 body at 64 characters, which is what PEM requires. */
const wrap64 = (body) => body.replace(/(.{64})/g, "$1\n").trim();

/**
 * Returns { key } on success, or { error } describing what is actually wrong.
 * Never throws: the caller decides whether a missing key is fatal.
 */
export function normalizePrivateKey(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    return { error: "the key is empty or not set" };
  }

  let value = raw.trim();

  // Copied out of the service-account JSON with its surrounding quotes.
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  // GitHub stores a pasted one-line secret with the newlines as literal \n.
  value = value
    .replace(/\\r\\n|\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\\"/g, '"');

  const header = value.match(HEADER);
  if (!header) {
    return {
      error:
        "no PEM header found. The value should start with -----BEGIN PRIVATE KEY----- — " +
        "copy the whole `private_key` field from the service-account JSON, not the file path, " +
        "the client_email, or the JSON itself",
    };
  }
  if (!FOOTER.test(value)) {
    return {
      error:
        "the PEM header is present but the -----END----- footer is missing — the value is truncated",
    };
  }
  if (/ENCRYPTED/.test(header[1])) {
    return {
      error:
        "this key is passphrase-protected; Search Console service accounts use an unencrypted PKCS#8 key",
    };
  }

  // Try as-is first: a correctly stored key needs no repair.
  const attempt = (candidate) => {
    try {
      createPrivateKey(candidate);
      return candidate;
    } catch {
      return null;
    }
  };

  const direct = attempt(value);
  if (direct) return { key: direct };

  // Rebuild from the parts that survive any of the manglings above. The body
  // is base64, so every character between the markers that is not base64 is
  // formatting damage and can be dropped without losing information.
  const label = header[1];
  const between = value.slice(value.indexOf(header[0]) + header[0].length, value.search(FOOTER));
  const body = between.replace(/[^A-Za-z0-9+/=]/g, "");
  if (!body) return { error: "the PEM markers are present but the key body between them is empty" };

  const rebuilt = `-----BEGIN ${label}-----\n${wrap64(body)}\n-----END ${label}-----\n`;
  const repaired = attempt(rebuilt);
  if (repaired) return { key: repaired, repaired: true };

  return {
    error:
      "the value looks like a PEM but OpenSSL cannot decode it, even after repairing its line breaks. " +
      "Re-copy the `private_key` field from a freshly downloaded service-account JSON key",
  };
}

/**
 * Reads and validates the credential pair from the environment.
 * Returns { email, privateKey } or { error }.
 */
export function credentialsFromEnv(env = process.env) {
  const email = env.GSC_CLIENT_EMAIL?.trim();
  const rawKey = env.GSC_PRIVATE_KEY;
  if (!email && !rawKey) return { error: "GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY are not set" };
  if (!email) return { error: "GSC_CLIENT_EMAIL is not set" };
  if (!/^[^@\s]+@[^@\s]+\.iam\.gserviceaccount\.com$/.test(email)) {
    return {
      error: `GSC_CLIENT_EMAIL does not look like a service account: "${email}". It should end in .iam.gserviceaccount.com`,
    };
  }
  const { key, error, repaired } = normalizePrivateKey(rawKey);
  if (error) return { error: `GSC_PRIVATE_KEY: ${error}` };
  return { email, privateKey: key, repaired };
}
