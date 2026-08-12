export type StoreCollection =
  | "Anime Collectibles"
  | "Gaming Gear"
  | "Games & Gaming Collectibles"
  | "Japanese Music & Media"
  | "Gift Cards & Digital Credit";

export type StoreRetailer = "Amazon" | "Play-Asia";

export type StoreProduct = {
  slug: string;
  asin?: string;
  productCode?: string;
  retailer?: StoreRetailer;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string[];
  collection: StoreCollection;
  categories: string[];
  affiliateUrl: string;
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  newArrival: boolean;
  purchaseNotice?: string;
  indexable?: boolean;
};

const amazonImage = (asin: string) =>
  `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
type CatalogArtworkKind =
  | "Game"
  | "Anime Game"
  | "Accessory"
  | "Gift Card"
  | "Game Top-Up";

type AdditionalPlayAsiaSeed = {
  slug: string;
  productCode: string;
  title: string;
  shortTitle: string;
  description: string;
  collection: StoreCollection;
  categories: string[];
  affiliateUrl: string;
  artworkKind: CatalogArtworkKind;
  purchaseNotice: string;
  indexable: boolean;
};

const artworkAccent: Record<CatalogArtworkKind, string> = {
  Game: "#38bdf8",
  "Anime Game": "#f472b6",
  Accessory: "#34d399",
  "Gift Card": "#fb923c",
  "Game Top-Up": "#a78bfa",
};

function escapeSvgText(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

function artworkTitleLines(value: string) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 24 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  if (lines.length > 3) {
    lines.splice(3);
    lines[2] = `${lines[2].replace(/[.,:;!?-]*$/, "")}…`;
  }
  return lines;
}

function catalogArtwork(kind: CatalogArtworkKind, title: string) {
  const accent = artworkAccent[kind];
  const titleMarkup = artworkTitleLines(title)
    .map(
      (line, index) =>
        `<text x="64" y="${330 + index * 58}" fill="#f8fafc" font-family="Arial,sans-serif" font-size="42" font-weight="800">${escapeSvgText(line)}</text>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#090f20"/><stop offset="1" stop-color="#172554"/></linearGradient><radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".42"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect width="800" height="800" rx="48" fill="url(#bg)"/><circle cx="690" cy="95" r="330" fill="url(#glow)"/><rect x="64" y="64" width="250" height="48" rx="24" fill="${accent}" fill-opacity=".16" stroke="${accent}" stroke-opacity=".7"/><text x="92" y="96" fill="${accent}" font-family="Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="3">PLAY-ASIA</text><text x="64" y="260" fill="${accent}" font-family="Arial,sans-serif" font-size="24" font-weight="800" letter-spacing="2">${escapeSvgText(kind.toUpperCase())}</text>${titleMarkup}<line x1="64" y1="600" x2="736" y2="600" stroke="#ffffff" stroke-opacity=".16"/><text x="64" y="650" fill="#cbd5e1" font-family="Arial,sans-serif" font-size="22">Curated affiliate listing</text><text x="64" y="688" fill="#94a3b8" font-family="Arial,sans-serif" font-size="18">Verify platform, region and delivery at retailer</text><text x="64" y="744" fill="#f8fafc" font-family="Arial,sans-serif" font-size="20" font-weight="700">GAMECASTLE STORE</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const additionalPlayAsiaSeeds: AdditionalPlayAsiaSeed[] = [
  {
    "slug": "apple-gift-card-10--eur-portugal-account",
    "productCode": "70dsm7",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-10--eur-portugal-account/13/70dsm7?affiliate_id=6821075",
    "title": "Apple Gift Card 10 EUR — Portugal Account",
    "shortTitle": "Apple Gift Card 10 EUR (Portugal)",
    "description": "A digital Apple Gift Card denominated in 10 EUR for an Apple account registered in Portugal.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Portugal. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-aud-australia-account",
    "productCode": "70g9ox",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-aud-australia-account/13/70g9ox?affiliate_id=6821075",
    "title": "Apple Gift Card 100 AUD — Australia Account",
    "shortTitle": "Apple Gift Card 100 AUD (Australia)",
    "description": "A digital Apple Gift Card denominated in 100 AUD for an Apple account registered in Australia.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Australia. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-dkk-denmark-account",
    "productCode": "70fm9f",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-dkk-denmark-account/13/70fm9f?affiliate_id=6821075",
    "title": "Apple Gift Card 100 DKK — Denmark Account",
    "shortTitle": "Apple Gift Card 100 DKK (Denmark)",
    "description": "A digital Apple Gift Card denominated in 100 DKK for an Apple account registered in Denmark.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Denmark. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-eur-france-account",
    "productCode": "709niz",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-eur-france-account/13/709niz?affiliate_id=6821075",
    "title": "Apple Gift Card 100 EUR — France Account",
    "shortTitle": "Apple Gift Card 100 EUR (France)",
    "description": "A digital Apple Gift Card denominated in 100 EUR for an Apple account registered in France.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in France. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-eur-netherlands-account",
    "productCode": "70ffnv",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-eur-netherlands-account/13/70ffnv?affiliate_id=6821075",
    "title": "Apple Gift Card 100 EUR — Netherlands Account",
    "shortTitle": "Apple Gift Card 100 EUR (Netherlands)",
    "description": "A digital Apple Gift Card denominated in 100 EUR for an Apple account registered in Netherlands.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Netherlands. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-gbp-uk-account",
    "productCode": "708lc7",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-gbp-uk-account/13/708lc7?affiliate_id=6821075",
    "title": "Apple Gift Card 100 GBP — United Kingdom Account",
    "shortTitle": "Apple Gift Card 100 GBP (United Kingdom)",
    "description": "A digital Apple Gift Card denominated in 100 GBP for an Apple account registered in United Kingdom.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in United Kingdom. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-mxn-mexico-account",
    "productCode": "70iixr",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-mxn-mexico-account/13/70iixr?affiliate_id=6821075",
    "title": "Apple Gift Card 100 MXN — Mexico Account",
    "shortTitle": "Apple Gift Card 100 MXN (Mexico)",
    "description": "A digital Apple Gift Card denominated in 100 MXN for an Apple account registered in Mexico.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Mexico. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-100-usd-us-account",
    "productCode": "7048ej",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-100-usd-us-account/13/7048ej?affiliate_id=6821075",
    "title": "Apple Gift Card 100 USD — United States Account",
    "shortTitle": "Apple Gift Card 100 USD (United States)",
    "description": "A digital Apple Gift Card denominated in 100 USD for an Apple account registered in United States.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in United States. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-20--eur-finland-account",
    "productCode": "70exdt",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-20--eur-finland-account/13/70exdt?affiliate_id=6821075",
    "title": "Apple Gift Card 20 EUR — Finland Account",
    "shortTitle": "Apple Gift Card 20 EUR (Finland)",
    "description": "A digital Apple Gift Card denominated in 20 EUR for an Apple account registered in Finland.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Finland. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-30--cny-china-account",
    "productCode": "70h87p",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-30--cny-china-account/13/70h87p?affiliate_id=6821075",
    "title": "Apple Gift Card 30 CNY — China Account",
    "shortTitle": "Apple Gift Card 30 CNY (China)",
    "description": "A digital Apple Gift Card denominated in 30 CNY for an Apple account registered in China.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in China. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-40--eur-ireland-account",
    "productCode": "70hufv",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-40--eur-ireland-account/13/70hufv?affiliate_id=6821075",
    "title": "Apple Gift Card 40 EUR — Ireland Account",
    "shortTitle": "Apple Gift Card 40 EUR (Ireland)",
    "description": "A digital Apple Gift Card denominated in 40 EUR for an Apple account registered in Ireland.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Ireland. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-50--eur-france-account",
    "productCode": "709nix",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-50--eur-france-account/13/709nix?affiliate_id=6821075",
    "title": "Apple Gift Card 50 EUR — France Account",
    "shortTitle": "Apple Gift Card 50 EUR (France)",
    "description": "A digital Apple Gift Card denominated in 50 EUR for an Apple account registered in France.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in France. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-50--pln-poland-account",
    "productCode": "70fm93",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-50--pln-poland-account/13/70fm93?affiliate_id=6821075",
    "title": "Apple Gift Card 50 PLN — Poland Account",
    "shortTitle": "Apple Gift Card 50 PLN (Poland)",
    "description": "A digital Apple Gift Card denominated in 50 PLN for an Apple account registered in Poland.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Poland. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-500-cny-china-account",
    "productCode": "70h87x",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-500-cny-china-account/13/70h87x?affiliate_id=6821075",
    "title": "Apple Gift Card 500 CNY — China Account",
    "shortTitle": "Apple Gift Card 500 CNY (China)",
    "description": "A digital Apple Gift Card denominated in 500 CNY for an Apple account registered in China.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in China. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-500-nok-norway-account",
    "productCode": "70gy4b",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-500-nok-norway-account/13/70gy4b?affiliate_id=6821075",
    "title": "Apple Gift Card 500 NOK — Norway Account",
    "shortTitle": "Apple Gift Card 500 NOK (Norway)",
    "description": "A digital Apple Gift Card denominated in 500 NOK for an Apple account registered in Norway.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Norway. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-5000-inr-india-account",
    "productCode": "70iiv1",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-5000-inr-india-account/13/70iiv1?affiliate_id=6821075",
    "title": "Apple Gift Card 5000 INR — India Account",
    "shortTitle": "Apple Gift Card 5000 INR (India)",
    "description": "A digital Apple Gift Card denominated in 5000 INR for an Apple account registered in India.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in India. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-600-mxn-mexico-account",
    "productCode": "70exef",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-600-mxn-mexico-account/13/70exef?affiliate_id=6821075",
    "title": "Apple Gift Card 600 MXN — Mexico Account",
    "shortTitle": "Apple Gift Card 600 MXN (Mexico)",
    "description": "A digital Apple Gift Card denominated in 600 MXN for an Apple account registered in Mexico.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Mexico. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "apple-gift-card-75--sar-saudi-arabia-account",
    "productCode": "70fck5",
    "affiliateUrl": "https://www.play-asia.com/ar/apple-gift-card-75--sar-saudi-arabia-account/13/70fck5?affiliate_id=6821075",
    "title": "Apple Gift Card 75 SAR — Saudi Arabia Account",
    "shortTitle": "Apple Gift Card 75 SAR (Saudi Arabia)",
    "description": "A digital Apple Gift Card denominated in 75 SAR for an Apple account registered in Saudi Arabia.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Apple Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for an Apple account registered in Saudi Arabia. Confirm the recipient account country before purchase; codes usually cannot be transferred between storefront regions.",
    "indexable": false
  },
  {
    "slug": "arc-raiders",
    "productCode": "70j41j",
    "affiliateUrl": "https://www.play-asia.com/ar/arc-raiders/13/70j41j?affiliate_id=6821075",
    "title": "ARC Raiders — Multiplayer Extraction Adventure",
    "shortTitle": "ARC Raiders",
    "description": "A multiplayer extraction adventure set on a future Earth threatened by mechanized ARC enemies, built around scavenging, survival and high-risk expeditions.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "assassins-creed-the-ezio-collection",
    "productCode": "70dcwz",
    "affiliateUrl": "https://www.play-asia.com/ar/assassins-creed-the-ezio-collection/13/70dcwz?affiliate_id=6821075",
    "title": "Assassin's Creed: The Ezio Collection",
    "shortTitle": "Assassin's Creed: The Ezio Collection",
    "description": "A collection centered on Ezio Auditore's story across Assassin's Creed II, Brotherhood and Revelations.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Game Collections"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "atomic-heart",
    "productCode": "70fylt",
    "affiliateUrl": "https://www.play-asia.com/ar/atomic-heart/13/70fylt?affiliate_id=6821075",
    "title": "Atomic Heart — Alternate-History Action RPG",
    "shortTitle": "Atomic Heart",
    "description": "An alternate-history first-person action RPG combining combat, exploration and a retro-futuristic facility setting.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "RPG Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "blasphemous",
    "productCode": "70d0c3",
    "affiliateUrl": "https://www.play-asia.com/ar/blasphemous/13/70d0c3?affiliate_id=6821075",
    "title": "Blasphemous — Dark Action-Platformer",
    "shortTitle": "Blasphemous",
    "description": "A dark action-platformer known for demanding combat, interconnected exploration and gothic pixel art.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "blood-strike-1000-100-gold-direct-top-up",
    "productCode": "70jd7l",
    "affiliateUrl": "https://www.play-asia.com/ar/blood-strike-1000-100-gold-direct-top-up/13/70jd7l?affiliate_id=6821075",
    "title": "Blood Strike 1,000 + 100 Gold Direct Top-Up",
    "shortTitle": "Blood Strike 1,000 + 100 Gold",
    "description": "A direct top-up package for 1,000 + 100 Gold in Blood Strike.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Direct Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "borderlands-4",
    "productCode": "70itl7",
    "affiliateUrl": "https://www.play-asia.com/ar/borderlands-4/13/70itl7?affiliate_id=6821075",
    "title": "Borderlands 4 — Looter-Shooter Adventure",
    "shortTitle": "Borderlands 4",
    "description": "A cooperative looter-shooter built around Vault Hunters, an expansive arsenal and fast combat on Kairos.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "dark-souls-remastered",
    "productCode": "70d38z",
    "affiliateUrl": "https://www.play-asia.com/ar/dark-souls-remastered/13/70d38z?affiliate_id=6821075",
    "title": "Dark Souls Remastered — Action RPG",
    "shortTitle": "Dark Souls Remastered",
    "description": "The remastered edition of the influential action RPG with deliberate combat and interconnected exploration.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "RPG Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "disneys-hercules",
    "productCode": "70ew79",
    "affiliateUrl": "https://www.play-asia.com/ar/disneys-hercules/13/70ew79?affiliate_id=6821075",
    "title": "Disney's Hercules — Classic Action Game",
    "shortTitle": "Disney's Hercules",
    "description": "Explore Disney's Hercules, a classic action-platform game, then verify platform, region, language and delivery details on Play-Asia.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Classic Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "dmm-point-code-1000-yen",
    "productCode": "70gq15",
    "affiliateUrl": "https://www.play-asia.com/ar/dmm-point-code-1000-yen/13/70gq15?affiliate_id=6821075",
    "title": "DMM Point Code 1,000 Yen — Japan Account",
    "shortTitle": "DMM Point Code 1,000 Yen",
    "description": "A digital DMM point code with a 1,000-yen value for compatible Japanese DMM services.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "DMM Point Codes",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Intended for a compatible Japanese DMM account. Confirm account eligibility, service restrictions and redemption requirements before purchase.",
    "indexable": false
  },
  {
    "slug": "dmm-point-code-10000-yen",
    "productCode": "70bm6p",
    "affiliateUrl": "https://www.play-asia.com/ar/dmm-point-code-10000-yen/13/70bm6p?affiliate_id=6821075",
    "title": "DMM Point Code 10,000 Yen — Japan Account",
    "shortTitle": "DMM Point Code 10,000 Yen",
    "description": "A digital DMM point code with a 10,000-yen value for compatible Japanese DMM services.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "DMM Point Codes",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Intended for a compatible Japanese DMM account. Confirm account eligibility, service restrictions and redemption requirements before purchase.",
    "indexable": false
  },
  {
    "slug": "dragon-ball-xenoverse-2-season-pass-dlc",
    "productCode": "70jj8v",
    "affiliateUrl": "https://www.play-asia.com/ar/dragon-ball-xenoverse-2-season-pass-dlc/13/70jj8v?affiliate_id=6821075",
    "title": "Dragon Ball Xenoverse 2 Season Pass — DLC",
    "shortTitle": "Dragon Ball Xenoverse 2 Season Pass",
    "description": "Downloadable season-pass content for Dragon Ball Xenoverse 2; the compatible base game is required.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "This is add-on content, not the base game. Confirm the required base game, platform and account region before purchase.",
    "indexable": true
  },
  {
    "slug": "dragonsword-awakening",
    "productCode": "70k4ob",
    "affiliateUrl": "https://www.play-asia.com/ar/dragonsword-awakening/13/70k4ob?affiliate_id=6821075",
    "title": "DragonSword: Awakening — Anime Open-World RPG",
    "shortTitle": "DragonSword: Awakening",
    "description": "An anime-style open-world action RPG set on the Continent of Orbis with companion-based tag combat.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games",
      "RPG Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "final-fantasy-xiii",
    "productCode": "708sh1",
    "affiliateUrl": "https://www.play-asia.com/ar/final-fantasy-xiii/13/708sh1?affiliate_id=6821075",
    "title": "Final Fantasy XIII — Story-Driven JRPG",
    "shortTitle": "Final Fantasy XIII",
    "description": "A story-driven Japanese RPG following Lightning and her allies through Cocoon and Pulse.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games",
      "RPG Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "fortnite-gift-card-100-usd-us-account",
    "productCode": "70jns3",
    "affiliateUrl": "https://www.play-asia.com/ar/fortnite-gift-card-100-usd-us-account/13/70jns3?affiliate_id=6821075",
    "title": "Fortnite Gift Card 100 USD — US Account",
    "shortTitle": "Fortnite Gift Card 100 USD",
    "description": "A 100 USD Fortnite gift card intended for a compatible United States account.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Gift Cards",
      "Digital Gift Cards",
      "Region-Locked Codes"
    ],
    "artworkKind": "Gift Card",
    "purchaseNotice": "Region locked: intended for a compatible United States account. Confirm the account country and redemption rules before purchase.",
    "indexable": false
  },
  {
    "slug": "garena-free-fire-21021-diamonds",
    "productCode": "70ia8x",
    "affiliateUrl": "https://www.play-asia.com/ar/garena-free-fire-21021-diamonds/13/70ia8x?affiliate_id=6821075",
    "title": "Garena Free Fire 210 + 21 Diamonds",
    "shortTitle": "Free Fire 210 + 21 Diamonds",
    "description": "A digital diamond package for Garena Free Fire containing 210 + 21 Diamonds.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "hacker-evolution-duality",
    "productCode": "70ebtz",
    "affiliateUrl": "https://www.play-asia.com/ar/hacker-evolution-duality/13/70ebtz?affiliate_id=6821075",
    "title": "Hacker Evolution Duality — Hacking Simulation",
    "shortTitle": "Hacker Evolution Duality",
    "description": "A hacking-themed strategy and simulation game focused on digital infiltration and tactical decisions.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "koumajou-remilia-ii-strangers-requiem",
    "productCode": "70j815",
    "affiliateUrl": "https://www.play-asia.com/ar/koumajou-remilia-ii-strangers-requiem/13/70j815?affiliate_id=6821075",
    "title": "Koumajou Remilia II: Stranger's Requiem",
    "shortTitle": "Koumajou Remilia II",
    "description": "A Touhou-inspired side-scrolling action game with gothic presentation and anime-style artwork.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "lego-dimensions-fun-pack-chima-cragger",
    "productCode": "7093nb",
    "affiliateUrl": "https://www.play-asia.com/ar/lego-dimensions-fun-pack-chima-cragger/13/7093nb?affiliate_id=6821075",
    "title": "LEGO Dimensions Fun Pack — Chima Cragger",
    "shortTitle": "LEGO Dimensions Chima Cragger",
    "description": "Explore the LEGO Dimensions Chima Cragger Fun Pack and verify included pieces, compatibility, packaging and condition on Play-Asia.",
    "collection": "Gaming Gear",
    "categories": [
      "Gaming Accessories",
      "Gaming Collectibles"
    ],
    "artworkKind": "Accessory",
    "purchaseNotice": "Confirm compatibility, included pieces, condition and regional packaging on the Play-Asia listing.",
    "indexable": true
  },
  {
    "slug": "lego-dimensions-fun-pack-chima-eris",
    "productCode": "7093nd",
    "affiliateUrl": "https://www.play-asia.com/ar/lego-dimensions-fun-pack-chima-eris/13/7093nd?affiliate_id=6821075",
    "title": "LEGO Dimensions Fun Pack — Chima Eris",
    "shortTitle": "LEGO Dimensions Chima Eris",
    "description": "Explore the LEGO Dimensions Chima Eris Fun Pack and verify included pieces, compatibility, packaging and condition on Play-Asia.",
    "collection": "Gaming Gear",
    "categories": [
      "Gaming Accessories",
      "Gaming Collectibles"
    ],
    "artworkKind": "Accessory",
    "purchaseNotice": "Confirm compatibility, included pieces, condition and regional packaging on the Play-Asia listing.",
    "indexable": true
  },
  {
    "slug": "marvel-rivals-1000-lattices-direct-top-up",
    "productCode": "70j3fx",
    "affiliateUrl": "https://www.play-asia.com/ar/marvel-rivals-1000-lattices-direct-top-up/13/70j3fx?affiliate_id=6821075",
    "title": "Marvel Rivals 1,000 Lattices Direct Top-Up",
    "shortTitle": "Marvel Rivals 1,000 Lattices",
    "description": "A direct top-up package for 1,000 Lattices in Marvel Rivals.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Direct Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "marvel-rivals-2180-lattices-direct-top-up",
    "productCode": "70j3fz",
    "affiliateUrl": "https://www.play-asia.com/ar/marvel-rivals-2180-lattices-direct-top-up/13/70j3fz?affiliate_id=6821075",
    "title": "Marvel Rivals 2,180 Lattices Direct Top-Up",
    "shortTitle": "Marvel Rivals 2,180 Lattices",
    "description": "A direct top-up package for 2,180 Lattices in Marvel Rivals.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Direct Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "marvel-rivals-500-lattices-direct-top-up",
    "productCode": "70j3fv",
    "affiliateUrl": "https://www.play-asia.com/ar/marvel-rivals-500-lattices-direct-top-up/13/70j3fv?affiliate_id=6821075",
    "title": "Marvel Rivals 500 Lattices Direct Top-Up",
    "shortTitle": "Marvel Rivals 500 Lattices",
    "description": "A direct top-up package for 500 Lattices in Marvel Rivals.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Direct Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "marvel-rivals-5680-lattices-direct-top-up",
    "productCode": "70j3g1",
    "affiliateUrl": "https://www.play-asia.com/ar/marvel-rivals-5680-lattices-direct-top-up/13/70j3g1?affiliate_id=6821075",
    "title": "Marvel Rivals 5,680 Lattices Direct Top-Up",
    "shortTitle": "Marvel Rivals 5,680 Lattices",
    "description": "A direct top-up package for 5,680 Lattices in Marvel Rivals.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Direct Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "mobile-legends-1783-diamonds",
    "productCode": "70e19d",
    "affiliateUrl": "https://www.play-asia.com/ar/mobile-legends-1783-diamonds/13/70e19d?affiliate_id=6821075",
    "title": "Mobile Legends 1,783 Diamonds",
    "shortTitle": "Mobile Legends 1,783 Diamonds",
    "description": "A digital package for 1,783 Diamonds in Mobile Legends.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "namco-museum-archives-vol-2",
    "productCode": "70eslz",
    "affiliateUrl": "https://www.play-asia.com/ar/namco-museum-archives-vol-2/13/70eslz?affiliate_id=6821075",
    "title": "Namco Museum Archives Vol. 2",
    "shortTitle": "Namco Museum Archives Vol. 2",
    "description": "A second collection of classic Namco games prepared for modern platforms.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Classic Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "naruto-shippuden-ultimate-ninja-storm-3-full-burst",
    "productCode": "70709v",
    "affiliateUrl": "https://www.play-asia.com/ar/naruto-shippuden-ultimate-ninja-storm-3-full-burst/13/70709v?affiliate_id=6821075",
    "title": "Naruto Shippuden: Ultimate Ninja Storm 3 Full Burst",
    "shortTitle": "Naruto Storm 3 Full Burst",
    "description": "An anime action and fighting game covering major Naruto Shippuden story battles.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "nintendo-switch-pro-controller-xenoblade-2-edition",
    "productCode": "70brof",
    "affiliateUrl": "https://www.play-asia.com/ar/nintendo-switch-pro-controller-xenoblade-2-edition/13/70brof?affiliate_id=6821075",
    "title": "Nintendo Switch Pro Controller — Xenoblade 2 Edition",
    "shortTitle": "Xenoblade 2 Switch Pro Controller",
    "description": "A Xenoblade Chronicles 2-themed Nintendo Switch Pro Controller for players and collectors.",
    "collection": "Gaming Gear",
    "categories": [
      "Gaming Accessories",
      "Nintendo Switch Accessories"
    ],
    "artworkKind": "Accessory",
    "purchaseNotice": "Confirm compatibility, included pieces, condition and regional packaging on the Play-Asia listing.",
    "indexable": true
  },
  {
    "slug": "nioh-2-the-complete-edition",
    "productCode": "70hsqp",
    "affiliateUrl": "https://www.play-asia.com/ar/nioh-2-the-complete-edition/13/70hsqp?affiliate_id=6821075",
    "title": "Nioh 2: The Complete Edition",
    "shortTitle": "Nioh 2: The Complete Edition",
    "description": "A demanding samurai action RPG package with the Complete Edition's bundled content.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Game Collections",
      "RPG Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "palworld",
    "productCode": "70gwjv",
    "affiliateUrl": "https://www.play-asia.com/ar/palworld/13/70gwjv?affiliate_id=6821075",
    "title": "Palworld — Open-World Survival Adventure",
    "shortTitle": "Palworld",
    "description": "An open-world survival game built around creature collection, crafting, base building and exploration.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "pubg-mobile-3000850-uc-code",
    "productCode": "70dh1p",
    "affiliateUrl": "https://www.play-asia.com/ar/pubg-mobile-3000850-uc-code/13/70dh1p?affiliate_id=6821075",
    "title": "PUBG Mobile 3,000 + 850 UC Code",
    "shortTitle": "PUBG Mobile 3,000 + 850 UC",
    "description": "A digital UC code package for PUBG Mobile containing 3,000 + 850 UC.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "pubg-mobile-30025-uc-code",
    "productCode": "70dh1l",
    "affiliateUrl": "https://www.play-asia.com/ar/pubg-mobile-30025-uc-code/13/70dh1l?affiliate_id=6821075",
    "title": "PUBG Mobile 300 + 25 UC Code",
    "shortTitle": "PUBG Mobile 300 + 25 UC",
    "description": "A digital UC code package for PUBG Mobile containing 300 + 25 UC.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "pubg-mobile-60--uc-code",
    "productCode": "70dh1j",
    "affiliateUrl": "https://www.play-asia.com/ar/pubg-mobile-60--uc-code/13/70dh1j?affiliate_id=6821075",
    "title": "PUBG Mobile 60 UC Code",
    "shortTitle": "PUBG Mobile 60 UC",
    "description": "A digital code package for 60 UC in PUBG Mobile.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "pubg-mobile-60002100-uc-code",
    "productCode": "70dh1r",
    "affiliateUrl": "https://www.play-asia.com/ar/pubg-mobile-60002100-uc-code/13/70dh1r?affiliate_id=6821075",
    "title": "PUBG Mobile 6,000 + 2,100 UC Code",
    "shortTitle": "PUBG Mobile 6,000 + 2,100 UC",
    "description": "A digital UC code package for PUBG Mobile containing 6,000 + 2,100 UC.",
    "collection": "Gift Cards & Digital Credit",
    "categories": [
      "Game Top-Ups",
      "Digital Credit",
      "Region-Locked Codes"
    ],
    "artworkKind": "Game Top-Up",
    "purchaseNotice": "Confirm the correct game account, server or region and required player information before purchase. Direct top-ups and digital codes may be non-returnable after delivery.",
    "indexable": false
  },
  {
    "slug": "resident-evil-2-biohazard-re-2",
    "productCode": "70g4ob",
    "affiliateUrl": "https://www.play-asia.com/ar/resident-evil-2-biohazard-re-2/13/70g4ob?affiliate_id=6821075",
    "title": "Resident Evil 2 / Biohazard RE:2",
    "shortTitle": "Resident Evil 2",
    "description": "A modern reimagining of Resident Evil 2 with survival-horror exploration in Raccoon City.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "resident-evil-4-gold-edition",
    "productCode": "70hgxh",
    "affiliateUrl": "https://www.play-asia.com/ar/resident-evil-4-gold-edition/13/70hgxh?affiliate_id=6821075",
    "title": "Resident Evil 4 Gold Edition",
    "shortTitle": "Resident Evil 4 Gold Edition",
    "description": "The modern Resident Evil 4 survival-horror campaign with edition-specific additional content.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Game Collections"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "saints-row-the-third-remastered",
    "productCode": "70eme1",
    "affiliateUrl": "https://www.play-asia.com/ar/saints-row-the-third-remastered/13/70eme1?affiliate_id=6821075",
    "title": "Saints Row: The Third Remastered",
    "shortTitle": "Saints Row: The Third Remastered",
    "description": "A remastered open-world action game centered on the Third Street Saints.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Action Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "simcity-2000-special-edition",
    "productCode": "70ecfv",
    "affiliateUrl": "https://www.play-asia.com/ar/simcity-2000-special-edition/13/70ecfv?affiliate_id=6821075",
    "title": "SimCity 2000 Special Edition",
    "shortTitle": "SimCity 2000 Special Edition",
    "description": "A classic city-building simulation focused on planning, infrastructure and urban growth.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Classic Games",
      "Strategy Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "super-robot-wars-y-ultimate-edition",
    "productCode": "70itm1",
    "affiliateUrl": "https://www.play-asia.com/ar/super-robot-wars-y-ultimate-edition/13/70itm1?affiliate_id=6821075",
    "title": "Super Robot Wars Y Ultimate Edition",
    "shortTitle": "Super Robot Wars Y Ultimate Edition",
    "description": "A grid-based tactical RPG bringing pilots and machines from multiple anime series together.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games",
      "Strategy Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "syndicate-plus",
    "productCode": "70dt55",
    "affiliateUrl": "https://www.play-asia.com/ar/syndicate-plus/13/70dt55?affiliate_id=6821075",
    "title": "Syndicate Plus — Classic Cyberpunk Strategy",
    "shortTitle": "Syndicate Plus",
    "description": "A classic cyberpunk tactical strategy package built around squad control and corporate warfare.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Classic Games",
      "Strategy Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "teenage-mutant-ninja-turtles-the-cowabunga-collection",
    "productCode": "70fny1",
    "affiliateUrl": "https://www.play-asia.com/ar/teenage-mutant-ninja-turtles-the-cowabunga-collection/13/70fny1?affiliate_id=6821075",
    "title": "TMNT: The Cowabunga Collection",
    "shortTitle": "TMNT: The Cowabunga Collection",
    "description": "A collection of classic Teenage Mutant Ninja Turtles games gathered for modern platforms.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Game Collections",
      "Classic Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "the-legend-of-heroes-trails-of-cold-steel-ii",
    "productCode": "70dki5",
    "affiliateUrl": "https://www.play-asia.com/ar/the-legend-of-heroes-trails-of-cold-steel-ii/13/70dki5?affiliate_id=6821075",
    "title": "The Legend of Heroes: Trails of Cold Steel II",
    "shortTitle": "Trails of Cold Steel II",
    "description": "A story-driven Japanese RPG continuing Rean Schwarzer's journey through Erebonia.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games",
      "RPG Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "tom-clancys-the-division",
    "productCode": "70el71",
    "affiliateUrl": "https://www.play-asia.com/ar/tom-clancys-the-division/13/70el71?affiliate_id=6821075",
    "title": "Tom Clancy's The Division",
    "shortTitle": "Tom Clancy's The Division",
    "description": "An online action RPG combining third-person combat, cooperative missions and equipment progression.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "RPG Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "transformers-battlegrounds",
    "productCode": "70dyl3",
    "affiliateUrl": "https://www.play-asia.com/ar/transformers-battlegrounds/13/70dyl3?affiliate_id=6821075",
    "title": "Transformers: Battlegrounds",
    "shortTitle": "Transformers: Battlegrounds",
    "description": "A tactical game featuring Autobots and Decepticons in turn-based battles.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Strategy Games"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "triangle-strategy",
    "productCode": "70fsox",
    "affiliateUrl": "https://www.play-asia.com/ar/triangle-strategy/13/70fsox?affiliate_id=6821075",
    "title": "Triangle Strategy — Tactical JRPG",
    "shortTitle": "Triangle Strategy",
    "description": "A tactical Japanese RPG featuring grid battles, branching convictions and political fantasy.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Anime Games",
      "RPG Games",
      "Strategy Games"
    ],
    "artworkKind": "Anime Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  },
  {
    "slug": "uncharted-legacy-of-thieves-collection",
    "productCode": "70izd1",
    "affiliateUrl": "https://www.play-asia.com/ar/uncharted-legacy-of-thieves-collection/13/70izd1?affiliate_id=6821075",
    "title": "Uncharted: Legacy of Thieves Collection",
    "shortTitle": "Uncharted: Legacy of Thieves",
    "description": "A collection pairing Uncharted 4: A Thief's End with Uncharted: The Lost Legacy.",
    "collection": "Games & Gaming Collectibles",
    "categories": [
      "Video Games",
      "Game Collections"
    ],
    "artworkKind": "Game",
    "purchaseNotice": "Platform, region, supported language and delivery format can vary. Confirm the exact Play-Asia listing before purchase.",
    "indexable": true
  }
];

