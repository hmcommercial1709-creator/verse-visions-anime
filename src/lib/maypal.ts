/**
 * Maypal crypto checkout helper.
 *
 * Maypal hosts the payment page; we hand it the amount, an order reference and
 * a return URL. After a successful crypto payment the buyer is sent back to
 * `/store/thanks?p=<productId>` where the delivery link is revealed.
 *
 * Replace MAYPAL_MERCHANT_ID with the merchant/store ID from your Maypal
 * dashboard (it is a public identifier, safe to keep in the frontend).
 */
export const MAYPAL_MERCHANT_ID = "0xf2229e9260c";

/**
 * Public EVM wallet (ETH / USDT / USDC on Ethereum-compatible chains) that
 * receives store payouts. Public by design — safe in the frontend.
 */
export const PAYOUT_WALLET_ADDRESS = "0xf2229e6a6de3788d6cfe1f978f53655f6ca9260c";

const MAYPAL_CHECKOUT_BASE = "https://pay.maypal.com/checkout";

const SITE_ORIGIN = "https://gamecastle.store";

export type MaypalCheckoutInput = {
  productId: string;
  title: string;
  /** Price in USD, e.g. 1.99 — Maypal converts to the buyer's chosen coin. */
  amount: number;
};

export function buildMaypalCheckoutUrl({ productId, title, amount }: MaypalCheckoutInput) {
  const origin = typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN;
  const params = new URLSearchParams({
    merchant: MAYPAL_MERCHANT_ID,
    order_id: `${productId}-${Date.now()}`,
    item: title,
    amount: amount.toFixed(2),
    currency: "USD",
    pay_with: "crypto",
    payout_address: PAYOUT_WALLET_ADDRESS,
    success_url: `${origin}/store/thanks?p=${productId}`,
    cancel_url: `${origin}/store`,
  });
  return `${MAYPAL_CHECKOUT_BASE}?${params.toString()}`;
}
