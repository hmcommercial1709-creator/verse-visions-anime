import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

const AdSlot = () => (
  <div className="ad-container my-8 w-full flex justify-center overflow-hidden min-h-[100px] bg-slate-900/50 rounded-lg">
    <div className="ads-placeholder w-full h-full" />
  </div>
);

export const Route = createFileRoute('/$locale/anime/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'anime')
      .eq('slug', params.slug)
      .maybeSingle()
    return { anime: data, error: error?.message || null }
  },
  component: AnimeMegaPage,
})

function AnimeMegaPage() {
  const { anime } = Route.useLoaderData()
  if (!anime) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Authority Node...</div>

  const meta = (anime.metadata as any) || {}
  const genres = Array.isArray(meta.genres) ? meta.genres : []
  const studios = Array.isArray(meta.studios) ? meta.studios : []
  const year = meta.season_year || '2026'
  const episodes = meta.episodes || 'Ongoing'

  // --- هيكلة الكيانات المتقدمة جداً (Multi-Entity Knowledge Graph Schema) ---
  // هذا ما يجعل أكبر المواقع تتصدر، نحن نخبر جوجل بكل تفصيلة بطريقة برمجية معيارية
  const advancedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gamecastle.store/" },
          { "@type": "ListItem", "position": 2, "name": "Anime Hub", "item": "https://gamecastle.store/anime" },
          { "@type": "ListItem", "position": 3, "name": anime.name, "item": `https://gamecastle.store/anime/${anime.slug}` }
        ]
      },
      {
        "@type": "TVSeries",
        "name": anime.name,
        "description": anime.description,
        "image": anime.image_url,
        "genre": genres,
        "numberOfEpisodes": episodes,
        "productionCompany": studios.map((s: any) => ({
          "@type": "Organization",
          "name": typeof s === 'string' ? s : s.name
        })),
        "releasedEvent": {
          "@type": "PublicationEvent",
          "startDate": year
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* ضخ البيانات المعيارية الخارقة */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(advancedStructuredData) }} />

      <div className="mx-auto max-w-7xl px-6 pt-12">
        {/* مسار التنقل البرمجي */}
        <nav className="text-sm text-slate-400 mb-8 flex gap-2 items-center font-medium">
          <a href="/" className="hover:text-indigo-400 transition">الرئيسية</a> / 
          <a href="/anime" className="hover:text-indigo-400 transition">دليل الأنمي</a> / 
          <span className="text-indigo-300 font-bold">{anime.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* المحتوى السيادة */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {anime.name} <span className="block text-2xl font-normal text-indigo-400 mt-2">الملف الشامل، الدليل التقني والمحتوى الرقمي</span>
            </h1>
            
            {/* فقرة السيمانكس العميق للذكاء الاصطناعي */}
            <article className="prose prose-invert prose-lg max-w-none leading-relaxed text-slate-300 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
              <p className="text-lg">
                يُصنف العمل الفني <strong>{anime.name}</strong> كواحد من أهم إطلاقات موسم 
                <a href={`/year/${year}`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 mx-1 font-semibold">{year}</a>. 
                وقد حظي بمتابعة جبارة بفضل الإنتاج التقني المتقن من قِبل 
                {studios.map((s: any, i: number) => {
                  const sName = typeof s === 'string' ? s : s.name;
                  return (
                    <a key={i} href={`/studio/${sName.toLowerCase().replace(/\s+/g, '-')}`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 mx-1 font-semibold">
                      {sName}
                    </a>
                  );
                })} 
                ، ليتربع على عرش فئات 
                {genres.map((g: string, i: number) => (
                  <a key={i} href={`/category/${g.toLowerCase().replace(/\s+/g, '-')}`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 mx-1 font-semibold">
                    {g}
                  </a>
                ))}. يمتد هذا الإصدار عبر {episodes} حلقة مشوقة.
              </p>
              <p className="mt-4 text-slate-300">{anime.description}</p>
            </article>

            <AdSlot />

            {/* مركز العمليات التفاعلي للزائر والذكاء الاصطناعي */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span>⚡</span> بوابتك الحصرية لـ {anime.name}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-200">
                <a href="/store" className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-indigo-500 transition group">
                  <div className="font-bold text-indigo-400 group-hover:text-indigo-300 mb-1">🎮 متجر الألعاب والأكواد</div>
                  <p className="text-xs text-slate-400">احصل على بطاقات الهدايا والمحتوى المرتبط مباشرة.</p>
                </a>
                <a href="/downloads" className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-indigo-500 transition group">
                  <div className="font-bold text-indigo-400 group-hover:text-indigo-300 mb-1">📥 الخلفيات والوسائط</div>
                  <p className="text-xs text-slate-400">خلفيات بجودة 8K وأصول رقمية أصلية.</p>
                </a>
              </div>
            </div>
          </div>

          {/* الشريط الجانبي الفائق */}
          <aside className="space-y-6">
            <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
              <h4 className="font-bold text-white mb-4 border-b border-slate-800 pb-3 text-lg">الشبكة الدلالية للأنمي</h4>
              <div className="flex flex-wrap gap-2">
                {genres.map((g: string) => (
                   <a key={g} href={`/category/${g.toLowerCase().replace(/\s+/g, '-')}`} className="px-3.5 py-1.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition shadow-sm">
                     {g}
                   </a>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md text-center">
              <p className="text-xs text-slate-400 mb-4">هل تبحث عن المزيد من التحديثات؟ استكشف أرشيف النظام بالكامل.</p>
              <a href="/anime" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition shadow-lg text-sm">
                الوصول لكل الأرشيف 🚀
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
