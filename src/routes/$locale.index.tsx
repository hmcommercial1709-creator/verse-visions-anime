import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLocale, hreflangLinks, isLocaleCode, SITE_URL } from "@/lib/i18n";
import { LocalizedEditionNotice } from "@/components/localized-edition";

export const Route = createFileRoute("/$locale/")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale) || params.locale === "en") throw notFound();
  },
  loader: ({ params }) => ({ locale: params.locale }),
  head: ({ params }) => {
    const locale = getLocale(params.locale);
    return {
      meta: [
      { name: "twitter:card", content: "summary_large_image" },
        { title: `AnimeVerse — ${locale.english} edition` },
        {
          name: "description",
          content: `The ${locale.english} edition of AnimeVerse: anime reviews, character deep-dives, watch orders, and long-form editorial.`,
        },
        { property: "og:title", content: `AnimeVerse — ${locale.english} edition` },
        {
          property: "og:description",
          content: `The ${locale.english} edition of AnimeVerse: anime reviews, watch orders, and long-form editorial.`,
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/${locale.code}` },
        { property: "og:locale", content: locale.hrefLang },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale.code}` },
        ...hreflangLinks("/"),
      ],
    };
  },
  component: LocalizedHome,
});

function LocalizedHome() {
  const { locale } = Route.useLoaderData();
  return <LocalizedEditionNotice locale={locale} path="/" />;
}
