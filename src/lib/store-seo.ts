/**
 * Multi-lingual SEO layer for the digital wallpaper store.
 *
 * Each locale ships hand-written (not machine-translated) titles,
 * descriptions and keyword sets tuned for anime-wallpaper buyers in that
 * market, plus Product/Offer JSON-LD so the $1.99 price is eligible for
 * rich-result price display.
 */
import { storeProducts, STORE_CATEGORIES, type StoreProduct } from "@/data/store-products";

export const SITE = "https://gamecastle.store";

export type StoreLocaleCode = "en" | "ja" | "es" | "fr" | "pt";

export type StoreLocaleSeo = {
  code: StoreLocaleCode;
  /** BCP-47 value for hreflang / og:locale. */
  hrefLang: string;
  ogLocale: string;
  language: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  /** On-page copy for the localized editions. */
  heading: string;
  intro: string;
  cta: string;
  priceNote: string;
  sections: [string, string];
};

export const STORE_LOCALES: StoreLocaleSeo[] = [
  {
    code: "en",
    hrefLang: "en",
    ogLocale: "en_US",
    language: "English",
    title: "4K Anime Phone Wallpapers — $1.99 Packs, Instant Download | AnimeVerse Store",
    description:
      "Buy 4K anime phone wallpapers and dark AMOLED aesthetic packs for $1.99. 500+ hand-picked vertical wallpapers, instant Google Drive delivery, card, Apple Pay, Google Pay or crypto checkout.",
    keywords: [
      "anime phone wallpapers",
      "4k anime wallpaper pack",
      "anime wallpapers download",
      "dark aesthetic wallpapers",
      "amoled black wallpapers",
      "anime wallpaper bundle",
      "cheap wallpaper pack",
    ],
    ogTitle: "4K Anime & Dark Aesthetic Phone Wallpapers — $1.99 a pack",
    ogDescription:
      "500+ vertical 4K wallpapers, hand-picked and colour-graded. Instant download after payment. Card, wallet or crypto.",
    heading: "Premium phone wallpapers, delivered the second you buy",
    intro:
      "Two curated 4K collections — anime artwork and deep-black aesthetic backgrounds — cropped for real phone screens. One-time $1.99, lifetime files, no subscription.",
    cta: "Buy now",
    priceNote: "One-time payment · instant download",
    sections: ["High-Quality Anime Wallpapers", "Dark & Aesthetic Phone Wallpapers"],
  },
  {
    code: "ja",
    hrefLang: "ja",
    ogLocale: "ja_JP",
    language: "日本語",
    title: "アニメ壁紙 4K スマホ用パック — 1.99ドルで即ダウンロード | AnimeVerse",
    description:
      "スマホ用の4Kアニメ壁紙と黒基調のAMOLED向け壁紙パックが1本1.99ドル。厳選された縦型壁紙500枚以上、決済後すぐにGoogleドライブのリンクからダウンロードできます。",
    keywords: [
      "アニメ 壁紙",
      "スマホ 壁紙 アニメ",
      "4k 壁紙 アニメ",
      "高画質 壁紙 ダウンロード",
      "黒 壁紙 amoled",
      "壁紙 パック 販売",
    ],
    ogTitle: "アニメ＆ダーク系 スマホ壁紙パック — 1パック1.99ドル",
    ogDescription:
      "縦型4K壁紙が500枚以上。決済後すぐにダウンロード。カード・ウォレット・暗号資産に対応。",
    heading: "買ったその瞬間に届く、プレミアムなスマホ壁紙",
    intro:
      "厳選した4Kコレクションは2種類 — アニメアートと深い黒を基調にしたデザイン。実際のスマホ画面に合わせてトリミング済み。1回1.99ドルの買い切りで、サブスクは不要です。",
    cta: "今すぐ購入",
    priceNote: "買い切り価格 · 即ダウンロード",
    sections: ["高画質アニメ壁紙", "ダーク系・アート壁紙"],
  },
  {
    code: "es",
    hrefLang: "es",
    ogLocale: "es_ES",
    language: "Español",
    title: "Fondos de pantalla de anime 4K — packs por 1,99 $ y descarga instantánea | AnimeVerse",
    description:
      "Compra packs de fondos de pantalla de anime en 4K y fondos oscuros AMOLED por 1,99 $. Más de 500 wallpapers verticales seleccionados, entrega inmediata por Google Drive, pago con tarjeta, monedero o cripto.",
    keywords: [
      "fondos de pantalla anime",
      "wallpapers anime 4k",
      "fondos de pantalla para movil anime",
      "fondos oscuros amoled",
      "pack de wallpapers",
      "descargar fondos anime",
    ],
    ogTitle: "Fondos de anime y estética oscura en 4K — 1,99 $ por pack",
    ogDescription:
      "Más de 500 wallpapers verticales en 4K. Descarga inmediata tras el pago. Tarjeta, monedero o cripto.",
    heading: "Fondos de pantalla premium, entregados al instante",
    intro:
      "Dos colecciones en 4K cuidadosamente seleccionadas — arte de anime y fondos oscuros — recortadas para pantallas de móvil reales. Pago único de 1,99 $, archivos para siempre y sin suscripción.",
    cta: "Comprar ahora",
    priceNote: "Pago único · descarga inmediata",
    sections: ["Fondos de anime en alta calidad", "Fondos oscuros y estéticos"],
  },
  {
    code: "fr",
    hrefLang: "fr",
    ogLocale: "fr_FR",
    language: "Français",
    title: "Fonds d'écran anime 4K — packs à 1,99 $ en téléchargement immédiat | AnimeVerse",
    description:
      "Achetez des packs de fonds d'écran anime en 4K et des fonds noirs AMOLED pour 1,99 $. Plus de 500 wallpapers verticaux sélectionnés, livraison instantanée via Google Drive, paiement par carte, wallet ou crypto.",
    keywords: [
      "fond d'ecran anime",
      "wallpaper anime 4k",
      "fond d'ecran telephone anime",
      "fond d'ecran noir amoled",
      "pack de fonds d'ecran",
      "telecharger fond d'ecran anime",
    ],
    ogTitle: "Fonds d'écran anime et dark aesthetic en 4K — 1,99 $ le pack",
    ogDescription:
      "Plus de 500 wallpapers verticaux en 4K. Téléchargement immédiat après paiement. Carte, wallet ou crypto.",
    heading: "Des fonds d'écran premium, livrés dès l'achat",
    intro:
      "Deux collections 4K soigneusement choisies — illustrations anime et fonds très sombres — recadrées pour de vrais écrans de téléphone. Paiement unique de 1,99 $, fichiers à vie, sans abonnement.",
    cta: "Acheter",
    priceNote: "Paiement unique · téléchargement immédiat",
    sections: ["Fonds d'écran anime haute qualité", "Fonds sombres et esthétiques"],
  },
  {
    code: "pt",
    hrefLang: "pt",
    ogLocale: "pt_BR",
    language: "Português",
    title: "Papéis de parede de anime 4K — packs por US$ 1,99 com download na hora | AnimeVerse",
    description:
      "Compre packs de papéis de parede de anime em 4K e fundos escuros AMOLED por US$ 1,99. Mais de 500 wallpapers verticais selecionados, entrega imediata pelo Google Drive, pagamento com cartão, carteira digital ou cripto.",
    keywords: [
      "papel de parede anime",
      "wallpaper anime 4k",
      "papel de parede celular anime",
      "fundo preto amoled",
      "pack de wallpapers",
      "baixar papel de parede anime",
    ],
    ogTitle: "Papéis de parede de anime e dark aesthetic em 4K — US$ 1,99 o pack",
    ogDescription:
      "Mais de 500 wallpapers verticais em 4K. Download imediato após o pagamento. Cartão, carteira ou cripto.",
    heading: "Papéis de parede premium, entregues na hora da compra",
    intro:
      "Duas coleções em 4K selecionadas a dedo — arte de anime e fundos bem escuros — recortadas para telas reais de celular. Pagamento único de US$ 1,99, arquivos para sempre e sem assinatura.",
    cta: "Comprar agora",
    priceNote: "Pagamento único · download imediato",
    sections: ["Papéis de parede de anime em alta qualidade", "Fundos escuros e estéticos"],
  },
];

