import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

// --- Clean Ad Slot for Maximum Monetization ---
const AdSlot = () => (
  <div className="ad-container my-8 w-full flex justify-center overflow-hidden min-h-[100px]">
    <div className="ads-placeholder w-full h-full" />
  </div>
);

export const Route = createFileRoute('/$locale/codes/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'code') // أو نوع البيانات الخاص بالألعاب والبطاقات لديك
      .eq('slug', params.slug)
      .maybeSingle()

    if (error) {
      console.error('Code loading error:', error)
      return { codeItem: null, error: error.message }
    }

    return { codeItem: data, error: null }
  },
  component: GamingCodeMegaPage,
})

function GamingCodeMegaPage() {
  const { codeItem, error } = Route.useLoaderData()

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-2xl rounded-2xl border border-red-900 bg-red-950/30 p-8">
          <h1 className="mb-4 text-3xl font-bold text-red-400">Error Loading Gaming Offer</h1>
          <p className="text-slate-300">{error}</p>
        </div>
      </main>
    )
  }

  if (!codeItem) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Gaming Code Not Found</h1>
          <p className="mt-3 text-slate-400">The requested digital card or game key could not be found.</p>
        </div>
      </main>
    )
  }

  const itemName = codeItem.name
  const itemDescription = codeItem.description || `Get instant digital delivery for ${itemName}. Secure activation codes, region-free options, and best market prices.`
  const metadata = codeItem.metadata && typeof codeItem.metadata === 'object' ? (codeItem.metadata as Record<string, unknown>) : {}
  const price = metadata.price ? String(metadata.price) : '19.99'

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Schema.org E-commerce Product & Offer Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": itemName,
            "image": codeItem.image_url,
            "description": itemDescription,
            "brand": {
              "@type": "Brand",
              "name": "GameCastle Store"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": price,
              "availability": "https://schema.org/InStock",
              "url": window.location.href
            }
          })
        }}
      />

      <AdSlot />

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          
          <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight md:text-5xl">{itemName}</h1>
            
            <AdSlot />

            <div className="grid gap-8 md:grid-cols-2 items-center bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              {codeItem.image_url ? (
                <img src={codeItem.image_url} alt={itemName} className="w-full rounded-xl object-cover aspect-video border border-slate-700" />
              ) : (
                <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center text-slate-500">No Preview</div>
              )}
              <div className="space-y-4">
                <div className="text-3xl font-black text-indigo-400">${price} USD</div>
                <p className="text-sm text-slate-300">Instant digital code delivery directly to your email or account. 100% secure activation.</p>
                <a 
                  href={`https://www.gamivo.com/`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl transition shadow-lg"
                >
                  Buy Now via Secure Partner ⚡
                </a>
              </div>
            </div>

            <article className="prose prose-lg prose-invert max-w-none text-slate-300 leading-relaxed">
              <p>{itemDescription}</p>
            </article>

            {/* Spider Web Internal Links */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
              <h2 className="mb-4 text-xl font-bold text-white">Explore More Gaming Categories</h2>
              <div className="flex flex-wrap gap-3">
                <a href="/store" className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm text-indigo-300 font-medium transition">
                  🎮 All Store Offers
                </a>
                <a href="/" className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm text-indigo-300 font-medium transition">
                  🏠 Home Hub
                </a>
              </div>
            </article>
          </div>

          <aside className="space-y-8">
            <AdSlot />
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="font-bold text-white mb-4">Quick Delivery Features</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">✅ 24/7 Automated Delivery</li>
                <li className="flex items-center gap-2">✅ Global Region Activation</li>
                <li className="flex items-center gap-2">✅ Secure Payment Gateways</li>
              </ul>
            </div>
          </aside>

        </div>
      </section>
    </main>
  )
}
