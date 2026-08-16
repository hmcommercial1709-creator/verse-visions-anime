import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/trending')({
  component: GlobalEmpireHub,
});

// مصفوفات التوليد الكبرى لتغطية ملايين التركيبة المفتاحية (Long-tail Keywords)
const entities = ["Steam", "Roblox", "PUBG", "PlayStation", "Xbox", "Valorant", "Fortnite", "Razer Gold", "Nintendo", "Apex Legends"];
const actions = ["Buy", "Redeem", "Instant Code", "Free Generator Guide", "Crypto Discount", "Direct Delivery"];
const regions = ["Global", "USA", "EU", "UK", "MENA", "Asia", "LatAm", "Canada", "Australia"];
const years = ["2026", "2027"];

function GlobalEmpireHub() {
  // توليد مصفوفة ضخمة جداً من الاحتمالات والصفحات المستهدفة برمجياً
  const empirePages = entities.flatMap(entity => 
    actions.flatMap(action => 
      regions.map(region => ({
        keyword: `${action} ${entity} Gift Card ${region} ${years[0]}`,
        slug: `${entity.toLowerCase()}-${action.toLowerCase().replace(/ /g, '-')}-${region.toLowerCase()}`,
        image: `/assets/${entity.toLowerCase()}-digital-code.webp`,
        alt: `Official ${entity} digital gift card ${action} for ${region} region with instant delivery`,
        revenueTier: "High-Yield Affiliate / Crypto Checkout"
      }))
    )
  );

  return (
    <div className="bg-black text-slate-100 min-h-screen py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-purple-900/50 pb-10 text-center">
          <span className="bg-purple-600/30 text-purple-400 text-xs font-mono px-3 py-1 rounded-full uppercase tracking-widest">
            Hyper-Scale Programmatic Engine Active
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white mt-4 mb-6 leading-tight">
            Global Digital Asset & Entertainment Index
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Systematically capturing global search intent across billions of long-tail keyword combinations through autonomous algorithmic generation.
          </p>
          <div className="mt-8 inline-flex items-center gap-4 bg-slate-900/80 border border-slate-800 px-8 py-3 rounded-2xl">
            <span className="text-purple-400 font-bold text-xl">{empirePages.length * 1000}+</span>
            <span className="text-slate-400 text-sm font-medium">Algorithmic Index Variations Queued for Search Bots</span>
          </div>
        </header>

        {/* شبكة العرض الإمبراطورية الضخمة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {empirePages.slice(0, 40).map((page, index) => (
            <div key={index} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 hover:border-purple-500/50 transition flex flex-col justify-between">
              <div>
                <div className="overflow-hidden rounded-xl mb-4 bg-black h-32 flex items-center justify-center">
                  <img 
                    src={page.image} 
                    alt={page.alt} 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition duration-300"
                  />
                </div>
                <h2 className="text-base font-bold text-purple-300 mb-2 line-clamp-2">{page.keyword}</h2>
              </div>
              <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">/{page.slug}</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono">Optimized</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
