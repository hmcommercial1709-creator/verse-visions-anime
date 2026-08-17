import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$-locale/super-hub')({
  component: SuperHubPage,
})

function SuperHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white p-6 md:p-12">
      {/* قسم العنوان الرئيسي الجذاب */}
      <div className="max-w-5xl mx-auto text-center py-12">
        <span className="bg-emerald-500/10 text-emerald-400 text-xs md:text-sm font-bold uppercase tracking-widest py-2 px-4 rounded-full border border-emerald-500/20">
          🔥 Ultimate Global Anime & Gaming Hub 2026
        </span>
        <h1 className="text-4xl md:text-7xl font-black mt-6 mb-6 tracking-tight uppercase bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
          Unlock The Ultimate Anime & Gaming Experience
        </h1>
        <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto mb-10">
          Discover exclusive 8K wallpapers, digital art assets, gaming codes, and premium collectibles curated for true fans worldwide.
        </p>

        {/* زر التحويل السوبر */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="https://gumroad.com/discover?a=772584035"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg py-4 px-10 rounded-2xl transition duration-300 transform hover:scale-105 shadow-2xl shadow-emerald-600/30 text-center"
          >
            🚀 Explore Global Digital Vault Now
          </a>
        </div>
      </div>

      {/* شبكة الميزات الاستراتيجية لجذب الانتباه */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-md hover:border-emerald-500/50 transition duration-300">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold mb-3 text-emerald-400">8K Ultra Wallpapers</h3>
          <p className="text-slate-400">
            Immersive, high-resolution masterpieces featuring legendary characters designed for all devices.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-md hover:border-emerald-500/50 transition duration-300">
          <div className="text-4xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold mb-3 text-emerald-400">Gaming Gear & Codes</h3>
          <p className="text-slate-400">
            Instant access to digital products, gift cards, and premium gaming resources worldwide.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-md hover:border-emerald-500/50 transition duration-300">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="text-2xl font-bold mb-3 text-emerald-400">Exclusive Assets</h3>
          <p className="text-slate-400">
            Hand-picked digital treasures updated daily to satisfy every otaku and gamer's absolute passion.
          </p>
        </div>
      </div>

      {/* قسم دعوة إضافي لتحقيق أقصى تفاعل */}
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-10 my-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready To Upgrade Your Digital World?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
          Join thousands of global enthusiasts accessing premium digital creations right now.
        </p>
        <a
          href="https://gumroad.com/discover?a=772584035"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-black font-extrabold py-3 px-8 rounded-xl hover:bg-slate-200 transition duration-300 shadow-xl"
        >
          ✨ Access Now
        </a>
      </div>
    </div>
  )
}
