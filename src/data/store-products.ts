export type StoreCategory = "anime-wallpapers" | "dark-aesthetic";

export type StoreProduct = {
  id: string;
  title: string;
  category: StoreCategory;
  count: number;
  /** Marketing-facing count label, e.g. "10,000+". */
  countLabel: string;
  /** Preview mockup artwork. */
  image: string;
  /** Display price string. */
  price: string;
  /** Numeric USD amount handed to Maypal checkout. */
  amount: number;
  originalPrice?: string;
  blurb: string;
  bullets: string[];
  /** Delivery link handed to the buyer (Google Drive folder, etc.). */
  deliveryUrl: string;
  gradient: string;
  accent: string;
};

export const STORE_CATEGORIES: {
  slug: StoreCategory;
  name: string;
  tagline: string;
  description: string;
}[] = [
  {
    slug: "anime-wallpapers",
    name: "High-Quality Anime Wallpapers",
    tagline: "Section 01",
    description:
      "Hand-picked, high-resolution phone wallpapers from the biggest franchises — cropped and colour-graded for modern phone screens, ready the second you pay.",
  },
  {
    slug: "dark-aesthetic",
    name: "Dark & Aesthetic Phone Wallpapers",
    tagline: "Section 02",
    description:
      "Deep-black, AMOLED-friendly packs built to save battery and make your icons pop. Minimal, moody, and endlessly re-usable across every device you own.",
  },
];

/** Live delivery links handed to buyers after checkout. */
const ANIME_DRIVE =
  "https://drive.google.com/file/d/1JDzZANisDIKKmeAbpWlpDBis1X1d2_JB/view?usp=sharing";
const DARK_DRIVE_1 =
  "https://drive.google.com/file/d/1C2oTBCwAn7U4-mTMJjcT_RSxqylkGk_4/view?usp=sharing";
const DARK_DRIVE_2 =
  "https://drive.google.com/file/d/1cXjziv7NEXxxQ1IsE1GLD5nkNqkv0trO/view?usp=sharing";

import shonenImg from "@/assets/store/shonen-legends.jpg";
import sakugaImg from "@/assets/store/sakuga-frames.jpg";
import portraitImg from "@/assets/store/portrait-collection.jpg";
import amoledImg from "@/assets/store/pure-black-amoled.jpg";
import neonImg from "@/assets/store/neon-noir.jpg";
import minimalImg from "@/assets/store/minimal-dark.jpg";

export const storeProducts: StoreProduct[] = [
  {
    id: "shonen-legends-pack",
    title: "Shonen Legends — 10,000+ Wallpaper Vault",
    category: "anime-wallpapers",
    count: 10000,
    countLabel: "10,000+",
    image: shonenImg,
    price: "$1.99",
    amount: 1.99,
    originalPrice: "$19",
    blurb:
      "One download, a lifetime of fresh lock screens. 10,000+ hero-moment wallpapers from One Piece, Naruto, Jujutsu Kaisen, Demon Slayer and more — every frame upscaled to 4K and framed so nothing important hides behind your clock.",
    bullets: ["10,000+ files · 4K vertical (2160×3840)", "Optimised for iPhone & Android crops", "Instant delivery — no waiting, no account"],
    deliveryUrl: ANIME_DRIVE,
    gradient: "linear-gradient(135deg, #ff5f6d, #1a0b1f 70%)",
    accent: "#ff5f6d",
  },
  {
    id: "sakuga-frames-pack",
    title: "Sakuga Frames — 5,000+ Cinematic Stills",
    category: "anime-wallpapers",
    count: 5000,
    countLabel: "5,000+",
    image: sakugaImg,
    price: "$1.99",
    amount: 1.99,
    originalPrice: "$14",
    blurb:
      "The frames animators are proud of. 5,000+ cinematic stills chosen for composition and colour, so your home screen looks like a movie poster instead of a screenshot.",
    bullets: ["5,000+ files · 4K vertical", "Colour-graded for OLED contrast", "Includes 12 matching lock-screen variants"],
    deliveryUrl: ANIME_DRIVE,
    gradient: "linear-gradient(135deg, #00ffcc, #06121a 70%)",
    accent: "#00ffcc",
  },
  {
    id: "waifu-portrait-pack",
    title: "Portrait Collection — 6,000+ Character Wallpapers",
    category: "anime-wallpapers",
    count: 6000,
    countLabel: "6,000+",
    image: portraitImg,
    price: "$1.99",
    amount: 1.99,
    blurb:
      "Fan-favourite characters in clean, poster-style portrait layouts. Each wallpaper leaves the top third breathable so widgets and notifications never cover a face.",
    bullets: ["6,000+ files · 4K vertical", "Widget-safe composition", "Sorted into folders by series"],
    deliveryUrl: ANIME_DRIVE,
    gradient: "linear-gradient(135deg, #a855f7, #140b22 70%)",
    accent: "#a855f7",
  },
  {
    id: "pure-black-amoled",
    title: "Pure Black AMOLED — 12,000+ Pack",
    category: "dark-aesthetic",
    count: 12000,
    countLabel: "12,000+",
    image: amoledImg,
    price: "$1.99",
    amount: 1.99,
    originalPrice: "$12",
    blurb:
      "True-black backgrounds that switch OLED pixels off entirely: measurably better battery life, zero glare at night, and a screen that makes every icon look designed.",
    bullets: ["12,000+ files · true #000000 base", "Battery-friendly on AMOLED panels", "Minimal accent variants included"],
    deliveryUrl: DARK_DRIVE_1,
    gradient: "linear-gradient(135deg, #2b2b2b, #000 70%)",
    accent: "#8f8f8f",
  },
  {
    id: "neon-noir-pack",
    title: "Neon Noir — 4,000+ Aesthetic Pack",
    category: "dark-aesthetic",
    count: 4000,
    countLabel: "4,000+",
    image: neonImg,
    price: "$1.99",
    amount: 1.99,
    blurb:
      "Rain-slick streets, cold neon, and empty midnight cities. Built for people who want their phone to feel like a late-night anime episode without a single character on screen.",
    bullets: ["4,000+ files · 4K vertical", "Neon-on-black palette", "Pairs with any dark icon pack"],
    deliveryUrl: DARK_DRIVE_2,
    gradient: "linear-gradient(135deg, #1b6cff, #05060f 70%)",
    accent: "#4f8cff",
  },
  {
    id: "minimal-dark-pack",
    title: "Minimal Dark — 2,000+ Gradient Pack",
    category: "dark-aesthetic",
    count: 2000,
    countLabel: "2,000+",
    image: minimalImg,
    price: "$1.99",
    amount: 1.99,
    blurb:
      "Soft dark gradients and quiet textures for a screen that stays calm. The pack people keep coming back to when a busy wallpaper starts feeling loud.",
    bullets: ["2,000+ files · 4K vertical", "Grain + smooth gradient variants", "Works on phone, tablet and watch"],
    deliveryUrl: DARK_DRIVE_1,
    gradient: "linear-gradient(135deg, #3a3a52, #08080c 70%)",
    accent: "#b0b0d0",
  },
];

export const productsByCategory = (c: StoreCategory) =>
  storeProducts.filter((p) => p.category === c);
