import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storeProducts, type StoreProduct } from "@/data/store-products";
import {
  buildCheckoutUrl,
  PAYMENT_METHODS,
  PAYOUT_WALLET_ADDRESS,
  type PaymentMethodId,
} from "@/lib/payments";
import {
  AcceptedMarks,
  AmexMark,
  ApplePayMark,
  CryptoMark,
  GooglePayMark,
  MastercardMark,
  VisaMark,
} from "@/components/payment-marks";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bitcoin,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

const SITE = "https://gamecastle.store";

const ICONS: Record<PaymentMethodId, typeof Bitcoin> = {
  maypal: Bitcoin,
  onchain: Wallet,
  card: CreditCard,
  wallet: Smartphone,
};

const METHOD_MARKS: Record<PaymentMethodId, React.ReactNode> = {
  maypal: <CryptoMark label="Bitcoin, Ethereum, USDT, USDC" />,
  onchain: <CryptoMark label="On-chain transfer" />,
  card: (
    <>
      <VisaMark />
      <MastercardMark />
      <AmexMark />
    </>
  ),
  wallet: (
    <>
      <ApplePayMark />
      <GooglePayMark />
    </>
  ),
};

export const Route = createFileRoute("/store_/checkout")({
  head: () => ({
    meta: [
      { title: "Secure checkout — pay by card, wallet or crypto | GameCastle Anime Store" },
      {
        name: "description",
        content:
          "Complete your $1.99 wallpaper pack purchase with card, Apple Pay, Google Pay or crypto. Instant Google Drive delivery after payment confirms.",
      },
      { property: "og:title", content: "Secure checkout · GameCastle Anime Store" },
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

function CopyRow({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 flex items-stretch gap-2">
        <div
          className={`flex-1 overflow-x-auto rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 text-xs ${
            mono ? "font-mono" : "font-semibold"
          }`}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-3 text-xs font-semibold transition-colors hover:border-primary/60 hover:text-primary"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function OnchainPanel({ product }: { product: StoreProduct }) {
  return (
    <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/[0.04] p-5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
        <Wallet className="h-3.5 w-3.5" /> On-chain transfer
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        Send the exact amount in ETH, USDT or USDC on any Ethereum-compatible network, then confirm
        below. Delivery is automatic — your download link unlocks instantly, with no manual approval.
      </p>
      <div className="mt-4 space-y-3.5">
        <CopyRow label="Payout wallet" value={PAYOUT_WALLET_ADDRESS} />
        <CopyRow label="Exact amount" value={`${product.amount.toFixed(2)} USD`} mono={false} />
      </div>
    </div>
  );
}

function CheckoutPage() {
  const [productId, setProductId] = useState<string | null>(null);
  // Read after mount so SSR and hydration agree, then resolve the real pack.
  useEffect(() => {
    setProductId(new URLSearchParams(window.location.search).get("p"));
  }, []);
  const product = storeProducts.find((p) => p.id === productId) ?? storeProducts[0];
  const [method, setMethod] = useState<PaymentMethodId>("maypal");

  if (!product) return null;

  const url = buildCheckoutUrl(method, product);
  const selected = PAYMENT_METHODS.find((m) => m.id === method);
  const pending = Boolean(selected && !selected.live);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient luxury glow — pure gradient, no blur filters (CLS/INP safe). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-12">
        {/* Distraction-free top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-5">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              256-bit SSL secured
            </span>
          </div>
        </div>

        <header className="mt-8 max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> GameCastle Anime checkout
          </div>
          <h1 className="mt-3.5 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-[2.75rem]">
            Complete your purchase
          </h1>
          <p className="mt-3.5 text-[15px] leading-relaxed text-muted-foreground">
            One price, one download, lifetime access. Choose any payment method below — your Google
            Drive delivery link unlocks the moment payment confirms.
          </p>
        </header>

        <div className="mt-9 grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* ---------- PAYMENT METHODS ---------- */}
          <section aria-label="Payment method">
            <div className="rounded-3xl border border-border/60 bg-card/25 p-2 sm:p-3">
              <div className="flex items-center justify-between px-3 pb-2 pt-2">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em]">
                  Payment method
                </h2>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Step 1 of 2
                </span>
              </div>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = ICONS[m.id];
                  const active = m.id === method;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      aria-pressed={active}
                      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? "border-primary/60 bg-primary/[0.07] shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                          : "border-border/50 bg-background/60 hover:border-border hover:bg-card/40"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Radio indicator */}
                        <span
                          aria-hidden
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            active ? "border-primary bg-primary" : "border-border/80"
                          }`}
                        >
                          {active && <Check className="h-3 w-3 text-primary-foreground" />}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <Icon
                              className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span className="font-semibold tracking-tight">{m.label}</span>
                            {m.live ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/[0.07] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
                                <BadgeCheck className="h-3 w-3" /> Available
                              </span>
                            ) : (
                              <span className="rounded-full border border-border/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                Setup pending
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                            {m.blurb}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {METHOD_MARKS[m.id]}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {method === "onchain" && <OnchainPanel product={product} />}

            {pending && (
              <p className="mt-4 rounded-2xl border border-border/60 bg-card/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
                Card and digital-wallet payments need a card processor connected before they can go
                live. Until then, crypto checkout and direct wallet transfer are fully working.
              </p>
            )}

            {/* Trust row */}
            <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
              {[
                [ShieldCheck, "Encrypted", "TLS 1.3 · PCI-compliant hosts"],
                [Zap, "Instant delivery", "Link unlocks in seconds"],
                [Lock, "Zero card data", "We never see your credentials"],
              ].map(([Icon, title, sub]) => {
                const I = Icon as typeof ShieldCheck;
                return (
                  <div
                    key={title as string}
                    className="rounded-2xl border border-border/50 bg-card/25 p-3.5"
                  >
                    <I className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-[13px] font-semibold">{title as string}</div>
                    <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      {sub as string}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------- ORDER SUMMARY ---------- */}
          <aside className="h-fit overflow-hidden rounded-3xl border border-border/60 bg-card/30 lg:sticky lg:top-24">
            <div className="border-b border-border/50 px-6 py-5">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em]">
                Order summary
              </h2>
            </div>

            <div className="px-6 py-5">
              <div className="flex gap-3.5">
                <img
                  src={product.image}
                  alt={`${product.title} preview`}
                  loading="lazy"
                  width={1200}
                  height={752}
                  className="h-20 w-28 shrink-0 rounded-xl border border-border/60 object-cover"
                />
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold leading-snug">{product.title}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {product.countLabel} wallpapers · 4K vertical · instant Google Drive delivery
                  </div>
                </div>
              </div>

              <dl className="mt-5 space-y-2.5 border-t border-border/50 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>${product.amount.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="text-primary">Instant · free</dd>
                </div>
                {product.originalPrice && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Bundle discount</dt>
                    <dd className="text-muted-foreground line-through">{product.originalPrice}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex items-end justify-between border-t border-border/50 pt-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Total due
                </span>
                <span className="font-display text-3xl font-bold tracking-tight text-gradient">
                  ${product.amount.toFixed(2)}
                </span>
              </div>

              {method === "onchain" ? (
                <Link
                  to="/store/thanks"
                  search={{ p: product.id } as never}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 px-4 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  I&apos;ve sent the transfer <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={!url}
                  onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold tracking-tight text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Lock className="h-4 w-4" /> Pay ${product.amount.toFixed(2)} securely
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Secured by 256-bit SSL. Payment happens on the provider&apos;s hosted page —
                  digital downloads are non-refundable once delivered.
                </p>
              </div>

              <div className="mt-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  We accept
                </div>
                <div className="mt-2">
                  <AcceptedMarks />
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 bg-background/40 px-6 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Other packs
              </div>
              <ul className="mt-2.5 space-y-2">
                {storeProducts
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/store/checkout?p=${p.id}`}
                        className="flex items-center justify-between gap-2 text-[13px] text-foreground/80 transition-colors hover:text-primary"
                      >
                        <span className="truncate">{p.title}</span>
                        <span className="shrink-0 text-muted-foreground">
                          ${p.amount.toFixed(2)}
                        </span>
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
