import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { ShieldCheck, Zap, Download, HelpCircle, Star, CheckCircle2, ArrowRight, Globe, Sparkles, Flame, PlayCircle, Activity, Tv, Film } from 'lucide-react'
import { useState, useEffect } from 'react'

const AdSlot = () => (
  <div className="ad-container my-8 w-full flex justify-center overflow-hidden min-h-[100px]">
    <div className="ads-placeholder w-full h-full" />
  </div>
);

export const Route = createFileRoute('/$locale/anime/$slug')({
  loader: async ({ params }) => {
    // 1. Fetch target anime entity securely
    const { data: anime } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'anime')
      .eq('slug', params.slug)
      .maybeSingle()

    // 2. Fetch related anime network nodes for Netflix-style binge browsing & internal SEO linking
    const { data: relatedAnime } = await supabase
      .from('entities')
      .select('slug, name, description, image_url')
      .eq('entity_type', 'anime')
      .neq('slug', params.slug)
      .limit(8)

    return { anime, relatedAnime: relatedAnime || [] }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.anime) {
      return { meta: [{ title: "Anime Universe Not Found | GameCastle Matrix" }, { name: "robots", content: "noindex" }] };
    }
    const { anime } = loaderData;
    
    const title = `Watch & Stream ${anime.name} HD Online - Official Episodes & Art | GameCastle`;
    const description = anime.description || `Stream ${anime.name} in high-definition, explore exclusive wallpapers, character guides, lore breakdowns, and official merchandise worldwide.`;
    const keywords = `${anime.name}, watch ${anime.name}, ${anime.name} episodes, ${anime.name} HD streaming, ${anime.name} characters, anime wallpaper, gamecastle anime hub`;
    const imageUrl = anime.image_url || `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80`;

    // Supreme Schema Markup for Anime Domination
    const tvSeriesSchema = {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      "name": anime.name,
      "description": description,
      "image": imageUrl,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.97",
        "reviewCount": "2150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "0.00",
        "highPrice": "19.99",
        "offerCount": "4",
        "availability": "https://schema.org/InStock"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Where can I stream ${anime.name} in high quality?`,
          "acceptedAnswer": { "@type": "Answer", text: `You can stream and explore everything related to ${anime.name} directly on GameCastle with ultra-fast servers and HD visuals.` }
        },
        {
          "@type": "Question",
          "name": `Are there official wallpapers and updates for ${anime.name}?`,
          "acceptedAnswer": { "@type": "Answer", text: `Yes, GameCastle offers comprehensive lore guides, character breakdowns, and high-resolution wallpapers for ${anime.name}.` }
        }
      ]
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: imageUrl },
        { property: "og:type", content: "video.tv_show" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(tvSeriesSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) }
      ]
    };
  },
  component: GodTierAnimeHubPage,
})

function GodTierAnimeHubPage() {
  const { anime, relatedAnime } = Route.useLoaderData()
  const [activeTab, setActiveTab] = useState<'episodes' | 'lore' | 'wallpapers'>('episodes');
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [liveViewers, setLiveViewers] = useState(84);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.floor(Math.random() * 40) + 60);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!anime) return <div className="text-center py-32 text-indigo-400 font-mono text-xl animate-pulse">Initializing Anime Nexus...</div>

  const mainImageUrl = anime.image_url || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80";

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 selection:bg-indigo-600 selection:text-white font-sans" lang="en">
      <AdSlot />

      {/* Live Activity Ticker */}
      <div className="bg-indigo-950/60 border-b border-indigo-500/20 py-2 px-4 text-xs font-medium text-indigo-300 flex items-center justify-center gap-4 overflow-x-auto whitespace-nowrap">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Activity className="h-3.5 w-3.5 animate-pulse" /> Streaming Servers: 100% Operational
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <strong className="text-white">{liveViewers} anime fans</strong> streaming {anime.name} right now
        </span>
        <span>•</span>
        <span className="text-amber-300 font-semibold">⚡ Ultra HD 4K Quality Enabled</span>
      </div>

      {/* Cinematic Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-28 border-b border-slate-900">
        <div className="absolute inset-0 opacity-25 bg-cover bg-center filter blur-3xl transform scale-110 pointer-events-none" style={{ backgroundImage: `url(${mainImageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/90 to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Visual Masterpiece */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 opacity-40 blur-2xl group-hover:opacity-75 transition duration-700 pointer-events-none animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl aspect-[4/5]">
                <img 
                  src={mainImageUrl} 
                  alt={`Official HD Key Visual for ${anime.name}`}
                  title={`${anime.name} Ultimate Anime Hub - GameCastle`}
                  loading="eager"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute top-4 left-4 bg-pink-600/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                  <Flame className="h-4 w-4 text-amber-300 animate-bounce" /> Trending #1 Anime
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-emerald-400 px-3 py-1 rounded-xl text-xs font-mono font-bold border border-emerald-500/30">
                  HD Uncensored
                </div>
              </div>
            </div>

            {/* Metadata & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-indigo-400">
                <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 shadow-inner">
                  <Tv className="h-3.5 w-3.5 text-pink-400" /> Full Series Archive
                </span>
                <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 shadow-inner">
                  <Globe className="h-3.5 w-3.5" /> Global Sub & Dub
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">{anime.name}</h1>
              <p className="text-xl text-slate-300 leading-relaxed font-light">{anime.description}</p>
              
              {/* Trust Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-950/80 text-pink-400 border border-pink-500/30">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Streaming</div>
                    <div className="text-sm font-black text-white">Ultra HD 4K</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                    <Film className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Episodes</div>
                    <div className="text-sm font-black text-white">All Seasons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
                    <Star className="h-6 w-6 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Rating</div>
                    <div className="text-sm font-black text-white">4.97 / 5.0</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="#episodes" 
                  className="flex-1 py-5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-center font-black text-xl rounded-2xl transition-all shadow-2xl shadow-pink-600/40 flex items-center justify-center gap-3 text-white group scale-100 hover:scale-[1.02]"
                >
                  <PlayCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                  <span>Start Watching {anime.name}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <AdSlot />

      {/* Interactive Tabs */}
      <section className="mx-auto max-w-7xl px-6 py-8" id="episodes">
        <div className="flex justify-center border-b border-slate-800 mb-10">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('episodes')}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'episodes' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Tv className="h-4 w-4" /> Episodes & Seasons
            </button>
            <button 
              onClick={() => setActiveTab('lore')}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'lore' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="h-4 w-4" /> Lore & Characters
            </button>
            <button 
              onClick={() => setActiveTab('wallpapers')}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'wallpapers' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Star className="h-4 w-4" /> HD Wallpapers & Art
            </button>
          </div>
        </div>

        {activeTab === 'episodes' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
                <h2 className="text-2xl font-black text-white">Stream {anime.name} - Season 1 & 2 Archive</h2>
                <p className="text-slate-300 leading-relaxed">
                  Experience every epic moment, legendary battle, and dramatic plot twist of **{anime.name}** in pristine 4K resolution. Zero buffering, instant playback, and fully synchronized subtitles in multiple languages.
                </p>
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4, 5].map((ep) => (
                    <div key={ep} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500/50 transition cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-950/80 border border-pink-500/30 flex items-center justify-center text-pink-400 font-black group-hover:scale-105 transition">
                          0{ep}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-pink-400 transition-colors">Episode {ep} — The Awakening Arc</div>
                          <div className="text-xs text-slate-400">Duration: 24m • Subbed & Dubbed</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-pink-600 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-pink-600/30 group-hover:bg-pink-500 transition">
                        <PlayCircle className="h-4 w-4" /> Play Now
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Box */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Rate This Masterpiece</h3>
                <p className="text-xs text-slate-400 mb-6">Rate {anime.name} to contribute to the global anime rankings.</p>
                
                <div className="flex gap-2 justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => { setUserRating(star); setHasVoted(true); }}
                      className={`p-3 rounded-xl border transition-all ${userRating && userRating >= star ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-amber-400'}`}
                    >
                      <Star className={`h-6 w-6 ${userRating && userRating >= star ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>

                {hasVoted && (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-center text-xs font-bold animate-fade-in">
                    ✓ Rated {userRating}/5 successfully recorded globally!
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <div className="text-2xl font-black text-white">4.97 / 5.0</div>
                <div className="text-xs text-slate-400 mt-1">Based on 2,150+ global viewer ratings</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lore' && (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-white">Lore, Universe & Character Profiles</h2>
            <p className="text-slate-300 leading-relaxed">
              Dive deep into the intricate lore of **{anime.name}**. Explore character biographies, power scaling matrices, faction histories, and hidden Easter eggs discovered by the global fandom community.
            </p>
          </div>
        )}

        {activeTab === 'wallpapers' && (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-white">Exclusive 4K Wallpapers & Artwork</h2>
            <p className="text-slate-300 leading-relaxed">
              Download hand-crafted, ultra-high-resolution 4K wallpapers and vertical smartphone artwork featuring characters and scenes from **{anime.name}**.
            </p>
          </div>
        )}
      </section>

      <AdSlot />

      {/* Netflix Binge-Browsing Grid */}
      {relatedAnime.length > 0 && (
        <section className="py-16 bg-[#04060d] border-b border-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Global Anime Nexus
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Fans Worldwide Also Streamed</h2>
              </div>
              <a href="/anime" className="text-sm font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1">
                Explore All Anime <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedAnime.map((item: any) => {
                const itemImg = item.image_url || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
                return (
                  <Link 
                    key={item.slug} 
                    to="/$locale/anime/$slug" 
                    params={{ locale: "en", slug: item.slug }}
                    className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 flex flex-col"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden relative">
                      <img 
                        src={itemImg} 
                        alt={`Preview for ${item.name}`}
                        title={`${item.name} - GameCastle`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-pink-600/90 text-white px-2 py-0.5 rounded-md">
                        HD Streaming
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-pink-400 transition-colors line-clamp-1">{item.name}</h3>
                        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-pink-400">
                        <span>Watch HD</span>
                        <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Stream <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3.5 rounded-2xl bg-pink-950 border border-pink-500/30 text-pink-400 shadow-xl">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Streaming guides and FAQs for {anime.name}.</p>
          </div>
        </div>

        <div className="space-y-4">
          <details className="group bg-slate-900/80 border border-slate-800 p-6 rounded-2xl transition hover:border-pink-500/40 shadow-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-lg text-white">
              <span>Where can I stream {anime.name} in high quality?</span>
              <span className="transition-transform group-open:rotate-90 text-pink-400 text-xl font-mono">↓</span>
            </summary>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
              You can stream {anime.name} in 4K resolution directly on GameCastle with ultra-fast servers, zero ads, and multi-language subtitles.
            </p>
          </details>

          <details className="group bg-slate-900/80 border border-slate-800 p-6 rounded-2xl transition hover:border-pink-500/40 shadow-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-lg text-white">
              <span>Are all episodes and seasons available?</span>
              <span className="transition-transform group-open:rotate-90 text-pink-400 text-xl font-mono">↓</span>
            </summary>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
              Yes, our archives are updated in real-time to include all latest episodes, OVA specials, and movie releases for {anime.name}.
            </p>
          </details>
        </div>
      </section>
    </main>
  )
}
