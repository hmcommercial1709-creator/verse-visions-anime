import { createFileRoute, Link } from "@tanstack/react-router";
import { AR_GUIDES } from "@/data/ar-guides";
import { SITE_URL } from "@/lib/i18n";
import { allSitemapEntries } from "@/lib/sitemap";

const URL = `${SITE_URL}/ar/anime`;

export const Route = createFileRoute("/ar/anime/")({
  head: () => ({
    meta: [
      { title: "أدلة ترتيب مشاهدة الأنمي بالعربية — GameCastle Anime" },
      {
        name: "description",
        content:
          "أدلة عربية أصلية لترتيب مشاهدة أشهر الأنميات: ون بيس، جوجوتسو كايسن، ناروتو، بليتش، هجوم العمالقة وغيرها، مع جداول الأقواس والحلقات الحشو.",
      },
      { property: "og:title", content: "أدلة ترتيب مشاهدة الأنمي بالعربية" },
      { property: "og:description", content: "جداول الأقواس، الحلقات الحشو، وأماكن الأفلام لأشهر 15 سلسلة أنمي." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "ar" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          inLanguage: "ar",
          name: "أدلة ترتيب مشاهدة الأنمي بالعربية",
          url: URL,
        }),
      },
    ],
  }),
  component: ArHub,
});

function ArHub() {
  const localizedPages = allSitemapEntries()
    .map(({ path }) => path)
    .filter((path) => path !== "/" && !path.startsWith("/anime/dandadan") && !path.startsWith("/anime/sakamoto-days") && path !== "/rewards/anime-wallpapers");
  return (
    <div dir="rtl" lang="ar" className="mx-auto w-full max-w-4xl px-4 py-10 text-right">
      <h1 className="text-3xl font-bold md:text-4xl">أدلة ترتيب مشاهدة الأنمي بالعربية</h1>
      <p className="mt-4 leading-8 text-muted-foreground">
        خمسة عشر دليلاً عربياً مكتوباً خصيصاً وليس مترجماً حرفياً، يشرح ترتيب المشاهدة، الأقواس،
        الحلقات الحشو، أماكن الأفلام، ونقطة الانتقال إلى المانغا.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {AR_GUIDES.map((g) => (
          <li key={g.slug} className="rounded-lg border border-border p-4">
            <Link to="/ar/anime/$slug" params={{ slug: g.slug }} className="font-semibold text-primary hover:underline">
              {g.h1}
            </Link>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{g.metaDescription}</p>
          </li>
        ))}
      </ul>
      <section className="mt-12 border-t border-border pt-8" aria-labelledby="arabic-directory-title">
        <h2 id="arabic-directory-title" className="text-2xl font-bold">دليل صفحات GameCastle العربية</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          روابط مباشرة ومنظمة إلى الأدلة والتصنيفات والشخصيات والمقالات، لتسهيل التصفح ووصول محركات البحث إلى كل صفحة عربية.
        </p>
        <ul className="mt-6 columns-1 gap-6 space-y-2 sm:columns-2 lg:columns-3">
          {localizedPages.map((path) => (
            <li key={path} className="break-inside-avoid">
              <a href={`/ar${path}`} className="text-sm text-foreground/80 hover:text-primary hover:underline">
                {path.split("/").filter(Boolean).at(-1)?.replace(/[-_]+/g, " ") || "الرئيسية"}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
