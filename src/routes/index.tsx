import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const generateLibrary = (category: string, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1
    return {
      id,
      title: `${category} Masterpiece Edition #${id}`,
      description: `Complete archive and streaming details for ${category.toLowerCase()} item #${id}. High-speed access and interactive database records.`,
      slug: `${category.toLowerCase()}-item-${id}`,
      category: category.toLowerCase(),
      rating: (7.5 + (i % 25) / 10).toFixed(1),
      metaInfo: category === 'anime' ? `${(i % 50) + 12} Episodes` : category === 'games' ? `Instant Key #${id}` : `Chapter #${id}`
    }
  })
}

const masterDatabase = {
  anime: generateLibrary('Anime', 300),
  games: generateLibrary('Games', 300),
  stories: generateLibrary('Stories', 300),
}

function HomePage() {
  const [activeTab, setActiveTab] = useState<'anime' | 'games' | 'stories'>('anime')
  const [searchQuery, setSearchQuery] = useState('')

  const currentList = masterDatabase[activeTab]

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return currentList
    const query = searchQuery.toLowerCase()
    return currentList.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    )
  }, [currentList, searchQuery])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-rose-500 mb-3 tracking-wider">GAMECASTLE NEXUS</h1>
          <p className="text-gray-400 text-sm md:text-base">Massive Digital Library: Seamlessly interconnected Anime, Games, and Stories.</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {(['anime', 'games', 'stories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
              className={`px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all shadow-lg ${
                activeTab === tab 
                  ? 'bg-rose-600 text-white scale-105 shadow-rose-600/50 ring-2 ring-rose-400' 
                  : 'bg-[#13182b] text-gray-300 hover:bg-[#1f293d]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-10">
          <input
            type="text"
            placeholder="Can't find what you want? Type any name or keyword to search the massive library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13182b] border border-[#1f293d] rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition text-base shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between bg-[#13182b]/50 border border-[#1f293d] rounded-xl p-4 mb-8 text-sm text-gray-400">
          <span>Active Category: <strong className="text-rose-400 uppercase">{activeTab}</strong> ({filteredItems.length} items available)</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white transition" onClick={() => setActiveTab('anime')}>Anime Hub</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-white transition" onClick={() => setActiveTab('games')}>Games Hub</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-white transition" onClick={() => setActiveTab('stories')}>Stories Hub</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.slice(0, 60).map((item) => (
            <div
              key={item.id}
              className="bg-[#13182b] border border-[#1f293d] rounded-xl p-5 hover:border-rose-500 transition-all flex flex-col justify-between shadow-md group"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold uppercase">{item.category}</span>
                  <span className="text-xs text-amber-400 font-bold">⭐ {item.rating}</span>
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-rose-400 transition mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#1f293d]/50">
                <span className="text-xs text-gray-500">{item.metaInfo}</span>
                <a
                  href={`/${item.slug}`}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-4 py-2 rounded-lg font-semibold text-xs transition"
                >
                  Open Page →
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No items found matching "{searchQuery}". Try another keyword or explore our interconnected sections above!
          </div>
        )}

      </div>
    </div>
  )
}
