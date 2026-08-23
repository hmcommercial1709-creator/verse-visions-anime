import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/articles/')({
  loader: async () => {
    // Fetch live articles/entities from Supabase for Programmatic SEO Indexing
    let { data: articles } = await supabase
      .from('entities')
      .select('name, slug, description, metadata')
      .eq('entity_type', 'article')
      .limit(50)

    // Fallback cluster if database is empty to ensure high-speed crawling
    const fallbackArticles = articles && articles.length > 0 ? articles : [
      { name: 'Ultimate 2026 Global Digital Asset & S2S Activation Hub', slug: 'global-digital-asset-hub', description: 'Comprehensive intelligence and secure verification protocols.' },
      { name: 'High-Yield Programmatic SEO Strategies & Monetization', slug: 'programmatic-seo-strategies', description: 'Advanced automation techniques for billion-scale traffic acquisition.' },
      { name: 'Instant Region-Free Gaming Key Distribution Guide', slug: 'global-gaming-key-guide', description: 'Secure cryptographic keys and instant activation frameworks.' }
    ]

    return { articles: fallbackArticles }
  },
  component: BillionScaleArticlesIndex,
})

function BillionScaleArticlesIndex() {
  const { articles } = Route.useLoaderData()

  return (
    <main className="min-h-screen bg-[#020204] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      {/* Schema Markup for Collection Page Indexing */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "GameCastle Global Articles & Intelligence Hub",
        "description": "Index of high-yield programmatic SEO articles, cryptographic verification guides, and market analytics.",
        "publisher": { "@type": "Organization", "name": "GameCastle" }
      })}} />

      {/* Navigation Bar */}
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-[#020204]/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <Link to="/" className="text-lg font-black tracking-tighter text-emerald-400">GAMECASTLE <span className="text-white font-light">KNOWLEDGE INDEX</span></Link>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-mono text-white/50 uppercase tracking-widest">
          <span className="text-emerald-400 font-bold">● Crawler Hub Active</span>
          <span>Matrix Sync: 100%</span>
        </div>
      </nav>

      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold tracking-widest uppercase font-mono mb-6">
          <span>🌐 Billion-Traffic Master Crawler Index</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-[900] tracking-tight text-white mb-6">
          Global Intelligence & <span className="text-emerald-400">Programmatic Hub</span>
        </h1>
        <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
          Explore our fully synchronized matrix of automated intelligence briefings, global market analyses, and secure cryptographic verification pathways designed for maximum search engine dominance.
        </p>
      </section>

      {/* Articles Grid Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art: any, index: number) => (
            <Link 
              key={index}
              to="/$locale/articles/$slug"
              params={{ locale: 'en', slug: art.slug }}
              className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-emerald-500/40 p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase font-bold">Node #{index + 1}</span>
                  <span className="text-xs font-mono text-white/40">Verified</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                  {art.name}
                </h2>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
                  {art.description || 'Comprehensive intelligence briefing and market analysis.'}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="font-bold">Access Intelligence</span>
                <span className="group-hover:translate-x-2 transition-transform">➔</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center">
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">GameCastle Global Intelligence Syndicate © 2026. All Rights Reserved.</p>
      </footer>
    </main>
  )
}
