/**
 * Multi-method checkout layer for the GameCastle Anime digital store.
 *
 * Every method settles into the SAME payout destination:
 *  - crypto methods settle on-chain to PAYOUT_WALLET_ADDRESS
 *  - card / digital-wallet methods settle to the connected processor account,
 *    which auto-converts and pays out to PAYOUT_WALLET_ADDRESS (set the crypto
 *    payout address once in the processor dashboard).
 */
import { buildMaypalCheckoutUrl, PAYOUT_WALLET_ADDRESS } from "@/lib/maypal";
import type { StoreProduct } from "@/data/store-products";

export { PAYOUT_WALLET_ADDRESS };

export type PaymentMethodId = "maypal" | "card" | "wallet" | "onchain";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  /** Short list of what the buyer can actually pay with. */
  accepts: string;
  blurb: string;
  /** false = needs a processor connected before it can be shown as live. */
  live: boolean;
};

/**
 * Hosted card / digital-wallet checkout base URL.
 * Leave empty until a card processor is connected — the UI then shows the
 * method as "setup pending" instead of sending buyers to a dead link.
 */
export const CARD_CHECKOUT_BASE = "";

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "maypal",
    label: "Crypto checkout (Maypal)",
    accepts: "BTC · ETH · USDT · USDC · BNB · SOL",
    blurb:
      "Hosted crypto checkout. Pick any supported coin, pay, and your download unlocks the moment the network confirms.",
    live: true,
  },
  {
    id: "onchain",
    label: "Direct wallet transfer",
    accepts: "ETH · USDT · USDC (EVM networks)",
    blurb:
      "Send the exact amount straight to our payout wallet, then paste your transaction hash to unlock the pack.",
    live: true,
  },
  {
    id: "card",
    label: "Credit & debit card",
    accepts: "Visa · Mastercard · Amex",
    blurb:
      "Standard hosted card checkout with 3-D Secure. Funds are auto-converted and swept to the payout wallet.",
    live: Boolean(CARD_CHECKOUT_BASE),
  },
  {
    id: "wallet",
    label: "Digital wallets",
    accepts: "Apple Pay · Google Pay · Link",
    blurb:
      "One-tap wallet payment on mobile — same settlement route as card payments.",
    live: Boolean(CARD_CHECKOUT_BASE),
  },
];

export const SITE_ORIGIN = "https://gamecastle.store";

function origin() {
  return typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN;
}

/**
 * Returns the URL to open for a given method, or null when the method needs a
 * flow rendered in-page (direct wallet transfer) or is not configured yet.
 */
export function buildCheckoutUrl(
  method: PaymentMethodId,
  product: Pick<StoreProduct, "id" | "title" | "amount">,
): string | null {
  if (method === "maypal") {
    return buildMaypalCheckoutUrl({
      productId: product.id,
      title: product.title,
      amount: product.amount,
    });
  }

  if ((method === "card" || method === "wallet") && CARD_CHECKOUT_BASE) {
    const params = new URLSearchParams({
      item: product.title,
      product_id: product.id,
      amount: product.amount.toFixed(2),
      currency: "USD",
      method: method === "wallet" ? "digital_wallet" : "card",
      payout_address: PAYOUT_WALLET_ADDRESS,
      success_url: `${origin()}/store/thanks?p=${product.id}`,
      cancel_url: `${origin()}/store/checkout?p=${product.id}`,
    });
    return `${CARD_CHECKOUT_BASE}?${params.toString()}`;
  }

  return null;
}
