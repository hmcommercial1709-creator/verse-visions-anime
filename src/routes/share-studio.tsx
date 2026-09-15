import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ExternalLink, Megaphone, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/ui-bits";
import { publishedArticleList, articleTags } from "@/data/articles";
import {
  POST_PLATFORMS,
  PLATFORM_LABELS,
  draftFor,
  isPosted,
  nextUnposted,
  readPostLog,
  togglePosted,
  writePostLog,
  type PostLog,
  type PostPlatform,
  type PostSource,
} from "@/lib/post-kit";

const TITLE = "Share Studio — Ready-to-Post Captions for Every Page";
const DESC =
  "Every published GameCastle page, with a caption already written for Pinterest, Facebook, Telegram, X, WhatsApp and Reddit. Copy it, or open the platform with the post pre-filled.";
const URL = "https://gamecastle.store/share-studio";

const SITE = "https://gamecastle.store";

/**
 * The pages worth promoting, newest first.
 *
 * Built at module scope from the site's own article data, so a caption always
 * carries the editorial title and excerpt rather than a slug with the hyphens
 * taken out. Nothing is fetched: this is the same data the article pages
 * render from.
 */
const SOURCES: PostSource[] = publishedArticleList()
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    url: `${SITE}/article/${article.slug}`,
    // `cover` is a CSS gradient on every article, so only ogImage is a real
    // image URL. Pinterest is the one platform that needs one.
    image: article.ogImage?.startsWith("http")
      ? article.ogImage
      : article.ogImage
        ? `${SITE}${article.ogImage}`
        : undefined,
    tags: articleTags(article),
  }));

export const Route = createFileRoute("/share-studio")({
  head: () => ({
    meta: [
      { title: `${TITLE} · GameCastle Anime` },
      { name: "description", content: DESC },
      // A workbench for publishing the site, not a page anyone searches for.
      // Indexing it would add a thin page that competes with the articles it
      // exists to promote.
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ShareStudioPage,
});

function ShareStudioPage() {
  const [platform, setPlatform] = useState<PostPlatform>("pinterest");
  const [log, setLog] = useState<PostLog>({});
  const [copied, setCopied] = useState<string | null>(null);

  // localStorage does not exist during the server render, so the log loads
  // after mount. Until then every card simply reads as not yet posted.
  useEffect(() => setLog(readPostLog()), []);

  const save = useCallback((next: PostLog) => {
    setLog(next);
    writePostLog(next);
  }, []);

  const drafts = useMemo(
    () => SOURCES.map((source) => ({ source, draft: draftFor(platform, source) })),
    [platform],
  );

  const done = drafts.filter(({ source }) => isPosted(log, platform, source.slug)).length;
  const next = nextUnposted(log, platform, SOURCES);

  const copy = async (slug: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(slug);
      window.setTimeout(() => setCopied((current) => (current === slug ? null : current)), 2000);
    } catch {
      // Refused in insecure contexts and some in-app browsers. The text is
      // on screen and selectable, so this is a lost convenience, not a wall.
      setCopied(null);
    }
  };

  /** Opens the composer and marks the page posted in one action. */
  const openNext = () => {
    if (!next) return;
    const draft = draftFor(platform, next);
    window.open(draft.composer, "_blank", "noopener,noreferrer");
    save(togglePosted(log, platform, next.slug));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Share Studio" }]} />

      <h1 className="font-display text-4xl font-bold lg:text-5xl">Share Studio</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Every published page, with the caption already written for each platform. No API key and no
        app review — each button opens the platform&apos;s own composer with the post filled in, so
        publishing is one tap to confirm.
      </p>

      {/* --- platform picker ------------------------------------------- */}
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Platform">
        {POST_PLATFORMS.map((id) => {
          const active = id === platform;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setPlatform(id)}
              className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {PLATFORM_LABELS[id]}
            </button>
          );
        })}
      </div>

      {/* --- progress + one-tap flow ----------------------------------- */}
      <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">
              {done} of {SOURCES.length} posted to {PLATFORM_LABELS[platform]}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tracked in this browser only. Clearing site data resets it.
            </p>
          </div>

          <div className="flex gap-2">
            {done > 0 && (
              <button
                type="button"
                onClick={() => save({ ...log, [platform]: [] })}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={openNext}
              disabled={!next}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-40"
            >
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              {next ? "Post the next one" : "All done"}
            </button>
          </div>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-border/50"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={SOURCES.length}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${SOURCES.length ? (done / SOURCES.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* --- one card per page ----------------------------------------- */}
      <ul className="mt-8 space-y-4">
        {drafts.map(({ source, draft }) => {
          const posted = isPosted(log, platform, source.slug);
          return (
            <li
              key={source.slug}
              className={`rounded-2xl border p-5 transition-colors ${
                posted ? "border-border/40 bg-card/20 opacity-60" : "border-border/60 bg-card/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-base font-semibold leading-snug">
                  <Link
                    to="/article/$slug"
                    params={{ slug: source.slug }}
                    className="hover:text-primary"
                  >
                    {source.title}
                  </Link>
                </h2>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {draft.length}/{draft.limit}
                </span>
              </div>

              <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-background/60 p-3 text-sm leading-relaxed text-muted-foreground">
                {draft.text}
              </pre>

              {draft.caveat && (
                <p className="mt-2 text-xs text-amber-400/90">{draft.caveat}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(source.slug, draft.text)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-4 text-sm font-semibold transition-colors hover:border-primary/50"
                >
                  {copied === source.slug ? (
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copied === source.slug ? "Copied" : "Copy text"}
                </button>

                <a
                  href={draft.composer}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!posted) save(togglePosted(log, platform, source.slug));
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
                  style={{ backgroundColor: draft.accent }}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open {draft.label}
                </a>

                <button
                  type="button"
                  aria-pressed={posted}
                  onClick={() => save(togglePosted(log, platform, source.slug))}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {posted ? "Posted" : "Mark posted"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
