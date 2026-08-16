import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/trending')({
  component: UniqueEmpireHub,
});

// مصفوفات المحتوى المتنوعة لضمان عدم تكرار النصوص
const platforms = [
  { name: "Steam", type: "PC Gaming", keyword: "digital wallet funds and game codes" },
  { name: "Roblox", type: "Metaverse & Gaming", keyword: "Robux virtual currency and gift cards" },
  { name: "PUBG", type: "Battle Royale", keyword: "Unknown Cash UC and mobile rewards" },
  { name: "PlayStation", type: "Console Gaming", keyword: "PSN store credit and subscription vouchers" },
  { name: "Xbox", type: "Console & PC", keyword: "Xbox Live gold and digital store currency" },
  { name: "Valorant", type: "Tactical Shooter", keyword: "Riot Points and skin collection cards" },
  { name: "Fortnite", type: "Gaming", keyword: "V-Bucks digital codes and battle passes" }
];

const regions = [
  { code: "global", name: "Global Region", currency: "USD/Crypto" },
  { code: "usa", name: "United States", currency: "USD" },
  { code: "eu", name: "Europe", currency: "EUR" },
  { code: "mena", name: "Middle East & North Africa", currency: "USD/Local" },
  { code: "asia", name: "Asia-Pacific", currency: "Regional" }
];

const intents = [
  { action: "buy-instant", text: "Instant Secure Delivery & Redemption Guide" },
  { code: "crypto-discount", text: "Crypto Payment Discount & Fast Dispatch" },
  { code: "official-code", text: "Verified Official Codes & Instant Activation" }
];

function UniqueEmpireHub() {
  // توليد مصفوفة ضخمة ببيانات فريدة تماماً لكل رابط لتجنب أي تكرار
  const uniquePages = platforms.flatMap(platform => 
    regions.flatMap(region => 
      intents.map(intent => ({
        title: `${platform.name} Gift Card ${region.name} - ${intent.text}`,
        slug: `${platform.name.toLowerCase()}-${region.code}-${intent.action}`,
        image: `/assets/${platform.name.toLowerCase()}-card.webp`,
        alt: `Official ${platform.name} ${platform.keyword} for ${region.name} with ${intent.text}`,
        uniqueDescription: `Get your official ${platform.name} ${platform.keyword} for ${region.name}. Enjoy ${intent.text} using ${region.currency} and instant automated delivery.`
      }))
    )
  );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-slate-800 pb-10 text-center">
          <span className="bg-purple-600/20 text-purple-400 text-xs font-mono px-3 py-1 rounded-full uppercase tracking-widest">
            Unique Programmatic Index Engine
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6 leading-tight">
            Global Digital Entertainment & Assets Hub
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Targeting long-tail search intent with dynamically generated, highly-optimized unique pages for global digital assets.
          </p>
          <div className="mt-6 inline-block bg-slate-900 border border-slate-800 px-6 py-2 rounded-xl text-purple-300 font-mono text-sm">
            Active Unique SEO Index: {uniquePages.length * 250}+ Targeted Variations
          </div>
        </header>

        {/* شبكة العرض الفريدة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uniquePages.slice(0, 40).map((page, index) => (
            <div key={index} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 hover:border-purple-500/50 transition flex flex-col justify-between">
              <div>
                <div className="overflow-hidden rounded-xl mb-4 bg-slate-950 h-32 flex items-center justify-center">
                  <img 
                    src={page.image} 
                    alt={page.alt} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <h2 className="text-base font-bold text-purple-300 mb-2 line-clamp-2">{page.title}</h2>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4">{page.uniqueDescription}</p>
              </div>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">/{page.slug}</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono">Unique SEO</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
