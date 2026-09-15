/**
 * Ready-to-post captions for every published page, one per platform.
 *
 * WHY THIS REPLACES THE API POSTER
 * --------------------------------
 * The Pinterest API path needed an app approved for production access. Three
 * live runs failed on that approval, not on our code: "InactiveConsumer" on
 * production, and a rejected token on the sandbox — which is a simulated
 * environment that never touches a real account anyway. The approval is
 * Pinterest's to grant, so no amount of code moves it.
 *
 * Every platform also publishes a *composer* URL that needs no token, no app
 * and no review: a plain link that opens the platform with the post already
 * filled in. That path cannot be revoked and works today. It costs one tap to
 * confirm — which is the trade, and it is the only honest one available.
 *
 * NOTHING HERE IS INVENTED
 * ------------------------
 * Every caption is assembled from the article's own title, excerpt and tags.
 * There is no template that asserts a rating, a ranking, a view count or a
 * superlative the article does not contain.
 */

export type PostPlatform = "pinterest" | "facebook" | "telegram" | "x" | "reddit" | "whatsapp";

/** The page a post points at. All fields come from the site's own data. */
export interface PostSource {
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  /** Absolute image URL. Absent on pages whose only art is a CSS gradient. */
  image?: string;
  tags: string[];
}

export interface PostDraft {
  platform: PostPlatform;
  label: string;
  accent: string;
  /** The exact text to paste, already within the platform's limit. */
  text: string;
  /** Opens the platform's own composer, pre-filled. No token, no SDK. */
  composer: string;
  length: number;
  limit: number;
  /**
   * Set when the platform will not accept this page as-is. It is a warning,
   * not a block: the composer still opens.
   */
  caveat?: string;
}

const enc = encodeURIComponent;

/**
 * Field limits.
 *
 * `pinterest`, `x` and `reddit` are the platforms' own documented maximums.
 * `facebook`, `telegram` and `whatsapp` accept far more than anyone reads, so
 * those three are OUR editorial cap, not a platform rule — a caption longer
 * than this gets collapsed behind a "See more" and stops being read.
 */
export const POST_LIMITS: Record<PostPlatform, number> = {
  pinterest: 500,
  x: 280,
  reddit: 300,
  facebook: 600,
  telegram: 600,
  whatsapp: 600,
};

/**
 * `dr-stone` -> `#DrStone`.
 *
 * Hashtags cannot carry the hyphens our tags use, and a platform reading
 * `#dr-stone` indexes `#dr`. Only the tag's own words are used, so a hashtag
 * never claims a topic the article is not tagged with.
 */
export function hashtag(tag: string): string {
  const words = tag
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.length ? `#${words.join("")}` : "";
}

/**
 * At most `max` hashtags.
 *
 * Every platform that supports them treats a wall of tags as spam, and
 * Pinterest's own guidance is a handful of relevant ones over a keyword dump.
 */
export function hashtags(tags: string[], max = 4): string {
  return tags.slice(0, max).map(hashtag).filter(Boolean).join(" ");
}

