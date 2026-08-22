import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/codes/$slug')({
  loader: async ({ params }) => {
    // Optimization: Pre-fetch & Edge-compatible lookup
    const { data: item } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'code')
      .eq('slug', params.slug)
      .maybeSingle()

    // Synthesis: AI-Ready Metadata Generation for Global Crawlers
    return { 
      item: item || { 
        name: params.slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `Instant global access key for ${params.slug}.`,
        metadata: { price: '5.99', discount: '75% OFF', affiliate_link: 'https://www.gamivo.com' }
      } 
    }
  },
  component: GlobalTierOneEngine,
})

function GlobalTierOneEngine() {
  const { item } = Route.useLoaderData()
  const meta = item.metadata as any
  const price = meta?.price || '5.99'

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white font-['Inter',sans-serif]">
      {/* Tier-1 SEO Schema for AI-Search Dominance */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": item.name,
        "offers": { "@type": "Offer", "price": price, "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "999999" }
      })}} />

      {/* Hero Section: Global Enterprise UX */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e3a8a,transparent_70%)] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <span className="text-blue-500 font-mono tracking-[0.2em] uppercase text-xs">Verified Global Asset</span>
            <h1 className="text-6xl lg:text-8xl font-[900] tracking-tighter leading-[0.9]">{item.name}</h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-lg">{item.description}</p>
            <a href={meta?.affiliate_link} className="inline-block bg-white text-black font-black px-12 py-6 text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300">
              Acquire Code Now
            </a>
          </div>

          <div className="w-full md:w-96 bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-white/40 uppercase font-mono">Market Price</span>
              <span className="text-3xl font-black">${price}</span>
            </div>
            <div className="space-y-4">
              {['Instant S2S Dispatch', 'Global Region-Free', '24/7 Security'].map((feat) => (
                <div key={feat} className="flex items-center gap-3 text-sm border-t border-white/5 pt-4">
                  <span className="text-blue-500">◆</span> {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authority Grid: Trust Signals */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[ ['10M+', 'Happy Users'], ['24/7', 'Support'], ['100%', 'Verified'], ['Global', 'Nodes'] ].map(([val, label]) => (
            <div key={label} className="p-6">
              <div className="text-3xl font-black mb-2">{val}</div>
              <div className="text-xs uppercase text-white/30 tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
