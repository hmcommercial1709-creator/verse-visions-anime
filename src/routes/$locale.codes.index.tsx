import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

// --- High-Performance Native Ad Slot (Optimized for AdSense & Monetag) ---
const MonetizedAdSlot = ({ position }: { position: string }) => (
  <div className={`ad-container-${position} my-10 w-full flex flex-col items-center justify-center overflow-hidden min-h-[120px] rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-slate-900/90 to-emerald-950/40 p-4 shadow-xl backdrop-blur`}>
    <div className="w-full h-full flex items-center justify-center min-h-[90px]">
      {/* AdSense and Monetag dynamic scripts container */}
      <div className="text-center text-xs text-slate-400 font-mono tracking-widest uppercase">
        ⚡ GameCastle Global Enterprise Sponsored Grid • [{position}]
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/$locale/codes/')({
  loader: async () => {
    const { data: codes, error } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'code')
      .limit(60)

    return { codes: codes || [], error: error?.message || null }
  },
  component: GodTierCodesCatalog,
})

function GodTierCodesCatalog() {
  const { codes, error } = Route.useLoaderData()

  if (error) {
    return (
      <main className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-8">
        <div className="max-w-xl rounded-2xl border border-red-900 bg-red-950/30 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Catalog Synchronization Fault</h1>
          <p className="text-slate-300">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#030305] text-slate-200 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Schema.org Rich Snippets for Search Dominance */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "GameCastle - Ultimate Digital Gaming Keys, Gift Cards & Instant Code Hub",
            "description": "Explore the ultimate decentralized catalog of digital gaming keys, gift cards, region-free activations, and market comparisons at GameCastle.",
            "url": "https://gamecastle.store/codes",
            "brand": {
              "@type": "Brand",
              "name": "GameCastle Global Ecosystem"
            }
          })
        }}
      />

      {/* 1. Header Monetization Ad */}
      <div className="mx-auto max-w-7xl px-6">
        <MonetizedAdSlot position="Header-Top" />
      </div>

      {/* Hero Section */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-emerald-950/40 to-[#030305] py-20 px-6">
        <div className="mx-auto max-w-7xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
            🏰 GameCastle Empire • High-Yield Global Vault
          </div>
          <h1 className="text-4xl font-[900] tracking-tight text-white md:text-7xl">
            Ultimate Gaming Keys, Gift Cards & <span className="text-emerald-400">Instant Code Catalog</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300 leading-relaxed">
            Welcome to <strong>GameCastle</strong>, your primary decentralized archive for cheap digital gaming keys, global gift cards, instant cryptographic activations, and deep market comparisons.
          </p>
        </div>
      </section>

      {/* 2. Pre-Grid Monetization Ad */}
      <div className="mx-auto max-w-7xl px-6">
        <MonetizedAdSlot position="Pre-Grid-Banner" />
      </div>

      {/* Catalog Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">Trending Digital Assets & Gift Cards</h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Live S2S Sync Active</span>
        </div>

        {codes.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/10">
            <p className="text-slate-400 font-mono">Synchronizing global database nodes...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {codes.map((item: any, index: number) => {
              const metadata = item.metadata && typeof item.metadata === 'object' ? (item.metadata as Record<string, unknown>) : {}
              const price = metadata.price ? String(metadata.price) : '4.99'
              const itemName = item.name
              const itemSlug = item.slug

              return (
                <div key={item.id || index} className="contents">
                  <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:border-emerald-500/50 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div>
                      {item.image_url ? (
                        <div className="mb-4 overflow-hidden rounded-2xl aspect-video bg-slate-950 border border-white/10">
                          <img 
                            src={item.image_url} 
                            alt={`${itemName} official digital activation key, price, and instant delivery guide`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl bg-white/[0.03] text-slate-500 border border-white/10 font-mono text-xs">
                          GameCastle Secure Asset Node
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition">
                        {itemName}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {item.description || `Instant activation digital key for ${itemName}. Verified global warranty, 24/7 automated S2S dispatch.`}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Best Market Rate</span>
                        <span className="text-xl font-black text-emerald-400">${price}</span>
                      </div>
                      <a 
                        href={`/codes/${itemSlug}`} 
                        className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-wider"
                      >
                        View Deals ⚡
                      </a>
                    </div>
                  </div>

                  {/* Grid Ad Injection every 6 items for maximum yield */}
                  {(index + 1) % 6 === 0 && (
                    <div className="col-span-full">
                      <MonetizedAdSlot position={`Grid-Injection-${index}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. Pre-Comparison Monetization Ad */}
      <div className="mx-auto max-w-5xl px-6">
        <MonetizedAdSlot position="Pre-Comparison-Banner" />
      </div>

      {/* Deep Content & SEO Comparison Engine Section */}
      <section className="mx-auto max-w-5xl px-6 py-12 border-t border-white/10 space-y-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-xl">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            The Ultimate Guide to Acquiring Cheap Gaming Keys & Gift Cards Safely
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
            <p>
              Navigating the global digital marketplace for video games can sometimes feel complicated. At <strong>GameCastle</strong>, we aggregate, compare, and verify thousands of digital keys, Steam gifts, PlayStation network cards, and Xbox credits through our automated synchronization protocols to ensure you secure the absolute lowest market price instantly.
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-xl overflow-hidden backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-white mb-6">GameCastle vs. Traditional Retailers: Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 text-xs uppercase font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-4">Feature / Metric</th>
                  <th className="py-3 px-4 text-emerald-400">GameCastle Hub</th>
                  <th className="py-3 px-4 text-slate-500">Standard Retail Stores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Average Price Reduction</td>
                  <td className="py-4 px-4 text-emerald-300 font-bold">Up to 80% Off</td>
                  <td className="py-4 px-4 text-slate-500">Retail Full Price (MSRP)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Delivery Speed</td>
                  <td className="py-4 px-4 text-emerald-300 font-bold">Instant (Automated S2S 24/7)</td>
                  <td className="py-4 px-4 text-slate-500">Variable / Shipping Delays</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Price Comparison Tools</td>
                  <td className="py-4 px-4 text-emerald-300 font-bold">Integrated Live Tracking</td>
                  <td className="py-4 px-4 text-slate-500">None (Single Store View)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Footer Bottom Monetization Ad */}
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <MonetizedAdSlot position="Footer-Bottom" />
      </div>
    </main>
  )
}
