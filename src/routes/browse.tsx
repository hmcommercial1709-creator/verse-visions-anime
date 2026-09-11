import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/browse')({
  component: BrowseCatalog,
})

const sampleAnime = [
  { id: 1, title: 'One Piece', genre: 'Action', episodes: '1100+', rating: '9.1', slug: 'one-piece' },
  { id: 2, title: 'Attack on Titan', genre: 'Action', episodes: '89', rating: '9.0', slug: 'attack-on-titan' },
  { id: 3, title: 'Fullmetal Alchemist: Brotherhood', genre: 'Adventure', episodes: '64', rating: '9.2', slug: 'fullmetal-alchemist' },
  { id: 4, title: 'Hunter x Hunter', genre: 'Adventure', episodes: '148', rating: '9.1', slug: 'hunter-x-hunter' },
  { id: 5, title: 'Demon Slayer', genre: 'Action', episodes: '55', rating: '8.7', slug: 'demon-slayer' },
  { id: 6, title: 'Frieren: Beyond Journey\'s End', genre: 'Fantasy', episodes: '28', rating: '9.0', slug: 'frieren' },
  { id: 7, title: 'Jujutsu Kaisen', genre: 'Action', episodes: '47', rating: '8.6', slug: 'jujutsu-kaisen' },
  { id: 8, title: 'Solo Leveling', genre: 'Action', episodes: '12', rating: '8.5', slug: 'solo-leveling' },
]

function BrowseCatalog() {
  const [filter, setFilter] = useState('all')
  const filteredItems = filter === 'all' ? sampleAnime : sampleAnime.filter(i => i.genre === filter)

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-rose-500">تصفح الأنمي والقصص والوِحدات</h1>
        <p className="text-gray-400 mb-8">قائمة كاملة بالأنميات والقصص المتاحة للمشاهدة الفورية والضغط المباشر.</p>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'Action', 'Adventure', 'Fantasy'].map((genre) => (
            <button
              key={genre}
              onClick={() => setFilter(genre)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === genre ? 'bg-rose-600 text-white' : 'bg-[#13182b] text-gray-300 hover:bg-[#1f293d]'
              }`}
            >
              {genre === 'all' ? 'الكل' : genre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#13182b] border border-[#1f293d] rounded-xl p-4 hover:border-rose-500 transition group block shadow-lg"
            >
              <div className="aspect-[16/9] bg-[#1a2238] rounded-lg mb-3 overflow-hidden relative flex items-center justify-center">
                <span className="text-rose-400 font-bold text-lg">{item.title}</span>
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-rose-400 mb-1">{item.title}</h3>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>التصنيف: {item.genre}</span>
                <span className="text-amber-400 font-bold">⭐ {item.rating}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">الحلقات: {item.episodes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
