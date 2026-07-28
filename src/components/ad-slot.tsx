import { AD_CLIENT } from "@/components/adsense-unit";

export { AD_CLIENT };

/**
 * AUTO ADS ONLY.
 *
 * Google AdSense Auto Ads is enabled for this domain, so Google decides where
 * ads go and injects them straight into the natural content flow. Every manual
 * slot in this file is therefore a no-op: no reserved boxes, no dark
 * placeholders, no min-heights, no labels. The exports are kept so existing
 * pages keep compiling and no layout wrapper has to be touched.
 */

const NoAd = () => null;

export const AdSlot: (props?: unknown) => null = NoAd;
export const AdSenseContainer: (props?: unknown) => null = NoAd;
export const MultiplexAd: (props?: unknown) => null = NoAd;
export const DisplayAd: (props?: unknown) => null = NoAd;
export const InFeedAd: (props?: unknown) => null = NoAd;
export const VideoAd: (props?: unknown) => null = NoAd;
export const HeaderBannerAd: (props?: unknown) => null = NoAd;
export const BelowTitleAd: (props?: unknown) => null = NoAd;
export const PostContentAd: (props?: unknown) => null = NoAd;
export const InArticleAd: (props?: unknown) => null = NoAd;
export const StickySidebarAd: (props?: unknown) => null = NoAd;
export const MobileAnchorAd: (props?: unknown) => null = NoAd;

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
