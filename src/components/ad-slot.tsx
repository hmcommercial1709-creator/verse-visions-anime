type Placement = "top" | "hero" | "inline" | "between" | "sidebar" | "footer" | "sticky-mobile" | "native" | "video" | "affiliate";

// Reusable, clean ad placeholders. Wire real ad code into `data-slot`.
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

export function AffiliateBox({ title, subtitle, price, cta = "View Deal" }: { title: string; subtitle: string; price?: string; cta?: string }) {
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
