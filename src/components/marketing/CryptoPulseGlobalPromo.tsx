import { ArrowRight, Crown, Sparkles, Trophy, Users, Zap } from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "CRYPTO INTELLIGENCE" },
  { icon: Sparkles, label: "TELEGRAM STARS" },
  { icon: Users, label: "REFERRAL NETWORK" },
  { icon: Trophy, label: "GLOBAL LEADERBOARD" },
  { icon: Crown, label: "VIP MILESTONES" },
];

export function CryptoPulseGlobalPromo() {
  return (
    <section aria-label="Sponsored CryptoPulse Pro promotion" className="relative isolate w-full overflow-hidden border-y border-purple-300/20 bg-[#05020a] text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_50%,rgba(139,92,246,.24),transparent_34%),radial-gradient(ellipse_at_82%_30%,rgba(34,211,238,.18),transparent_30%),linear-gradient(105deg,#020407_0%,#070b10_48%,#030406_100%)]" />
      <div aria-hidden className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div aria-hidden className="absolute left-[8%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-purple-400/20 blur-[90px] animate-pulse" />
      <div aria-hidden className="absolute right-[8%] top-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-[100px] animate-pulse" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-cyan-300 shadow-[0_0_24px_rgba(168,85,247,.85)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="relative min-h-[430px] overflow-hidden border border-white/10 bg-black/35 shadow-[0_30px_120px_-40px_rgba(139,92,246,.60)]">
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.95)_0%,rgba(0,0,0,.70)_48%,rgba(0,0,0,.30)_100%)]" />
          <div aria-hidden className="absolute right-[10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-cyan-300/10 shadow-[0_0_80px_rgba(34,211,238,.12),inset_0_0_80px_rgba(245,158,11,.08)]" />
          <div aria-hidden className="absolute right-[15%] top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border border-amber-300/20 animate-[spin_18s_linear_infinite]" />
          <div aria-hidden className="absolute right-[22%] top-[38%] h-3 w-3 rounded-full bg-purple-300 shadow-[0_0_35px_12px_rgba(168,85,247,.8)] animate-pulse" />
          <div aria-hidden className="absolute right-[31%] top-[63%] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_28px_10px_rgba(34,211,238,.7)] animate-pulse" />
          <svg aria-hidden className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1200 500" preserveAspectRatio="none">
            <path d="M720 245 L930 130 L1080 270 L900 385 L720 245 M930 130 L900 385 M780 330 L1030 190" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>

          <div className="relative z-10 flex min-h-[430px] flex-col justify-center p-7 sm:p-10 lg:w-[70%] lg:p-14 xl:p-16">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-amber-200">Sponsored partner</span>
              <span className="rounded-full border border-purple-300/30 bg-purple-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-purple-200">CRYPTOPULSE PRO</span>
            </div>
            <p className="mt-7 text-[11px] font-black uppercase tracking-[0.45em] text-purple-300">PLAY. SHARE. GROW.</p>
            <h2 className="mt-3 max-w-5xl text-5xl font-black leading-[.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-8xl">
              ENTER THE
              <span className="block bg-gradient-to-r from-purple-200 via-cyan-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,.22)]">NETWORK.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base lg:text-lg">Crypto intelligence, Telegram Stars rewards and a referral center and a Telegram referral center with personal links, network statistics, leaderboard, milestones and VIP levels.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {FEATURES.map(({ icon: Icon, label }) => <span key={label} className="inline-flex items-center gap-2 border border-white/10 bg-white/[.035] px-3 py-2 text-[9px] font-black tracking-wider text-white/75 backdrop-blur"><Icon className="h-3.5 w-3.5 text-purple-300" />{label}</span>)}
            </div>
            <div className="mt-8">
              <a href="https://t.me/CryptoPulseHubBot" target="_blank" rel="noopener noreferrer sponsored" className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 via-white to-cyan-100 px-7 py-4 text-xs font-black tracking-[0.16em] text-[#08040d] shadow-[0_0_55px_rgba(168,85,247,.4)] transition-all hover:scale-[1.03] hover:shadow-[0_0_70px_rgba(34,211,238,.45)]">🚀 ENTER THE NETWORK <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
            </div>
            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Build your network. Track your growth. Chase the next milestone.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
