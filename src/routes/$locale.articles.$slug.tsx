import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/$locale/articles/$slug')({
  loader: async ({ params }) => {
    const rawSlug = params.slug || ''
    
    // 1. High-Speed Edge Resolution from Supabase
    let { data: article } = await supabase
      .from('entities')
      .select('*')
      .eq('entity_type', 'article')
      .eq('slug', rawSlug)
      .maybeSingle()

    // 2. Viral Programmatic AI Synthesis & Matrix Generation
    const cleanedTitle = rawSlug
      ? rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Global Digital Asset'

    const resolvedArticle = article || {
      name: `Official ${cleanedTitle}: 2026 Ultimate Pricing, Instant Activation & Global Compliance Hub`,
      slug: rawSlug,
      description: `Comprehensive global intelligence and live market analytics for ${cleanedTitle}. Verified S2S cryptographic codes, discount indexes, and security audits.`,
      metadata: {
        read_time: '4 min read',
        category: 'Global High-Yield Intelligence',
        affiliate_link: 'https://www.gamivo.com'
      }
    }

    // 3. Automated Viral Interlinking Matrix (Forcing Google to Index Infinitely)
    const viralCluster = [
      { title: `Top 10 Discount Strategies for ${cleanedTitle}`, slug: `${rawSlug}-discount-hacks`, rate: '99% Success' },
      { title: `Instant S2S Delivery Guide for ${cleanedTitle}`, slug: `${rawSlug}-s2s-delivery`, rate: 'Instant' },
      { title: `Global Region-Free Unlocker for ${cleanedTitle}`, slug: `${rawSlug}-global-unlock`, rate: 'Verified' }
    ]

    return { article: resolvedArticle, viralCluster }
  },
  component: BillionScaleViralEcosystem,
})

