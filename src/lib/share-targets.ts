/**
 * Share destinations, as plain intent URLs.
 *
 * No SDKs. Facebook, X, Reddit and Pinterest all publish a share widget that
 * wants a script tag, and every one of those is a third-party bundle plus a
 * tracker on every page that carries a share button. A share is a link with a
 * query string — that is all any of these endpoints need — so this file builds
 * the link and the browser opens it.
 *
 * What this cannot do, and does not pretend to: attach the generated card
 * IMAGE. Web share intents carry text and a URL, never a file. The image
 * travels one of two honest ways — the Web Share API with files, which works
 * on most phones (see canShareFiles), or the download button, which always
 * works. A link preview does the rest: the shared URL rebuilds the same card
 * for whoever opens it.
 */

export type ShareTargetId = "whatsapp" | "x" | "telegram" | "facebook" | "reddit" | "pinterest";

export interface ShareTarget {
  id: ShareTargetId;
  label: string;
  /** Brand colour, used for the button's accent only. */
  accent: string;
  build: (input: ShareInput) => string;
}

export interface ShareInput {
  /** The page being shared. Must be absolute — every endpoint below requires it. */
  url: string;
  /** One line of context. Kept short: several platforms truncate hard. */
  text: string;
  /** Absolute image URL, for the one target that needs one. */
  image?: string;
}

const enc = encodeURIComponent;

export const SHARE_TARGETS: ShareTarget[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    accent: "#25D366",
    // wa.me takes a single text field, so the URL rides inside it.
    build: ({ url, text }) => `https://wa.me/?text=${enc(`${text} ${url}`)}`,
  },
  {
    id: "x",
    label: "X",
    accent: "#e7e9ea",
    build: ({ url, text }) => `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    accent: "#29A9EB",
    build: ({ url, text }) => `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    accent: "#1877F2",
    // Facebook takes the URL only and reads the title and image from the
    // page's Open Graph tags, so no text parameter is passed here.
    build: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
  },
  {
    id: "reddit",
    label: "Reddit",
    accent: "#FF4500",
    build: ({ url, text }) => `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(text)}`,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    accent: "#E60023",
    // media is optional: without it Pinterest asks the pinner to choose an
    // image from the page, which still works. Passing an empty media would
    // not.
    build: ({ url, text, image }) =>
      `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(text)}` +
      (image ? `&media=${enc(image)}` : ""),
  },
];

/** Whether this browser can share an actual file (the card image itself). */
export function canShareFiles(files: File[]): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (typeof nav.share !== "function" || typeof nav.canShare !== "function") return false;
  try {
    return nav.canShare({ files });
  } catch {
    return false;
  }
}