export function getStoreLocale(code: string | undefined): StoreLocaleSeo {
  return STORE_LOCALES.find((l) => l.code === code) ?? STORE_LOCALES[0]!;
}

export function isStoreLocale(code: string | undefined): code is StoreLocaleCode {
  return STORE_LOCALES.some((l) => l.code === code);
}

/** Path for a locale's store edition ("/store" for English). */
export function storePath(code: StoreLocaleCode): string {
  return code === "en" ? "/store" : `/${code}/store`;
}

/** hreflang set covering every localized store edition plus x-default. */
export function storeHreflangLinks() {
  return [
    ...STORE_LOCALES.map((l) => ({
      rel: "alternate",
      hrefLang: l.hrefLang,
      href: `${SITE}${storePath(l.code)}`,
    })),
    { rel: "alternate", hrefLang: "x-default", href: `${SITE}/store` },
  ];
}

/** Social meta (Open Graph + Twitter Card) for a store edition. */
export function storeSocialMeta(locale: StoreLocaleSeo) {
  const url = `${SITE}${storePath(locale.code)}`;
  return [
    { title: locale.title },
    { name: "description", content: locale.description },
    { name: "keywords", content: locale.keywords.join(", ") },
    { property: "og:site_name", content: "AnimeVerse" },
    { property: "og:title", content: locale.ogTitle },
    { property: "og:description", content: locale.ogDescription },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:locale", content: locale.ogLocale },
    ...STORE_LOCALES.filter((l) => l.code !== locale.code).map((l) => ({
      property: "og:locale:alternate",
      content: l.ogLocale,
    })),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: locale.ogTitle },
    { name: "twitter:description", content: locale.ogDescription },
    { name: "twitter:label1", content: "Price" },
    { name: "twitter:data1", content: "$1.99 per pack" },
    { name: "twitter:label2", content: "Delivery" },
    { name: "twitter:data2", content: "Instant download" },
  ];
}

