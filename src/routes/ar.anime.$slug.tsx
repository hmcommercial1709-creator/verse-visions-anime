import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { arGuideBySlug, AR_GUIDES, type ArGuide } from "@/data/ar-guides";
import { SITE_URL } from "@/lib/i18n";

export const Route = createFileRoute("/ar/anime/$slug")({
  loader: ({ params }) => {
    const guide = arGuideBySlug(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ params, loaderData }) => {
    const g = loaderData?.guide;
    const url = `${SITE_URL}/ar/anime/${params.slug}`;
    if (!g) {
      return { meta: [{ title: "غير متوفر" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: g.titleTag },
        { name: "description", content: g.metaDescription },
        { name: "keywords", content: g.keywords.join("، ") },
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
        { rel: "alternate", hreflang: "x-default", href: `${SITE_URL}${g.enPath}` },
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
                publisher: { "@type": "Organization", name: "GameCastle Anime" },
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
  const others = AR_GUIDES.filter((x) => x.slug !== g.slug).slice(0, 6);

  return (
    <div dir="rtl" lang="ar" className="mx-auto w-full max-w-3xl px-4 py-10 text-right">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/ar/anime" className="hover:text-primary">أدلة المشاهدة بالعربية</Link>
      </nav>

      <h1 className="text-3xl font-bold leading-snug md:text-4xl">{g.h1}</h1>
      <p className="mt-3 text-sm text-muted-foreground">آخر تحديث: {g.updated}</p>

      <ul className="mt-4 flex flex-wrap justify-end gap-2">
        {g.keywords.map((k) => (
          <li key={k} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{k}</li>
        ))}
      </ul>

      <div className="mt-6 space-y-4 text-base leading-8">
        {g.intro.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{g.table.caption}</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/40">
              <tr>
                {g.table.head.map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-border/60">
                  {row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}
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
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
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
              <Link to="/ar/anime/$slug" params={{ slug: o.slug }} className="text-primary hover:underline">
                {o.h1}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          النسخة الإنجليزية:{" "}
          <a href={g.enPath} className="text-primary hover:underline">{g.enPath}</a>
        </p>
      </section>
    </div>
  );
}
