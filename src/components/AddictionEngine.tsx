import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AddictionEngineProps {
  initialSlug: string;
  initialData: {
    name: string;
    description: string;
    target_market?: string;
    target_language?: string;
    aggregate_rating?: number;
  };
}

export function AddictionEngine({ initialSlug, initialData }: AddictionEngineProps) {
  const [streamItems, setStreamItems] = useState<any[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    async function fetchInfiniteMatrixStream() {
      const { data } = await supabase
        .from('game_nexus_matrix')
        .select('slug, title, sample_review, target_market')
        .limit(9);
      if (data) setStreamItems(data);
    }
    fetchInfiniteMatrixStream();
  }, [initialSlug]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      {/* High-Impact Conversion & Dopamine Trigger Box */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-8 rounded-3xl shadow-2xl border border-pink-500/40 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-pink-600 text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
          {initialData?.target_market || 'Global Verified'}
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight leading-tight">{initialData?.name}</h1>
        <p className="text-gray-300 text-lg mb-6 leading-relaxed">{initialData?.description}</p>
        
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            onClick={() => { navigator.clipboard.writeText(initialSlug); setUnlocked(true); }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer">
            {unlocked ? '✨ Code Unlocked & Copied Successfully!' : '🔓 Reveal Secret Key & Instant Access'}
          </button>
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-950/40 px-4 py-2 rounded-xl border border-green-500/20">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            <span>Over 18,400 users interacted with this code today</span>
          </div>
        </div>
      </div>

      {/* Infinite Discovery & Addiction Stream */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 text-pink-400 flex items-center gap-2">
          <span>⚡ Continuous Discovery Stream (Recommended For You)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {streamItems.map((item) => (
            <a 
              key={item.slug} 
              href={`/en/codes/${item.slug}`} 
              className="bg-gray-900/90 hover:bg-gray-800/90 p-5 rounded-2xl border border-gray-800 hover:border-pink-500/60 transition-all duration-300 shadow-lg group block">
              <span className="text-xs text-purple-400 font-semibold uppercase">{item.target_market || 'Verified Region'}</span>
              <h4 className="font-bold text-base my-2 text-white group-hover:text-pink-300 transition-colors line-clamp-1">{item.title}</h4>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.sample_review || 'Click for instant access, code decoding, and verified digital key retrieval.'}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
