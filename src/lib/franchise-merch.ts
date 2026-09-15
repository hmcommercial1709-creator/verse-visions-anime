import { storeProducts, type StoreProduct } from "@/data/store-products";

/**
 * Store products that genuinely belong to a given series.
 *
 * "Smart related merchandise" fails in one specific way: when there is no
 * real match it shows something anyway. A Naruto page carrying a Jujutsu
 * Kaisen figure under the heading "Naruto merchandise" is worse than an empty
 * section — it is a small lie, it converts badly, and a reader who notices it
 * once stops trusting every recommendation on the site.
 *
 * So this matches on the franchise name appearing in the product's own title,
 * and returns an empty list when nothing does. The caller renders nothing.
 */

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Title words worth matching on, longest first.
 *
 * Short words are dropped: "one" from "One Piece" would match "One Punch Man",
 * "Ranking of Kings" and half the catalog. Matching on the full normalized
 * title first, then progressively shorter prefixes, means "Demon Slayer:
 * Kimetsu no Yaiba" still finds "Demon Slayer" products without "Slayer"
 * alone dragging in unrelated ones.
 */
export function franchiseKeys(title: string): string[] {
  const full = normalize(title);
  if (!full) return [];
  const words = full.split(" ");
  const keys: string[] = [];
  for (let length = words.length; length >= 2; length -= 1) {
    keys.push(words.slice(0, length).join(" "));
  }
  // A single word is only specific enough when it is long and distinctive.
  if (words.length === 1 && words[0].length >= 6) keys.push(words[0]);
  return keys;
}

export interface MerchMatch {
  product: StoreProduct;
  /** The franchise phrase that matched, so the pairing is never a guess. */
  matchedOn: string;
}

export function merchForTitle(titles: string[], limit = 3): MerchMatch[] {
  const keys = [...new Set(titles.flatMap(franchiseKeys))].sort((a, b) => b.length - a.length);
  if (!keys.length) return [];

  const out: MerchMatch[] = [];
  const taken = new Set<string>();
  for (const key of keys) {
    for (const product of storeProducts) {
      if (taken.has(product.slug)) continue;
      const haystack = normalize(
        `${product.title} ${product.shortTitle} ${product.categories.join(" ")}`,
      );
      if (!haystack.includes(key)) continue;
      taken.add(product.slug);
      out.push({ product, matchedOn: key });
      if (out.length >= limit) return out;
    }
  }
  return out;
}
