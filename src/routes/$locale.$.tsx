import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLocale, hreflangLinks, isLocaleCode, SITE_URL } from "@/lib/i18n";
import { LocalizedEditionNotice } from "@/components/localized-edition";

export const Route = createFileRoute("/$locale/$")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale) || params.locale === "en") throw notFound();
  },
  loader: ({ params }) => ({ locale: params.locale, path: `/${params._splat ?? ""}` }),
  head: ({ params }) => {
    const locale = getLocale(params.locale);
    const path = `/${params._splat ?? ""}`;
    return {
      meta: [
      { name: "twitter:card", content: "summary_large_image" },
        { title: `GameCastle Anime ${locale.english} — ${path}` },
        {
          name: "description",
          content: `${locale.english} edition of this GameCastle Anime page. Translation in progress — the English original stays available.`,
        },
        { property: "og:title", content: `GameCastle Anime ${locale.english} edition` },
        { property: "og:description", content: `${locale.english} edition of this GameCastle Anime page.` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/${locale.code}${path}` },
        { property: "og:locale", content: locale.hrefLang },
        { name: "robots", content: "noindex, follow" },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale.code}${path}` },
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
