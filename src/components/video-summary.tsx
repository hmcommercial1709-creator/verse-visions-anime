import { useEffect, useRef, useState } from "react";
import { ExternalLink, Lock, Play, Sparkles } from "lucide-react";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";
import { officialPlatformFor } from "@/data/video-summaries";
import { RewardedAdModal } from "@/components/rewarded-ad-modal";

/** Length of the free preview clip, in seconds. */
const PREVIEW_SECONDS = 45;

/**
 * Video-first content block with a rewarded-preview flow:
 * 1. free 45s preview clip (click-to-play YouTube embed, no third-party
 *    iframe before interaction so LCP/CLS stay clean),
 * 2. a rewarded-ad gate that opens as the preview ends — or when the visitor
 *    hits "Watch full episode" — and
 * 3. the unlocked CTA to the licensed platform plus the rest of the Arabic
 *    RTL summary written for search.
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
  const [gateOpen, setGateOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [left, setLeft] = useState(PREVIEW_SECONDS);
  const gateShown = useRef(false);

  const platform = officialPlatformFor(animeSlug, animeTitle);
  const Heading = headingAs;
  const embedTitle = episodeNumber
    ? `${animeTitle} — الحلقة ${episodeNumber} · ${kindLabelAr}`
    : `${animeTitle} · ${kindLabelAr}`;

  // Preview countdown: once the clip is (nearly) over, raise the gate.
  useEffect(() => {
    if (!playing || unlocked) return;
    const id = window.setInterval(() => setLeft((v) => (v <= 1 ? 0 : v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing, unlocked]);

  useEffect(() => {
    if (playing && !unlocked && left <= 3 && !gateShown.current) {
      gateShown.current = true;
      setGateOpen(true);
    }
  }, [playing, unlocked, left]);

  const openGate = () => {
    gateShown.current = true;
    setGateOpen(true);
  };

  const visibleParagraphs = unlocked ? paragraphsAr : paragraphsAr.slice(0, 1);
  const hiddenCount = paragraphsAr.length - visibleParagraphs.length;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border/60 bg-card/40 ${className ?? ""}`}
    >
      <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={
              unlocked
                ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`
                : `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&start=0&end=${PREVIEW_SECONDS}`
            }
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
              aria-label={`تشغيل معاينة ${embedTitle}`}
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground glow-primary transition-transform hover:scale-110">
                <Play className="h-7 w-7 fill-current" />
              </span>
            </button>
            <span
              dir="rtl"
              className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white"
            >
              معاينة مجانية {PREVIEW_SECONDS} ثانية
            </span>
          </>
        )}

        {playing && !unlocked && (
          <span
            dir="rtl"
            className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white"
          >
            المعاينة المجانية · {left} ثانية
          </span>
        )}
      </div>

      <div dir="rtl" lang="ar" className="p-5 text-right">
        <span className="inline-block rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
          {kindLabelAr}
        </span>
        <Heading className="mt-2 font-display text-xl font-bold leading-snug sm:text-2xl">{titleAr}</Heading>

        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/85">
          {visibleParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {unlocked ? (
          <>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> تم فتح الملخص الكامل
            </span>
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-accent-foreground hover:brightness-110 sm:w-auto"
            >
              شاهد الحلقة الكاملة على المنصة الرسمية
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </>
        ) : (
          <>
            {hiddenCount > 0 && (
              <p className="mt-3 text-[12px] text-muted-foreground">
                يتبقى {hiddenCount} مقطع من الملخص — افتحها عبر إعلان قصير.
              </p>
            )}
            <button
              type="button"
              onClick={openGate}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-accent-foreground hover:brightness-110 sm:w-auto"
            >
              <Lock className="h-4 w-4 shrink-0" />
              شاهد الحلقة الكاملة / أكمل الملخص
            </button>
          </>
        )}

        <p className="mt-2 text-[11px] text-muted-foreground">
          الروابط تؤدي إلى {platform.label} — منصة مرخّصة رسمياً. لا نستضيف أي حلقات على موقعنا.
        </p>
      </div>

      <RewardedAdModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onReward={() => setUnlocked(true)}
        platformLabel={platform.label}
        platformUrl={platform.url}
      />
    </section>
  );
}
