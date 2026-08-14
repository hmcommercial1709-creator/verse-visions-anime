export type StorePrice = {
  amount: number;
  currency: "USD";
  originalAmount?: number;
  discountPercent?: number;
  availability: "InStock" | "OutOfStock";
  pricePrefix?: "From" | "Last listed";
  checkedAt: string;
};

type StorePriceSeed = Omit<StorePrice, "currency" | "availability" | "checkedAt"> & {
  availability?: StorePrice["availability"];
};

export const STORE_PRICE_CHECKED_AT = "2026-08-13";

const storePriceSeeds = {
  "70dsm7": { amount: 13.09 },
  "70g9ox": { amount: 78.49 },
  "70fm9f": { amount: 18.39 },
  "709niz": { amount: 131.79 },
  "70ffnv": { amount: 128.49 },
  "708lc7": { amount: 152.59 },
  "70iixr": { amount: 6.99, originalAmount: 7.24, discountPercent: 3 },
  "7048ej": { amount: 104.49, originalAmount: 106.99, discountPercent: 2 },
  "70exdt": { amount: 19.99, originalAmount: 24.49, discountPercent: 18 },
  "70h87p": { amount: 5.39, originalAmount: 6.05, discountPercent: 11 },
  "70hufv": { amount: 53.29 },
  "709nix": { amount: 64.29 },
  "70fm93": { amount: 16.89 },
  "70h87x": { amount: 100.98, availability: "OutOfStock", pricePrefix: "Last listed" },
  "70gy4b": { amount: 60.49 },
  "70iiv1": { amount: 59.39, originalAmount: 69.49, discountPercent: 15 },
  "70exef": { amount: 40.69, originalAmount: 43.39, discountPercent: 6 },
  "70fck5": { amount: 22.39, originalAmount: 25.09, discountPercent: 11 },
  "70j41j": { amount: 27.99, originalAmount: 39.99, discountPercent: 30 },
  "70dcwz": { amount: 68.59 },
  "70fylt": { amount: 8.99, originalAmount: 44.99, discountPercent: 80 },
  "70d0c3": { amount: 3.99, originalAmount: 7.65, discountPercent: 48 },
  "70jd7l": { amount: 7.76 },
  "70itl7": { amount: 32.81, originalAmount: 69.99, discountPercent: 53 },
  "70d38z": { amount: 5.86 },
  "70ew79": { amount: 53.28 },
  "70gq15": { amount: 8.39, originalAmount: 19.99, discountPercent: 58 },
  "70bm6p": { amount: 76.39, originalAmount: 86.89, discountPercent: 12 },
  "70jj8v": { amount: 28.97 },
  "70k4ob": { amount: 28.49, originalAmount: 29.99, discountPercent: 5 },
  "708sh1": { amount: 7.25, originalAmount: 15.99, discountPercent: 55 },
  "70jns3": { amount: 115.29 },
  "70ia8x": { amount: 2 },
  "70ebtz": { amount: 38.89 },
  "70j815": { amount: 4.99, originalAmount: 29.99, discountPercent: 83 },
  "7093nb": { amount: 13.99 },
  "7093nd": { amount: 13.99 },
  "70j3fx": { amount: 9.99 },
  "70j3fz": { amount: 19.99 },
  "70j3fv": { amount: 4.99 },
  "70j3g1": { amount: 49.99 },
  "70e19d": { amount: 33.69 },
  "70eslz": { amount: 6.40, originalAmount: 8.60, discountPercent: 26 },
  "70709v": { amount: 17.25 },
  "70brof": { amount: 117.99 },
  "70hsqp": { amount: 20.29, originalAmount: 27.51, discountPercent: 26 },
  "70gwjv": { amount: 98.29 },
  "70dh1p": { amount: 51.79, originalAmount: 52.99, discountPercent: 2 },
  "70dh1l": { amount: 5.39 },
  "70dh1j": { amount: 1.19 },
  "70dh1r": { amount: 103.59 },
  "70g4ob": { amount: 11.83 },
  "70hgxh": { amount: 14.99, originalAmount: 33.99, discountPercent: 56 },
  "70eme1": { amount: 4.37, originalAmount: 8.62, discountPercent: 49 },
  "70ecfv": { amount: 4.24 },
  "70itm1": { amount: 59.99, originalAmount: 119.99, discountPercent: 50 },
  "70dt55": { amount: 3.86 },
  "70fny1": { amount: 38.19, originalAmount: 39.99, discountPercent: 5 },
  "70dki5": { amount: 11.32, originalAmount: 39.99, discountPercent: 72 },
  "70el71": { amount: 7.78 },
  "70dyl3": { amount: 12.12, originalAmount: 24.99, discountPercent: 52 },
  "70fsox": { amount: 25.54, originalAmount: 59.99, discountPercent: 57 },
  "70izd1": { amount: 14.99, originalAmount: 49.99, discountPercent: 70 },
  "B0DTP3MTX1": { amount: 35.90, pricePrefix: "From" },
  "B0DCQKYFT5": { amount: 23.95, pricePrefix: "From" },
  "B084CB8VYP": { amount: 26.70, pricePrefix: "From" },
  "B08FMSC7NC": { amount: 19.95, pricePrefix: "From" },
  "B07PGYF5QY": { amount: 17.77, pricePrefix: "From" },
  "B0D2YBQQ1P": { amount: 92.03, pricePrefix: "From" },
  "B0C7F58QFT": { amount: 55.31, pricePrefix: "From" },
  "B07KYHBVYH": { amount: 13.58, pricePrefix: "From" },
  "B08FCGJY2P": { amount: 43.99, pricePrefix: "From" },
  "B0B4V6ZDVT": { amount: 35, pricePrefix: "From" },
  "70gpd7": { amount: 48.99, originalAmount: 52.99, discountPercent: 8 },
  "70b1h3": { amount: 41.99 },
  "70ater": { amount: 37.99 },
  "70erzh": { amount: 14.99 },
  "70hl09": { amount: 31.99 },
  "70jxj9": { amount: 23.24, originalAmount: 24.99, discountPercent: 7 },
  "70dj7p": { amount: 24.99, originalAmount: 26.99, discountPercent: 7 },
  "70gkwf": { amount: 8.99, originalAmount: 12.99, discountPercent: 31 },
} satisfies Record<string, StorePriceSeed>;

export function verifiedStorePrice(productId: string): StorePrice {
  const seed = storePriceSeeds[productId as keyof typeof storePriceSeeds];

  if (!seed) {
    throw new Error(`Missing verified store price for ${productId}`);
  }

  return {
    ...seed,
    currency: "USD",
    availability: seed.availability ?? "InStock",
    checkedAt: STORE_PRICE_CHECKED_AT,
  };
}

export function formatStorePriceAmount(amount: number) {
  return `US$${amount.toFixed(2)}`;
}

export function storePriceLabel(price: StorePrice) {
  const prefix = price.pricePrefix ? `${price.pricePrefix} ` : "";
  return `${prefix}${formatStorePriceAmount(price.amount)}`;
}

export function storePriceCheckedLabel(checkedAt: string) {
  if (checkedAt === "2026-08-13") return "Aug 13, 2026";
  return checkedAt;
}
