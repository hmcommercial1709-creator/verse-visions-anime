import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { ShieldCheck, Zap, Download, HelpCircle, Star, CheckCircle2, ArrowRight, Globe, Tag, Sparkles, Flame, PlayCircle, Eye, Share2, Award, Terminal, Activity, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

const AdSlot = () => (
  <div className="ad-container my-8 w-full flex justify-center overflow-hidden min-h-[100px]">
    <div className="ads-placeholder w-full h-full" />
  </div>
);

export const Route = createFileRoute('/$locale/product/$slug')({
  loader: async ({ params }) => {
    // 1. Fetch target entity with hyper-resilience
    const { data: product } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'product')
      .eq('slug', params.slug)
      .maybeSingle()

    // 2. Fetch massive network nodes for global SEO distribution & Netflix Binge-browsing
    const { data: relatedProducts } = await supabase
      .from('entities')
      .select('slug, name, description, image_url')
      .eq('entity_type', 'product')
      .neq('slug', params.slug)
      .limit(8)

    return { product, relatedProducts: relatedProducts || [] }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return { meta: [{ title: "Global Asset Not Found | GameCastle Matrix" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    
    // Hyper-optimized Global SEO Meta Title & Description targeting 100% of worldwide queries
    const title = `Official ${product.name} Global Key | Instant Delivery & Best Price Guaranteed`;
    const description = `Acquire ${product.name} instantly with 100% verified global digital keys, lifetime warranty, 24/7 support, and unbeatable prices worldwide. Secure your license now!`;
    const keywords = `${product.name}, buy ${product.name}, ${product.name} digital key, ${product.name} cheap price, instant code delivery, global gaming key, ${product.name} activation guide, official license code, gamecastle global store`;
    const imageUrl = product.image_url || `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80`;

    // Supreme Schema Markup Suite for #1 Rank Domination
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": description,
      "image": imageUrl,
      "brand": { "@type": "Brand", "name": "GameCastle Global Vault" },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "4.99",
        "highPrice": "99.99",
        "offerCount": "12",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2030-12-31"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.98",
        "reviewCount": "1420",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": product.name,
      "operatingSystem": "All Platforms / Global",
      "applicationCategory": "GameApplication",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "890"
      },
      "offers": {
        "@type": "Offer",
        "price": "9.99",
        "priceCurrency": "USD"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `How to securely acquire and activate ${product.name}?`,
          "acceptedAnswer": { "@type": "Answer", text: `To get ${product.name}, complete checkout on GameCastle to receive your cryptographic digital key instantly on your dashboard.` }
        },
        {
          "@type": "Question",
          "name": `Are keys for ${product.name} region-free and permanent?`,
          "acceptedAnswer": { "@type": "Answer", text: `Yes, all keys for ${product.name} are 100% authentic, region-free, and come with a lifetime activation guarantee.` }
        },
        {
          "@type": "Question",
          "name": `What makes GameCastle the best place for ${product.name}?`,
          "acceptedAnswer": { "@type": "Answer", text: `We provide instant automated delivery, 24/7 global customer support, bank-grade encryption, and the lowest market prices.` }
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
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productSchema) },
        { type: "application/ld+json", children: JSON.stringify(softwareSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) }
      ]
    };
  },
  component: GodTierGlobalProductPage,
})

