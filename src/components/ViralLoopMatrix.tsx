import { useState } from "react";

export function ViralLoopMatrix() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://gamecastle.store/ar/anime?ref=elite_master";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnPinterest = () => {
    const url = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(referralLink)}&description=${encodeURIComponent("Join the ultimate anime multiverse and gaming hub on GameCastle! 🔥")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 rounded-3xl border border-primary/40 bg-card/90 backdrop-blur-2xl shadow-2xl space-y-6 my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
            ⚡ Viral Growth Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            Sovereign Referral & Viral Matrix
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs">
          Invite fellow gamers and anime fans. Every unique click supercharges our global search ranking and grants you instant XP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-background/50 border border-border space-y-3">
          <label className="text-xs font-bold text-muted-foreground block">Your Unique Multiverse Portal Link</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-primary font-mono focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-primary text-primary-foreground font-black rounded-xl text-xs whitespace-nowrap hover:opacity-90 transition"
            >
              {copied ? "Copied! ✨" : "Copy Link"}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-background/50 border border-border space-y-3 flex flex-col justify-between">
          <label className="text-xs font-bold text-muted-foreground block">Instant Pinterest & Social Broadcast</label>
          <div className="flex gap-3">
            <button 
              onClick={shareOnPinterest}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 font-bold text-xs hover:bg-red-600/30 transition flex items-center justify-center gap-2"
            >
              📌 Pin to Pinterest
            </button>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out GameCastle - The absolute global anime multiverse & gaming hub! ⚡")}&url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold text-xs hover:bg-blue-500/30 transition flex items-center justify-center gap-2"
            >
              🐦 Share on X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