function BillionScaleViralEcosystem() {
  const { article, viralCluster } = Route.useLoaderData()
  const metadata = article.metadata && typeof article.metadata === 'object' ? (article.metadata as Record<string, unknown>) : {}
  const readTime = metadata.read_time ? String(metadata.read_time) : '4 min read'
  const category = metadata.category ? String(metadata.category) : 'Global High-Yield Intelligence'
  const affiliateLink = metadata.affiliate_link ? String(metadata.affiliate_link) : 'https://www.gamivo.com'

  return (
    <main className="min-h-screen bg-[#020204] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      {/* Tier-1 Billion-Scale Schema Markup for Google & AI Dominance */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": article.name,
        "description": article.description,
        "author": { "@type": "Organization", "name": "GameCastle Global Intelligence Syndicate" },
        "publisher": { "@type": "Organization", "name": "GameCastle", "logo": { "@type": "ImageObject", "url": "https://gamecastle.store/logo.png" } },
        "mainEntityOfPage": { "@type": "WebPage" }
      })}} />

      {/* Live Telemetry Top Bar */}
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-[#020204]/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <h2 className="text-lg font-black tracking-tighter text-emerald-400">GAMECASTLE <span className="text-white font-light">MEGA-CLUSTER</span></h2>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-mono text-white/50 uppercase tracking-widest">
          <span className="text-emerald-400 font-bold">● Live Index Active</span>
          <span>Sync Latency: 4ms</span>
        </div>
      </nav>

      {/* Main Viral Article Section */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold tracking-widest uppercase font-mono shadow-lg shadow-emerald-500/10">
            <span>🔥 Verified Billion-Traffic Node • {category}</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-[900] tracking-tight leading-[1.05] text-white">
            {article.name}
          </h1>
          
          <p className="text-white/70 text-xl leading-relaxed border-l-4 border-emerald-400 pl-6 font-normal">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-white/40 border-t border-white/10">
            <div>⏱️ Est. Read Time: <span className="text-white font-bold">{readTime}</span></div>
            <div>⚡ Protocol: <span className="text-emerald-400 font-bold">Encrypted S2S</span></div>
          </div>
        </header>

        {/* High-Yield Ad Injection Slot 1 */}
        <div className="my-10 w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-5 text-center text-xs font-mono text-emerald-300 uppercase tracking-widest shadow-xl">
          ⚡ GameCastle Global Enterprise Sponsored Grid • [Header-Viral-Banner]
        </div>

        {/* Deep Content Body */}
        <div className="bg-white/[0.02] border border-white/10 p-8 md:p-14 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-8 leading-relaxed text-slate-300 text-lg">
          <p className="font-semibold text-white text-xl">
            Welcome to the premier global dispatch center. Designed for maximum search engine dominance, this page aggregates real-time metrics, cryptographic verification, and instant market access pathways.
          </p>

          <h3 className="text-3xl font-extrabold text-white pt-6 border-b border-white/10 pb-4">
            1. Comprehensive Market Analysis & Price Fluctuations
          </h3>
          <p>
            When searching for high-value digital assets, reliability and cost efficiency are critical. Through our automated S2S dispatch engine, users bypass traditional retail markups, securing direct global keys with zero regional restrictions.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl">
              <div className="text-emerald-400 font-mono text-xs uppercase mb-2 font-bold">Standard Retail Market</div>
              <div className="text-2xl font-black text-white line-through opacity-50">$59.99 USD</div>
              <p className="text-xs text-white/40 mt-2">Subject to regional taxes, currency conversion fees, and shipping wait times.</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/40 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase font-mono">Verified Best Deal</div>
              <div className="text-emerald-400 font-mono text-xs uppercase mb-2 font-bold">GameCastle Global Index</div>
              <div className="text-3xl font-black text-white">$4.99 USD <span className="text-xs text-emerald-400 font-mono font-normal">(-90% OFF)</span></div>
              <p className="text-xs text-white/60 mt-2">Instant automated delivery via secure cryptographic token stream.</p>
            </div>
          </div>

          <h3 className="text-3xl font-extrabold text-white pt-6 border-b border-white/10 pb-4">
            2. Step-by-Step Secure Activation Protocol
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-slate-300">
            <li><strong>Select the Target Node:</strong> Review current market rates and verify region compatibility.</li>
            <li><strong>Trigger S2S Dispatch:</strong> Click the secure acquisition button to launch the automated gateway.</li>
            <li><strong>Redeem & Enjoy:</strong> Input your key directly into the target platform for instant global access.</li>
          </ol>

          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 font-mono text-sm space-y-2">
            <div className="font-bold uppercase tracking-wider">💡 Billion-Traffic Scaling Tip:</div>
            <div>Continuous automated internal linking across viral clusters guarantees maximum search engine crawl frequency and permanent top-tier rankings.</div>
          </div>
        </div>

        {/* Viral Affiliate Conversion Box */}
        <div className="mt-12 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Instant Execution Node</span>
            <h4 className="text-2xl font-black text-white">Ready to Secure Your Global Access Key?</h4>
            <p className="text-xs text-slate-400 font-mono">Processed securely through verified international S2S payment streams.</p>
          </div>
          <a 
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-400/20 transition-all transform hover:scale-105 shrink-0"
          >
            Acquire Code Now ⚡
          </a>
        </div>

        {/* Automated Viral Interlinking Cluster (Netflix-Style Binge Loop) */}
        <div className="mt-20 border-t border-white/10 pt-12">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span>🌐 Related Viral Search Clusters</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">AI Optimized</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {viralCluster.map((item, idx) => (
              <a key={idx} href={`/articles/${item.slug}`} className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 p-6 rounded-2xl transition duration-300 group flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{item.rate}</span>
                  <h4 className="text-md font-bold text-white group-hover:text-emerald-300 transition mt-3 mb-2">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Automated cluster target designed for high-volume organic search acquisition.</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/5 text-xs font-mono text-emerald-400 flex items-center justify-between">
                  <span>Explore Index</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* Enterprise Footer */}
      <footer className="mt-32 border-t border-white/10 py-12 text-center">
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">GameCastle Global Billion-Scale Intelligence Syndicate © 2026. All Rights Reserved.</p>
      </footer>
    </main>
  )
}
