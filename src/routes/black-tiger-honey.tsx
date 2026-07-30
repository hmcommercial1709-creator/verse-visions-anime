import { createFileRoute } from "@tanstack/react-router";
import productImg from "@/assets/bth/box-12.jpg";
import lifestyleImg from "@/assets/bth/lifestyle.jpg";

const WA = "https://wa.me/447453408902";
const URL = "https://gamecastle.store/black-tiger-honey";

const features = [
  { icon: "📦", title: "عبوة فاخرة تحتوي على 12 ظرفاً عملياً", text: "علبة كرتونية فاخرة بتصميم أنيق تضم 12 ظرف عسل بحصص مضبوطة، سهلة الحمل في الجيب أو حقيبة السفر وتكفيك لشهر كامل." },
  { icon: "🌿", title: "مكونات طبيعية 100%", text: "عسل جبلي خام مع خلطة أعشاب وجذور طبيعية مختارة بعناية، بدون سكر أو مواد كيميائية أو إضافات صناعية." },
  { icon: "⚡", title: "طاقة فورية وتدوم طويلاً", text: "يمنحك دفعة نشاط سريعة خلال دقائق، مع طاقة وحيوية تستمر معك لساعات طويلة دون هبوط مفاجئ." },
  { icon: "🛡️", title: "آمن وخالٍ من أي آثار جانبية", text: "تركيبة طبيعية بالكامل مناسبة للاستخدام المنتظم، بدون آثار جانبية معروفة عند الالتزام بالجرعة." },
  { icon: "👑", title: "جودة عالية", text: "إنتاج بمعايير صارمة وتعبئة محكمة تحافظ على قوة الخلطة وطعمها الأصلي حتى تصل إليك." },
];

const faqs = [
  { q: "كيف يتم استخدام عسل النمر الأسود؟", a: "ظرف واحد كامل على معدة فارغة أو قبل النشاط بنصف ساعة تقريباً، بمعدل 2 إلى 3 أظرف في الأسبوع. يُفضل شرب كوب ماء بعده." },
  { q: "ماذا تحتوي العلبة؟", a: "كل علبة كرتونية فاخرة تحتوي على 12 ظرف عسل مغلّف بإحكام بحصة فردية جاهزة، ما يكفي لدورة استخدام شهر تقريباً." },
  { q: "هل المنتج طبيعي فعلاً؟", a: "نعم، الخلطة مكوّنة من عسل خام طبيعي وأعشاب وجذور تقليدية معروفة، بدون سكر مضاف أو مواد حافظة صناعية." },
  { q: "كم يستغرق التوصيل داخل سوريا؟", a: "عادة من 24 إلى 72 ساعة حسب المحافظة، ويتم التواصل معك عبر الواتساب لتأكيد الطلب والعنوان قبل الشحن." },
  { q: "هل التوصيل سري؟", a: "بالتأكيد. يصلك الطلب بتغليف محايد بدون أي كتابة أو صورة تدل على محتواه، ولا نشارك بياناتك مع أي جهة." },
  { q: "هل الدفع عند الاستلام متاح؟", a: "نعم، الدفع عند الاستلام متاح في معظم المحافظات السورية. تأكد من التفاصيل مع فريقنا عبر الواتساب." },
  { q: "كيف أتأكد أن المنتج أصلي؟", a: "اطلب فقط عبر رقم الواتساب الرسمي الظاهر في هذه الصفحة، وتحقق من ختم العلبة الكرتونية وسلامة الأظرف الـ12 وعدم فتح أي منها عند الاستلام." },
];

function OrderButton({ className = "", label = "اطلب الآن عبر الواتساب" }: { className?: string; label?: string }) {
  return (
    <a
      href={WA}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#f5d271] via-[#d4af37] to-[#b8860b] px-8 py-4 text-base font-extrabold text-[#0a0a0a] shadow-[0_10px_40px_-10px_rgba(212,175,55,0.7)] transition hover:brightness-110 ${className}`}
    >
      <span aria-hidden>💬</span>
      {label}
    </a>
  );
}

