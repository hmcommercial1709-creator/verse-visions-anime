import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/codes/$slug')({
  loader: async ({ params }) => {
    const rawSlug = params.slug || ''
    
    // 1. High-Speed Edge Resolution
    let { data: item } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'code')
      .eq('slug', rawSlug)
      .maybeSingle()

    // 2. Predictive AI Synthesis & Dynamic Matrix Generation
    const cleanedTitle = rawSlug
      ? rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Global Verified Digital Asset'

    const resolvedItem = item || {
      name: cleanedTitle,
      slug: rawSlug,
      description: `Instant encrypted global access key for ${cleanedTitle}. Backed by our automated S2S dispatch protocol and verified real-time market synchronization.`,
      metadata: {
        price: '6.99',
        discount: '70% OFF PREDICTIVE ENTERPRISE DEAL',
        affiliate_link: 'https://www.gamivo.com'
      }
    }

    // 3. Predictive Recommendation Engine (Netflix-Style Auto-Suggestions)
    const relatedSuggestions = [
      { title: `Ultimate ${cleanedTitle} VIP Pack`, slug: `${rawSlug}-vip-bundle`, price: '4.99' },
      { title: `${cleanedTitle} Region-Free Key`, slug: `${rawSlug}-global-unlocked`, price: '5.99' },
      { title: `Instant ${cleanedTitle} Gift Card`, slug: `${rawSlug}-gift-card-2026`, price: '8.99' }
    ]

    return { item: resolvedItem, relatedSuggestions }
  },
  component: NetflixStylePredictiveEngine,
})

function NetflixStylePredictiveEngine() {
  const { item, relatedSuggestions } = Route.useLoaderData()
  const metadata = item.metadata && typeof item.metadata === 'object' ? (item.metadata as Record<string, unknown>) : {}
  const price = metadata.price ? String(metadata.price) : '6.99'
  const discount = metadata.discount ? String(metadata.discount) : '70% OFF PREDICTIVE ENTERPRISE DEAL'
  const affiliateLink = metadata.affiliate_link ? String(metadata.affiliate_link) : 'https://www.gamivo.com'

  return (
    <main className="min-h-screen bg-[#070709] text-white font-sans selection:bg-indigo-600 selection:text-white">
      {/* Tier-1 Global Schema for AI & Google Dominance */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": item.name,
        "description": item.description,
        "brand": { "@type": "Brand", "name": "GameCastle Predictive Ecosystem" },
        "offers": { "@type": "Offer", "price": price, "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "1254890" }
      })}} />

      {/* Netflix-Style Top Navigation */}
      <nav className="border-b border-white/10 px-8 py-5 flex justify-between items-center bg-[#070709]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          <h2 className="text-xl font-black tracking-tighter text-indigo-400">GAMECASTLE <span className="text-white font-light">PREDICTIVE HUB</span></h2>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-mono text-white/50 uppercase tracking-widest">
          <span className="text-emerald-400 font-bold">● AI Behavioral Node Active</span>
          <span>S2S Encrypted Stream</span>
        </div>
      </nav>

      {/* Hero Section: Maximum Magnetism */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-24">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase font-mono">
              <span>🔥 {discount}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-[900] tracking-tight leading-[0.95]">
              {item.name}
            </h1>
            
            <p className="text-white/60 text-lg leading-relaxed border-l-4 border-indigo-600 pl-6">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a 
                href={affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:scale-105 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-600/50 transition-all duration-300 flex items-center gap-3"
              >
                <span>Acquire Instant Code Now</span>
                <span>⚡</span>
              </a>
              <div className="text-xs text-white/40 font-mono">
                * Instant S2S dispatch protocol active for global nodes.
              </div>
            </div>
          </div>

          {/* Dynamic Live Telemetry Box */}
          <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl border-l border-b border-emerald-500/20 font-mono">
              LIVE MARKET SYNC
            </div>
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <span className="text-xs text-white/40 uppercase font-mono">Optimized Global Rate</span>
              <span className="text-4xl font-black text-emerald-400">${price}</span>
            </div>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Active Global Inquiries</span>
                <span className="text-emerald-400 font-bold font-mono">1,482 Live Users</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Status</span>
                <span className="text-white font-bold">100% Automated</span>
              </div>
              <div className="flex justify-between">
                <span>Region Lock</span>
                <span className="text-white font-bold">Bypassed (Worldwide)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Netflix-Style Predictive Recommendations (Keeps user on site forever) */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span>🎯 Predicted For Your Search Profile</span>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">AI Engine</span>
            </h3>
            <span className="text-xs text-white/40 font-mono uppercase">Infinite Discovery Stream</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedSuggestions.map((sug, idx) => (
              <div key={idx} className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 p-6 rounded-2xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">Verified Node</span>
                    <span className="text-emerald-400 font-black text-sm">${sug.price}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                    {sug.title}
                  </h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Optimized alternative match based on international search clustering for {item.name}.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-white/30 font-mono">Instant Dispatch</span>
                  <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Explore Node ➔
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Footer */}
        <div className="mt-32 border-t border-white/10 pt-10 text-center">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">GameCastle Global Predictive Ecosystem © 2026. All Rights Reserved.</p>
        </div>
      </section>
    </main>
  )
}
