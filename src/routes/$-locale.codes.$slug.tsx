import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/$-locale/codes/$slug')({
  component: MassiveCodesPage,
})

function MassiveCodesPage() {
  const { locale, slug } = Route.useParams()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // معالجة اسم اللعبة أو العنصر القادم من الرابط الديناميكي
  const targetName = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'GAME & ANIME'

  // قائمة وهمية لأكواد ضخمة يتم توليدها ديناميكياً لكل صفحة فرعية
  const codesList = [
    { code: `${targetName}_VIP_2026`, reward: 'مكافأة نادرة وموارد مضاعفة' },
    { code: `${targetName}_FREE_GEMS`, reward: 'شدات / جوهر مجاني فوري' },
    { code: `ANIME_${targetName}_PRO`, reward: 'فتح الشخصيات الأسطورية' },
    { code: `MEGA_BONUS_2026`, reward: 'خصم خاص وتفعيل فوري' },
  ]

  const handleCopy = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="massive-page-wrapper min-h-screen bg-slate-950 text-white p-6 md:p-12">
      {/* رأس الصفحة الضخمة */}
      <header className="max-w-4xl mx-auto text-center border-b border-slate-800 pb-8 mb-10">
        <span className="bg-pink-600/20 text-pink-400 border border-pink-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase">
          {locale.toUpperCase()} - Official Codes Vault
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
          أكواد وتفعيلات {targetName} الحصرية (متجددة يومياً)
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          الموسوعة الأكبر المخصصة لجلب أحدث الأكواد والمكافآت المعتمدة لـ {targetName}. انسخ الكود وفعلّه فوراً لتكون في قمة اللاعبين.
        </p>
      </header>

      {/* شبكة الأكواد التفاعلية */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          🎁 قائمة الأكواد الفعالة لـ {targetName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {codesList.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-md">
              <div>
                <span className="font-mono text-lg font-bold text-green-400 tracking-wider block">{item.code}</span>
                <span className="text-xs text-slate-500">{item.reward}</span>
              </div>
              <button
                onClick={() => handleCopy(item.code, idx)}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                {copiedIndex === idx ? 'تم النسخ!' : 'نسخ الكود'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* قسم التحويل والشحن المربط بالمتجر */}
      <section className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/30 p-8 rounded-3xl text-center shadow-2xl">
        <h3 className="text-2xl font-bold mb-3">هل تحتاج إلى رصيد أو شحن سريع لـ {targetName}؟</h3>
        <p className="text-slate-300 text-sm mb-6 max-w-xl mx-auto">
          استمتع بالأسعار الأفضل والشحن الفوري الآمن فور تفعيل الـ API الخاص بنا قريباً.
        </p>
        <button className="bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition transform hover:scale-105">
          الانتقال لمتجر البطاقات والروبوكس
        </button>
      </section>
    </div>
  )
}
