import type { LucideIcon } from "lucide-react";
import {
  Gamepad2,
  Globe2,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

export const GAMIVO_AFFILIATE_ID = "gkphy5wy";
export const sponsoredRel = "sponsored nofollow noopener noreferrer";

export function gamivoUrl(path: string) {
  const url = path.startsWith("http") ? path : `https://www.gamivo.com${path}`;
  return `${url}${url.includes("?") ? "&" : "?"}glv=${GAMIVO_AFFILIATE_ID}`;
}

export type HubLink = {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const hubLinks: HubLink[] = [
  {
    to: "/gaming-hub",
    label: "Gaming Hub",
    description: "Start with the complete digital gaming resource center.",
    icon: Gamepad2,
  },
  {
    to: "/gaming-hub/game-codes-deals",
    label: "Game Codes & Deals",
    description:
      "Browse live marketplace destinations without invented promo codes.",
    icon: WalletCards,
  },
  {
    to: "/gaming-hub/region-currency-guide",
    label: "Regions & Currency",
    description: "Check account regions and estimate conversion costs.",
    icon: Globe2,
  },
  {
    to: "/gaming-hub/safe-game-credits-guide",
    label: "Safe Credits Guide",
    description: "Use a practical checklist before paying for digital credit.",
    icon: ShieldCheck,
  },
  {
    to: "/gaming-hub/anime-games",
    label: "Anime Games",
    description:
      "Compare platforms and editions for major licensed anime games.",
    icon: Sparkles,
  },
  {
    to: "/gaming-hub/ultimate-gaming-secrets-guide",
    label: "Gaming Secrets & Settings",
    description: "Optimize controls, solve puzzles and prepare for difficult anime and adventure stages.",
    icon: Gamepad2,
  },
  {
    to: "/gaming-hub/genshin-impact-ultimate-guide",
    label: "Genshin Impact Mastery",
    description: "Long-form pro settings, Spiral Abyss strategy, puzzle logic and efficient farming.",
    icon: Sparkles,
  },
  {
    to: "/gaming-hub/honkai-star-rail-ultimate-guide",
    label: "Honkai: Star Rail Mastery",
    description: "Advanced builds, endgame modes, action order, pro settings and efficient farming.",
    icon: Sparkles,
  },
  {
    to: "/gaming-hub/ultimate-anime-gaming-hub-2026",
    label: "Ultimate Anime & Gaming Hub",
    description: "Streaming schedules, episode analysis, receivers, walkthroughs and hardware fixes.",
    icon: Gamepad2,
  },
  {
    to: "/gaming-hub/global-gaming-hub-2026",
    label: "Global Gaming Hub 2026",
    description: "Upcoming releases, comparisons, performance fixes, walkthroughs and gear.",
    icon: Gamepad2,
  },
];

export type PlatformGuide = {
  name: string;
  image: string;
  imageAlt: string;
  summary: string;
  regionRule: string;
  marketplaceUrl: string;
  officialSupport: string;
};

export const platformGuides: PlatformGuide[] = [
  {
    name: "Steam Wallet",
    image: "/gamivo/cards/steam.webp",
    imageAlt: "Steam Wallet digital gift card",
    summary:
      "PC wallet credit offered in multiple currencies and regional catalogs.",
    regionRule:
      "Check the Steam account store country and the currency or restrictions stated on the listing.",
    marketplaceUrl: gamivoUrl("/store/gift-cards/steam"),
    officialSupport:
      "https://help.steampowered.com/en/faqs/view/78E3-7431-1E88-AD59",
  },
  {
    name: "PlayStation Store",
    image: "/gamivo/cards/playstation.webp",
    imageAlt: "PlayStation Store digital gift card",
    summary:
      "Wallet credit for PlayStation Store accounts in supported countries.",
    regionRule:
      "The voucher region must match the country or region assigned to the PlayStation account.",
    marketplaceUrl: gamivoUrl("/store/gift-cards/psn"),
    officialSupport:
      "https://www.playstation.com/en-us/support/store/redeem-ps-store-voucher-code/",
  },
  {
    name: "Xbox Gift Cards",
    image: "/gamivo/cards/xbox.svg",
    imageAlt: "Xbox digital gift card",
    summary:
      "Microsoft and Xbox digital credit with country-specific listings.",
    regionRule:
      "Some Xbox codes are intended for a specific country or region; match the account settings and listing.",
    marketplaceUrl: gamivoUrl("/store/gift-cards/xbox-live"),
    officialSupport:
      "https://support.xbox.com/en-US/help/subscriptions-billing/redeem-codes-gifting/redeem-prepaid-codes",
  },
  {
    name: "Nintendo eShop",
    image: "/gamivo/cards/nintendo.webp",
    imageAlt: "Nintendo eShop digital gift card",
    summary:
      "Nintendo eShop credit tied to a particular country or regional store.",
    regionRule:
      "Nintendo states that an eShop card must match the country or region configured on the Nintendo Account.",
    marketplaceUrl: gamivoUrl("/store/gift-cards/nintendo"),
    officialSupport:
      "https://www.nintendo.com/en-gb/Support/Purchases-Subscriptions/Nintendo-eShop-Card-Is-Not-Working-1661029.html",
  },
  {
    name: "Roblox Gift Cards",
    image: "/gamivo/cards/roblox.webp",
    imageAlt: "Roblox digital gift card",
    summary:
      "Digital Roblox credit listings for different markets and denominations.",
    regionRule:
      "Read the currency, redemption destination and any regional conditions on the current listing.",
    marketplaceUrl: gamivoUrl("/store/gift-cards/roblox"),
    officialSupport:
      "https://en.help.roblox.com/hc/en-us/articles/360029697131-Roblox-Gift-Cards",
  },
  {
    name: "PUBG Mobile UC",
    image: "/gamivo/cards/pubg.webp",
    imageAlt: "PUBG Mobile UC top-up",
    summary:
      "Account-based PUBG Mobile credit options with country and player-ID requirements.",
    regionRule:
      "Confirm the game version, player ID, server and supported account country before payment.",
    marketplaceUrl: gamivoUrl("/direct-top-ups/pubg-mobile"),
    officialSupport: "https://support.pubg.com/",
  },
];

export type AnimeGame = {
  name: string;
  image: string;
  imageAlt: string;
  format: string;
  platforms: string;
  buyerQuestion: string;
  officialUrl: string;
  marketplaceUrl: string;
};

export const animeGames: AnimeGame[] = [
  {
    name: "DRAGON BALL: Sparking! ZERO",
    image: "/gaming-hub/dragon-ball-sparking-zero.webp",
    imageAlt: "DRAGON BALL Sparking ZERO official key art",
    format: "3D arena fighting game",
    platforms:
      "PC and current console editions; verify the live platform listing.",
    buyerQuestion:
      "Compare Standard and expanded editions carefully and confirm whether downloadable content is included or sold separately.",
    officialUrl:
      "https://www.bandainamcoent.com/games/dragon-ball-sparking-zero",
    marketplaceUrl: gamivoUrl("/search/dragon-ball-sparking-zero"),
  },
  {
    name: "NARUTO X BORUTO Ultimate Ninja STORM CONNECTIONS",
    image: "/gaming-hub/naruto-storm-connections.webp",
    imageAlt:
      "Naruto X Boruto Ultimate Ninja Storm Connections official artwork",
    format: "Anime fighting and story game",
    platforms: "PlayStation, Xbox, Nintendo Switch and PC editions exist.",
    buyerQuestion:
      "Match the code to the exact console generation or PC storefront and compare the base game with edition bundles.",
    officialUrl:
      "https://www.bandainamcoent.com/games/naruto-x-boruto-ultimate-ninja-storm-connections",
    marketplaceUrl: gamivoUrl(
      "/search/naruto-x-boruto-ultimate-ninja-storm-connections",
    ),
  },
  {
    name: "ONE PIECE ODYSSEY",
    image: "/gaming-hub/one-piece-odyssey.webp",
    imageAlt: "One Piece Odyssey Deluxe Edition official product artwork",
    format: "Single-player role-playing game",
    platforms:
      "Nintendo Switch, PlayStation, Xbox and PC versions are listed officially.",
    buyerQuestion:
      "Check the platform, edition name and included scenario or costume content instead of comparing title alone.",
    officialUrl: "https://www.bandainamcoent.com/games/one-piece-odyssey",
    marketplaceUrl: gamivoUrl("/search/one-piece-odyssey"),
  },
];
