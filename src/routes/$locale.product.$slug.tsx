import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

const AdSlot = () => (
  <div className="ad-container my-8 w-full flex justify-center overflow-hidden min-h-[100px]">
    <div className="ads-placeholder w-full h-full" />
  </div>
);

export const Route = createFileRoute('/$locale/product/$slug')({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'product')
      .eq('slug', params.slug)
      .maybeSingle()
    return { product: data }
  },
  component: ProductLandingPage,
})

function ProductLandingPage() {
  const { product } = Route.useLoaderData()

  if (!product) return <div className="text-center py-20 text-white">Loading Premium Offer...</div>

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AdSlot />
      
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{product.name}</h1>
          <p className="text-xl text-slate-400 mb-8">{product.description}</p>
          
          <div className="flex flex-col gap-4">
            <a 
              href="/store" 
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-center font-black text-xl rounded-2xl transition shadow-lg hover:shadow-indigo-500/20"
            >
              Claim Your Exclusive Access Now 🚀
            </a>
            <p className="text-center text-sm text-slate-500">Limited stock available for {product.name}</p>
          </div>
        </div>

        <AdSlot />

        <article className="prose prose-invert mt-12 max-w-none">
          <h2 className="text-2xl font-bold mb-4">Why choose this product?</h2>
          <p>
            {product.name} is engineered to provide the best performance and value. 
            By integrating directly with our gaming resource hub, you ensure 
            maximum compatibility and instant delivery.
          </p>
        </article>
      </section>
    </main>
  )
}
