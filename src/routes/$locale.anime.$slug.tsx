import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/$')({
  loader: async () => {
    // Fetch trending nodes to maintain high SEO authority and indexing speed
    const { data: trendingNodes } = await supabase
      .from('entities')
      .select('name, slug, entity_type')
      .limit(12)
    return { trendingNodes: trendingNodes || [] }
  },
  component: InfiniteGrowthEngine,
})

function InfiniteGrowthEngine() {
  const { trendingNodes } = Route.useLoaderData()

  return (
    <main className="min-h-screen bg-[#020205] text-white selection:bg-cyan-500 font-sans overflow-x-hidden">
      
      {/* 1. Global Authority Header */}
      <header className="relative py-24 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),_transparent_70%)]" />
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          GLOBAL ANIME <br /> INTELLIGENCE HUB
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          The ultimate decentralized archive. Real-time data streams, power-scaling analytics, and verified gaming assets optimized for instant indexing.
        </p>

        {/* 2. Global AI-Search */}
        <div className="max-w-2xl mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search millions of entities, power levels, or game codes..." 
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-cyan-500 outline-none transition shadow-2xl"
          />
          <div className="absolute right-6 top-6 text-cyan-400 font-bold">AI SEARCH</div>
        </div>
      </header>

      {/* 3. Infinite Growth Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingNodes.map((node: any) => (
            <a 
              key={node.slug}
              href={`/${node.entity_type}/${node.slug}`}
              className="group p-6 bg-slate-900/30 border border-slate-800 rounded-3xl hover:bg-cyan-950/20 hover:border-cyan-500/50 transition-all duration-300"
            >
              <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase">{node.entity_type}</span>
              <h3 className="text-lg font-bold mt-2 group-hover:text-cyan-300 transition">{node.name}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* 4. SEO Authority Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Massive Entity Coverage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Anime Entities", val: "150k+" },
            { label: "Gaming Assets", val: "45k+" },
            { label: "Power Scales", val: "Unlimited" },
            { label: "Global Index", val: "100%" }
          ].map((stat, i) => (
            <div key={i} className="p-8 border border-slate-800 rounded-3xl">
              <div className="text-4xl font-black text-cyan-400 mb-2">{stat.val}</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
