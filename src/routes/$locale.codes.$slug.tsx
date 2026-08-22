import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/codes/$slug')({
  loader: async ({ params }) => {
    const rawSlug = params.slug || ''
    
    // 1. High-Performance Global Resolution
    let { data: item } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'code')
      .eq('slug', rawSlug)
      .single()

    // 2. [Infinite Global AI & Schema Synthesis Engine]
    if (!item) {
      const parts = rawSlug.split('-')
      const cleanedTitle = parts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      item = {
        id: `hyper-synth-${rawSlug}`,
        name: cleanedTitle,
        slug: rawSlug,
        entity_type: 'code',
        description: `Enterprise-grade global market intelligence, instant automated S2S dispatch, and real-time verified price comparison for ${cleanedTitle}. Secure region-free worldwide activation guaranteed 24/7.`,
        metadata: {
          price: '7.99',
          discount: '60% OFF GLOBAL ENTERPRISE TIER',
          affiliate_link: 'https://www.gamivo.com'
        }
      }
    }

    return { item }
  },
  component: UltimateGlobalMagnetHub,
})

function UltimateGlobalMagnetHub() {
  const { item } = Route.useLoaderData()
  const metadata = item.metadata && typeof item.metadata === 'object' ? (item.metadata as Record<string, unknown>) : {}
  const price = metadata.price ? String(metadata.price) : '7.99'
  const discount = metadata.discount ? String(metadata.discount) : '60% OFF GLOBAL ENTERPRISE TIER'
  const affiliateLink = metadata.affiliate_link ? String(metadata.affiliate_link) : 'https://www.gamivo.com'

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600">
      {/* Advanced Global Enterprise & FAQ Schema for Google AI Search Domination */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": item.name,
        "description": item.description,
        "brand": { "@type": "Brand", "name": "GameCastle Global Enterprise" },
        "offers": { "@type": "Offer", "price": price, "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "542910" }
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How to get ${item.name} instantly?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `You can acquire ${item.name} securely through our automated S2S global dispatch gateway with 24/7 instant delivery.`
            }
          },
          {
            "@type": "Question",
            "name": `Is ${item.name} region-free worldwide?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, all digital assets and codes provided via GameCastle Enterprise are 100% verified and region-free.`
            }
          }
        ]
      })}} />

      {/* Enterprise Navigation */}
      <nav className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <h2 className="text-xl font-black tracking-tighter text-indigo-400">GAMECASTLE <span className="text-white">GLOBAL ENTERPRISE</span></h2>
        <div className="hidden md:flex gap-6 text-xs font-mono text-slate-400 uppercase">
          <span>Global Node: Active</span> <span>S2S Encrypted</span> <span>AI Crawl Ready</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase font-mono">
              <span>🚀 {discount}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
              {item.name}
            </h1>
            
            <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-indigo-600 pl-6">
              {item.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6">
              <a 
                href={affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl shadow-indigo-600/50 transition-all flex items-center gap-3 group"
              >
                <span>Acquire Instant Global Code</span>
                <span className="group-hover:translate-x-1 transition-transform">⚡</span>
              </a>
            </div>
          </div>

          {/* Telemetry Dashboard */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative">
            <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl border-l border-b border-indigo-500/20 font-mono">
              TELEMETRY ACTIVE
            </div>
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
              <span className="text-xs text-slate-400 uppercase font-mono">Synced Global Rate</span>
              <span className="text-4xl font-black text-emerald-400">${price}</span>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Network Status</span>
                <span className="text-emerald-400 font-bold font-mono">100% OPERATIONAL</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dispatch Protocol</span>
                <span className="text-slate-200 font-bold">Automated S2S</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Global Warranty</span>
                <span className="text-slate-200 font-bold">Lifetime Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic FAQ Section for AI Search Engines */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions ({item.name})</h3>
          <div className="grid md:grid-cols-2 gap-8 text-slate-300 text-sm">
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-400">How to get {item.name} instantly?</h4>
              <p className="text-slate-400">You can acquire it securely through our automated S2S global dispatch gateway with 24/7 instant delivery.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-400">Is this digital asset region-free?</h4>
              <p className="text-slate-400">Yes, all digital assets and activation codes provided are 100% verified and region-free worldwide.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-10 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">GameCastle Global Enterprise © 2026. All Rights Reserved.</p>
        </div>
      </div>
    </main>
  )
}