export const Route = createFileRoute("/black-tiger-honey")({
  head: () => ({
    meta: [
      { title: "عسل النمر الأسود · طاقة رجالية طبيعية 100% | Black Tiger Honey" },
      { name: "description", content: "عسل النمر الأسود: علبة فاخرة بـ12 ظرف عسل طبيعي 100% للطاقة والحيوية الرجالية. توصيل سري وسريع والدفع عند الاستلام. اطلب عبر الواتساب." },
      { property: "og:title", content: "عسل النمر الأسود · طاقة رجالية طبيعية 100%" },
      { property: "og:description", content: "علبة فاخرة بـ12 ظرفاً: طاقة فورية تدوم طويلاً بمكونات طبيعية بالكامل. توصيل سري وسريع." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  component: BlackTigerHoney,
});

function BlackTigerHoney() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#070707] text-[#f4efe4]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#d4af37]/20">
        <img
          src={lifestyleImg}
          alt="رجل يتمتع بالقوة والحيوية بإضاءة ذهبية فاخرة"
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/70 via-[#070707]/85 to-[#070707]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-block rounded-full border border-[#d4af37]/50 px-4 py-1 text-xs font-bold tracking-widest text-[#d4af37]">
              BLACK TIGER HONEY · عسل النمر الأسود
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-[#f7e9c3] lg:text-6xl">
              طاقة الرجل الحقيقي… <span className="bg-gradient-to-l from-[#f5d271] to-[#b8860b] bg-clip-text text-transparent">قوة طبيعية تدوم</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#cfc7b6]">
              علبة كرتونية فاخرة تحتوي على <strong className="text-[#f7e9c3]">12 ظرف عسل</strong> بحصص جاهزة ومضبوطة: خلطة من العسل
              الخام والأعشاب الطبيعية 100% تمنحك نشاطاً فورياً وحيوية تدوم طوال اليوم — بدون منشطات صناعية وبدون آثار جانبية.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-[#e7dcc2] sm:grid-cols-2">
              {["علبة فاخرة بـ 12 ظرفاً", "مكونات طبيعية 100%", "توصيل سري وسريع", "الدفع عند الاستلام"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-[#d4af37]">✔</span> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <OrderButton />
              <span className="text-sm text-[#a99f8c]">الكمية محدودة — يتم التأكيد خلال دقائق</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#d4af37]/10" />
            <img
              src={productImg}
              alt="علبة عسل النمر الأسود الكرتونية الفاخرة مع 12 ظرف عسل"
              width={1024}
              height={1024}
              className="relative w-full rounded-3xl border border-[#d4af37]/30 object-cover shadow-[0_30px_80px_-30px_rgba(212,175,55,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-black text-[#f7e9c3] lg:text-4xl">مميزات المنتج</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[#a99f8c]">
          لماذا يختار آلاف الرجال عسل النمر الأسود؟ لأنه يجمع بين قوة الطبيعة ومعايير الجودة العالية.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="rounded-2xl border border-[#d4af37]/25 bg-[#0f0f0f] p-6 transition hover:border-[#d4af37]/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10 text-2xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-[#f7e9c3]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#b8b0a0]">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* DELIVERY */}
      <section className="border-y border-[#d4af37]/20 bg-[#0b0b0b]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-[#f7e9c3] lg:text-4xl">التوصيل السري</h2>
            <p className="mt-4 leading-relaxed text-[#cfc7b6]">
              خصوصيتك أولويتنا. يصلك طلبك بتغليف محايد تماماً بدون أي إشارة إلى محتواه، ولا يظهر اسم المنتج على الطرد أو
              في التواصل مع شركة الشحن. بياناتك تبقى محفوظة ولا تُشارك مع أي جهة.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { t: "توصيل سريع", d: "يصلك خلال 24–72 ساعة إلى باب المنزل" },
                { t: "تغليف سري", d: "بدون أي كتابة أو صورة على الطرد" },
                { t: "دفع عند الاستلام", d: "تدفع فقط بعد استلام طلبك بيدك" },
              ].map((x) => (
                <div key={x.t} className="rounded-xl border border-[#d4af37]/25 bg-[#111] p-4">
                  <p className="font-bold text-[#d4af37]">{x.t}</p>
                  <p className="mt-1 text-sm text-[#b8b0a0]">{x.d}</p>
                </div>
              ))}
            </div>
            <OrderButton className="mt-8" label="اطلب الآن مع توصيل سري" />
          </div>
          <img
            src={lifestyleImg}
            alt="أجواء فاخرة تعبر عن القوة والثقة"
            loading="lazy"
            width={1536}
            height={1024}
            className="w-full rounded-3xl border border-[#d4af37]/25 object-cover"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-3xl font-black text-[#f7e9c3] lg:text-4xl">الأسئلة الشائعة</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-[#d4af37]/25 bg-[#0f0f0f] p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-[#f7e9c3]">
                {f.q}
                <span className="text-[#d4af37] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#b8b0a0]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#d4af37]/25 bg-[#0b0b0b]">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-black text-[#f7e9c3]">جاهز لتجربة طاقة النمر الأسود؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#a99f8c]">
            تواصل معنا مباشرة عبر الواتساب وسنساعدك في اختيار عدد العلب المناسب وتأكيد طلبك خلال دقائق.
          </p>
          <OrderButton className="mt-6" />
          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-[#8d8677]">
            <p>
              واتساب:{" "}
              <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline" dir="ltr">
                +44 7453 408902
              </a>
            </p>
            <p>خدمة العملاء: يومياً من 9 صباحاً حتى 11 مساءً</p>
            <p className="mt-4 text-xs">
              © {new Date().getFullYear()} Black Tiger Honey — عسل النمر الأسود. هذا المنتج مكمل غذائي طبيعي وليس دواءً،
              ويُنصح باستشارة الطبيب في حال وجود حالة صحية مزمنة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
