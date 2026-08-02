import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { storeProducts } from "@/data/store-products";
import { Breadcrumbs } from "@/components/ui-bits";
import { CheckCircle2, Download } from "lucide-react";

const SITE = "https://gamecastle.store";

export const Route = createFileRoute("/store_/thanks")({
  head: () => ({
    meta: [
      { title: "Your wallpaper download — AnimeVerse Store" },
      {
        name: "description",
        content:
          "Payment confirmed. Open your instant download link and grab your 4K anime or dark aesthetic wallpaper pack.",
      },
      { property: "og:title", content: "Your wallpaper download · AnimeVerse Store" },
      {
        property: "og:description",
        content: "Payment confirmed — your 4K wallpaper pack download link is ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/store/thanks` }],
  }),
  component: ThanksPage,
});

function ThanksPage() {
  const [productId, setProductId] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const opened = useRef(false);

  // Read the order reference on the client (SSR has no query string).
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setProductId(search.get("p") ?? search.get("product_id") ?? search.get("item"));
  }, []);

  const product = storeProducts.find((p) => p.id === productId);

  // Fully automated delivery: as soon as the provider returns the buyer here,
  // the download link opens itself — no manual approval step.
  useEffect(() => {
    if (!product || opened.current) return;
    opened.current = true;
    const timer = window.setTimeout(() => {
      window.open(product.deliveryUrl, "_blank", "noopener,noreferrer");
      setAutoOpened(true);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [product]);

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
        <Breadcrumbs
          items={[{ to: "/", label: "Home" }, { to: "/store", label: "Digital store" }, { label: "Download" }]}
        />
        <div className="mt-6 rounded-3xl border border-border/60 bg-card/30 p-8 text-center lg:p-12">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
            Payment confirmed — your pack is ready
          </h1>
          <p className="mt-3 text-muted-foreground">
            Delivery is automatic: your download opens in a new tab right away, and the link below
            stays valid for lifetime re-downloads.
          </p>

          {product ? (
            <div className="mt-8 rounded-2xl border border-border/60 bg-black/60 p-6">
              <div className="font-display text-lg font-bold">{product.title}</div>
              <div className="text-sm text-muted-foreground">
                {product.count} wallpapers · 4K vertical
              </div>
              <a
                href={product.deliveryUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:brightness-110"
              >
                <Download className="h-4 w-4" /> Open download link
              </a>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {autoOpened
                  ? "Opened automatically. If your browser blocked the new tab, use the button above."
                  : "Opening your download automatically…"}
              </p>
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">
              We couldn&apos;t match your order to a pack. Head back to the{" "}
              <Link to="/store" className="text-primary underline">
                store
              </Link>{" "}
              and reopen the pack you bought, or contact us with your payment or transaction ID.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
