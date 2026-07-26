import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAdUnitId, useViewableAdRefresh } from "@/lib/ad-refresh";

/** Replace with the live publisher ID before going live on AdSense. */
export const AD_CLIENT = "ca-pub-0000000000000000";


type Placement =
  | "top"
  | "hero"
  | "inline"
  | "between"
  | "sidebar"
  | "footer"
  | "sticky-mobile"
  | "native"
  | "video"
  | "affiliate";

// Reusable, clean ad placeholders. Wire real ad code into `data-ad-slot`.
export function AdSlot({ placement = "inline", label }: { placement?: Placement; label?: string }) {
  const heights: Record<Placement, string> = {
    top: "h-24",
    hero: "h-28",
    inline: "h-32",
    between: "h-36",
    sidebar: "h-64",
    footer: "h-24",
    "sticky-mobile": "h-14",
    native: "h-40",
    video: "h-56",
    affiliate: "h-40",
  };
  return (
    <div
      data-ad-slot={placement}
      className={`w-full ${heights[placement]} rounded-xl border border-dashed border-border/70 bg-secondary/30 grid place-items-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70`}
      aria-label="advertisement"
    >
      {label ?? `Ad Slot · ${placement}`}
    </div>
  );
}

/**
 * Standard Google AdSense container. Renders the `<ins class="adsbygoogle">`
 * element with a stable DOM id and a reserved box so the unit never shifts
 * layout (CLS = 0) before or after the ad script fills it.
 */
export function AdSenseContainer({
  id,
  slot,
  minHeight,
  format = "auto",
  className = "",
  label,
}: {
  id: string;
  slot?: string;
  minHeight: number;
  format?: string;
  className?: string;
  label?: string;
}) {
  const geo = useGeoTarget();
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight, height: minHeight, contain: "layout size" }}
      aria-label="advertisement"
      role="complementary"
    >
      <ins
        id={id}
        className="adsbygoogle block h-full w-full"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot ?? id}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...adTargetingAttributes(geo, id)}
      />
      <span className="pointer-events-none absolute inset-0 grid place-items-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60">
        {label ?? id}
      </span>
    </div>
  );
}

/**
 * Wraps any AdSense container with its own independent viewability-gated
 * refresh cycle (45s of accumulated in-view time, paused off-screen/off-tab).
 */
function RefreshingUnit({
  slotKind,
  adId,
  prefix,
  minHeight,
  format,
  label,
  className,
}: {
  slotKind: string;
  adId: string;
  prefix: string;
  minHeight: number;
  format?: string;
  label?: string;
  className?: string;
}) {
  const unitId = useAdUnitId(prefix);
  const { ref, refreshKey, viewable } = useViewableAdRefresh<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-ad-slot={slotKind}
      data-ad-unit-id={unitId}
      data-ad-refresh={refreshKey}
      data-ad-viewable={viewable ? "true" : "false"}
    >
      <AdSenseContainer
        key={refreshKey}
        id={adId}
        slot={unitId}
        minHeight={minHeight}
        format={format}
        label={label}
        className={className}
      />
    </div>
  );
}

/** Responsive header leaderboard that sits directly under the sticky nav. */
export function HeaderBannerAd() {
  return (
    <div className="sticky top-[68px] z-30 border-y border-border/50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6">
        <RefreshingUnit
          slotKind="header"
          adId="Header_Ad"
          prefix="av-header"
          minHeight={90}
          label="Header_Ad · 728×90 / 320×50"
          className="rounded-lg border border-dashed border-border/70 bg-secondary/25"
        />
      </div>
    </div>
  );
}

/** Billboard directly beneath the article title / byline block. */
export function BelowTitleAd() {
  return (
    <div className="my-6">
      <RefreshingUnit
        slotKind="below-title"
        adId="Below_Title_Ad"
        prefix="av-below-title"
        minHeight={100}
        label="Below_Title_Ad · 970×90 / 336×100"
        className="rounded-xl border border-dashed border-border/70 bg-secondary/25"
      />
    </div>
  );
}

/** Post-article / pre-footer banner. */
export function PostContentAd() {
  return (
    <div className="mt-12">
      <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">Advertisement</div>
      <RefreshingUnit
        slotKind="post-content"
        adId="Post_Content_Ad"
        prefix="av-post-content"
        minHeight={250}
        label="Post_Content_Ad · 970×250 / 336×280"
        className="rounded-2xl border border-dashed border-border/70 bg-secondary/25"
      />
    </div>
  );
}

/** In-article native unit, designed to read as part of the flow. */
export function InArticleAd({
  index = 1,
  unitId,
  adId,
}: {
  index?: number;
  unitId?: string;
  adId?: string;
}) {
  const autoId = useAdUnitId("av-inarticle");
  const id = unitId ?? autoId;
  const containerId = adId ?? `InArticle_Ad_${index}`;
  const { ref, refreshKey, viewable } = useViewableAdRefresh<HTMLElement>();

  return (
    <aside
      ref={ref}
      data-ad-slot="in-article"
      data-ad-unit-id={id}
      data-ad-refresh={refreshKey}
      data-ad-viewable={viewable ? "true" : "false"}
      aria-label="advertisement"
      className="my-8 overflow-hidden rounded-2xl border border-border/60 bg-card/40"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
        <span>Sponsored</span>
        <span className="font-mono opacity-60">slot {index}</span>
      </div>
      <AdSenseContainer
        key={refreshKey}
        id={containerId}
        slot={id}
        minHeight={128}
        format="fluid"
        label={`${containerId} · native`}
      />
    </aside>
  );
}

/** Desktop sidebar unit that stays in view while the reader scrolls. */
export function StickySidebarAd({
  label = "Sidebar_Sticky_Ad · 300×600",
  unitId,
  adId = "Sidebar_Sticky_Ad",
}: {
  label?: string;
  unitId?: string;
  adId?: string;
}) {
  const autoId = useAdUnitId("av-sidebar");
  const id = unitId ?? autoId;
  const { ref, refreshKey, viewable } = useViewableAdRefresh<HTMLDivElement>();

  return (
    <div className="sticky top-28 hidden lg:block">
      <div
        ref={ref}
        data-ad-slot="sticky-sidebar"
        data-ad-unit-id={id}
        data-ad-refresh={refreshKey}
        data-ad-viewable={viewable ? "true" : "false"}
        aria-label="advertisement"
      >
        <AdSenseContainer
          key={refreshKey}
          id={adId}
          slot={id}
          minHeight={600}
          format="vertical"
          label={label}
          className="rounded-2xl border border-dashed border-border/70 bg-secondary/25"
        />
      </div>
    </div>
  );
}


/** Mobile-only bottom anchor banner with a dismiss control. */
export function MobileAnchorAd() {
  const [closed, setClosed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  if (closed || !ready) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="relative border-t border-border/60 bg-background/95 backdrop-blur-md px-3 pb-[env(safe-area-inset-bottom)] pt-2">
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Close advertisement"
          className="absolute -top-3 right-3 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-lg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <AdSenseContainer
          id="Mobile_Anchor_Ad"
          minHeight={50}
          label="Mobile_Anchor_Ad · 320×50"
          className="rounded-lg border border-dashed border-border/70 bg-secondary/30"
        />

      </div>
    </div>
  );
}

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