/** Trims to `max` on a word boundary, so a caption never ends mid-word. */
export function clamp(value: string, max: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/**
 * Fits `body` into `limit` once `reserved` characters are spoken for.
 *
 * X counts every link as 23 characters regardless of its real length, so the
 * caller reserves that rather than the URL's own length.
 */
function fit(body: string, limit: number, reserved: number): string {
  return clamp(body, Math.max(0, limit - reserved));
}

/**
 * The caption for one platform, written the way that platform is read.
 *
 * Pinterest and Reddit are search surfaces, so the title leads and the words
 * people would type stay in. Facebook reads the link's Open Graph tags and
 * renders its own card, so the caption does not repeat the title. Telegram
 * and WhatsApp are chats, so it is one line and a link.
 */
export function draftFor(platform: PostPlatform, source: PostSource): PostDraft {
  const limit = POST_LIMITS[platform];
  const tags = hashtags(source.tags);
  const { title, excerpt, url } = source;

  let text: string;
  let composer: string;
  let caveat: string | undefined;

  switch (platform) {
    case "pinterest": {
      // Pinterest indexes the description, so the excerpt earns its place
      // here more than anywhere else.
      //
      // Title, excerpt and tags are trimmed SEPARATELY and joined afterwards,
      // because clamp() collapses runs of whitespace — trimming the assembled
      // string flattens the blank lines and the caption arrives as one wall
      // of text with the title welded to the first sentence.
      const tail = tags ? `\n\n${tags}` : "";
      const head = clamp(title, limit - tail.length);
      const room = limit - head.length - tail.length - 2;
      const body = room > 0 ? clamp(excerpt, room) : "";
      text = body ? `${head}\n\n${body}${tail}` : `${head}${tail}`;
      composer =
        `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(text)}` +
        (source.image ? `&media=${enc(source.image)}` : "");
      if (!source.image) {
        caveat =
          "This page has no share image, so Pinterest will ask you to pick one from the page itself.";
      }
      break;
    }
    case "facebook": {
      // sharer.php takes the URL only and builds its card from the page's
      // og: tags, so this text is for pasting into the composer by hand.
      text = `${fit(excerpt, limit, url.length + 2)}\n\n${url}`;
      composer = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
      caveat = "Facebook fills the card from the page itself — paste this text above it.";
      break;
    }
    case "telegram": {
      text = fit(`${title} — ${excerpt}`, limit, 0);
      composer = `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`;
      break;
    }
    case "x": {
      // Every link costs 23 characters on X no matter how long it is.
      const withTags = tags ? ` ${tags}` : "";
      text = `${fit(title, limit, 23 + withTags.length + 2)}${withTags}`;
      composer = `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`;
      break;
    }
    case "reddit": {
      // Reddit posts a title, not a caption, and hashtags read as spam there.
      text = fit(title, limit, 0);
      composer = `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(text)}`;
      caveat = "Pick a subreddit whose rules allow self-promotion, or it will be removed.";
      break;
    }
    case "whatsapp": {
      text = `${fit(title, limit, url.length + 2)}\n\n${url}`;
      composer = `https://wa.me/?text=${enc(text)}`;
      break;
    }
  }

  return {
    platform,
    label: PLATFORM_LABELS[platform],
    accent: PLATFORM_ACCENTS[platform],
    text,
    composer,
    length: text.length,
    limit,
    caveat,
  };
}

export const PLATFORM_LABELS: Record<PostPlatform, string> = {
  pinterest: "Pinterest",
  facebook: "Facebook",
  telegram: "Telegram",
  x: "X",
  reddit: "Reddit",
  whatsapp: "WhatsApp",
};

const PLATFORM_ACCENTS: Record<PostPlatform, string> = {
  pinterest: "#E60023",
  facebook: "#1877F2",
  telegram: "#29A9EB",
  x: "#e7e9ea",
  reddit: "#FF4500",
  whatsapp: "#25D366",
};

/** The three the site is actively promoted on lead the list. */
export const POST_PLATFORMS: PostPlatform[] = [
  "pinterest",
  "facebook",
  "telegram",
  "x",
  "whatsapp",
  "reddit",
];

/* --- What has already been posted ------------------------------------
 *
 * Kept in the poster's own browser. A posting log is a private working note,
 * not site content: it needs no account, and putting it in a table would mean
 * a round trip before the page can even be drawn.
 */

export const POST_LOG_KEY = "gamecastle.postlog.v1";

/** platform -> slugs already posted there. */
export type PostLog = Partial<Record<PostPlatform, string[]>>;

export function parsePostLog(raw: string | null): PostLog {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const log: PostLog = {};
    for (const platform of POST_PLATFORMS) {
      const value = (parsed as Record<string, unknown>)[platform];
      if (Array.isArray(value)) {
        log[platform] = value.filter((slug): slug is string => typeof slug === "string");
      }
    }
    return log;
  } catch {
    // Storage can hold anything a previous version, or another tab, wrote.
    return {};
  }
}

export const isPosted = (log: PostLog, platform: PostPlatform, slug: string): boolean =>
  (log[platform] ?? []).includes(slug);

export function togglePosted(log: PostLog, platform: PostPlatform, slug: string): PostLog {
  const current = log[platform] ?? [];
  const next = current.includes(slug)
    ? current.filter((entry) => entry !== slug)
    : [...current, slug];
  return { ...log, [platform]: next };
}

/** The next page not yet posted to this platform, or null when none is left. */
export function nextUnposted(
  log: PostLog,
  platform: PostPlatform,
  sources: PostSource[],
): PostSource | null {
  return sources.find((source) => !isPosted(log, platform, source.slug)) ?? null;
}

export function readPostLog(): PostLog {
  if (typeof window === "undefined") return {};
  try {
    return parsePostLog(window.localStorage.getItem(POST_LOG_KEY));
  } catch {
    // Private windows and blocked site data both throw on access.
    return {};
  }
}

export function writePostLog(log: PostLog): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(POST_LOG_KEY, JSON.stringify(log));
  } catch {
    // Out of quota, or storage blocked. The page keeps working without it.
  }
}
