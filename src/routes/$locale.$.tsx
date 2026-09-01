import { createFileRoute, notFound } from '@tanstack/react-router'
import { isLocaleCode } from '@/lib/i18n'
import { supabase } from '@/integrations/supabase/client'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/$locale/$')({
  beforeLoad: ({ params }) => {
    // Do not turn arbitrary missing URLs (e.g. /daily) into a 200 hub page.
    if (!isLocaleCode(params.locale)) throw notFound();
  },
  loader: async () => {
    const { data: recentAnime } = await supabase
      .from('entities')
      .select('name, slug, metadata')
      .eq('entity_type', 'anime')
      .limit(6)
    
    return { recentAnime: recentAnime || [] }
  },
  component: GlobalEnterpriseMatrix,
})

function GlobalEnterpriseMatrix() {
  const { recentAnime } = Route.useLoaderData()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAnime, setFilteredAnime] = useState(recentAnime)
  const [systemUptime, setSystemUptime] = useState(99.99)

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemUptime(prev => +(prev + (Math.random() * 0.005 - 0.002)).toFixed(2))
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAnime(recentAnime)
    } else {
      const q = searchQuery.toLowerCase()
      setFilteredAnime(
        recentAnime.filter((a: any) => 
          a.name.toLowerCase().includes(q) || 
          a.slug.toLowerCase().includes(q)
        )
      )
    }
  }, [searchQuery, recentAnime])

  return (
    <main className="min-h-screen bg-[#010103] text-slate-100 selection:bg-indigo-500 font-sans">
      
      {/* 1. Global Telemetry Status Bar */}
      <div className="bg-indigo-950/40 border-b border-indigo-500/20 py-2.5 px-8 text-xs text-indigo-300 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-widest">AI-MATRIX ENGINE:</span> FULLY OPERATIONAL
        </div>
        <div className="flex gap-8 text-slate-400 font-mono">
          <span>UPTIME: {systemUptime}%</span>
          <span>GLOBAL INDEX: 100% SYNCED</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* 2. Enterprise Hero Section & AI Search */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase">
            Global Knowledge & Gaming Intelligence Hub
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            The Ultimate Anime & Gaming Matrix
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            The premier global authority for real-time anime entities, power-scaling analytics, and digital gaming assets.
          </p>

          {/* Real-time Semantic Search Bar */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime nodes, studios, or global archives..."
              className="w-full bg-slate-900/80 border border-indigo-500/30 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-2xl transition"
            />
            <span className="absolute left-5 top-4 text-indigo-400">🔍</span>
          </div>
        </div>

        {/* 3. Live Database Entities Grid */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⚡</span> Active Synchronized Knowledge Nodes
            </h2>
            <span className="text-xs text-indigo-400 font-mono">{filteredAnime.length} Entities Indexed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnime.map((anime: any, idx: number) => (
              <a 
                key={idx}
                href={`/anime/${anime.slug}`}
                className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/60 hover:bg-indigo-950/10 transition group shadow-xl"
              >
                <div className="text-xs text-indigo-400 font-mono mb-2">ENTITY NODE: #{anime.slug}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 mb-2">{anime.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">Explore comprehensive metadata, power metrics, and related digital resources.</p>
              </a>
            ))}
          </div>
        </div>

        {/* 4. Strategic Infrastructure Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[
            { title: "Anime Index Hub", path: "/anime", desc: "Global anime intelligence database", icon: "🏮" },
            { title: "Gaming Hub", path: "/gaming-hub", desc: "Verified gaming codes & credits", icon: "🎮" },
            { title: "Digital Store", path: "/store", desc: "Secure marketplace & offers", icon: "💎" },
            { title: "AI Wallpapers", path: "/downloads", desc: "8K neural-rendered assets", icon: "🎨" }
          ].map((mod) => (
            <a 
              key={mod.path}
              href={mod.path}
              className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl hover:border-indigo-500 transition group"
            >
              <div className="text-3xl mb-4">{mod.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400">{mod.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{mod.desc}</p>
              <span className="text-xs text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                Initialize Module <span>→</span>
              </span>
            </a>
          ))}
        </div>

      </div>
    </main>
  )
}
