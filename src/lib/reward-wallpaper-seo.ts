import { rewardWallpapers } from "@/lib/reward-wallpapers";
import { absoluteUrl } from "@/lib/seo";

const faq = {
  en: [
    {
      q: "Are these anime wallpapers free to download?",
      a: "Yes. The images in this reward gallery can be downloaded without payment or account registration.",
    },
    {
      q: "Which wallpaper size should I choose?",
      a: "Choose Desktop for a wide 16:9 display and Mobile for a vertical phone screen. Each card shows the exact pixel dimensions before download.",
    },
    {
      q: "Are these official anime promotional images?",
      a: "No. They are original GameCastle illustrations and unofficial fan-inspired artwork. Anime titles and trademarks remain the property of their respective owners.",
    },
    {
      q: "Why do some images appear only when I scroll?",
      a: "The gallery uses lazy loading so off-screen previews do not slow the page. The high-resolution file loads only after you choose to download it.",
    },
  ],
  ar: [
    {
      q: "هل خلفيات الأنمي مجانية؟",
      a: "نعم. يمكن تنزيل الصور الموجودة في معرض المكافأة من دون دفع أو إنشاء حساب.",
    },
    {
      q: "ما المقاس المناسب لجهازي؟",
      a: "اختر الكمبيوتر للشاشة العريضة بنسبة 16:9، واختر الجوال للشاشة العمودية. تعرض كل بطاقة الأبعاد الدقيقة قبل التنزيل.",
    },
    {
      q: "هل هذه صور ترويجية رسمية للأنمي؟",
      a: "لا. إنها رسومات GameCastle أصلية وأعمال غير رسمية مستوحاة من الأنمي. تبقى أسماء الأنمي والعلامات التجارية ملكًا لأصحابها.",
    },
    {
      q: "لماذا تظهر بعض الصور عند التمرير فقط؟",
      a: "يستخدم المعرض التحميل الكسول حتى لا تبطئ الصور البعيدة الصفحة، ولا يتم تحميل الملف عالي الدقة إلا بعد اختيارك تنزيله.",
    },
  ],
} as const;

const absoluteMediaUrl = (src: string) =>
  src.startsWith("https://") || src.startsWith("http://") ? src : absoluteUrl(src);

export function rewardWallpaperSchema(language: "en" | "ar") {
  const isArabic = language === "ar";
  const path = isArabic ? "/ar/rewards/anime-wallpapers" : "/rewards/anime-wallpapers";
  const pageName = isArabic
    ? "خلفيات أنمي مجانية عالية الدقة للجوال والكمبيوتر"
    : "Free HD anime wallpapers for desktop and mobile";
  const description = isArabic
    ? "معرض هدايا يضم 40 خلفية أنمي أصلية مجانية للجوال والكمبيوتر، مع تنزيل فوري وصور مستوحاة من أشهر عوالم الأنمي."
    : "A free reward gallery with 40 original anime-inspired wallpapers for desktop and mobile, instant image downloads and fast lazy-loaded previews.";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(path)}#collection`,
        url: absoluteUrl(path),
        name: pageName,
        description,
        inLanguage: language,
        isPartOf: { "@id": "https://gamecastle.store/#website" },
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: absoluteUrl("/rewards/wallpapers/pirate-ocean-sunset-hd.webp"),
          width: 1600,
          height: 900,
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: rewardWallpapers.length,
          itemListElement: rewardWallpapers.map((wallpaper, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "ImageObject",
              name: isArabic ? wallpaper.titleAr : wallpaper.titleEn,
              description: isArabic ? wallpaper.descriptionAr : wallpaper.descriptionEn,
              contentUrl: absoluteMediaUrl(wallpaper.download),
              thumbnailUrl: absoluteMediaUrl(wallpaper.preview),
              width: wallpaper.width,
              height: wallpaper.height,
              encodingFormat: "image/webp",
              inLanguage: language,
              creditText: "GameCastle Anime original illustration",
              copyrightNotice:
                "Unofficial fan-inspired artwork. Referenced titles and trademarks belong to their respective owners.",
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isArabic ? "الرئيسية" : "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isArabic ? "خلفيات أنمي مجانية" : "Free anime wallpapers",
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "FAQPage",
        inLanguage: language,
        mainEntity: faq[language].map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
