import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

// --- High-Performance Native Ad Slot (Optimized for AdSense & Monetag) ---
const MonetizedAdSlot = ({ position }: { position: string }) => (
  <div className={`ad-container-${position} my-10 w-full flex flex-col items-center justify-center overflow-hidden min-h-[120px] rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900/90 to-indigo-950/40 p-4 shadow-xl backdrop-blur`}>
    <div className="w-full h-full flex items-center justify-center min-h-[90px]">
      {/* هنا يتم حقن وحدات AdSense و Monetag البرمجية تلقائياً عبر الـ Global Scripts */}
      <div className="text-center text-xs text-slate-500 font-mono tracking-widest uppercase">
        ⚡ Game Castle Sponsored Grid • [{position}]
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/$locale/codes/index')({
  loader: async () => {
    const { data: codes, error } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'code')
      .limit(60)

    return { codes: codes || [], error: error?.message || null }
  },
  component: GameCastleUltimateCatalog,
})

function GameCastleUltimateCatalog() {
  const { codes, error } = Route.useLoaderData()

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-xl rounded-2xl border border-red-900 bg-red-950/30 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Catalog Sync Error</h1>
          <p className="text-slate-300">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Schema.org Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Game Castle - Ultimate Digital Gaming Keys, Gift Cards & Comparison Hub",
            "description": "Explore the ultimate catalog of digital gaming keys, gift cards, instant region-free activations, and deep comparisons at Game Castle.",
            "url": "https://gamecastle.store/codes",
            "brand": {
              "@type": "Brand",
              "name": "GameCastle"
            }
          })
        }}
      />

      {/* 1. إعلان علوي فائق الربح (Header Monetization) */}
      <div className="mx-auto max-w-7xl px-6">
        <MonetizedAdSlot position="Header-Top" />
      </div>

      {/* Hero Section */}
      <section className="relative border-b border-slate-800 bg-gradient-to-b from-indigo-950/60 to-slate-950 py-16 px-6">
        <div className="mx-auto max-w-7xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-widest">
            🏰 Game Castle Empire • High-Yield Vault
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Ultimate Gaming Keys, Gift Cards & <span className="text-indigo-400">Instant Code Catalog</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300 leading-relaxed">
            Welcome to <strong>Game Castle</strong>, your premier destination for cheap gaming keys, global gift cards, instant activation codes, and deep hardware-software comparisons.
          </p>
        </div>
      </section>

      {/* 2. إعلان في منتصف الصفحة قبل المنتجات (Pre-Grid Monetization) */}
      <div className="mx-auto max-w-7xl px-6">
        <MonetizedAdSlot position="Pre-Grid-Banner" />
      </div>

      {/* Catalog Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Trending Digital Assets & Gift Cards</h2>
          <span className="text-sm text-indigo-400 font-medium">Live Market Rates Active</span>
        </div>

        {codes.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Synchronizing database inventory...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {codes.map((item, index) => {
              const metadata = item.metadata && typeof item.metadata === 'object' ? (item.metadata as Record<string, unknown>) : {}
              const price = metadata.price ? String(metadata.price) : '14.99'
              const itemName = item.name
              const itemSlug = item.slug

              return (
                <div key={item.id} className="contents">
                  <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div>
                      {item.image_url ? (
                        <div className="mb-4 overflow-hidden rounded-xl aspect-video bg-slate-950 border border-slate-800">
                          <img 
                            src={item.image_url} 
                            alt={`${itemName} official digital activation key, price, and instant delivery guide`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-slate-950 text-slate-600 border border-slate-800">
                          Game Castle Secure Asset
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                        {itemName}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                        {item.description || `Instant activation digital key for ${itemName}. Verified global warranty, 24/7 automated delivery.`}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Best Price</span>
                        <span className="text-xl font-black text-indigo-400">${price}</span>
                      </div>
                      <a 
                        href={`/codes/${itemSlug}`} 
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-md"
                      >
                        View Deals ⚡
                      </a>
                    </div>
                  </div>

                  {/* حقن إعلان داخل الشبكة كل 6 منتجات لرفع الأرباح بجنون */}
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

      {/* 3. إعلان قبل جدول المقارنات */}
      <div className="mx-auto max-w-5xl px-6">
        <MonetizedAdSlot position="Pre-Comparison-Banner" />
      </div>

      {/* Deep Content & SEO Comparison Engine Section */}
      <section className="mx-auto max-w-5xl px-6 py-12 border-t border-slate-800/80 space-y-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            The Ultimate Guide to Buying Cheap Gaming Keys & Gift Cards Safely
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed text-base">
            <p>
              Navigating the digital marketplace for video games can sometimes feel overwhelming. At <strong>Game Castle</strong>, we aggregate, compare, and verify thousands of digital keys, Steam gifts, PlayStation network cards, and Xbox credits to ensure you get the absolute lowest market price.
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-6">Game Castle vs. Traditional Retailers: Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Feature / Metric</th>
                  <th className="py-3 px-4 text-indigo-400">Game Castle Hub</th>
                  <th className="py-3 px-4 text-slate-500">Standard Retail Stores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Average Price Reduction</td>
                  <td className="py-4 px-4 text-indigo-300 font-bold">Up to 70% Off</td>
                  <td className="py-4 px-4 text-slate-500">Retail Full Price (MSRP)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Delivery Speed</td>
                  <td className="py-4 px-4 text-indigo-300 font-bold">Instant (Automated 24/7)</td>
                  <td className="py-4 px-4 text-slate-500">Variable / Shipping Delays</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">Price Comparison Tools</td>
                  <td className="py-4 px-4 text-indigo-300 font-bold">Integrated Live Tracking</td>
                  <td className="py-4 px-4 text-slate-500">None (Single Store View)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. إعلان ختامي مدمر أسفل الصفحة (Footer Monetization) */}
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <MonetizedAdSlot position="Footer-Bottom" />
      </div>
    </main>
  )
}
