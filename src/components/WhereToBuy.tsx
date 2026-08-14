import { ExternalLink, ShoppingBag } from "lucide-react";

export type RetailerLink = {
  name: string;
  url: string;
  note: string;
  accent?: string;
};

type WhereToBuyProps = {
  title?: string;
  description?: string;
  links: RetailerLink[];
};

const isSafePartnerUrl = (url: string) => /^https:\/\//i.test(url);

export default function WhereToBuy({
  title = "Featured partner listings",
  description = "Open the retailer page to verify the current price, region, stock and product details before purchasing.",
  links,
}: WhereToBuyProps) {
  const verifiedLinks = links.filter((link) => isSafePartnerUrl(link.url));

  if (verifiedLinks.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {verifiedLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group rounded-xl border border-border bg-background/60 p-4 hover:border-primary/60"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold" style={{ color: link.accent }}>
                {link.name}
              </span>
              <ExternalLink
                className="h-4 w-4 text-muted-foreground group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{link.note}</p>
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Affiliate disclosure: GameCastle may earn a commission from qualifying purchases at no extra
        cost to you. Prices and availability are controlled by each retailer and can change.
      </p>
    </section>
  );
}
