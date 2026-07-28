import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useAdUnitId, useViewableAdRefresh } from "@/lib/ad-refresh";
import { adTargetingAttributes, useGeoTarget } from "@/lib/geo-targeting";

/** Live AdSense publisher ID (loaded globally from the root route <head>). */
export const AD_CLIENT = "ca-pub-6422431093727588";




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
      className={`w-full ${heights[placement]} rounded-xl border border-dashed border-border/70 bg-ad-surface grid place-items-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground`}
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
  layout,
  className = "",
  label,
  /** Fluid units (in-article, multiplex) must be allowed to grow. */
  fluidHeight = false,
}: {
  id: string;
  slot?: string;
  minHeight: number;
  format?: string;
  layout?: string;
  className?: string;
  label?: string;
  fluidHeight?: boolean;
}) {
  const geo = useGeoTarget();
  const insRef = useRef<HTMLModElement | null>(null);
  const [filled, setFilled] = useState(false);
  // Re-push on every route change so client-side navigation always fills.
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hand the freshly mounted <ins> to the globally loaded AdSense script.
  useEffect(() => {
    const node = insRef.current;
    if (!node) return;
    let cancelled = false;

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      if (node.getAttribute("data-adsbygoogle-status") !== "done") {
        w.adsbygoogle.push({});
      }
    } catch {
      /* script blocked or not yet available — box stays reserved, no CLS */
    }

    // Swap the placeholder label out once Google fills the unit.
    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            if (cancelled) return;
            if (node.getAttribute("data-ad-status") === "filled" || node.firstElementChild) {
              setFilled(true);
            }
          })
        : null;
    observer?.observe(node, { attributes: true, childList: true, attributeFilter: ["data-ad-status"] });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [id, slot, pathname]);


  return (
    <div
      className={`relative w-full overflow-hidden bg-ad-surface ${className}`}
      style={
        fluidHeight
          ? { minHeight, contain: "layout", backgroundColor: "var(--ad-surface)" }
          : { minHeight, height: minHeight, contain: "layout size", backgroundColor: "var(--ad-surface)" }
      }
      aria-label="advertisement"
      role="complementary"
      data-ad-filled={filled ? "true" : "false"}
      data-ad-label={label ?? id}
    >
      <ins
        ref={insRef}
        id={id}
        className="adsbygoogle block w-full"
        style={{ display: "block", width: "100%", ...(fluidHeight ? {} : { height: "100%" }) }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot ?? "auto"}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
        {...adTargetingAttributes(geo, id)}
      />
    </div>
  );
}




/**
 * Ad unit renderer. AdSense fills the reserved box directly; Monetag serves
 * through its global in-page tag, so no per-slot wrapper is needed.
 */
function RotatingUnit({
  id,
  slot,
  minHeight,
  format,
  layout,
  fluidHeight,
  label,
  className,
}: {
  refreshKey?: number;
  id: string;
  slot?: string;
  minHeight: number;
  format?: string;
  layout?: string;
  fluidHeight?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <AdSenseContainer
      id={id}
      slot={slot}
      minHeight={minHeight}
      format={format}
      layout={layout}
      fluidHeight={fluidHeight}
      label={label}
      className={className}
    />
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
  layout,
  fluidHeight,
  label,
  className,
}: {
  slotKind: string;
  adId: string;
  prefix: string;
  minHeight: number;
  format?: string;
  layout?: string;
  fluidHeight?: boolean;
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
      data-ad-network="adsense"
      data-ad-viewable={viewable ? "true" : "false"}
    >
      <RotatingUnit
        key={refreshKey}
        id={adId}
        slot={unitId}
        minHeight={minHeight}
        format={format}
        layout={layout}
        fluidHeight={fluidHeight}
        label={label}
        className={className}
      />
    </div>
  );
}



/**
 * Multiplex / "matched content" grid — high-yield recirculation unit meant to
 * sit at the end of long pages, below the article body or feed.
 */
export function MultiplexAd({
  adId = "Multiplex_Ad",
  prefix = "av-multiplex",
  title = "You may also like",
  className = "",
}: {
  adId?: string;
  prefix?: string;
  title?: string;
  className?: string;
}) {
  return (
    <section className={`mt-12 ${className}`} aria-label="Sponsored recommendations">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>{title}</span>
        <span>Advertisement</span>
      </div>
      <RefreshingUnit
        slotKind="multiplex"
        adId={adId}
        prefix={prefix}
        minHeight={320}
        format="autorelaxed"
        fluidHeight
        label={`${adId} · matched content`}
        className="rounded-2xl border border-dashed border-border/70 bg-ad-surface"
      />
    </section>
  );
}

/**
 * Generic responsive display unit for grid/listing pages. Google picks the
 * best size within the reserved box, so the layout never shifts.
 */
