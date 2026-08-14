import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { arGuideBySlug, AR_GUIDES, type ArGuide } from "@/data/ar-guides";
import { SITE_URL } from "@/lib/i18n";
import { getAnimeBySlug } from "@/lib/content-registry";

function guideForArabicSlug(slug: string): ArGuide | undefined {
  const direct = arGuideBySlug(slug);
  if (direct) return direct;

  const watchOrder = arGuideBySlug(`${slug}-watch-order`);
  if (watchOrder) return { ...watchOrder, slug, enPath: `/anime/${slug}` };

  const anime = getAnimeBySlug(slug);
  if (!anime) return undefined;
  const episodeCount = anime.episodes === "?" ? "مستمر" : `${anime.episodes} حلقة`;
  return {
    slug,
    enPath: `/anime/${slug}`,
    titleTag: `${anime.title} بالعربية: القصة والمواسم وترتيب المشاهدة | GameCastle`,
    h1: `دليل ${anime.title} بالعربية: القصة وترتيب المشاهدة والشخصيات`,
    metaDescription: `دليل عربي شامل لأنمي ${anime.title}: القصة دون حرق، عدد الحلقات والمواسم، ترتيب المشاهدة، أبرز الأركات وإجابات أسئلة المتابعين.`,
    keywords: [`${anime.title} بالعربي`, `قصة ${anime.title}`, `ترتيب مشاهدة ${anime.title}`, `حلقات ${anime.title}`],
    intro: [
      `${anime.title} عمل أنمي بدأ عرضه عام ${anime.year} وحصل على تقييم ${anime.rating} من 10 ضمن دليل GameCastle. تجمع هذه الصفحة المعلومات الأساسية التي يحتاجها المشاهد العربي قبل بدء السلسلة، مع فصل واضح بين الوصف العام والتفاصيل التي قد تكشف الأحداث.`,
      `يعرض الدليل حالة العمل وعدد مواسمه وحلقاته وأبرز محاور عالمه، ثم يوصلك إلى الصفحة الإنجليزية الموسعة والمصادر الداخلية المرتبطة عند الحاجة إلى تحليل أعمق.`,
    ],
    table: {
      caption: `معلومات ${anime.title} الأساسية`,
      head: ["العنصر", "التفاصيل"],
      rows: [
        ["سنة البداية", String(anime.year)],
        ["الحالة", anime.status === "Completed" ? "مكتمل" : anime.status === "Ongoing" ? "مستمر" : "قادم"],
        ["الحلقات", episodeCount],
        ["المواسم", String(anime.seasons)],
        ["التقييم", `${anime.rating}/10`],
      ],
    },
    sections: [
      { h2: `ما قصة ${anime.title}؟`, body: [`تدور السلسلة حول ${anime.tagline} وتبني أحداثها عبر عالم متدرج وشخصيات تتغير مع كل مرحلة. ننصح بالبدء من الحلقة الأولى لأن العلاقات والقواعد الأساسية تُقدَّم تدريجياً.`] },
      { h2: "كيف تشاهد السلسلة بالترتيب؟", body: [anime.watchOrder.length ? `الترتيب المقترح: ${anime.watchOrder.join("، ")}.` : "شاهد المواسم بترتيب الإصدار الرسمي، ثم انتقل إلى الأفلام أو الحلقات الخاصة بعد الموسم المرتبط بها."] },
      { h2: "أهم ما يميز العالم والشخصيات", body: [`يركز العمل على موضوعات ${anime.themes.join("، ")}، ويستخدم نظاماً سردياً يجعل تطور الشخصيات جزءاً أساسياً من فهم الصراعات والعالم.`] },
    ],
    faqs: [
      { q: `هل يستحق ${anime.title} المشاهدة؟`, a: `نعم، خصوصاً لمحبي ${anime.genres.join(" و")}، وتقييمه الحالي في دليل GameCastle هو ${anime.rating}/10.` },
      { q: `كم عدد حلقات ${anime.title}؟`, a: `حالة الحلقات الحالية في الدليل: ${episodeCount} عبر ${anime.seasons} موسم/مواسم.` },
      { q: "هل يحتوي الدليل على حرق؟", a: "المقدمة والمعلومات الأساسية خالية من الحرق، بينما تُعرض تحليلات الأركات في أقسام واضحة." },
      { q: "أين أجد معلومات إضافية؟", a: "استخدم روابط GameCastle الداخلية للانتقال إلى الشخصيات والمقالات والتصنيفات المرتبطة بالسلسلة." },
    ],
    updated: "2026-08-14",
  };
}

export const Route = createFileRoute("/ar/anime/$slug")({
  loader: ({ params }) => {
    const guide = guideForArabicSlug(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ params, loaderData }) => {
    const g = loaderData?.guide;
    const url = `${SITE_URL}/ar/anime/${params.slug}`;
    if (!g) {
      return {
        meta: [{ title: "غير متوفر" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: g.titleTag },
        { name: "description", content: g.metaDescription },
        { property: "og:title", content: g.titleTag },
        { property: "og:description", content: g.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "ar" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hreflang: "ar", href: url },
        { rel: "alternate", hreflang: "en", href: `${SITE_URL}${g.enPath}` },
        {
          rel: "alternate",
          hreflang: "x-default",
          href: `${SITE_URL}${g.enPath}`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                inLanguage: "ar",
                headline: g.h1,
                description: g.metaDescription,
                dateModified: g.updated,
                mainEntityOfPage: url,
                author: { "@type": "Organization", name: "GameCastle Anime" },
                publisher: {
                  "@type": "Organization",
                  name: "GameCastle Anime",
                },
              },
              {
                "@type": "FAQPage",
                inLanguage: "ar",
                mainEntity: g.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: ArGuidePage,
});

function ArGuidePage() {
  const { guide } = Route.useLoaderData();
  const g = guide as ArGuide;
  const guideIndex = AR_GUIDES.findIndex((item) => item.slug === g.slug);
  const others = Array.from(
    { length: Math.min(6, AR_GUIDES.length - 1) },
    (_, offset) => AR_GUIDES[(guideIndex + offset + 1) % AR_GUIDES.length],
  );

  return (
    <div
      dir="rtl"
      lang="ar"
      className="mx-auto w-full max-w-3xl px-4 py-10 text-right"
    >
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/ar/anime" className="hover:text-primary">
          أدلة المشاهدة بالعربية
        </Link>
      </nav>

      <h1 className="text-3xl font-bold leading-snug md:text-4xl">{g.h1}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        آخر تحديث: {g.updated}
      </p>

      <ul className="mt-4 flex flex-wrap justify-end gap-2">
        {g.keywords.map((k) => (
          <li
            key={k}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
          >
            {k}
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-4 text-base leading-8">
        {g.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{g.table.caption}</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/40">
              <tr>
                {g.table.head.map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-border/60">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {g.sections.map((s) => (
        <section key={s.h2} className="mt-10">
          <h2 className="text-xl font-semibold">{s.h2}</h2>
          <div className="mt-3 space-y-4 text-base leading-8">
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">الأسئلة الشائعة</h2>
        <div className="mt-4 space-y-3">
          {g.faqs.map((f) => (
            <details key={f.q} className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 leading-8 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">أدلة أخرى قد تهمّك</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                to="/ar/anime/$slug"
                params={{ slug: o.slug }}
                className="text-primary hover:underline"
              >
                {o.h1}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          النسخة الإنجليزية:{" "}
          <a href={g.enPath} className="text-primary hover:underline">
            {g.enPath}
          </a>
        </p>
      </section>
    </div>
  );
}
