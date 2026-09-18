const LEADERBOARD = [
  { name: "NovaTrader", stars: "12,480 STARS" },
  { name: "CryptoWolf", stars: "9,760 STARS" },
  { name: "StarPilot", stars: "7,320 STARS" },
  { name: "PulseMaster", stars: "5,940 STARS" },
];

export function CryptoPulseGlobalPromo() {
  return (
    <section aria-label="Sponsored CryptoPulse Pro promotion" className="relative isolate w-full overflow-hidden border-y border-cyan-300/20 bg-[#020407] text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(34,211,238,.14),transparent_34%),radial-gradient(ellipse_at_80%_70%,rgba(245,158,11,.14),transparent_34%),linear-gradient(135deg,#010204_0%,#05070a_50%,#010204_100%)]" />
      <div aria-hidden className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div aria-hidden className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,.07),transparent_45%)]" />
      <div aria-hidden className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_28px_10px_rgba(34,211,238,.65)] animate-pulse" />
      <div aria-hidden className="absolute left-[28%] top-[68%] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_28px_10px_rgba(245,158,11,.65)] animate-pulse" />
      <div aria-hidden className="absolute right-[14%] top-[26%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_28px_10px_rgba(34,211,238,.65)] animate-pulse" />
      <div aria-hidden className="absolute right-[30%] top-[76%] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_28px_10px_rgba(245,158,11,.65)] animate-pulse" />
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 1200 760" preserveAspectRatio="none">
        <path d="M95 135 L335 515 L690 195 L1080 315 L875 650 L515 535 L690 195 M335 515 L875 650 M95 135 L690 195 M1080 315 L690 195" fill="none" stroke="url(#network)" strokeWidth="1.5" strokeDasharray="7 12" className="animate-[pulse_5s_ease-in-out_infinite]" />
        <defs><linearGradient id="network"><stop stopColor="#22d3ee"/><stop offset=".5" stopColor="#f5f3ff"/><stop offset="1" stopColor="#f59e0b"/></linearGradient></defs>
      </svg>
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-amber-300 shadow-[0_0_24px_rgba(34,211,238,.8)]" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-7 sm:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-black leading-[.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-8xl">
            💥 TURN YOUR NETWORK INTO A FORTUNE! Start Now &amp; Earn Thousands of STARS Daily.
          </h2>
          <p className="mx-auto mt-7 max-w-5xl text-base font-medium leading-relaxed text-white/75 sm:text-xl lg:text-2xl">
            The ultimate crypto intelligence tool is in your hands. Join for free, build your referral network, and watch Telegram Stars flow endlessly. Don&apos;t miss the digital gold rush!
          </p>
          <a href="https://t.me/CryptoPulseHubBot" target="_blank" rel="noopener noreferrer sponsored" className="mt-9 flex w-full items-center justify-center rounded-none bg-gradient-to-r from-amber-100 via-white to-cyan-100 px-6 py-6 text-base font-black tracking-[0.08em] text-[#020407] shadow-[0_0_65px_rgba(34,211,238,.35),0_0_90px_rgba(245,158,11,.2)] animate-pulse transition-transform hover:scale-[1.01] sm:text-xl">
            🚀 ENTER THE NETWORK FOR FREE
          </a>
        </div>

        <div className="mx-auto mt-12 max-w-4xl border border-cyan-300/20 bg-black/55 p-5 shadow-[0_0_80px_rgba(34,211,238,.12)] backdrop-blur sm:p-7">
          <div className="mb-5 text-center">
            <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-amber-200 via-white to-cyan-200 bg-clip-text sm:text-3xl">GLOBAL LEADERBOARD</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">Demo leaderboard — sample figures for the current landing-page design</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {LEADERBOARD.map((row, index) => (
              <div key={row.name} className="flex items-center justify-between border border-white/10 bg-white/[.025] px-4 py-4">
                <span className="font-black text-cyan-200">#{index + 1} {row.name}</span>
                <span className="font-black text-amber-200">{row.stars}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-5 max-w-4xl text-center text-[11px] leading-relaxed text-white/35">Sponsored partner. Leaderboard figures above are demonstration data, not verified live earnings.</p>
      </div>
    </section>
  );
}
