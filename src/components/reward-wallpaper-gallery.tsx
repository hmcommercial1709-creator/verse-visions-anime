import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Download,
  Gift,
  Image as ImageIcon,
  Monitor,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { rewardWallpapers, type RewardWallpaper } from "@/lib/reward-wallpapers";

type Language = "en" | "ar";
type Filter = "All" | RewardWallpaper["format"];

const copy = {
  en: {
    reward: "GameCastle visitor reward",
    h1: "Free HD anime wallpapers for desktop and mobile",
    intro:
      "Your reward gallery is open. Choose from 40 distinct original GameCastle illustrations inspired by the anime worlds fans love, then download any wallpaper instantly with no sign-up.",
    original: "40 original artworks",
    instant: "Instant free download",
    mobile: "Desktop + mobile",
    galleryEyebrow: "Choose your wallpaper",
    galleryTitle: "The complete anime wallpaper gift collection",
    galleryIntro:
      "Use the format filters to find wide desktop art or vertical mobile posters. Preview images load only as you scroll, while the high-resolution file is requested only when you download it.",
    all: "All 40",
    desktop: "Desktop",
    mobileFilter: "Mobile",
    download: "Free download",
    pixels: "pixels",
    howTitle: "How to download your free anime wallpaper",
    steps: [
      [
        "Pick a design",
        "Filter the gallery by desktop or mobile and open the artwork that fits your screen.",
      ],
      [
        "Download the original",
        "Select Free download to request the high-resolution WebP file only when you need it.",
      ],
      [
        "Set your wallpaper",
        "Choose the downloaded image from your device display or wallpaper settings.",
      ],
    ],
    whyTitle: "A fast wallpaper gallery built for anime fans",
    why: [
      [
        "Original gallery art",
        "Every listed image comes from GameCastle's own visual library or an original fan-inspired reward artwork.",
      ],
      [
        "Fast on mobile",
        "Native lazy loading, compact WebP previews and fixed image dimensions prevent unnecessary data use and layout shifts.",
      ],
      [
        "Clear downloads",
        "Every visible download button points to a real image file. There are no empty buttons or internal checkout steps.",
      ],
    ],
    faqTitle: "Anime wallpaper download FAQ",
    faqs: [
      [
        "Are these anime wallpapers free to download?",
        "Yes. The images in this reward gallery can be downloaded without payment or account registration.",
      ],
      [
        "Which wallpaper size should I choose?",
        "Choose Desktop for a wide 16:9 display and Mobile for a vertical phone screen. Each card shows the exact pixel dimensions before download.",
      ],
      [
        "Are these official anime promotional images?",
        "No. They are original GameCastle illustrations and unofficial fan-inspired artwork. Anime titles and trademarks remain the property of their respective owners.",
      ],
      [
        "Why do some images appear only when I scroll?",
        "The gallery uses lazy loading so off-screen previews do not slow the page. The high-resolution file loads only after you choose to download it.",
      ],
    ],
    explore: "Continue exploring GameCastle",
    exploreCopy:
      "Find watch orders, character guides and more original anime artwork after choosing your reward.",
    browse: "Browse anime",
    art: "Artwork gallery",
    switchLabel: "العربية",
    switchPath: "/ar/rewards/anime-wallpapers",
    breadcrumbHome: "Home",
    breadcrumbReward: "Free anime wallpapers",
    unofficial:
      "Unofficial fan-inspired artwork. GameCastle is not affiliated with the owners of the referenced anime franchises.",
  },
  ar: {
    reward: "مكافأة زوار GameCastle",
    h1: "خلفيات أنمي مجانية عالية الدقة للجوال والكمبيوتر",
    intro:
      "معرض هديتك مفتوح الآن. اختر من 40 لوحة أصلية مميزة من GameCastle مستوحاة من عوالم الأنمي المحبوبة، ثم حمّل أي خلفية فورًا من دون تسجيل.",
    original: "40 لوحة أصلية",
    instant: "تحميل مجاني وفوري",
    mobile: "للكمبيوتر والجوال",
    galleryEyebrow: "اختر خلفيتك",
    galleryTitle: "مجموعة هدية خلفيات الأنمي الكاملة",
    galleryIntro:
      "استخدم الفلاتر للوصول إلى خلفيات الكمبيوتر العريضة أو خلفيات الأنمي العمودية للجوال. لا تُحمّل المعاينات إلا عند التمرير، ولا يُطلب الملف عالي الدقة إلا عند الضغط على التنزيل.",
    all: "الكل 40",
    desktop: "كمبيوتر",
    mobileFilter: "جوال",
    download: "تحميل مجاني",
    pixels: "بكسل",
    howTitle: "طريقة تحميل خلفيات الأنمي المجانية",
    steps: [
      ["اختر التصميم", "صفِّ المعرض حسب الكمبيوتر أو الجوال، ثم اختر العمل المناسب لشاشتك."],
      ["حمّل النسخة الأصلية", "اضغط تحميل مجاني لطلب ملف WebP عالي الدقة عند الحاجة فقط."],
      ["عيّن الخلفية", "اختر الصورة التي حملتها من إعدادات الشاشة أو الخلفية في جهازك."],
    ],
    whyTitle: "معرض خلفيات سريع صُمم لمحبي الأنمي",
    why: [
      [
        "لوحات أصلية",
        "كل صورة معروضة مأخوذة من مكتبة GameCastle البصرية أو من أعمال المكافآت الأصلية المستوحاة من الأنمي.",
      ],
      [
        "سريع على الجوال",
        "التحميل الكسول ومعاينات WebP المضغوطة والأبعاد الثابتة تمنع استهلاك البيانات غير الضروري وتحرك التخطيط.",
      ],
      [
        "روابط تنزيل حقيقية",
        "كل زر تحميل ظاهر يقود إلى ملف صورة فعلي؛ لا توجد أزرار فارغة أو خطوات دفع داخلية.",
      ],
    ],
    faqTitle: "أسئلة شائعة عن تحميل خلفيات الأنمي",
    faqs: [
      [
        "هل خلفيات الأنمي مجانية؟",
        "نعم. يمكن تنزيل الصور الموجودة في معرض المكافأة من دون دفع أو إنشاء حساب.",
      ],
      [
        "ما المقاس المناسب لجهازي؟",
        "اختر الكمبيوتر للشاشة العريضة بنسبة 16:9، واختر الجوال للشاشة العمودية. تعرض كل بطاقة الأبعاد الدقيقة قبل التنزيل.",
      ],
      [
        "هل هذه صور ترويجية رسمية للأنمي؟",
        "لا. إنها رسومات GameCastle أصلية وأعمال غير رسمية مستوحاة من الأنمي. تبقى أسماء الأنمي والعلامات التجارية ملكًا لأصحابها.",
      ],
      [
        "لماذا تظهر بعض الصور عند التمرير فقط؟",
        "يستخدم المعرض التحميل الكسول حتى لا تبطئ الصور البعيدة الصفحة، ولا يتم تحميل الملف عالي الدقة إلا بعد اختيارك تنزيله.",
      ],
    ],
    explore: "واصل استكشاف GameCastle",
    exploreCopy:
      "انتقل إلى أدلة ترتيب المشاهدة وصفحات الشخصيات والمزيد من أعمال الأنمي الأصلية بعد اختيار هديتك.",
    browse: "تصفح الأنمي",
    art: "معرض الرسومات",
    switchLabel: "English",
    switchPath: "/rewards/anime-wallpapers",
    breadcrumbHome: "الرئيسية",
    breadcrumbReward: "خلفيات أنمي مجانية",
    unofficial:
      "أعمال غير رسمية مستوحاة من الأنمي. GameCastle غير تابع لمالكي سلاسل الأنمي المشار إليها.",
  },
} as const;

