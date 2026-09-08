import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/$locale/codes/$slug")({
  beforeLoad: ({ params }) => {
    // قصر الصفحات على اللغة الإنجليزية حصراً لاستهداف السوق العالمي
    if (params.locale !== "en") throw notFound();
  },
  loader: async ({ params }) => {
    // الاستعلام المباشر فائق السرعة من جدول السيو البرمجي الجديد
    const { data, error } = await supabase
      .from("programmatic_pages")
      .select("*")
      .eq("locale", params.locale)
      .eq("category", "codes")
      .eq("slug", params.slug)
      .single();

    if (error || !data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const page = loaderData;
    if (!page) return {};

    return {
      meta: [
        { title: page.meta_title },
        { name: "description", content: page.meta_description },
        { name: "robots", content: page.robots || "index, follow, max-snippet:-1, max-image-preview:large" },
      ],
      scripts: page.schema_markup && Object.keys(page.schema_markup).length > 0 ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(page.schema_markup),
        },
      ] : [],
    };
  },
  component: function ProgrammaticCodePage() {
    const page = Route.useLoaderData();

    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-slate-100">
        {/* عنوان الصفحة المتسابق عالمياً */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">
          {page.title}
        </h1>

        {/* المحتوى الديناميكي الغني الوارد من قاعدة البيانات */}
        <div 
          className="prose prose-invert max-w-none mb-12 text-lg leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: page.content?.html || page.content?.body || '' }} 
        />

        {/* قسم الأسئلة الشائعة (FAQs Schema Integration) */}
        {page.faqs && Array.isArray(page.faqs) && page.faqs.length > 0 && (
          <section className="my-12 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {page.faqs.map((faq: any, idx: number) => (
                <div key={idx} className="border-b border-slate-800 pb-4 last:border-0">
                  <h3 className="font-semibold text-lg text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-300 leading-normal">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* شبكة الروابط الداخلية الأوتوماتيكية لتدفق الزحف (Link Juice) */}
        {page.related_slugs && page.related_slugs.length > 0 && (
          <section className="mt-16 border-t border-slate-800 pt-8">
            <h3 className="text-xl font-bold mb-4 text-slate-200">Related Codes & Guides</h3>
            <div className="flex flex-wrap gap-2.5">
              {page.related_slugs.map((relSlug: string, idx: number) => (
                <a
                  key={idx}
                  href={`/${page.locale}/codes/${relSlug}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-cyan-600 hover:text-white transition-all rounded-xl text-sm font-medium text-cyan-300 border border-slate-700"
                >
                  {relSlug.replace(/-/g, ' ')}
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    );
  },
});
