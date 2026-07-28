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

type AnyAdProps = Record<string, unknown>;
const NoAd = (_props: AnyAdProps) => null;

export const AdSlot: (props: AnyAdProps) => null = NoAd;
export const AdSenseContainer: (props: AnyAdProps) => null = NoAd;
export const MultiplexAd: (props: AnyAdProps) => null = NoAd;
export const DisplayAd: (props: AnyAdProps) => null = NoAd;
export const InFeedAd: (props: AnyAdProps) => null = NoAd;
export const VideoAd: (props: AnyAdProps) => null = NoAd;
export const HeaderBannerAd: (props: AnyAdProps) => null = NoAd;
export const BelowTitleAd: (props: AnyAdProps) => null = NoAd;
export const PostContentAd: (props: AnyAdProps) => null = NoAd;
export const InArticleAd: (props: AnyAdProps) => null = NoAd;
export const StickySidebarAd: (props: AnyAdProps) => null = NoAd;
export const MobileAnchorAd: (props: AnyAdProps) => null = NoAd;

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