function productNode(p: StoreProduct, locale: StoreLocaleSeo) {
  const url = `${SITE}${storePath(locale.code)}#${p.id}`;
  return {
    "@type": "Product",
    "@id": url,
    name: p.title,
    description: p.blurb,
    sku: p.id,
    brand: { "@type": "Brand", name: "AnimeVerse" },
    category:
      p.category === "anime-wallpapers"
        ? "Anime phone wallpapers"
        : "Dark aesthetic phone wallpapers",
    inLanguage: locale.hrefLang,
    isFamilyFriendly: true,
    offers: {
      "@type": "Offer",
      url: `${SITE}/store/checkout?p=${p.id}`,
      price: p.amount.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: "2027-12-31",
      seller: { "@type": "Organization", name: "AnimeVerse" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
    },
  };
}

/** Product/Offer graph for the store page in a given language. */
export function storeJsonLd(locale: StoreLocaleSeo) {
  const url = `${SITE}${storePath(locale.code)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: locale.ogTitle,
        description: locale.description,
        inLanguage: locale.hrefLang,
        isPartOf: { "@type": "WebSite", name: "AnimeVerse", url: SITE },
      },
      {
        "@type": "ItemList",
        name: locale.ogTitle,
        numberOfItems: storeProducts.length,
        itemListElement: storeProducts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: productNode(p, locale),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: locale.sections[0], item: url },
        ],
      },
    ],
  };
}

export { STORE_CATEGORIES };
