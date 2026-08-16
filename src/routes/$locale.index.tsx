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
    const isArabic = locale.code === "ar";
    const title = isArabic
      ? "GameCastle Anime بالعربية — أدلة الأنمي وترتيب المشاهدة"
      : `GameCastle Anime — ${locale.english} edition`;
    const description = isArabic
      ? "اكتشف أدلة الأنمي العربية، ترتيب المشاهدة، تحليلات الشخصيات، أخبار المواسم وموارد الألعاب في GameCastle Anime."
      : `The ${locale.english} edition of GameCastle Anime: anime reviews, character deep-dives, watch orders, and long-form editorial.`;

    return {
      meta: [
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/${locale.code}` },
        { property: "og:locale", content: isArabic ? "ar_AR" : locale.hrefLang },
        {
          name: "robots",
          content: isArabic ? "index, follow" : "noindex, follow",
        },
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
  return (
    <div>
      <LocalizedEditionNotice locale={locale} path="/" />
      <div className="text-center py-8 space-y-4">
        <div>
          <Link to="/crypto" className="text-purple-400 font-bold underline">
            Guide to Buying with Crypto
          </Link>
        </div>
        <div>
          <Link to="/trending" className="text-purple-400 font-bold underline">
            Explore Trending Anime & Gaming Hub
          </Link>
        </div>
      </div>
    </div>
      </div>
          Guide to Buying with Crypto
        </Link>
      </div>
    </div>
  );
}
