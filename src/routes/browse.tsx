import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const Route = createFileRoute('/browse')({
  component: BrowseCatalog,
})

function BrowseCatalog() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let query = supabase.from('anime').select('*').limit(50)
      if (filter !== 'all') {
        query = query.eq('genre', filter)
      }
      const { data, error } = await query
      if (!error && data) {
        setItems(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [filter])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-rose-500">تصفح الأنمي والقصص والتصنيفات</h1>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'Action', 'Adventure', 'Fantasy', 'Drama', 'Sci-Fi'].map((genre) => (
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

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري جلب المحتوى من قاعدة البيانات...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">لا توجد عناصر متاحة في هذا التصنيف حالياً.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <a
                key={item.id || item.slug}
                href={`/${item.slug}`}
                className="bg-[#13182b] border border-[#1f293d] rounded-xl p-3 hover:border-rose-500 transition group block"
              >
                <div className="aspect-[3/4] bg-[#1a2238] rounded-lg mb-3 overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs">GameCastle</div>
                  )}
                </div>
                <h3 className="font-bold text-sm truncate group-hover:text-rose-400">{item.title || item.name}</h3>
                <span className="text-xs text-gray-400 mt-1 block">{item.genre || 'أنمي'}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
