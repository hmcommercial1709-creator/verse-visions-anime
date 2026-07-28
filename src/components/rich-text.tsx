import { Fragment } from "react";
import { Link } from "@tanstack/react-router";

/**
 * Minimal inline markup for editorial paragraphs.
 *
 * Supports contextual internal links written as `[label](/article/slug)`.
 * Internal paths render as client-side <Link>s so the crawler sees a real
 * anchor and readers never get a full page reload; anything else falls back
 * to a plain external anchor.
 */
import { INLINE_LINK_RE } from "@/lib/inline-links";

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(INLINE_LINK_RE);

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href] = match;
    parts.push(
      href.startsWith("/") ? (
        <Link
          key={`${match.index}-${href}`}
          to={href}
          className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${match.index}-${href}`}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          className="font-medium text-primary underline underline-offset-4"
        >
          {label}
        </a>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