const additionalPlayAsiaProducts: StoreProduct[] = additionalPlayAsiaSeeds.map(
  (seed) => ({
    slug: seed.slug,
    productCode: seed.productCode,
    retailer: "Play-Asia",
    title: seed.title,
    shortTitle: seed.shortTitle,
    description: seed.description,
    longDescription: [
      seed.description,
      seed.purchaseNotice,
      "Open the Play-Asia listing to confirm the exact platform or account region, included content, delivery method, compatibility, stock and latest price before purchase.",
    ],
    collection: seed.collection,
    categories: [...seed.categories],
    affiliateUrl: seed.affiliateUrl,
    imageUrl: catalogArtwork(seed.artworkKind, seed.shortTitle),
    imageAlt: `GameCastle catalog artwork for ${seed.shortTitle}`,
    featured: false,
    newArrival: true,
    purchaseNotice: seed.purchaseNotice,
    indexable: seed.indexable,
  }),
);


export const storeProducts: StoreProduct[] = [
  {
    slug: "my-dress-up-darling-taito-t-most-figure",
    asin: "B0DTP3MTX1",
    title:
      "Taito T-Most My Dress-Up Darling Figure — Marin Kitagawa Collectible",
    shortTitle: "My Dress-Up Darling T-Most Figure",
    description:
      "A character-focused My Dress-Up Darling display figure selected for anime shelves, collector desks and thoughtful fan gifts.",
    longDescription: [
      "Bring My Dress-Up Darling energy to your display with this Taito T-Most collectible. Its character-first presentation makes it an easy centerpiece for fans building a dedicated anime shelf.",
      "Use the Amazon button to review the current seller, package details, availability and latest price before ordering. Those details are controlled by Amazon and may vary by region.",
    ],
    collection: "Anime Collectibles",
    categories: ["Anime Figures"],
    affiliateUrl: "https://amzn.to/4wqhuYD",
    imageUrl: amazonImage("B0DTP3MTX1"),
    imageAlt: "Taito T-Most My Dress-Up Darling anime figure",
    featured: true,
    newArrival: true,
  },
  {
    slug: "satoru-gojo-anime-heroes-jujutsu-kaisen-figure",
    asin: "B0DCQKYFT5",
    title: "Satoru Gojo Anime Heroes Figure — Jujutsu Kaisen Collectible",
    shortTitle: "Satoru Gojo Anime Heroes Figure",
    description:
      "A Jujutsu Kaisen collectible centered on Satoru Gojo, chosen for fans who want a recognizable sorcerer on their display shelf.",
    longDescription: [
      "This Anime Heroes Satoru Gojo figure gives Jujutsu Kaisen collectors a clear character centerpiece for a manga shelf, gaming setup or themed display.",
      "Check the linked Amazon listing for the current seller, included pieces, packaging condition, availability and price before you buy.",
    ],
    collection: "Anime Collectibles",
    categories: ["Jujutsu Kaisen Collection", "Anime Figures"],
    affiliateUrl: "https://amzn.to/4wVF5Bm",
    imageUrl: amazonImage("B0DCQKYFT5"),
    imageAlt: "Satoru Gojo Anime Heroes Jujutsu Kaisen figure",
    featured: true,
    newArrival: false,
  },
  {
    slug: "nezuko-kamado-tamashii-nations-demon-slayer-figure",
    asin: "B084CB8VYP",
    title: "Nezuko Kamado TAMASHII NATIONS Figure — Demon Slayer Collectible",
    shortTitle: "Nezuko Kamado TAMASHII NATIONS Figure",
    description:
      "A Nezuko Kamado display collectible for Demon Slayer fans building a focused character or franchise collection.",
    longDescription: [
      "Designed around one of Demon Slayer's most recognizable characters, this Nezuko Kamado collectible fits naturally into a dedicated Kimetsu no Yaiba display.",
      "Amazon provides the live seller, package, availability and price information. Review the listing details at checkout because they can change over time and by destination.",
    ],
    collection: "Anime Collectibles",
    categories: ["Demon Slayer Collection", "Anime Figures"],
    affiliateUrl: "https://amzn.to/4wPvYlH",
    imageUrl: amazonImage("B084CB8VYP"),
    imageAlt: "Nezuko Kamado TAMASHII NATIONS Demon Slayer figure",
    featured: true,
    newArrival: false,
  },
  {
    slug: "roronoa-zoro-funko-pop-one-piece",
    asin: "B08FMSC7NC",
    title: "Funko Pop! Roronoa Zoro — One Piece Anime Vinyl Collectible",
    shortTitle: "Roronoa Zoro Funko Pop!",
    description:
      "A One Piece Funko Pop! featuring Roronoa Zoro for compact anime displays, vinyl collections and Straw Hat crew shelves.",
    longDescription: [
      "Add Roronoa Zoro to a One Piece display with a compact Funko Pop! collectible that pairs easily with other anime vinyl figures.",
      "Open the Amazon listing to confirm the edition, box condition, seller, current price and shipping availability for your country.",
    ],
    collection: "Anime Collectibles",
    categories: ["One Piece Collection", "Funko Pop Anime"],
    affiliateUrl: "https://amzn.to/4zaMnTk",
    imageUrl: amazonImage("B08FMSC7NC"),
    imageAlt: "Roronoa Zoro One Piece Funko Pop anime figure",
    featured: true,
    newArrival: false,
  },
  {
    slug: "deku-funko-pop-my-hero-academia",
    asin: "B07PGYF5QY",
    title: "Funko Pop! Deku — My Hero Academia Anime Vinyl Figure",
    shortTitle: "Deku Funko Pop!",
    description:
      "A compact Deku vinyl collectible for My Hero Academia fans, gift lists and hero-themed Funko Pop! displays.",
    longDescription: [
      "Build out a My Hero Academia shelf with a Deku Funko Pop! that works as a standalone desk piece or alongside other hero collectibles.",
      "The Amazon product page contains the current edition, seller, availability, delivery and price details. Confirm those details before purchase.",
    ],
    collection: "Anime Collectibles",
    categories: ["My Hero Academia Collection", "Funko Pop Anime"],
    affiliateUrl: "https://amzn.to/4wUHYlV",
    imageUrl: amazonImage("B07PGYF5QY"),
    imageAlt: "Deku My Hero Academia Funko Pop anime figure",
    featured: false,
    newArrival: false,
  },
  {
    slug: "steelseries-arctis-wireless-gaming-headset",
    asin: "B0D2YBQQ1P",
    title:
      "SteelSeries Arctis Wireless Gaming Headset — Multi-System Gaming Gear",
    shortTitle: "SteelSeries Arctis Wireless Headset",
    description:
      "A wireless SteelSeries Arctis headset option for players comparing a cleaner gaming setup across supported systems.",
    longDescription: [
      "This SteelSeries Arctis wireless headset is featured for gamers who want to compare a cable-free audio option for their current setup.",
      "Compatibility, included accessories and regional versions can differ. Use the Amazon listing to verify the exact model, supported systems, seller and latest price.",
    ],
    collection: "Gaming Gear",
    categories: ["Gaming Headsets"],
    affiliateUrl: "https://amzn.to/4wWRBRj",
    imageUrl: amazonImage("B0D2YBQQ1P"),
    imageAlt: "SteelSeries Arctis wireless gaming headset",
    featured: true,
    newArrival: true,
  },
  {
    slug: "nintendo-switch-joy-con-pastel-purple-green",
    asin: "B0C7F58QFT",
    title: "Nintendo Switch Joy-Con Pair — Pastel Purple & Pastel Green",
    shortTitle: "Nintendo Switch Pastel Joy-Con Pair",
    description:
      "A pastel purple and green Joy-Con color pairing for Nintendo Switch players refreshing a multiplayer or handheld setup.",
    longDescription: [
      "Refresh a Nintendo Switch setup with a pastel Joy-Con pairing that brings a softer color palette to handheld and local multiplayer play.",
      "Review the Amazon listing for current platform compatibility, region, included items, seller, availability and latest price before ordering.",
    ],
    collection: "Gaming Gear",
    categories: ["Nintendo Switch Accessories", "Gaming Controllers"],
    affiliateUrl: "https://amzn.to/4gsE1iA",
    imageUrl: amazonImage("B0C7F58QFT"),
    imageAlt:
      "Nintendo Switch Joy-Con controllers in pastel purple and pastel green",
    featured: true,
    newArrival: true,
  },
  {
    slug: "fastsnail-joy-con-charging-dock",
    asin: "B07KYHBVYH",
    title: "FastSnail Joy-Con Charging Dock — Nintendo Switch Accessory",
    shortTitle: "FastSnail Joy-Con Charging Dock",
    description:
      "A dedicated charging dock for organizing compatible Nintendo Switch Joy-Con controllers between play sessions.",
    longDescription: [
      "Keep compatible Joy-Con controllers organized between sessions with a dedicated FastSnail charging dock selected for practical Nintendo Switch setups.",
      "Confirm controller compatibility, included cables, seller, current availability and price on Amazon because listing details can change.",
    ],
    collection: "Gaming Gear",
    categories: ["Nintendo Switch Accessories", "Charging Accessories"],
    affiliateUrl: "https://amzn.to/4qdTsi6",
    imageUrl: "https://fastsnail.us/cdn/shop/files/1.png?v=1738827571&width=1200",
    imageAlt: "FastSnail charging dock for Nintendo Switch Joy-Con controllers",
    featured: false,
    newArrival: false,
  },
  {
    slug: "nezuko-kamado-figuarts-mini-demon-slayer",
    asin: "B08FCGJY2P",
    title: "Nezuko Kamado Figuarts Mini — Premium Demon Slayer Figure",
    shortTitle: "Nezuko Kamado Figuarts Mini",
    description:
      "A compact Figuarts-style Nezuko Kamado collectible for Demon Slayer displays where character detail and shelf space both matter.",
    longDescription: [
      "This Nezuko Kamado Figuarts collectible gives Demon Slayer fans a compact display option for a curated character shelf or desk setup.",
      "Use Amazon to verify the exact series, contents, seller, package condition, current availability and live price before purchasing.",
    ],
    collection: "Anime Collectibles",
    categories: [
      "Demon Slayer Collection",
      "Premium Anime Figures",
      "Anime Figures",
    ],
    affiliateUrl: "https://amzn.to/4wsjlMH",
    imageUrl: amazonImage("B08FCGJY2P"),
    imageAlt: "Nezuko Kamado Figuarts Mini Demon Slayer figure",
    featured: true,
    newArrival: true,
  },
  {
    slug: "banpresto-nezuko-kamado-vol-26-figure",
    asin: "B0B4V6ZDVT",
    title: "Banpresto Nezuko Kamado Vol. 26 — Demon Slayer Display Figure",
    shortTitle: "Banpresto Nezuko Kamado Vol. 26",
    description:
      "A Banpresto Nezuko Kamado Vol. 26 display figure for Demon Slayer collectors expanding a character-focused shelf.",
    longDescription: [
      "Expand a Demon Slayer collection with the Banpresto Nezuko Kamado Vol. 26 figure, selected as a clear character-led display piece.",
      "The linked Amazon page is the source for the current seller, edition, package details, availability, shipping options and latest price.",
    ],
    collection: "Anime Collectibles",
    categories: ["Demon Slayer Collection", "Anime Figures"],
    affiliateUrl: "https://amzn.to/4hoAWRI",
    imageUrl: amazonImage("B0B4V6ZDVT"),
    imageAlt: "Banpresto Nezuko Kamado Vol. 26 Demon Slayer figure",
    featured: true,
    newArrival: true,
  },
  {
    slug: "like-a-dragon-gaiden-ps4-multi-language",
    productCode: "70gpd7",
    retailer: "Play-Asia",
    title:
      "Like a Dragon Gaiden: The Man Who Erased His Name — Multi-Language PS4 Edition",
    shortTitle: "Like a Dragon Gaiden — PS4",
    description:
      "A physical multi-language PlayStation 4 edition featuring Kazuma Kiryu's action story, Yakuza and Agent fighting styles, and English subtitle support.",
    longDescription: [
      "Like a Dragon Gaiden: The Man Who Erased His Name follows Kazuma Kiryu under the codename Joryu in a focused action chapter built around the series' criminal underworld, side activities and character-driven storytelling.",
      "This Play-Asia listing is for the physical PlayStation 4 multi-language edition. Check the retailer page for the current cover option, supported languages, regional account requirements, stock, shipping and latest price before ordering.",
    ],
    collection: "Games & Gaming Collectibles",
    categories: ["PlayStation Games", "Action Games", "Multi-Language Games"],
    affiliateUrl:
      "https://www.play-asia.com/ar/like-a-dragon-gaiden-the-man-who-erased-his-name-multi-language/13/70gpd7?affiliate_id=6821075",
    imageUrl:
      "https://s.pacn.ws/1/p/17a/like-a-dragon-gaiden-the-man-who-erased-his-name-multilanguage-779371.10.jpg?v=s8izq6&width=800",
    imageAlt:
      "Like a Dragon Gaiden The Man Who Erased His Name multi-language PS4 game cover",
    featured: true,
    newArrival: true,
  },
  {
    slug: "aikotoba-4-cd-dvd-limited-edition-yamazaru",
    productCode: "70b1h3",
    retailer: "Play-Asia",
    title: "Aikotoba 4 by Yamazaru — CD + DVD Limited Edition",
    shortTitle: "Aikotoba 4 CD+DVD Limited Edition",
    description:
      "The Japanese limited edition of Yamazaru's Aikotoba 4, pairing the 12-track audio CD with a DVD of music videos and behind-the-scenes material.",
    longDescription: [
      "Aikotoba 4 is a Sony Music Japan release by Yamazaru. This limited edition combines the full audio album with a DVD containing music-film, music-video and making-of content listed by the retailer.",
      "Use the Play-Asia listing to confirm the Japanese edition, package condition, stock, shipping options and latest price. Music media policies can differ from standard merchandise, so review the retailer terms before purchase.",
    ],
    collection: "Japanese Music & Media",
    categories: ["Japanese Music", "Audio CDs", "Limited Editions"],
    affiliateUrl:
      "https://www.play-asia.com/ar/aikotoba-4-cddvd-limited-edition/13/70b1h3?affiliate_id=6821075",
    imageUrl:
      "https://www.sonymusic.co.jp/adm_image/common/artist_image/70005000/70005819/jacket_image/159669.jpg",
    imageAlt: "Yamazaru Aikotoba 4 CD and DVD limited edition cover",
    featured: false,
    newArrival: true,
  },
  {
    slug: "kimi-to-100-kaime-no-koi-original-soundtrack",
    productCode: "70ater",
    retailer: "Play-Asia",
    title: "Kimi To 100 Kaime No Koi — Original Soundtrack CD",
    shortTitle: "Kimi To 100 Kaime No Koi Soundtrack",
    description:
      "A Japanese Sony Music soundtrack CD collecting 24 pieces from The 100th Love with You, including instrumental and movie-version tracks.",
    longDescription: [
      "This original soundtrack collects the music associated with the Japanese romantic fantasy film Kimi To 100 Kaime No Koi, also known as The 100th Love with You.",
      "The Play-Asia listing identifies a Japanese audio CD with a 24-track program. Confirm stock, edition details, shipping eligibility and the latest price on the retailer page before purchasing.",
    ],
    collection: "Japanese Music & Media",
    categories: ["Soundtracks", "Japanese Music", "Audio CDs"],
    affiliateUrl:
      "https://www.play-asia.com/ar/kimi-to-100-kaime-no-koi-original-soundtrack/13/70ater?affiliate_id=6821075",
    imageUrl:
      "https://m.media-amazon.com/images/I/81sxESjBNXL._UXNaN_FMjpg_QL85_.jpg",
    imageAlt: "Kimi To 100 Kaime No Koi original soundtrack CD cover",
    featured: false,
    newArrival: true,
  },
  {
    slug: "go-go-b-t-train-shm-cd-buck-tick",
    productCode: "70erzh",
    retailer: "Play-Asia",
    title: "Go-Go B-T Train by BUCK-TICK — Japanese SHM-CD",
    shortTitle: "Go-Go B-T Train SHM-CD",
    description:
      "A Japanese high-fidelity SHM-CD edition of BUCK-TICK's Go-Go B-T Train single with four listed tracks.",
    longDescription: [
      "Go-Go B-T Train is a BUCK-TICK single issued in Japan in the SHM-CD format. The Play-Asia track listing includes the title song plus three additional versions.",
      "Open the affiliate listing to verify the edition, current availability, package details, shipping destination and latest retailer price before ordering.",
    ],
    collection: "Japanese Music & Media",
    categories: ["Japanese Music", "Audio CDs", "J-Rock"],
    affiliateUrl:
      "https://www.play-asia.com/ar/go-go-b-t-train-shm-cd/13/70erzh?affiliate_id=6821075",
    imageUrl:
      "https://lp.p.pia.jp/shared/materials/9d38a90f-ad7c-42d8-b185-c1202f6a0496/origin.jpg",
    imageAlt: "BUCK-TICK Go-Go B-T Train SHM-CD cover artwork",
    featured: false,
    newArrival: true,
  },
  {
    slug: "ma-ningen-limited-edition-vinyl-atarashii-gakko",
    productCode: "70hl09",
    retailer: "Play-Asia",
    title: "Ma Ningen by Atarashii Gakko! — Limited Edition Vinyl",
    shortTitle: "Ma Ningen Limited Edition Vinyl",
    description:
      "A limited-edition vinyl release of Atarashii Gakko!'s Ma Ningen with a five-track A-side and B-side program.",
    longDescription: [
      "Ma Ningen is presented here as a limited-edition Japanese vinyl release by Atarashii Gakko!, with five songs listed across its two sides.",
      "Check Play-Asia for the current vinyl color, pressing details, packaging, stock, international shipping and latest price before making a purchase.",
    ],
    collection: "Japanese Music & Media",
    categories: ["Japanese Music", "Vinyl Records", "Limited Editions"],
    affiliateUrl:
      "https://www.play-asia.com/ar/ma-ningen-limited-edition-vinyl/13/70hl09?affiliate_id=6821075",
    imageUrl:
      "https://flowrecordstore.com/cdn/shop/files/AtarashiiGakko2.jpg?v=1735962189",
    imageAlt: "Atarashii Gakko Ma Ningen limited edition vinyl cover",
    featured: true,
    newArrival: true,
  },
  {
    slug: "shikhondo-blue-pieta-steam-digital",
    productCode: "70jxj9",
    retailer: "Play-Asia",
    title: "Shikhondo: Blue Pieta — Region-Free Steam Digital Game",
    shortTitle: "Shikhondo: Blue Pieta Steam",
    description:
      "A region-free Windows Steam release of the side-scrolling fantasy bullet-hell shooter with anime-inspired artwork and multi-language support.",
    longDescription: [
      "Shikhondo: Blue Pieta is a side-scrolling fantasy bullet-hell shoot 'em up developed by DeerFarm and published by CFK, with anime-inspired art and high-risk scoring systems.",
      "The Play-Asia listing is for a region-free Steam digital product for Windows and lists English, Japanese, Korean and Chinese language support. Verify activation requirements, delivery details and the latest price before buying.",
    ],
    collection: "Games & Gaming Collectibles",
    categories: ["PC Games", "Digital Games", "Anime-Style Games"],
    affiliateUrl:
      "https://www.play-asia.com/ar/shikhondo-blue-pieta/13/70jxj9?affiliate_id=6821075",
    imageUrl:
      "https://s.pacn.ws/1/p/1fn/shikhondo-blue-pieta-929925.9.jpg?v=tev0kw&width=800",
    imageAlt: "Shikhondo Blue Pieta Steam digital game artwork",
    featured: true,
    newArrival: true,
  },
  {
    slug: "horipad-mini-nintendo-switch-blue",
    productCode: "70dj7p",
    retailer: "Play-Asia",
    title: "HORIPAD Mini for Nintendo Switch — Blue USB Controller",
    shortTitle: "HORIPAD Mini Switch Controller",
    description:
      "A compact blue USB controller officially licensed by Nintendo, with adjustable rapid-fire settings and listed Switch and PC compatibility.",
    longDescription: [
      "The blue HORIPAD Mini is a lightweight wired controller with an easy-to-hold compact shape and adjustable continuous-fire settings.",
      "Play-Asia lists USB connectivity and compatibility with Nintendo Switch and supported Windows PC use. Review the retailer page for the exact regional version, platform notes, stock and latest price.",
    ],
    collection: "Gaming Gear",
    categories: ["Nintendo Switch Accessories", "Gaming Controllers"],
    affiliateUrl:
      "https://www.play-asia.com/ar/horipad-mini-for-nintendo-switch-blue/13/70dj7p?affiliate_id=6821075",
    imageUrl:
      "https://s.pacn.ws/1/p/z2/hori-mini-controller-for-nintendo-switch-blue-631429.3.jpg?v=qd0vic&width=800",
    imageAlt: "Blue HORIPAD Mini USB controller for Nintendo Switch",
    featured: true,
    newArrival: true,
  },
  {
    slug: "super-mario-earth-tube-3d-jigsaw-puzzle",
    productCode: "70gkwf",
    retailer: "Play-Asia",
    title: "Super Mario & Earth Tube — 3D Jigsaw Puzzle Collectible",
    shortTitle: "Super Mario 3D Jigsaw Puzzle",
    description:
      "A reusable PVC 3D puzzle that builds Super Mario and a green pipe, designed for play, room display or use as a small coin bank.",
    longDescription: [
      "This Super Mario 3D puzzle combines 39 Mario pieces and 23 pipe pieces into a compact display approximately 90 mm tall for the Mario figure.",
      "The completed pipe can also function as a coin bank. Check Play-Asia for current availability, package details, shipping and the latest price.",
    ],
    collection: "Games & Gaming Collectibles",
    categories: ["Nintendo Collectibles", "3D Puzzles", "Super Mario"],
    affiliateUrl:
      "https://www.play-asia.com/ar/super-mario-earth-tube-3d-jigsaw-puzzle/13/70gkwf?affiliate_id=6821075",
    imageUrl:
      "https://s.pacn.ws/1/p/16z/super-mario-earth-tube-3d-jigsaw-puzzle-773583.1.jpg?v=s1kzx8&width=800",
    imageAlt: "Super Mario and green pipe 3D jigsaw puzzle collectible",
    featured: true,
    newArrival: true,
  },
  ...additionalPlayAsiaProducts,

];

