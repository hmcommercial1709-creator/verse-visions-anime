import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/wallpapers/$slug')({
  component: WallpapersPage,
})

function WallpapersPage() {
  const { slug } = Route.useParams()

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black mb-10 text-center uppercase tracking-tighter">
        {slug.replace(/-/g, ' ')} - 8K Wallpapers
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[9/16] bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
            خلفية 8K رقم {i}
          </div>
        ))}
      </div>
        <div className="flex justify-center my-6">
  <a 
    href="https://lamadventure4.gumroad.com/l/fovib" 
    className="gumroad-button inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
    data-gumroad-single-product="true"
  >
    🔥 Buy Ultimate 4K Pack Now
  </a>
</div> 
    </div>
  )
}
