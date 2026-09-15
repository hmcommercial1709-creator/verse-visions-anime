import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SHARE_TARGETS, canShareFiles, type ShareInput } from "@/lib/share-targets";

/**
 * The share row.
 *
 * Every button is an ordinary link to a platform's own intent URL — no SDKs,
 * no widget scripts, no trackers. See share-targets.ts.
 *
 * `file` is the generated card. When the browser can share a file (most
 * phones), the first button shares the IMAGE itself through the native sheet,
 * which is the only path that actually puts the picture in a chat. Everywhere
 * else the link travels alone and rebuilds the card for whoever opens it.
 */
export function ShareBar({
  url,
  text,
  image,
  file,
  label = "Share it",
}: ShareInput & { file?: File | null; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const timer = useRef(0);

  // Capability checks belong in an effect: navigator does not exist during the
  // server render, and branching on it in the body is a hydration mismatch.
  useEffect(() => {
    setCanShare(Boolean(file) && canShareFiles([file as File]));
  }, [file]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Refused in insecure contexts and some webviews. The address bar still
      // holds the link, so this is a missing convenience, not a broken share.
      setCopied(false);
    }
  };

  const shareFile = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text, url });
    } catch {
      // Includes the user simply dismissing the sheet, which is not an error.
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {canShare && (
          <button
            type="button"
            onClick={shareFile}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share the image
          </button>
        )}

        {SHARE_TARGETS.map((target) => (
          <a
            key={target.id}
            href={target.build({ url, text, image })}
            target="_blank"
            rel="noopener noreferrer"
            // min-h-11 is the touch target floor: anything shorter is a
            // mis-tap on a phone, which is where most of these are used.
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-card"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: target.accent }}
            />
            {target.label}
          </a>
        ))}

        <button
          type="button"
          onClick={copy}
          className="relative inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-card"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy link"}
          {copied && (
            <span
              role="status"
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs font-semibold text-background"
            >
              Link copied
            </span>
          )}
        </button>
      </div>

      {!canShare && file && (
        <p className="mt-3 text-xs text-muted-foreground">
          These share the link, which rebuilds the same card for whoever opens it. To post the
          picture itself, download it first.
        </p>
      )}
    </div>
  );
}
