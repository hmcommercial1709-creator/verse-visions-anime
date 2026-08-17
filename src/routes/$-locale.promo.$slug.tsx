import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/$-locale/promo/$slug')({
  component: PromoHubPage,
})

function PromoHubPage() {
  const { slug } = Route.useParams()
  const promoTitle = slug.replace(/-/g, ' ').toUpperCase()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("GAME-CASTLE-2026-VIP")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-emerald-400 mb-4">أكواد خصم {promoTitle}</h1>
        <p className="text-slate-300 mb-8">انسخ الكود الفعال واحصل على مكافآتك الفورية الآن بطريقة آمنة وسريعة.</p>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="text-2xl font-mono tracking-widest bg-slate-800 p-4 rounded-xl text-yellow-400 mb-4">
            GAME-CASTLE-2026-VIP
          </div>
          <button 
            onClick={handleCopy}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition"
          >
            {copied ? "تم النسخ بنجاح! ✅" : "اضغط لنسخ الكود 📋"}
          </button>
        </div>
      </div>
    </div>
  )
}
