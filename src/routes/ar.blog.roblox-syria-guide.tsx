import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gamepad2, Store, Zap } from "lucide-react";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";

const PATH = "/ar/blog/roblox-syria-guide";
const URL = absoluteUrl(PATH);
const TITLE = "دليلك الشامل: كيف تشحن رصيد Roblox في سوريا بأسهل الطرق";
const DESCRIPTION =
  "تعلم خطوات شحن رصيد Roblox في سوريا بسهولة وأمان عبر GameCastle. طرق دفع مرنة، تسليم فوري، وأسعار تنافسية.";

const FAQ = [
  {
    q: "هل يمكنني شحن Roblox في سوريا بسهولة؟",
    a: "نعم. عبر GameCastle، تستطيع اختيار بطاقة Roblox المناسبة لك، إتمام الدفع بإحدى الطرق المتاحة، واستلام كود الشحن فوراً لإدخاله في حسابك.",
  },
  {
    q: "كم مدة التسليم بعد الدفع؟",
    a: "التسليم فوري في معظم الحالات. بمجرد تأكيد عملية الدفع، يصلك كود البطاقة أو رابط التحميل مباشرة على الشاشة أو عبر البريد الإلكتروني.",
  },
  {
    q: "هل أسعار GameCastle تنافسية؟",
    a: "نحن نعمل على توفير أفضل الأسعار الممكنة لبطاقات الألعاب والشحن الرقمي، مع وضوح تام في التسعير قبل إتمام أي عملية شراء.",
  },
];

export const Route = createFileRoute("/ar/blog/roblox-syria-guide")({
  head: () => ({
    meta: [
      { title: `${TITLE} — GameCastle` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "ar" },
      { property: "og:site_name", content: "GameCastle" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hreflang: "ar", href: URL },
      { rel: "alternate", hreflang: "x-default", href: absoluteUrl("/blog") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: TITLE,
              description: DESCRIPTION,
              inLanguage: "ar",
              url: URL,
              author: { "@type": "Organization", name: "GameCastle" },
              publisher: {
                "@type": "Organization",
                name: "GameCastle",
                url: absoluteUrl("/"),
              },
              datePublished: "2026-08-15",
              dateModified: "2026-08-15",
            },
            breadcrumbSchema([
              { path: "/", name: "الرئيسية" },
              { path: "/blog", name: "المدونة" },
              { name: "دليل شحن Roblox في سوريا" },
            ]),
            faqSchema(FAQ),
          ],
        }),
      },
    ],
  }),
  component: RobloxSyriaGuide,
});

function RobloxSyriaGuide() {
  return (
    <main dir="rtl" lang="ar" className="mx-auto w-full max-w-3xl px-4 py-12 lg:px-6">
      <nav aria-label="مسار التنقل" className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link to="/blog" className="hover:text-foreground">
          المدونة
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">دليل شحن Roblox في سوريا</span>
      </nav>

      <header className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-card to-background p-8 md:p-12">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Gamepad2 className="h-3.5 w-3.5" /> GameCastle Blog
          </div>
          <h1 className="mt-5 font-display text-3xl font-black leading-tight md:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            وجهتك الأولى لكل ما يخص عالم الألعاب الرقمية. تعلّم كيف تشحن Roblox بسهولة،
            حتى لو كانت طرق الدفع العالمية محدودة في منطقتك.
          </p>
        </div>
      </header>

      <article className="mt-10 space-y-10 text-right leading-8">
        <section className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8">
          <p className="text-lg">
            مرحباً بك في <strong>GameCastle</strong>! وجهتك الأولى لكل ما يخص عالم الألعاب
            الرقمية.
          </p>
          <p className="mt-4 text-muted-foreground">
            كثيراً ما نواجه صعوبة في شحن ألعابنا المفضلة، وخاصة في مناطق مثل سوريا، حيث تكون
            طرق الدفع العالمية محدودة أو معقدة. نحن في GameCastle هنا لنقول لك: لا داعي للقلق
            بعد الآن!
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-3 font-display text-2xl font-bold md:text-3xl">
            <Zap className="h-6 w-6 text-primary" />
            لماذا GameCastle هو خيارك الأفضل؟
          </h2>
          <ol className="mt-5 space-y-4">
            {[
              {
                title: "سهولة الدفع",
                body: "نوفر لك طرق دفع مرنة تناسب احتياجاتك، مع واجهة طلب واضحة لا تترك مجالاً للتباس.",
              },
              {
                title: "تسليم فوري",
                body: "بمجرد تأكيد الدفع، تصلك أكواد البطاقات مباشرة — لا انتظار، لا تعقيد.",
              },
              {
                title: "أفضل الأسعار",
                body: "أسعار تنافسية ومميزة على بطاقات Roblox والألعاب الرقمية الأخرى.",
              },
            ].map((item, i) => (
              <li key={i} className="rounded-2xl border border-border/60 bg-card/30 p-5">
                <span className="font-display text-lg font-bold text-primary">
                  {i + 1}. {item.title}
                </span>
                <p className="mt-2 text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold md:text-3xl">كيف تبدأ الشحن؟</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              "زُر قسم \"المتجر\" في موقعنا.",
              "اختر بطاقة Roblox أو أي لعبة أخرى تريدها.",
              "أضفها للسلة وتابع عملية الدفع.",
              "استمتع بكود الشحن واستعد للعب!",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-background p-8 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">GameCastle — العب بلا حدود</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            ابدأ الآن بشحن Roblox من متجر GameCastle بخطوات بسيطة وآمنة. توجه إلى المتجر
            لتستعرض البطاقات المتاحة.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground glow-primary transition hover:scale-105"
            >
              <Store className="h-4 w-4" /> تصفّح المتجر الآن
            </Link>
            <Link
              to="/game-top-up"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-6 py-3 font-semibold transition hover:border-primary"
            >
              <Zap className="h-4 w-4" /> شحن سريع للألعاب
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold md:text-3xl">أسئلة شائعة</h2>
          <div className="mt-5 space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-border/60 bg-card/40 p-5"
              >
                <summary className="cursor-pointer font-display text-lg font-semibold">
                  {item.q}
                </summary>
                <p className="mt-3 leading-7 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex justify-start">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold transition hover:border-primary"
          >
            <ArrowLeft className="h-4 w-4" /> العودة إلى المدونة
          </Link>
        </div>
      </article>
    </main>
  );
}
