import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const title = "متجر GameCastle للأنمي والألعاب والإكسسوارات";
const description =
  "اكتشف أدلة الشراء وإكسسوارات الألعاب وبطاقات الهدايا ومنتجات الأنمي المختارة من GameCastle مع روابط آمنة إلى المتاجر الشريكة.";

export const Route = createFileRoute("/$locale/store")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "ar") throw notFound();
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/ar/store") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/ar/store") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { path: "/ar", name: "الرئيسية" },
            { name: "المتجر" },
          ]),
        ),
      },
    ],
  }),
  component: ArabicStoreLanding,
});

function ArabicStoreLanding() {
  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <section className="overflow-hidden rounded-3xl border border-primary/30 bg-card p-7 shadow-2xl sm:p-12">
        <p className="text-sm font-black tracking-wider text-primary">متجر GAMECASTLE</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-tight sm:text-6xl">
          منتجات الأنمي وإكسسوارات الألعاب المختارة للاعبين
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          تصفّح أدلة GameCastle العربية، وقارن تجهيزات اللعب، ثم انتقل بأمان إلى
          شركائنا لشراء المنتجات المتاحة في منطقتك. قد نحصل على عمولة من الروابط
          التابعة دون تكلفة إضافية عليك.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/gaming-hub" className="rounded-xl bg-primary px-6 py-3 font-black text-primary-foreground">
            أدلة الألعاب والإعدادات
          </Link>
          <Link to="/ar/anime" className="rounded-xl border border-border px-6 py-3 font-black text-foreground">
            استكشف دليل الأنمي العربي
          </Link>
          <Link to="/wallpapers" className="rounded-xl border border-border px-6 py-3 font-black text-foreground">
            خلفيات الأنمي المجانية
          </Link>
        </div>
      </section>
      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["إكسسوارات اللعب", "اختيارات عملية لتحسين التحكم والصوت والراحة أثناء الجلسات الطويلة."],
          ["بطاقات وهدايا رقمية", "إرشادات المنطقة والتوافق قبل شراء بطاقات الألعاب والرصيد الرقمي."],
          ["مقتنيات الأنمي", "أدلة تساعدك على مقارنة المجسمات والمقتنيات والمنتجات المرخصة."],
        ].map(([heading, text]) => (
          <article key={heading} className="rounded-2xl border border-border bg-card/70 p-6">
            <h2 className="text-xl font-black">{heading}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
