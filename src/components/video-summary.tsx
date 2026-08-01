import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";
import { officialPlatformFor } from "@/data/video-summaries";

/**
 * Video-first content block: a responsive click-to-play YouTube embed (no
 * third-party iframe before interaction, so LCP/CLS stay clean), an Arabic
 * RTL summary written for search below it, and a single prominent CTA to the
 * licensed platform. Used on the homepage and on every episode page.
 */
export function VideoSummaryCard({
  animeSlug,
  animeTitle,
  youtubeId,
  titleAr,
  kindLabelAr,
  paragraphsAr,
  headingAs = "h3",
  episodeNumber,
  className,
}: {
  animeSlug: string;
  animeTitle: string;
  youtubeId: string;
  titleAr: string;
  kindLabelAr: string;
  paragraphsAr: string[];
  headingAs?: "h2" | "h3";
  episodeNumber?: number;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const platform = officialPlatformFor(animeSlug, animeTitle);
  const Heading = headingAs;
  const embedTitle = episodeNumber
    ? `${animeTitle} — الحلقة ${episodeNumber} · ${kindLabelAr}`
    : `${animeTitle} · ${kindLabelAr}`;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border/60 bg-card/40 ${className ?? ""}`}
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
              aria-label={`تشغيل ${embedTitle}`}
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground glow-primary transition-transform hover:scale-110">
                <Play className="h-7 w-7 fill-current" />
              </span>
            </button>
          </>
        )}
      </div>

      <div dir="rtl" lang="ar" className="p-5 text-right">
        <span className="inline-block rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
          {kindLabelAr}
        </span>
        <Heading className="mt-2 font-display text-xl font-bold leading-snug sm:text-2xl">{titleAr}</Heading>

        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/85">
          {paragraphsAr.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-accent-foreground hover:brightness-110 sm:w-auto"
        >
          شاهد الحلقة الكاملة على المنصة الرسمية
          <ExternalLink className="h-4 w-4 shrink-0" />
        </a>
        <p className="mt-2 text-[11px] text-muted-foreground">
          الروابط تؤدي إلى {platform.label} — منصة مرخّصة رسمياً. لا نستضيف أي حلقات على موقعنا.
        </p>
      </div>
    </section>
  );
}
