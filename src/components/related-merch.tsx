import { ShoppingBag } from "lucide-react";

import { merchForTitle } from "@/lib/franchise-merch";

/**
 * Franchise merchandise, or nothing.
 *
 * merchForTitle only returns products whose own title carries the franchise
 * name, so this section is absent on most pages — by design. Filling it with
 * whatever the store has would put a Jujutsu Kaisen figure under a heading
 * that says Naruto, which is a small lie a reader only has to catch once.
 */
export function RelatedMerch({ titles }: { titles: string[] }) {
  const matches = merchForTitle(titles);
  if (!matches.length) return null;

  return (
    <section className="mt-12 rounded-2xl border border-border/60 bg-card/40 p-5 lg:p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold">
        <ShoppingBag className="h-4 w-4 text-primary" aria-hidden="true" />
        Merchandise for this series
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Matched to this franchise by name. Prices and availability are the retailer&apos;s and may
        have changed — check before ordering.
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map(({ product }) => (
          <li key={product.slug}>
            <a
              href={`/store/${product.slug}`}
              className="flex h-full min-h-11 flex-col gap-2 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:border-primary/60"
            >
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                loading="lazy"
                width={160}
                height={160}
                className="h-28 w-full rounded-lg object-contain"
              />
              <span className="text-sm font-semibold leading-snug">{product.shortTitle}</span>
              <span className="mt-auto text-xs text-muted-foreground">{product.collection}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
