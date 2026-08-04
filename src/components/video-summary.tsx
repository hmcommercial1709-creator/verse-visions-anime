import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";
import { officialPlatformFor } from "@/data/video-summaries";

/**
 * Privacy-friendly video and editorial summary.
 * The YouTube iframe is not created until the visitor clicks play, while the
 * complete original summary remains readable without an ad, countdown or modal.
 */
export function VideoSummaryCard({
  animeSlug,
  animeTitle,
  youtubeId,
  title,
  kindLabel,
  paragraphs,
  headingAs = "h3",
  episodeNumber,
  className,
}: {
  animeSlug: string;
  animeTitle: string;
  youtubeId: string;
  title: string;
  kindLabel: string;
  paragraphs: string[];
  headingAs?: "h2" | "h3";
  episodeNumber?: number;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const platform = officialPlatformFor(animeSlug, animeTitle);
  const Heading = headingAs;
  const embedTitle = episodeNumber
    ? `${animeTitle} — episode ${episodeNumber} · ${kindLabel}`
    : `${animeTitle} · ${kindLabel}`;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border/60 bg-card/40 ${
        className ?? ""
      }`}
    >
      <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={embedTitle}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            <MediaImage
              art={posterFor(animeSlug, [animeTitle])}
              alt={artAlt(animeTitle, "poster")}
              ratio="16/9"
              className="absolute inset-0 h-full w-full"
              imgClassName="object-cover object-top"
              sizes="(min-width:1024px) 720px, 100vw"
              overlay={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video preview of ${embedTitle}`}
              className="absolute inset-0 grid place-items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground glow-primary transition-transform hover:scale-105 motion-reduce:transform-none">
                <Play className="h-7 w-7 fill-current" />
              </span>
            </button>
            <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white">
              Click to play · privacy-enhanced
            </span>
          </>
        )}
      </div>

      <div className="p-5">
        <span className="inline-block rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
          {kindLabel}
        </span>
        <Heading className="mt-2 font-display text-xl font-bold leading-snug sm:text-2xl">
          {title}
        </Heading>

        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/85">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>

        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-accent-foreground hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
        >
          Check licensed availability on {platform.label}
          <ExternalLink className="h-4 w-4 shrink-0" />
        </a>

        <p className="mt-2 text-[11px] text-muted-foreground">
          The link opens {platform.label}. GameCastle Anime does not host episodes.
        </p>
      </div>
    </section>
  );
}