export const storeCategories = [
  {
    name: "Anime Collectibles",
    description:
      "Figures, vinyl collectibles and franchise-focused display pieces.",
    children: [
      "Demon Slayer Collection",
      "Jujutsu Kaisen Collection",
      "One Piece Collection",
      "My Hero Academia Collection",
      "Anime Figures",
      "Premium Anime Figures",
      "Funko Pop Anime",
    ],
  },
  {
    name: "Gaming Gear",
    description:
      "Headsets, controllers and charging accessories for modern setups.",
    children: [
      "Gaming Headsets",
      "Nintendo Switch Accessories",
      "Gaming Controllers",
      "Charging Accessories",
    ],
  },
  {
    name: "Games & Gaming Collectibles",
    description:
      "Physical and digital games, Nintendo collectibles and display puzzles.",
    children: [
      "PlayStation Games",
      "PC Games",
      "Digital Games",
      "Nintendo Collectibles",
      "3D Puzzles",
    ],
  },
  {
    name: "Japanese Music & Media",
    description:
      "Japanese CDs, original soundtracks, vinyl records and limited editions.",
    children: [
      "Japanese Music",
      "Soundtracks",
      "Audio CDs",
      "Vinyl Records",
      "Limited Editions",
    ],
  },
  {
    name: "Gift Cards & Digital Credit",
    description:
      "Region-specific gift cards, game currency and direct top-ups with clear redemption warnings.",
    children: [
      "Apple Gift Cards",
      "Game Gift Cards",
      "Game Top-Ups",
      "Direct Top-Ups",
      "DMM Point Codes",
      "Region-Locked Codes",
    ],
  },
] as const;

export function storeRetailer(product: StoreProduct): StoreRetailer {
  return product.retailer ?? "Amazon";
}

export function storeProductSku(product: StoreProduct) {
  return product.asin ?? product.productCode ?? product.slug;
}

export function getStoreProduct(slug: string) {
  return storeProducts.find((product) => product.slug === slug);
}

export function relatedStoreProducts(product: StoreProduct, limit = 4) {
  return storeProducts
    .filter((candidate) => candidate.slug !== product.slug)
    .map((candidate) => ({
      product: candidate,
      score:
        candidate.categories.filter((category) =>
          product.categories.includes(category),
        ).length *
          3 +
        (candidate.collection === product.collection ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product: candidate }) => candidate);
}
