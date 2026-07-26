import { useState } from "react";
import { Play, Film, ImageIcon } from "lucide-react";
import type { MediaArt } from "@/lib/media";
import { artAlt } from "@/lib/media";
import { cn } from "@/lib/utils";

type Ratio = "16/9" | "2/3" | "3/1" | "4/3";

/**
 * Lazy, CLS-safe image. The wrapper reserves the aspect ratio before the
 * bitmap arrives, so layout never shifts. `priority` opts a single LCP image
 * out of lazy loading per page.
 */
export function MediaImage({
  art,
  alt,
  ratio = "16/9",
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  gradient,
  overlay = true,
}: {
  art: MediaArt;
  alt: string;
  ratio?: Ratio;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Painted behind the image so the box is never empty while loading. */
  gradient?: string;
  overlay?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden bg-secondary/40", className)}
      style={{ aspectRatio: ratio, background: gradient }}
    >
      {failed ? (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <ImageIcon className="h-6 w-6 opacity-40" aria-hidden="true" />
        </div>
      ) : (
        <img
          src={art.src}
          srcSet={art.srcSet}
          sizes={sizes}
          width={art.width}
          height={art.height}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
      )}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      )}
    </div>
  );
}

/**
 * Responsive video player card. Renders a lightweight poster facade first and
 * only mounts the iframe on interaction, so no third-party frame is loaded on
 * page load. When no embed id is supplied it degrades to an official-channel
 * link instead of an empty player.
 */
export function VideoEmbed({
  art,
  title,
  subtitle,
  youtubeId,
  searchQuery,
  className,
}: {
  art: MediaArt;
  title: string;
  subtitle?: string;
  youtubeId?: string;
  searchQuery?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const query = encodeURIComponent(searchQuery ?? `${title} official trailer`);

  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-border/60 bg-card/40", className)}>
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {playing && youtubeId ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <MediaImage art={art} alt={artAlt(title)} ratio="16/9" className="absolute inset-0 h-full w-full" overlay />
            {youtubeId ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${title}`}
                className="absolute inset-0 grid place-items-center transition-colors hover:bg-background/20"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg glow-primary">
                  <Play className="h-7 w-7" aria-hidden="true" />
                </span>
              </button>
            ) : (
              <a
                href={`https://www.youtube.com/results?search_query=${query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 grid place-items-center transition-colors hover:bg-background/20"
              >
                <span className="flex items-center gap-2 rounded-full bg-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg">
                  <Play className="h-4 w-4" aria-hidden="true" /> Watch on the official channel
                </span>
              </a>
            )}
          </>
        )}
      </div>
      <figcaption className="flex items-start gap-3 border-t border-border/60 p-4">
        <Film className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{title}</span>
          {subtitle && <span className="mt-0.5 block text-xs text-muted-foreground">{subtitle}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/** Full-width illustrated section header used inside long-form articles. */
export function SectionHeaderImage({
  art,
  caption,
  alt,
}: {
  art: MediaArt;
  caption: string;
  alt?: string;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-border/60">
      <MediaImage art={art} alt={alt ?? artAlt(caption)} ratio="3/1" sizes="(min-width: 1024px) 720px, 100vw" overlay={false} />
      <figcaption className="border-t border-border/60 bg-card/40 px-4 py-2.5 text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
