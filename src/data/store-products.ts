export type StoreCollection = "Anime Collectibles" | "Gaming Gear";

export type StoreProduct = {
  slug: string;
  asin: string;
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
};

const amazonImage = (asin: string) =>
  `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;

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
] as const;

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
