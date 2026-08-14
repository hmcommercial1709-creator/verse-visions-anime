import { publishedAnime } from "@/lib/content-registry";
import { backdrops, backdropFor, posterFor } from "@/lib/media";

export type RewardWallpaper = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  seriesEn: string;
  seriesAr: string;
  preview: string;
  previewSrcSet?: string;
  download: string;
  filename: string;
  width: number;
  height: number;
  format: "Desktop" | "Mobile";
};

const arabicSeries: Record<string, string> = {
  naruto: "ناروتو",
  "one-piece": "ون بيس",
  "attack-on-titan": "هجوم العمالقة",
  "demon-slayer": "قاتل الشياطين",
  "jujutsu-kaisen": "جوجوتسو كايسن",
  "death-note": "مذكرة الموت",
  "fullmetal-alchemist-brotherhood": "الخيميائي المعدني الكامل",
  "hunter-x-hunter": "هنتر × هنتر",
  "chainsaw-man": "رجل المنشار",
  "solo-leveling": "سولو ليفلينج",
  frieren: "فريرن",
  "spy-x-family": "سباي × فاميلي",
  "dragon-ball-z": "دراغون بول زد",
  bleach: "بليتش",
  "my-hero-academia": "أكاديمية بطلي",
  "jojos-bizarre-adventure": "مغامرات جوجو العجيبة",
  "one-punch-man": "ون بنش مان",
  "mob-psycho-100": "موب سايكو 100",
  haikyuu: "هايكيو!!",
  "blue-lock": "بلو لوك",
  "black-clover": "بلاك كلوفر",
  "dr-stone": "دكتور ستون",
  "yu-yu-hakusho": "يو يو هاكوشو",
};

const featured: RewardWallpaper[] = [
  {
    id: "pirate-ocean-sunset",
    titleEn: "Pirate Ocean Sunset Anime Wallpaper",
    titleAr: "خلفية أنمي مغامرة القراصنة وقت الغروب",
    descriptionEn:
      "A cinematic pirate voyage across a glowing ocean, created for One Piece fans and wide desktop screens.",
    descriptionAr:
      "رحلة قراصنة سينمائية فوق محيط مضيء، مصممة لمحبي ون بيس وشاشات سطح المكتب العريضة.",
    seriesEn: "One Piece inspired",
    seriesAr: "مستوحاة من ون بيس",
    preview: "/rewards/thumbs/pirate-ocean-sunset-hd.webp",
    download: "/rewards/wallpapers/pirate-ocean-sunset-hd.webp",
    filename: "gamecastle-pirate-ocean-sunset-wallpaper.webp",
    width: 1600,
    height: 900,
    format: "Desktop",
  },
  {
    id: "ninja-moon-village",
    titleEn: "Ninja Moon Village Anime Wallpaper",
    titleAr: "خلفية أنمي النينجا وقرية القمر",
    descriptionEn:
      "An energetic orange-clad ninja above a mountain village, created for Naruto fans and desktop displays.",
    descriptionAr: "نينجا بزي برتقالي يقفز فوق قرية جبلية، مصممة لمحبي ناروتو وشاشات سطح المكتب.",
    seriesEn: "Naruto inspired",
    seriesAr: "مستوحاة من ناروتو",
    preview: "/rewards/thumbs/ninja-moon-village-hd.webp",
    download: "/rewards/wallpapers/ninja-moon-village-hd.webp",
    filename: "gamecastle-ninja-moon-village-wallpaper.webp",
    width: 1600,
    height: 900,
    format: "Desktop",
  },
  {
    id: "demon-hunter-wisteria",
    titleEn: "Demon Hunter Wisteria Anime Wallpaper",
    titleAr: "خلفية أنمي صائد الشياطين وغابة الوستارية",
    descriptionEn:
      "A moonlit swordsman surrounded by water energy, snow and wisteria for Demon Slayer fans.",
    descriptionAr: "مبارز تحت ضوء القمر تحيط به طاقة الماء والثلج والوستارية لمحبي قاتل الشياطين.",
    seriesEn: "Demon Slayer inspired",
    seriesAr: "مستوحاة من قاتل الشياطين",
    preview: "/rewards/thumbs/demon-hunter-wisteria-hd.webp",
    download: "/rewards/wallpapers/demon-hunter-wisteria-hd.webp",
    filename: "gamecastle-demon-hunter-wisteria-wallpaper.webp",
    width: 1600,
    height: 900,
    format: "Desktop",
  },
  {
    id: "giant-wall-battle",
    titleEn: "Giant Wall Battle Anime Wallpaper",
    titleAr: "خلفية أنمي معركة العملاق والأسوار",
    descriptionEn:
      "A colossal stone guardian and aerial squad in a ruined fortress, made for Attack on Titan fans.",
    descriptionAr: "حارس حجري عملاق وفريق مقاتلين وسط قلعة مهدمة، مصممة لمحبي هجوم العمالقة.",
    seriesEn: "Attack on Titan inspired",
    seriesAr: "مستوحاة من هجوم العمالقة",
    preview: "/rewards/thumbs/giant-wall-battle-hd.webp",
    download: "/rewards/wallpapers/giant-wall-battle-hd.webp",
    filename: "gamecastle-giant-wall-battle-wallpaper.webp",
    width: 1600,
    height: 900,
    format: "Desktop",
  },
];

