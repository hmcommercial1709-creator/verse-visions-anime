export type ExploreCategory = "wallpapers" | "watch-order" | "rankings" | "releases" | "streaming";

export interface ExplorePage {
  slug: string;
  category: ExploreCategory;
  en: { title: string; description: string; intro: string; items: string[]; faq: [string, string][] };
  ar: { title: string; description: string; intro: string; items: string[]; faq: [string, string][] };
  official?: { label: string; url: string }[];
}

const faqEn = (subject: string): [string, string][] => [
  [`Is this ${subject} guide free?`, "Yes. GameCastle guides and downloads on this page are free to browse and use."],
  ["How often is this page reviewed?", "Editorial pages are reviewed when official information changes; uncertain dates are marked TBA."],
];
const faqAr = (subject: string): [string, string][] => [
  [`هل دليل ${subject} مجاني؟`, "نعم، تصفح الدليل والمواد المتاحة في هذه الصفحة مجاني."],
  ["متى تُراجع المعلومات؟", "نراجع الصفحة عند تغيّر المعلومات الرسمية، ونضع «يُعلن لاحقًا» عند غياب موعد مؤكد."],
];

export const EXPLORE_PAGES: ExplorePage[] = [
  ...[
    ["one-piece-hd-wallpapers", "One Piece", "ون بيس", "pirate-ocean-sunset-hd.webp"],
    ["naruto-hd-wallpapers", "Naruto", "ناروتو", "ninja-moon-village-hd.webp"],
    ["demon-slayer-hd-wallpapers", "Demon Slayer", "قاتل الشياطين", "demon-hunter-wisteria-hd.webp"],
    ["attack-on-titan-hd-wallpapers", "Attack on Titan", "هجوم العمالقة", "giant-wall-battle-hd.webp"],
  ].map(([slug, name, arName, image]) => ({
    slug, category: "wallpapers" as const,
    en: { title: `${name} HD Anime Wallpapers`, description: `Free original ${name}-inspired HD wallpapers for desktop and mobile.`, intro: `Refresh your screen with original fan-oriented artwork inspired by the atmosphere of ${name}. Every file is hosted by GameCastle and offered in a clean high-resolution format.`, items: ["Desktop-ready 16:9 composition", "Mobile-friendly crop guidance", "Instant local WebP download", `Featured file: ${image}`], faq: faqEn(`${name} wallpaper`) },
    ar: { title: `خلفيات ${arName} عالية الدقة`, description: `خلفيات أصلية مجانية مستوحاة من ${arName} للجوال والكمبيوتر.`, intro: `جدّد شاشة جهازك برسومات أصلية مستوحاة من أجواء ${arName}. جميع الملفات مستضافة لدى GameCastle ومتاحة بصيغة عالية الدقة وسريعة التحميل.`, items: ["مقاس عريض مناسب للكمبيوتر", "إرشادات قص مناسبة للجوال", "تنزيل WebP مباشر وآمن", `الملف المميز: ${image}`], faq: faqAr(`خلفيات ${arName}`) },
  })),
  ...[
    ["one-piece-complete-watch-order", "One Piece", "ون بيس", ["Start with the TV series from episode 1", "Use recap specials only when you want a refresher", "Place movies by release window; most are optional side stories", "Check the current series hub before skipping anime-original material"]],
    ["naruto-complete-watch-order", "Naruto", "ناروتو", ["Naruto", "Naruto Shippuden", "The Last: Naruto the Movie near the end of Shippuden", "Boruto as the next-generation follow-up"]],
    ["demon-slayer-complete-watch-order", "Demon Slayer", "قاتل الشياطين", ["Tanjiro Kamado, Unwavering Resolve Arc", "Mugen Train: choose the film or episodic cut", "Entertainment District Arc", "Swordsmith Village and Hashira Training arcs"]],
    ["attack-on-titan-complete-watch-order", "Attack on Titan", "هجوم العمالقة", ["Season 1", "Season 2", "Season 3 parts 1 and 2", "The Final Season and its concluding specials"]],
  ].map(([slug, name, arName, order]) => ({
    slug: slug as string, category: "watch-order" as const,
    en: { title: `${name} Complete Watch Order`, description: `A spoiler-aware ${name} watch order covering seasons, movies and optional material.`, intro: `This release-first route preserves major reveals and separates essential story chapters from optional recaps. Streaming catalogues vary by country, so verify availability with licensed services in your region.`, items: order as string[], faq: faqEn(`${name} watch order`) },
    ar: { title: `ترتيب مشاهدة ${arName} الكامل`, description: `ترتيب مشاهدة ${arName} للمواسم والأفلام والمواد الاختيارية دون حرق.`, intro: `يعتمد هذا المسار ترتيب الإصدار للحفاظ على المفاجآت، ويميّز بين فصول القصة الأساسية والملخصات الاختيارية. يختلف توفر الحلقات حسب البلد، لذا تحقق من المنصات المرخصة في منطقتك.`, items: (order as string[]).map((x, i) => `${i + 1}. ${x}`), faq: faqAr(`ترتيب ${arName}`) },
  })),
  ...[
    ["strongest-one-piece-characters-ranking", "Strongest One Piece Characters", "أقوى شخصيات ون بيس", ["Monkey D. Luffy — adaptability and advanced Haki", "Shanks — elite Haki portrayal", "Blackbeard — unusual Devil Fruit combination", "Monkey D. Garp — legendary physical power"]],
    ["best-naruto-characters-ranking", "Best Naruto Characters", "أفضل شخصيات ناروتو", ["Naruto Uzumaki — perseverance and empathy", "Kakashi Hatake — leadership and versatility", "Itachi Uchiha — tragic complexity", "Sakura Haruno — medical skill and growth"]],
    ["demon-slayer-hashira-ranking", "Demon Slayer Hashira Ranking", "ترتيب الهاشيرا في قاتل الشياطين", ["Gyomei Himejima — Stone Hashira", "Sanemi Shinazugawa — Wind Hashira", "Giyu Tomioka — Water Hashira", "Shinobu Kocho — Insect Hashira"]],
    ["best-attack-on-titan-characters-ranking", "Best Attack on Titan Characters", "أفضل شخصيات هجوم العمالقة", ["Levi Ackerman — precision under pressure", "Hange Zoë — curiosity and leadership", "Erwin Smith — strategic resolve", "Mikasa Ackerman — loyalty and combat mastery"]],
  ].map(([slug, title, arTitle, items]) => ({
    slug: slug as string, category: "rankings" as const,
    en: { title: title as string, description: `An editorial ${title} ranking with transparent criteria and spoiler-aware analysis.`, intro: "This is an editorial ranking, not an objective power scale. We weigh writing, influence, ability, consistency and on-screen evidence, while separating popularity from demonstrated feats.", items: items as string[], faq: faqEn(title as string) },
    ar: { title: arTitle as string, description: `ترتيب تحريري لشخصيات الأنمي وفق معايير واضحة وتحليل يراعي الحرق.`, intro: "هذا ترتيب تحريري وليس مقياس قوة مطلقًا. نوازن بين جودة الكتابة والتأثير والقدرات والاستمرارية والأدلة الظاهرة، مع فصل الشعبية عن الإنجازات المثبتة.", items: items as string[], faq: faqAr(arTitle as string) },
  })),
  ...[
    ["upcoming-anime-2026-calendar", "Upcoming Anime 2026 Release Calendar", "تقويم الأنمي القادم في 2026"],
    ["returning-anime-seasons-2026", "Returning Anime Seasons in 2026", "مواسم الأنمي العائدة في 2026"],
    ["upcoming-anime-movies-2026", "Upcoming Anime Movies in 2026", "أفلام الأنمي القادمة في 2026"],
    ["seasonal-anime-release-guide", "Seasonal Anime Release and Viewing Guide", "دليل إصدارات الأنمي الموسمية"],
  ].map(([slug, title, arTitle]) => ({
    slug, category: "releases" as const,
    en: { title, description: `${title} with official-source checks, TBA labels and viewing-planning advice.`, intro: "Release plans can move. This tracker lists only information supported by official publishers, studios or licensed distributors. Entries without a confirmed day remain TBA rather than guessing.", items: ["Confirmed announcements are separated from rumors", "Dates are shown only when officially published", "TBA means no reliable date is available", "Check official regional services before planning a watch party"], faq: faqEn(title) },
    ar: { title: arTitle, description: `${arTitle} مع توثيق المصادر الرسمية ووضع «يُعلن لاحقًا» عند غياب الموعد.`, intro: "قد تتغير خطط الإصدار. لا يدرج هذا المتابع إلا المعلومات المدعومة من الناشرين أو الاستوديوهات أو الموزعين المرخصين، ويترك الموعد «يُعلن لاحقًا» بدل التخمين.", items: ["فصل الإعلانات المؤكدة عن الشائعات", "عرض التاريخ عند نشره رسميًا فقط", "«يُعلن لاحقًا» تعني عدم توفر موعد موثوق", "تحقق من المنصة الرسمية في بلدك"], faq: faqAr(arTitle) },
    official: [{ label: "Crunchyroll News", url: "https://www.crunchyroll.com/news" }, { label: "Anime News Network", url: "https://www.animenewsnetwork.com/" }],
  })),
  ...[
    ["best-legal-anime-streaming-services", "Best Legal Anime Streaming Services", "أفضل منصات مشاهدة الأنمي القانونية", ["Compare regional catalogues before subscribing", "Check subtitle and dub language support", "Review offline-download and simultaneous-stream limits", "Use official trials and cancellation controls"]],
    ["crunchyroll-beginner-viewing-guide", "Crunchyroll Beginner and Viewing Guide", "دليل كرانشي رول للمبتدئين", ["Search the catalogue available in your country", "Create a watchlist before starting a long series", "Choose subtitle or dub preferences per title", "Use parental and playback controls where available"]],
    ["best-anime-games-pc-console-mobile", "Best Anime Games for PC, Console and Mobile", "أفضل ألعاب الأنمي للكمبيوتر والمنصات والجوال", ["Match the game to your platform and region", "Check age rating and online requirements", "Compare free-to-play costs before installing", "Prefer official storefronts and publisher links"]],
    ["safe-anime-game-credits-top-up-guide", "Safe Anime Game Credits and Top-Up Guide", "دليل شحن أرصدة ألعاب الأنمي بأمان", ["Buy only from the publisher or an authorized seller", "Confirm account region and currency before paying", "Never share passwords or one-time codes", "Keep receipts and enable account security"]],
  ].map(([slug, title, arTitle, items]) => ({
    slug: slug as string, category: "streaming" as const,
    en: { title: title as string, description: `${title} focused on legal access, regional availability, value and account safety.`, intro: "Availability, pricing and features differ by country and can change. Use this decision guide to compare official options, then confirm the current terms on the provider's own website before paying.", items: items as string[], faq: faqEn(title as string) },
    ar: { title: arTitle as string, description: `${arTitle} مع التركيز على الوصول القانوني والتوفر الإقليمي والقيمة وأمان الحساب.`, intro: "يختلف التوفر والسعر والميزات حسب البلد وقد تتغير. استخدم هذا الدليل للمقارنة، ثم أكد الشروط الحالية من موقع المزود الرسمي قبل الدفع.", items: items as string[], faq: faqAr(arTitle as string) },
  })),
];

export const explorePageBySlug = (slug: string) => EXPLORE_PAGES.find((page) => page.slug === slug);
