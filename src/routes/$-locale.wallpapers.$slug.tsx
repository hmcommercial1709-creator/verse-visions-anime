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
    </div>
  )
}