export function RewardWallpaperGallery({ language }: { language: Language }) {
  const t = copy[language];
  const isArabic = language === "ar";
  const [filter, setFilter] = useState<Filter>("All");
  const filtered = useMemo(
    () => rewardWallpapers.filter((item) => filter === "All" || item.format === filter),
    [filter],
  );

  return (
    <div
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
      className={isArabic ? "text-right" : "text-left"}
    >
      <header className="relative isolate overflow-hidden border-b border-border/60">
        <img
          src="/rewards/wallpapers/pirate-ocean-sunset-hd.webp"
          alt=""
          width={1600}
          height={900}
          fetchPriority="high"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/45 rtl:bg-gradient-to-l" />
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
          <nav
            aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}
            className="mb-7 text-sm text-foreground/75"
          >
            <Link to="/" className="hover:text-primary">
              {t.breadcrumbHome}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span>{t.breadcrumbReward}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <Gift className="h-4 w-4" aria-hidden="true" /> {t.reward}
            </p>
            <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {t.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
              {t.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                [Sparkles, t.original],
                [Download, t.instant],
                [Monitor, t.mobile],
              ].map(([Icon, label]) => {
                const FeatureIcon = Icon as typeof Sparkles;
                return (
                  <span
                    key={String(label)}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm font-semibold backdrop-blur"
                  >
                    <FeatureIcon className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
                    {label as string}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <section aria-labelledby="reward-gallery-title">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {t.galleryEyebrow}
          </p>
          <h2
            id="reward-gallery-title"
            className="mt-2 font-display text-3xl font-bold sm:text-4xl"
          >
            {t.galleryTitle}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{t.galleryIntro}</p>

          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label={isArabic ? "تصفية الخلفيات" : "Filter wallpapers"}
          >
            {(
              [
                ["All", t.all, ImageIcon],
                ["Desktop", t.desktop, Monitor],
                ["Mobile", t.mobileFilter, Smartphone],
              ] as const
            ).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  filter === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/40 text-foreground/80 hover:border-primary/60 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <div className="mt-8 columns-1 gap-5 sm:columns-2 xl:columns-3">
            {filtered.map((wallpaper, index) => {
              const title = isArabic ? wallpaper.titleAr : wallpaper.titleEn;
              const description = isArabic ? wallpaper.descriptionAr : wallpaper.descriptionEn;
              const series = isArabic ? wallpaper.seriesAr : wallpaper.seriesEn;
              return (
                <article
                  key={wallpaper.id}
                  data-reward-wallpaper={wallpaper.id}
                  style={{
                    contentVisibility: "auto",
                    containIntrinsicSize: wallpaper.format === "Desktop" ? "420px" : "720px",
                  }}
                  className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border/70 bg-card/45 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
                >
                  <figure>
                    <div
                      className={wallpaper.format === "Desktop" ? "aspect-video" : "aspect-[2/3]"}
                    >
                      <img
                        src={wallpaper.preview}
                        srcSet={wallpaper.previewSrcSet}
                        sizes="(min-width: 1280px) 390px, (min-width: 640px) 48vw, 100vw"
                        width={wallpaper.width}
                        height={wallpaper.height}
                        alt={title}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="border-t border-border/60 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-primary">
                          {series}
                        </span>
                        <span className="text-muted-foreground">
                          {wallpaper.width} × {wallpaper.height} {t.pixels}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-bold leading-snug">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                      <a
                        href={wallpaper.download}
                        download={wallpaper.filename}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
                        aria-label={`${t.download}: ${title}`}
                      >
                        <Download className="h-4 w-4" aria-hidden="true" /> {t.download}
                      </a>
                    </figcaption>
                  </figure>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="download-steps-title">
          <h2 id="download-steps-title" className="font-display text-3xl font-bold">
            {t.howTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {t.steps.map(([title, description], index) => (
              <article key={title} className="rounded-2xl border border-border/70 bg-card/35 p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-16 rounded-3xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/40 to-accent/10 p-6 sm:p-8"
          aria-labelledby="fast-gallery-title"
        >
          <h2 id="fast-gallery-title" className="font-display text-3xl font-bold">
            {t.whyTitle}
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {t.why.map(([title, description], index) => {
              const Icon = [Sparkles, ShieldCheck, CheckCircle2][index];
              return (
                <article
                  key={title}
                  className="rounded-2xl border border-border/60 bg-background/50 p-5"
                >
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </article>
              );
            })}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{t.unofficial}</p>
        </section>

        <section className="mt-16" aria-labelledby="reward-faq-title">
          <h2 id="reward-faq-title" className="font-display text-3xl font-bold">
            {t.faqTitle}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {t.faqs.map(([question, answer]) => (
              <details
                key={question}
                className="rounded-2xl border border-border/70 bg-card/35 p-5"
              >
                <summary className="cursor-pointer font-semibold">{question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center" aria-labelledby="continue-title">
          <h2 id="continue-title" className="font-display text-3xl font-bold">
            {t.explore}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t.exploreCopy}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to={isArabic ? "/ar/anime" : "/browse"}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:brightness-110"
            >
              {t.browse}
            </Link>
            <Link
              to="/wallpapers"
              className="rounded-xl border border-border bg-card/50 px-5 py-3 font-semibold hover:border-primary/60 hover:text-primary"
            >
              {t.art}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