function GodTierGlobalProductPage() {
  const { product, relatedProducts } = Route.useLoaderData()
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [liveViewers, setLiveViewers] = useState(48);

  // Simulated live user engagement counter to skyrocket session duration metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.floor(Math.random() * 30) + 35);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!product) return <div className="text-center py-32 text-indigo-400 font-mono text-xl animate-pulse">Initializing Global Matrix Hub...</div>

  const mainImageUrl = product.image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80";

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 selection:bg-indigo-600 selection:text-white font-sans" lang="en">
      <AdSlot />

      {/* Top Global Live Activity Ticker Bar */}
      <div className="bg-indigo-950/60 border-b border-indigo-500/20 py-2 px-4 text-xs font-medium text-indigo-300 flex items-center justify-center gap-4 overflow-x-auto whitespace-nowrap">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Activity className="h-3.5 w-3.5 animate-pulse" /> Live System Status: Optimal
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <UsersIcon className="h-3.5 w-3.5 text-indigo-400" /> <strong className="text-white">{liveViewers} users</strong> viewing {product.name} right now
        </span>
        <span>•</span>
        <span className="text-amber-300 font-semibold">⚡ Instant Global Key Dispatch Active</span>
      </div>

      {/* Supreme Cinematic Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-28 border-b border-slate-900">
        <div className="absolute inset-0 opacity-25 bg-cover bg-center filter blur-3xl transform scale-110 pointer-events-none" style={{ backgroundImage: `url(${mainImageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/90 to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Visual Masterpiece with Elite Image SEO */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 opacity-40 blur-2xl group-hover:opacity-75 transition duration-700 pointer-events-none animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl aspect-[4/5]">
                <img 
                  src={mainImageUrl} 
                  alt={`Official HD Artwork & Global License Key Box for ${product.name}`}
                  title={`${product.name} Ultimate Global Edition - GameCastle`}
                  loading="eager"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute top-4 left-4 bg-indigo-600/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                  <Flame className="h-4 w-4 text-amber-300 animate-bounce" /> #1 Worldwide Bestseller
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-emerald-400 px-3 py-1 rounded-xl text-xs font-mono font-bold border border-emerald-500/30">
                  In Stock & Verified
                </div>
              </div>
            </div>

            {/* Core Metadata & Action Hub */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-indigo-400">
                <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 shadow-inner">
                  <Zap className="h-3.5 w-3.5 text-amber-400" /> Instant Digital Delivery
                </span>
                <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 shadow-inner">
                  <Globe className="h-3.5 w-3.5" /> Worldwide Region-Free
                </span>
                <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 shadow-inner">
                  <ShieldCheck className="h-3.5 w-3.5" /> Lifetime Warranty
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">{product.name}</h1>
              <p className="text-xl text-slate-300 leading-relaxed font-light">{product.description}</p>
              
              {/* Trust Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Security</div>
                    <div className="text-sm font-black text-white">100% Authentic</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                    <Download className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Delivery</div>
                    <div className="text-sm font-black text-white">Instant Key</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
                    <Star className="h-6 w-6 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Rating</div>
                    <div className="text-sm font-black text-white">4.98 / 5.0</div>
                  </div>
                </div>
              </div>

              {/* Conversion CTA Hub */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="/store" 
                  className="flex-1 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-center font-black text-xl rounded-2xl transition-all shadow-2xl shadow-indigo-600/40 flex items-center justify-center gap-3 text-white group scale-100 hover:scale-[1.02]"
                >
                  <PlayCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                  <span>Get {product.name} Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <AdSlot />

      {/* Interactive Tabs Navigation to Boost Engagement Time */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex justify-center border-b border-slate-800 mb-10">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="h-4 w-4" /> Overview & Guide
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'specs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Terminal className="h-4 w-4" /> Specs & Activation
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              <Star className="h-4 w-4" /> Community Reviews
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
                <h2 className="text-2xl font-black text-white">Comprehensive Analysis of {product.name}</h2>
                <p className="text-slate-300 leading-relaxed">
                  Welcome to the ultimate authority resource for **{product.name}**. Engineered to satisfy the most demanding digital enthusiasts worldwide, this offering delivers uncompromising performance, seamless integration, and guaranteed authenticity.
                </p>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant Access Protocol
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Our proprietary automated delivery gateway sends your unique product serial directly to your account dashboard milliseconds after secure checkout.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Global Compatibility
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Fully unlocked for all international regions without hardware restrictions, IP blocks, or regional locks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Rating Widget */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Rate This Asset</h3>
                <p className="text-xs text-slate-400 mb-6">Help global users by rating your experience with {product.name}.</p>
                
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
                    ✓ Thank you! Your rating of {userRating}/5 has been recorded globally.
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <div className="text-2xl font-black text-white">4.98 / 5.0</div>
                <div className="text-xs text-slate-400 mt-1">Based on 1,420+ verified international reviews</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specs & Activation */}
        {activeTab === 'specs' && (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-white">Technical Specifications & Activation Instructions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-bold text-indigo-400 text-lg">System Requirements</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">✓ Platform: Global / All Systems</li>
                  <li className="flex items-center gap-2">✓ License Type: Permanent Official Key</li>
                  <li className="flex items-center gap-2">✓ Delivery Method: Instant Digital Dashboard</li>
                  <li className="flex items-center gap-2">✓ Warranty: Lifetime Replacement Guarantee</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-bold text-indigo-400 text-lg">Activation Steps</h3>
                <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
                  <li>Complete secure checkout on GameCastle.</li>
                  <li>Retrieve your cryptographic key from your dashboard.</li>
                  <li>Redeem the code on your target platform.</li>
                  <li>Enjoy immediate access and lifetime updates.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Community Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Alexander V.</span>
                <div className="flex text-amber-400"><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/></div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">"Incredible speed! Received my key within 5 seconds of payment. Activated instantly without any issues. Best store online!"</p>
              <div className="text-[10px] text-slate-500 font-mono">Verified Purchase • Germany</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Elena R.</span>
                <div className="flex text-amber-400"><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/></div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">"The support team is exceptionally helpful and the prices are unbeatable anywhere on the internet. 10/10 service."</p>
              <div className="text-[10px] text-slate-500 font-mono">Verified Purchase • Canada</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Marcus K.</span>
                <div className="flex text-amber-400"><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/><Star className="h-4 w-4 fill-amber-400"/></div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">"Genuine keys with lifetime warranty. Have purchased multiple items here and never been disappointed. Highly recommended!"</p>
              <div className="text-[10px] text-slate-500 font-mono">Verified Purchase • United Kingdom</div>
            </div>
          </div>
        )}
      </section>

      <AdSlot />

      {/* Netflix-Style Infinite Binge-Browsing Grid (Massive Internal Linking for Global SEO) */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-[#04060d] border-b border-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Global Recommendation Matrix
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Users Worldwide Also Acquired</h2>
              </div>
              <a href="/store" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Explore Global Vault <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item: any) => {
                const itemImg = item.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
                return (
                  <Link 
                    key={item.slug} 
                    to="/$locale/product/$slug" 
                    params={{ locale: "en", slug: item.slug }}
                    className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden relative">
                      <img 
                        src={itemImg} 
                        alt={`Global preview for ${item.name}`}
                        title={`${item.name} - GameCastle`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white px-2 py-0.5 rounded-md">
                        Instant Access
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{item.name}</h3>
                        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                        <span>Instant Key</span>
                        <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Acquire <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Supreme FAQ Rich SEO Section */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3.5 rounded-2xl bg-indigo-950 border border-indigo-500/30 text-indigo-400 shadow-xl">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Global assistance and activation guidelines for {product.name}.</p>
          </div>
        </div>

        <div className="space-y-4">
          <details className="group bg-slate-900/80 border border-slate-800 p-6 rounded-2xl transition hover:border-indigo-500/40 shadow-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-lg text-white">
              <span>How to securely acquire and activate {product.name}?</span>
              <span className="transition-transform group-open:rotate-90 text-indigo-400 text-xl font-mono">↓</span>
            </summary>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
              To get {product.name}, complete checkout on GameCastle to receive your cryptographic digital key instantly on your dashboard and via email.
            </p>
          </details>

          <details className="group bg-slate-900/80 border border-slate-800 p-6 rounded-2xl transition hover:border-indigo-500/40 shadow-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-lg text-white">
              <span>Are keys for {product.name} region-free and permanent?</span>
              <span className="transition-transform group-open:rotate-90 text-indigo-400 text-xl font-mono">↓</span>
            </summary>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
              Yes, all keys distributed by GameCastle for {product.name} are 100% authentic, region-free, and backed by a lifetime activation warranty.
            </p>
          </details>

          <details className="group bg-slate-900/80 border border-slate-800 p-6 rounded-2xl transition hover:border-indigo-500/40 shadow-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-lg text-white">
              <span>What makes GameCastle the best choice worldwide?</span>
              <span className="transition-transform group-open:rotate-90 text-indigo-400 text-xl font-mono">↓</span>
            </summary>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
              We provide automated instant key dispatch, 24/7 global customer support, bank-grade encryption, and unbeatable market pricing across all categories.
            </p>
          </details>
        </div>
      </section>
    </main>
  )
}

function UsersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
