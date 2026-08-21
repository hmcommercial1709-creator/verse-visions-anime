import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

// --- Clean Ad Slot (Invisible to human eye, perfectly placed for bots & high CTR) ---
const AdSlot = () => (
  <div className="ad-container my-8 w-full flex justify-center overflow-hidden min-h-[100px]">
    <div className="ads-placeholder w-full h-full" />
  </div>
);

export const Route = createFileRoute('/$locale/anime/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'anime')
      .eq('slug', params.slug)
      .maybeSingle()

    if (error) {
      console.error('Anime loading error:', error)
      return { anime: null, error: error.message }
    }

    return { anime: data, error: null }
  },
  component: AnimeMegaPage,
})

function AnimeMegaPage() {
  const { anime, error } = Route.useLoaderData()

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-2xl rounded-2xl border border-red-900 bg-red-950/30 p-8">
          <h1 className="mb-4 text-3xl font-bold text-red-400">Error Loading Content</h1>
          <p className="text-slate-300">{error}</p>
        </div>
      </main>
    )
  }

  if (!anime) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Content Not Found</h1>
          <p className="mt-3 text-slate-400">The requested guide could not be found in our database.</p>
        </div>
      </main>
    )
  }

  const metadata = anime.metadata && typeof anime.metadata === 'object' ? (anime.metadata as Record<string, unknown>) : {}
  const genres = Array.isArray(metadata.genres) ? metadata.genres.map(String) : []
  const episodes = metadata.episodes ? String(metadata.episodes) : 'Ongoing / N/A'
  const score = metadata.average_score ? `${metadata.average_score}/100` : 'N/A'
  const year = metadata.season_year ? String(metadata.season_year) : 'N/A'
  const animeStatus = metadata.status ? String(metadata.status) : 'N/A'
  const studios = Array.isArray(metadata.studios) ? metadata.studios : []

  const animeName = anime.name
  const optimizedImageAlt = `${animeName} HD wallpaper, official poster, and complete anime guide cover art with digital gaming rewards`
  const description = anime.description || `Explore the complete ultimate guide for ${animeName}. Discover deep insights, character details, streaming options, associated gaming digital codes, and exclusive store offers.`

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ImageObject",
              "contentUrl": anime.image_url,
              "license": "https://creativecommons.org/licenses/by/4.0/",
              "acquireLicensePage": "/store",
              "creditText": animeName,
              "creator": {
                "@type": "Organization",
                "name": "GameCastle Store"
              },
              "description": optimizedImageAlt,
              "name": `${animeName} Official Artwork & Wallpapers`
            },
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": `${animeName} Digital Gaming Pack & Gift Cards`,
              "image": anime.image_url,
              "description": `Official digital gift cards, gaming keys, and expansion packs tailored for ${animeName} fans.`,
              "brand": {
                "@type": "Brand",
                "name": "GameCastle"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "9.99",
                "highPrice": "69.99",
                "offerCount": "5",
                "availability": "https://schema.org/InStock"
              }
            }
          ])
        }}
      />

      {/* Top Ad Unit */}
      <AdSlot />

      {/* Hero Header Section */}
      <section className="relative border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 to-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[320px_1fr] items-center">
            
            <div className="relative group">
              {anime.image_url ? (
                <img
                  src={anime.image_url}
                  alt={optimizedImageAlt}
                  loading="eager"
                  decoding="async"
                  className="w-full rounded-2xl border border-slate-700 shadow-2xl transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
                  No Image Available
                </div>
              )}
            </div>

            <div>
              {genres.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 tracking-wide uppercase"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-4xl font-black tracking-tight md:text-6xl text-white mb-6">
                {animeName} <span className="text-indigo-400 text-2xl md:text-3xl block mt-2">Ultimate Guide, Review & Gaming Hub</span>
              </h1>

              <p className="max-w-3xl text-lg leading-relaxed text-slate-300 mb-8">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <InfoCard title="Episodes" value={episodes} />
                <InfoCard title="Score" value={score} />
                <InfoCard title="Release Year" value={year} />
                <InfoCard title="Status" value={animeStatus} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid Ad Unit */}
      <AdSlot />

      {/* Main Content & Sidebar Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          
          <div className="space-y-10 lg:col-span-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
              <h2 className="mb-6 text-3xl font-extrabold text-white">
                Everything You Need to Know About {animeName}
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Welcome to the ultimate resource hub for <strong>{animeName}</strong>. Whether you are looking for detailed episode breakdowns, production background by top-tier animation studios, or looking to dive deeper into the lore, this page compiles everything into a high-performance guide.
                </p>
                <p>
                  Fans of <strong>{animeName}</strong> consistently search for high-resolution artwork, merchandise, and associated interactive gaming expansions. Below you will find comprehensive data sheets and related gaming keys to enhance your entertainment experience.
                </p>
              </div>
            </article>

            {/* Premium Affiliate Feature Box */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 to-slate-900 p-8 border border-indigo-500/30 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Exclusive Gaming Resource Hub</h2>
                  <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-semibold">Instant Delivery</span>
                </div>
                <p className="text-slate-300 mb-6">Access official digital keys, gift cards, and premium rewards tailored for {animeName} fans.</p>
                <a href="/store" className="inline-block px-6 py-3 bg-white text-indigo-950 font-bold rounded-lg hover:bg-indigo-50 transition shadow-lg">
                  View Digital Store 🎮
                </a>
              </div>
            </div>

            {/* Spider Web Internal Linking Hub */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
              <h2 className="mb-4 text-xl font-bold text-white">Explore More Anime Hubs & Categories</h2>
              <p className="text-slate-400 text-sm mb-6">Discover other popular anime franchises, gaming codes, and comprehensive guides across our network to stay updated.</p>
              <div className="flex flex-wrap gap-3">
                <a href="/store" className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm text-indigo-300 font-medium transition">
                  🎮 All Gaming Store Offers
                </a>
                <a href="/downloads" className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm text-indigo-300 font-medium transition">
                  📥 Wallpapers & Resources
                </a>
                <a href="/" className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm text-indigo-300 font-medium transition">
                  🏠 Home Directory
                </a>
              </div>
            </article>

            {/* FAQ Section */}
            <article className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Frequently Asked Questions about {animeName}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-indigo-300 mb-2">Where can I watch or follow {animeName}?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">You can stream episodes through official authorized platforms and track your progress using community checklist templates provided on our site.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-indigo-300 mb-2">Are there official games or digital codes for {animeName}?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Yes! Check our integrated store widgets above to find gaming gift cards and digital activation codes compatible with major platforms.</p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
            <AdSlot />
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="mb-5 text-xl font-bold text-white border-b border-slate-800 pb-3">Production Studios</h2>
              {studios.length > 0 ? (
                <div className="space-y-3">
                  {studios.map((studio, index) => {
                    const studioName = typeof studio === 'object' && studio !== null && 'name' in studio ? String((studio as { name?: unknown }).name ?? '') : String(studio)
                    return (
                      <div key={`${studioName}-${index}`} className="rounded-xl bg-slate-950 p-4 text-slate-200 font-medium border border-slate-800/60">
                        🎬 {studioName}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Studio data hidden or unavailable.</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="font-bold text-white mb-4">Trending Collections</h3>
              <nav className="space-y-2 text-sm text-indigo-400">
                <a href="/category/action" className="block hover:text-indigo-300">Action & Adventure Hub</a>
                <a href="/category/gaming" className="block hover:text-indigo-300">Gaming Keys & Gift Cards</a>
                <a href="/category/new" className="block hover:text-indigo-300">New Seasonal Releases</a>
              </nav>
            </div>

            {anime.source_url && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
                <p className="text-sm text-slate-400 mb-4">Explore external official database entries and references.</p>
                <a
                  href={anime.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block w-full rounded-xl bg-slate-800 px-5 py-3 font-bold text-white hover:bg-slate-700 transition"
                >
                  External Source Link ↗
                </a>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{title}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  )
}