const mobilePosters: RewardWallpaper[] = publishedAnime().map((anime) => {
  const art = posterFor(anime.slug, [anime.title, ...anime.genres]);
  const titleAr = arabicSeries[anime.slug] ?? anime.title;
  return {
    id: `mobile-${anime.slug}`,
    titleEn: `${anime.title} Anime Mobile Wallpaper`,
    titleAr: `خلفية أنمي ${titleAr} للجوال`,
    descriptionEn: `An original vertical GameCastle illustration representing ${anime.title}, optimized for mobile wallpaper browsing.`,
    descriptionAr: `رسم عمودي أصلي من GameCastle مستوحى من عالم ${titleAr} ومناسب كخلفية أنمي للجوال.`,
    seriesEn: anime.title,
    seriesAr: titleAr,
    preview: art.src,
    previewSrcSet: art.srcSet,
    download: art.src,
    filename: `gamecastle-${anime.slug}-mobile-wallpaper.webp`,
    width: art.width,
    height: art.height,
    format: "Mobile" as const,
  };
});

const editorialArt = [
  ["why-frieren-won-2024", "Frieren Starlit Journey", "رحلة فريرن تحت النجوم"],
  ["one-piece-wano-recap", "Wano Pirate Adventure", "مغامرة قراصنة وانو"],
  ["beginner-guide-modern-shonen", "Modern Shonen Heroes", "أبطال الشونين الحديث"],
  ["review-jujutsu-kaisen-s2", "Cursed Energy City", "مدينة الطاقة الملعونة"],
  ["top-10-anime-2026", "Anime Worlds Collection", "مجموعة عوالم الأنمي"],
  ["chainsaw-man-reze-arc-preview", "Neon Devil Hunter", "صائد الشياطين النيون"],
  ["solo-leveling-s2-review", "Shadow Hunter Awakening", "صحوة صياد الظلال"],
  ["spy-x-family-cruise-arc", "Secret Family Voyage", "رحلة العائلة السرية"],
  ["best-action-thriller-anime-2026", "Anime Action Showcase", "مشهد أكشن أنمي"],
] as const;

const editorialWallpapers: RewardWallpaper[] = editorialArt.map(([slug, titleEn, titleAr]) => {
  const art = backdropFor(slug);
  return {
    id: `editorial-${slug}`,
    titleEn: `${titleEn} Anime Wallpaper`,
    titleAr: `خلفية أنمي ${titleAr}`,
    descriptionEn: `Original GameCastle key art from the ${titleEn} editorial collection, available as a free widescreen download.`,
    descriptionAr: `لوحة أصلية من مجموعة ${titleAr} التحريرية في GameCastle ومتاحة للتنزيل المجاني للشاشات العريضة.`,
    seriesEn: "GameCastle editorial art",
    seriesAr: "فن GameCastle التحريري",
    preview: art.src,
    previewSrcSet: art.srcSet,
    download: art.src,
    filename: `gamecastle-${slug}-wallpaper.webp`,
    width: art.width,
    height: art.height,
    format: "Desktop" as const,
  };
});

const featureArt = [
  ["limitless", "Limitless Night Sky", "سماء الليل اللامحدودة"],
  ["shibuya", "Shibuya Night Battle", "معركة شيبويا الليلية"],
  ["clans", "Sorcerer Clans", "عشائر السحرة"],
  ["trailer", "Anime Cinema Lights", "أضواء سينما الأنمي"],
] as const;

const backdropWallpapers: RewardWallpaper[] = featureArt.map(([key, titleEn, titleAr]) => {
  const art = backdrops[key];
  return {
    id: `feature-${key}`,
    titleEn: `${titleEn} Anime Wallpaper`,
    titleAr: `خلفية أنمي ${titleAr}`,
    descriptionEn: `A wide original GameCastle anime illustration from the ${titleEn} visual collection.`,
    descriptionAr: `لوحة أنمي عريضة وأصلية من مجموعة ${titleAr} البصرية في GameCastle.`,
    seriesEn: "GameCastle key visual",
    seriesAr: "لوحة GameCastle أصلية",
    preview: art.src,
    previewSrcSet: art.srcSet,
    download: art.src,
    filename: `gamecastle-${key}-anime-wallpaper.webp`,
    width: art.width,
    height: art.height,
    format: "Desktop" as const,
  };
});

/**
 * Forty distinct original artworks. Keeping each source unique avoids a gallery
 * padded with duplicated crops while native lazy-loading prevents the full set
 * from competing with the page's LCP image.
 */
export const rewardWallpapers: RewardWallpaper[] = [
  ...featured,
  ...mobilePosters,
  ...editorialWallpapers,
  ...backdropWallpapers,
];
