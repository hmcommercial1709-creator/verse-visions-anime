import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui-bits";
import { storeProducts, type StoreProduct } from "@/data/store-products";
import {
  buildCheckoutUrl,
  PAYMENT_METHODS,
  PAYOUT_WALLET_ADDRESS,
  type PaymentMethodId,
} from "@/lib/payments";
import {
  ArrowRight,
  Bitcoin,
  Check,
  Copy,
  CreditCard,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";

const SITE = "https://gamecastle.store";

const ICONS: Record<PaymentMethodId, typeof Bitcoin> = {
  maypal: Bitcoin,
  onchain: Wallet,
  card: CreditCard,
  wallet: Smartphone,
};

export const Route = createFileRoute("/store/checkout")({
  head: () => ({
    meta: [
      { title: "Secure checkout — pay by card, wallet or crypto | AnimeVerse Store" },
      {
        name: "description",
        content:
          "Complete your $1.99 wallpaper pack purchase with card, Apple Pay, Google Pay or crypto. Instant Google Drive delivery after payment confirms.",
      },
      { property: "og:title", content: "Secure checkout · AnimeVerse Store" },
      {
        property: "og:description",
        content: "Pay by card, digital wallet or crypto — instant wallpaper pack delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/store/checkout` }],
  }),
  component: CheckoutPage,
});

function OnchainPanel({ product }: { product: StoreProduct }) {
  const [copied, setCopied] = useState<"addr" | "amount" | null>(null);
  const copy = (value: string, key: "addr" | "amount") => {
    void navigator.clipboard?.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-6 rounded-2xl border border-border/60 bg-black/70 p-5">
      <h3 className="font-display text-base font-bold">Send the payment on-chain</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Transfer the exact amount in ETH, USDT or USDC on any Ethereum-compatible network, then
        email us the transaction hash and pack name — the delivery link comes straight back.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Payout wallet
          </div>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="flex-1 overflow-x-auto rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs">
              {PAYOUT_WALLET_ADDRESS}
            </code>
            <button
              type="button"
              onClick={() => copy(PAYOUT_WALLET_ADDRESS, "addr")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
            >
              {copied === "addr" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === "addr" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Amount
          </div>
          <div className="mt-1 flex items-center gap-2">
            <code className="rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs">
              ${product.amount.toFixed(2)} USD
            </code>
            <button
              type="button"
              onClick={() => copy(product.amount.toFixed(2), "amount")}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs font-semibold hover:bg-card/60"
            >
              {copied === "amount" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === "amount" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const product = storeProducts.find((p) => p.id === params?.get("p")) ?? storeProducts[0];
  const [method, setMethod] = useState<PaymentMethodId>("maypal");

  if (!product) return null;

  const url = buildCheckoutUrl(method, product);
  const selected = PAYMENT_METHODS.find((m) => m.id === method);
  const pending = selected && !selected.live;

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
        <Breadcrumbs
          items={[
            { to: "/", label: "Home" },
            { to: "/store", label: "Digital store" },
            { label: "Checkout" },
          ]}
        />

        <header className="mt-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Lock className="h-3.5 w-3.5" /> Secure checkout
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Choose how you want to pay
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Card, digital wallet or crypto — every method settles to the same payout account, and
            your Google Drive delivery link unlocks the moment payment confirms.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* METHODS */}
          <section>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => {
                const Icon = ICONS[m.id];
                const active = m.id === method;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    aria-pressed={active}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-primary/70 bg-primary/10"
                        : "border-border/60 bg-black/60 hover:bg-card/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{m.label}</span>
                          {!m.live && (
                            <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              Setup pending
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-primary/80">{m.accepts}</div>
                        <p className="mt-1.5 text-sm text-muted-foreground">{m.blurb}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {method === "onchain" && <OnchainPanel product={product} />}

            {pending && (
              <p className="mt-6 rounded-2xl border border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
                Card and digital-wallet payments need a card processor connected before they can go
                live. Until then, crypto checkout and direct wallet transfer are fully working.
              </p>
            )}
          </section>

          {/* SUMMARY */}
          <aside className="h-fit rounded-2xl border border-border/60 bg-card/30 p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <div className="mt-4 rounded-xl border border-border/60 bg-black/60 p-4">
              <div className="font-semibold">{product.title}</div>
              <div className="text-xs text-muted-foreground">
                {product.count} wallpapers · 4K vertical · instant delivery
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-gradient">
                ${product.amount.toFixed(2)}
              </span>
            </div>

            {method === "onchain" ? (
              <Link
                to="/store/thanks"
                search={{ p: product.id } as never}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                I&apos;ve sent the transfer <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                disabled={!url}
                onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Lock className="h-4 w-4" /> Pay ${product.amount.toFixed(2)}
              </button>
            )}

            <p className="mt-3 text-[11px] text-muted-foreground">
              Payments are processed on the provider&apos;s secure hosted page — we never see your
              card or wallet credentials. Digital downloads are non-refundable once delivered.
            </p>

            <div className="mt-5 border-t border-border/60 pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Other packs
              </div>
              <ul className="mt-2 space-y-1.5">
                {storeProducts
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/store/checkout?p=${p.id}`}
                        className="text-sm text-foreground/80 hover:text-primary"
                      >
                        {p.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
