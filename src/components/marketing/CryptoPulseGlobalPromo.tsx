import { ArrowRight, Crown, Sparkles, Trophy, Users, Zap } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, label: "Crypto Intelligence" },
  { icon: Zap, label: "Telegram Stars" },
  { icon: Users, label: "Referral Network" },
  { icon: Trophy, label: "Global Leaderboard" },
  { icon: Crown, label: "VIP Milestones" },
];

export function CryptoPulseGlobalPromo() {
  return (
    <section aria-label="Sponsored CryptoPulse Pro promotion" className="relative isolate overflow-hidden border-y border-purple-400/15 bg-[#05040a] text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,.20),transparent_28%),radial-gradient(circle_at_88%_75%,rgba(34,211,238,.14),transparent_30%)]" />
      <div aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(168,85,247,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="mx-auto max-w-7xl px-4 py-5 sm:py-7 lg:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-purple-500/[0.08] via-black/40 to-cyan-400/[0.06] shadow-[0_25px_100px_-35px_rgba(139,92,246,.65)] backdrop-blur-xl">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-cyan-300" />
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:p-9">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-amber-200">Sponsored partner</span>
                <span className="rounded-full border border-purple-300/25 bg-purple-300/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-purple-200">CryptoPulse Pro × GameCastle</span>
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300/80">PLAY. SHARE. GROW.</p>
              <h2 className="mt-2 max-w-2xl font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl lg:text-5xl">From player <span className="bg-gradient-to-r from-purple-200 via-cyan-200 to-amber-200 bg-clip-text text-transparent">to network builder.</span></h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">Enter CryptoPulse Pro for crypto intelligence, Telegram Stars rewards and a referral center with a personal link, network statistics, leaderboard, milestones and VIP levels.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FEATURES.map(({ icon: Icon, label }) => <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-[10px] font-semibold text-white/80"><Icon className="h-3.5 w-3.5 text-purple-300" /> {label}</span>)}
              </div>
            </div>
            <div className="relative min-h-[190px] overflow-hidden rounded-2xl border border-purple-300/15 bg-purple-400/[0.04] p-5">
              <div aria-hidden className="absolute inset-0">
                <div className="absolute left-[15%] top-[48%] h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_22px_7px_rgba(168,85,247,.5)]" />
                <div className="absolute left-[50%] top-[20%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_22px_7px_rgba(34,211,238,.45)]" />
                <div className="absolute left-[78%] top-[52%] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_20px_6px_rgba(245,158,11,.4)] />
                <div className="absolute left-[48%] top-[78%] h-2 w-2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,.25)] />
                <svg className="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 500 220" preserveAspectRatio="none"><path d="M70 105 L250 45 L390 112 L240 172 L70 105 M250 45 L240 172" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">Global network map</span><span className="inline-flex items-center gap-1 text-[9px] font-semibold text-cyan-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> ONLINE</span></div>
                <div><div className="text-4xl font-black tracking-tight">✦</div><div className="mt-1 text-xs font-semibold text-white/70">Stars • Referrals • VIP</div><div className="mt-3 grid grid-cols-3 gap-2">{["STARS","REFERRALS","VIP"].map((x) => <div key={x} className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center text-[8px] font-bold tracking-wider text-white/55">{x}</div>)}</div></div>
                <div className="mt-4 flex items-center justify-between gap-3"><span className="text-[10px] text-white/45">Build your network. Track your growth.</span><a href="https://t.me/CryptoPulseHubBot" target="_blank" rel="noopener noreferrer sponsored" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-purple-200 via-white to-cyan-100 px-4 py-2.5 text-[10px] font-black text-[#090711] shadow-[0_10px_35px_-10px_rgba(168,85,247,.75)] transition-transform hover:scale-[1.04]">🚀 ENTER THE NETWORK <ArrowRight className="h-3.5 w-3.5" /></a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