export function DisplayAd({
  adId,
  prefix = "av-display",
  minHeight = 280,
  label,
  className = "",
}: {
  adId: string;
  prefix?: string;
  minHeight?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <RefreshingUnit
        slotKind="display"
        adId={adId}
        prefix={prefix}
        minHeight={minHeight}
        format="auto"
        label={label ?? `${adId} · responsive`}
        className="rounded-2xl border border-dashed border-border/70 bg-ad-surface"
      />
    </div>
  );
}

/**
 * In-feed native unit. Uses Google's fluid in-feed layout so the creative
 * adopts the surrounding card styling and reads as part of the list — the
 * highest-yield format for scroll-heavy feeds. Impressions register on view.
 */
export function InFeedAd({
  index = 1,
  unitId,
  adId,
  label = "Sponsored",
}: {
  index?: number;
  unitId?: string;
  adId?: string;
  label?: string;
}) {
  const autoId = useAdUnitId("av-infeed");
  const id = unitId ?? autoId;
  const containerId = adId ?? `InFeed_Ad_${index}`;
  const { ref, refreshKey, viewable } = useViewableAdRefresh<HTMLElement>();

  return (
    <aside
      ref={ref}
      data-ad-slot="in-feed"
      data-ad-unit-id={id}
      data-ad-refresh={refreshKey}
      data-ad-viewable={viewable ? "true" : "false"}
      aria-label="advertisement"
      className="my-5 overflow-hidden rounded-2xl border border-border/60 bg-card/40"
    >
      <RotatingUnit
        key={refreshKey}
        refreshKey={refreshKey}
        id={containerId}
        slot={id}
        minHeight={220}
        format="fluid"
        layout="in-article"
        fluidHeight
        label={`${containerId} · in-feed`}
      />
    </aside>
  );
}

/**
 * Outstream / in-content video unit. Reserves a 16:9-ish box so Google's video
 * demand can fill it without shifting the layout; counts a viewable impression
 * as soon as it scrolls into view — no click required.
 */
export function VideoAd({
  index = 1,
  unitId,
  adId,
  title = "Featured video",
}: {
  index?: number;
  unitId?: string;
  adId?: string;
  title?: string;
}) {
  const autoId = useAdUnitId("av-video");
  const id = unitId ?? autoId;
  const containerId = adId ?? `Video_Ad_${index}`;
  const { ref, refreshKey, viewable } = useViewableAdRefresh<HTMLElement>();

  return (
    <aside
      ref={ref}
      data-ad-slot="video"
      data-ad-unit-id={id}
      data-ad-refresh={refreshKey}
      data-ad-viewable={viewable ? "true" : "false"}
      aria-label="advertisement"
      className="my-6 overflow-hidden rounded-2xl border border-border/60 bg-card/40"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>{title}</span>
        <span>Advertisement</span>
      </div>
      <RotatingUnit
        key={refreshKey}
        refreshKey={refreshKey}
        id={containerId}
        slot={id}
        minHeight={280}
        format="auto"
        label={`${containerId} · video`}
      />
    </aside>
  );
}



/** Responsive header leaderboard that sits directly under the sticky nav. */
export function HeaderBannerAd() {
  return (
    <div className="border-y border-border/50 bg-background/85">
      <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6">
        <RefreshingUnit
          slotKind="header"
          adId="Header_Ad"
          prefix="av-header"
          minHeight={90}
          label="Header_Ad · 728×90 / 320×50"
          className="rounded-lg border border-dashed border-border/70 bg-ad-surface"
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
        className="rounded-xl border border-dashed border-border/70 bg-ad-surface"
      />
    </div>
  );
}

/** Post-article / pre-footer banner. */
export function PostContentAd() {
  return (
    <div className="mt-12">
      <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Advertisement</div>
      <RefreshingUnit
        slotKind="post-content"
        adId="Post_Content_Ad"
        prefix="av-post-content"
        minHeight={250}
        label="Post_Content_Ad · 970×250 / 336×280"
        className="rounded-2xl border border-dashed border-border/70 bg-ad-surface"
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
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>Sponsored</span>
        <span className="font-mono opacity-60">slot {index}</span>
      </div>
      <RotatingUnit
        key={refreshKey}
        refreshKey={refreshKey}
        id={containerId}
        slot={id}
        minHeight={200}
        format="fluid"
        layout="in-article"
        fluidHeight
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
        <RotatingUnit
          key={refreshKey}
          refreshKey={refreshKey}
          id={adId}
          slot={id}
          minHeight={600}
          format="vertical"
          label={label}
          className="rounded-2xl border border-dashed border-border/70 bg-ad-surface"
        />
      </div>
    </div>
  );
}


/**
 * Deprecated: floating/anchor ad banners are disabled site-wide by the
 * anti-intrusive ad policy. Kept as a no-op so old imports never re-introduce
 * a screen-hugging overlay.
 */
export function MobileAnchorAd() {
  return null;
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
