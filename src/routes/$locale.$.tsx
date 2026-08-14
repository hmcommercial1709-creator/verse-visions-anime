import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLocale, hreflangLinks, isLocaleCode, SITE_URL } from "@/lib/i18n";
import { LocalizedEditionNotice } from "@/components/localized-edition";

const ARABIC_SECTION_NAMES: Record<string, string> = {
  anime: "دليل الأنمي",
  article: "مقال وتحليل أنمي",
  character: "ملف شخصية أنمي",
  category: "قسم الأنمي",
  genre: "تصنيف الأنمي",
  studio: "استوديو الأنمي",
  gaming: "دليل الألعاب",
  "gaming-hub": "مركز الألعاب",
  store: "متجر GameCastle",
  explore: "دليل الاستكشاف",
  streaming: "دليل المشاهدة والبث",
};

function readableTopic(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const raw = parts.at(-1) || "GameCastle Anime";
  return decodeURIComponent(raw)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function localizedMetadata(code: string, path: string) {
  const locale = getLocale(code);
  const topic = readableTopic(path);
  const section = path.split("/").filter(Boolean)[0] || "anime";

  if (code === "ar") {
    const kind = ARABIC_SECTION_NAMES[section] ?? "دليل الأنمي والألعاب";
    return {
      title: `${topic} — ${kind} بالعربية | GameCastle Anime`,
      description: `اكتشف ${topic} في ${kind} من GameCastle Anime: معلومات موثوقة، ترتيب واضح، نصائح عملية وروابط مفيدة لعشاق الأنمي والألعاب بالعربية.`,
      ogLocale: "ar_AR",
    };
  }

  return {
    title: `${topic} — GameCastle Anime ${locale.english}`,
    description: `Explore ${topic} in the ${locale.english} edition of GameCastle Anime, with useful guides, clear navigation and carefully organized anime and gaming resources.`,
    ogLocale: locale.hrefLang,
  };
}

export const Route = createFileRoute("/$locale/$")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale) || params.locale === "en") throw notFound();
  },
  loader: ({ params }) => ({
    locale: params.locale,
    path: `/${params._splat ?? ""}`,
  }),
  head: ({ params }) => {
    const locale = getLocale(params.locale);
    const path = `/${params._splat ?? ""}`;
    const seo = localizedMetadata(locale.code, path);

    return {
      meta: [
        { name: "twitter:card", content: "summary_large_image" },
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/${locale.code}${path}` },
        { property: "og:locale", content: seo.ogLocale },
        {
          name: "robots",
          content: locale.code === "ar" ? "index, follow" : "noindex, follow",
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `${SITE_URL}/${locale.code}${path}`,
        },
        ...hreflangLinks(path),
      ],
    };
  },
  component: LocalizedPage,
});

function LocalizedPage() {
  const { locale, path } = Route.useLoaderData();
  return <LocalizedEditionNotice locale={locale} path={path} />;
}
