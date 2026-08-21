import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/$locale/store')({
  component: GlobalAffiliateHub,
})

const AFFILIATE_PRODUCTS = [
  { id: 1, name: "Steam Gift Card $50", price: "48.99", provider: "Gamivo", link: "https://www.gamivo.com/product/your-ref-link-here" },
  { id: 2, name: "PlayStation Plus 12 Months", price: "59.99", provider: "Amazon", link: "https://www.amazon.com/your-ref-link" },
  { id: 3, name: "Xbox Game Pass Ultimate", price: "16.99", provider: "Gamivo", link: "https://www.gamivo.com/product/your-ref-link-here" },
];

function GlobalAffiliateHub() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = AFFILIATE_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 p-6 md:p-12 font-sans selection:bg-emerald-500">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold tracking-widest uppercase">
            Global Digital Marketplace
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">GameCastle Digital Vault</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Instant digital delivery, verified affiliate partner keys, and automated routing.</p>
          
          <div className="max-w-lg mx-auto pt-4">
            <input
              type="text"
              placeholder="Search verified catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500 text-white placeholder-slate-500 shadow-2xl transition"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/50 transition flex flex-col justify-between shadow-xl">
              <div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">PARTNER: {p.provider}</div>
                <h3 className="text-lg font-bold text-white mb-3">{p.name}</h3>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 mb-6">${p.price} <span className="text-xs font-normal text-slate-400">USD</span></div>
                <a 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-center font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-600/20"
                >
                  Acquire Key ⚡
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
