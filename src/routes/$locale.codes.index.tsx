import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/codes/')({
  component: CodesIndexPage,
})

function CodesIndexPage() {
  const { "-locale": locale } = Route.useParams()

  // قائمة بأشهر الألعاب والأنمي التي ستولد آلاف الصفحات الفرعية
  const popularHubs = [
    { name: 'Roblox Blox Fruits', slug: 'blox-fruits', desc: 'أكواد روبلوكس الفعالة وحاسبة الروبوكس' },
    { name: 'Valorant', slug: 'valorant', desc: 'أكواد الشحن وأسرار السكنات' },
    { name: 'PUBG Mobile', slug: 'pubg-mobile', desc: 'شدات مجانية وأكواد التفعيل' },
    { name: 'Free Fire', slug: 'free-fire', desc: 'أكواد السكنات والجوائز اليومية' },
    { name: 'One Piece Anime Hub', slug: 'one-piece', desc: 'دليل الشخصيات وأسرار العالم' },
    { name: 'Solo Leveling', slug: 'solo-leveling', desc: 'دليل اللاعبين والمهام الكبرى' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <header className="max-w-5xl mx-auto text-center py-10 border-b border-slate-800 mb-12">
        <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase">
          {locale.toUpperCase()} - Global Gaming & Codes Hub
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
          الموسوعة الشاملة لأكواد الألعاب والأنمي العالمية
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          اختر لعبتك أو عالمك المفضلة لتنتقل فوراً إلى الصفحة العملاقة المخصصة للأكواد، الحاسبات الفورية، والمكافآت الحصرية.
        </p>
      </header>

      {/* شبكة الروابط المركزية التي تفهرس آلاف الصفحات لجوجل */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularHubs.map((hub, idx) => (
          <Link 
            key={idx} 
            to="/$-locale/codes/$slug"
            params={{ "-locale": locale, slug: hub.slug }}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition transform hover:-translate-y-1 shadow-xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{hub.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">{hub.desc}</p>
            </div>
            <span className="text-indigo-400 font-bold text-xs flex items-center gap-1">
              تصفح الأكواد والصفحة العملاقة ←
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
