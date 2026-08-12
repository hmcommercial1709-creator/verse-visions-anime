export type StoreCollection =
  | "Anime Collectibles"
  | "Gaming Gear"
  | "Games & Gaming Collectibles"
  | "Japanese Music & Media";

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
