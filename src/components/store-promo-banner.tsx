import { Link } from "@tanstack/react-router";
import { ArrowRight, Smartphone, Sparkles } from "lucide-react";

/**
 * Homepage announcement banner for the digital wallpapers store.
 * Fixed height on all breakpoints so it never shifts the LCP hero below it.
 */
export function StorePromoBanner() {
  return (
    <section className="border-b border-border/60 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10">
            <Smartphone className="h-5 w-5 text-primary" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3 w-3" /> New · Digital store
            </div>
            <h2 className="mt-1 font-display text-lg font-bold leading-snug sm:text-xl">
              Exclusive Digital Phone Wallpapers Store — 39,000+ 4K anime &amp; dark aesthetic wallpapers
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Instant delivery, no subscription. Every pack just $1.99 — pay with Maypal crypto checkout.
            </p>
          </div>
        </div>
        <Link
          to="/store"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:brightness-110"
        >
          Visit the store <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
