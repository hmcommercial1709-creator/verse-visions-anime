import { AD_CLIENT, AdsenseUnit } from "@/components/adsense-unit";
import { useAdUnitId } from "@/lib/ad-refresh";

export { AD_CLIENT };

/**
 * Manual AdSense placements (alongside Auto Ads).
 *
 * Four live units, each wrapped in <AdsenseUnit /> so they:
 *  - render exactly one responsive <ins class="adsbygoogle">
 *  - reserve height while loading (no layout shift) and collapse when unfilled
 *  - re-push on client-side route changes
 */
export const AD_SLOTS = {
  inArticle: "9312300696",
  multiplex: "9734703029",
  display: "5126563543",
  inFeed: "2783547212",
  displayTop: "9027889883",
} as const;


type BaseProps = {
  className?: string;
  unitId?: string;
  adId?: string;
  index?: number;
  label?: string;
  title?: string;
  placement?: string;
  prefix?: string;
  minHeight?: number;
};

/** Fluid in-article unit — best between paragraphs of long-form content. */
export function InArticleAd({ className = "", unitId, adId, index, prefix, minHeight = 120 }: BaseProps) {
  const auto = useAdUnitId(prefix ?? "av-in-article");
  const id = [unitId, adId, index].filter(Boolean).join("-") || auto;
  return (
    <AdsenseUnit
      id={id}
      slot={AD_SLOTS.inArticle}
      format="fluid"
      layout="in-article"
      fluidHeight
      minHeight={minHeight}
      className={`my-6 ${className}`}
    />
  );
}

/** Autorelaxed multiplex grid — "more content" style unit for page ends. */
export function MultiplexAd({ className = "", unitId, prefix, minHeight = 250 }: BaseProps) {
  const auto = useAdUnitId(prefix ?? "av-multiplex");
  return (
    <AdsenseUnit
      id={unitId ?? auto}
      slot={AD_SLOTS.multiplex}
      format="autorelaxed"
      fluidHeight
      minHeight={minHeight}
      className={`my-8 ${className}`}
    />
  );
}

/** Responsive display unit ("hazza") — headers, sidebars, post-content. */
export function DisplayAd({ className = "", unitId, adId, index, prefix, minHeight = 100 }: BaseProps) {
  const auto = useAdUnitId(prefix ?? "av-display");
  const id = [unitId, adId, index].filter(Boolean).join("-") || auto;
  return (
    <AdsenseUnit
      id={id}
      slot={AD_SLOTS.display}
      format="auto"
      minHeight={minHeight}
      className={`my-6 ${className}`}
    />
  );
}

/** Fluid in-feed unit — between cards in listing/feed layouts. */
export function InFeedAd({ className = "", unitId, adId, index, prefix, minHeight = 120 }: BaseProps) {
  const auto = useAdUnitId(prefix ?? "av-in-feed");
  const id = [unitId, adId, index].filter(Boolean).join("-") || auto;
  return (
    <AdsenseUnit
      id={id}
      slot={AD_SLOTS.inFeed}
      format="fluid"
      fluidHeight
      minHeight={minHeight}
      className={`my-4 ${className}`}
      extraAttrs={{ "data-ad-layout-key": "-ct-1h+5b-1e-7f" }}
    />
  );
}

/* ---- Semantic aliases used across routes ---- */

export const AdSenseContainer = DisplayAd;
export const HeaderBannerAd = DisplayAd;
export const BelowTitleAd = DisplayAd;
export const PostContentAd = DisplayAd;
export const StickySidebarAd = DisplayAd;
export const VideoAd = DisplayAd;

/** Generic slot: feed positions get the in-feed unit, everything else display. */
export function AdSlot({ placement, className, unitId, adId, index, prefix }: BaseProps) {
  if (placement === "inline") {
    return <InArticleAd className={className} unitId={unitId} adId={adId} index={index} prefix={prefix} />;
  }
  return <InFeedAd className={className} unitId={unitId} adId={adId} index={index} prefix={prefix} />;
}

/** Mobile anchor: Auto Ads owns anchor formats, so keep this a no-op. */
export const MobileAnchorAd = (_props: BaseProps) => null;

/** Editorial affiliate card — real content, not an ad placeholder. */
export function AffiliateBox({
  title,
  subtitle,
  price,
  cta = "View Deal",
}: {
  title: string;
  subtitle: string;
  price?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Affiliate</div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
        {price && <div className="font-display text-lg font-bold text-primary">{price}</div>}
      </div>
      <button className="mt-3 w-full rounded-md bg-primary/10 border border-primary/30 py-2 text-sm font-semibold text-primary hover:bg-primary/20">
        {cta}
      </button>
    </div>
  );
}
