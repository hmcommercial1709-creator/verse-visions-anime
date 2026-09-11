import { useEffect, useRef, useState } from "react";

/** The homepage renders no game engine, audio or iframe until an explicit click. */
export function HarborGame() {
  const [source, setSource] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState<number | null>(null);
  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !frame.current || event.source !== frame.current.contentWindow) return;
      if (event.data?.type === "harbor:resize" && Number.isFinite(event.data.height)) {
        setFrameHeight(Math.min(3000, Math.max(400, event.data.height)));
      }
    };
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);
  const launch = () => {
    const challenge = new URLSearchParams(window.location.search).get("challenge");
    setSource(`/harbor/index.html${challenge && /^\d{1,9}$/.test(challenge) ? `?challenge=${challenge}` : ""}`);
  };
  return (
    <section id="harbor-island" dir="rtl" aria-label="لعبة جزيرة الميناء" className="relative overflow-hidden border-b border-emerald-300/20 bg-[#081e2c] text-white">
      {source ? (
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-center justify-between gap-4 px-4 py-2 text-xs text-emerald-100">
            <span>جزيرة الميناء · تقدمك محفوظ على هذا المتصفح</span>
            <button onClick={() => { if (window.confirm("إغلاق اللعبة؟ تقدم البناء محفوظ، لكن المعركة الحالية لن تُحفظ.")) setSource(null); }} className="rounded-lg border border-white/20 px-3 py-2">إغلاق اللعبة</button>
          </div>
          <iframe ref={frame} src={source} title="جزيرة الميناء — لعبة بناء ومعارك بحرية" style={frameHeight ? { height: frameHeight } : undefined} className="block h-[1180px] w-full border-0 min-[801px]:h-[760px]" allow="autoplay; fullscreen; clipboard-write; web-share" allowFullScreen />
        </div>
      ) : (
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-16">
          <div className="relative z-10">
            <p className="mb-4 text-xs font-bold tracking-[.2em] text-emerald-300">GAMECASTLE ORIGINAL · HARBOR ISLAND</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">جزيرتك. رايتك.<br /><span className="text-[#ffd291]">أسطورتك تبدأ هنا.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">ابنِ ميناءك، طوّر مدفعك، وصدّ الأسطول القادم. اختر اسم القائد وتحدَّ أصدقاءك في مغامرة بحرية تلعبها مباشرة.</p>
            <button onClick={launch} className="mt-7 rounded-xl bg-[#ffd291] px-8 py-4 text-lg font-black text-[#302619] shadow-lg transition hover:bg-[#ffe0b4]">⚔ ابدأ اللعب مجاناً</button>
            <p className="mt-4 text-xs text-emerald-100/70">بدون تنزيل · بداية بلا حساب · صوت اختياري</p>
          </div>
          <div className="relative flex min-h-72 items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 520 360" className="w-full max-w-lg" role="presentation">
              <defs><radialGradient id="harbor-sea"><stop stopColor="#21767c" /><stop offset="1" stopColor="#081e2c" /></radialGradient><linearGradient id="harbor-rock" x2="0" y2="1"><stop stopColor="#729183" /><stop offset="1" stopColor="#263f49" /></linearGradient></defs>
              <ellipse cx="260" cy="230" rx="250" ry="122" fill="url(#harbor-sea)" /><ellipse cx="260" cy="260" rx="176" ry="72" fill="#86dfd3" opacity=".12" /><path d="M92 231Q260 148 430 231L384 282Q260 328 132 278Z" fill="url(#harbor-rock)" /><ellipse cx="260" cy="226" rx="167" ry="64" fill="#c5b58b" /><ellipse cx="260" cy="213" rx="149" ry="57" fill="#5c9476" /><path d="M220 250h60v84h-60z" fill="#a17856" /><path d="M220 263h60m-60 15h60m-60 15h60m-60 15h60m-60 15h60" stroke="#e2bd82" strokeWidth="3" /><path d="M175 177h166v62H175z" fill="#b6c8b6" /><path d="M160 175l34-26 34 26zm138 0 34-26 34 26z" fill="#23585a" /><path d="M172 176h44v58h-44zm138 0h44v58h-44z" fill="#849c96" /><path d="M225 126h72v105h-72z" fill="#ced3b7" /><path d="M208 131l53-53 54 53z" fill="#1b5655" stroke="#e6c38a" strokeWidth="3" /><path d="M250 208v-24q11-22 22 0v24z" fill="#183e49" /><path d="M261 79V29" stroke="#f2d098" strokeWidth="3" /><path d="M263 29l48 12-48 13z" fill="#6ce4c6" /><path d="M117 205l18-62 23 62zm252 4 18-62 23 62z" fill="#2c6758" /><ellipse cx="260" cy="247" rx="30" ry="10" fill="#22414a" /><path d="M251 241v-31h18v31z" fill="#f0c888" /><g transform="translate(69 102)"><path d="M-20 12h45L9 28z" fill="#b28671" /><path d="M5 12v-50" stroke="#e6cfa4" strokeWidth="3" /><path d="M0-37L-24 6H0z" fill="#c86670" /></g><g transform="translate(427 130)"><path d="M-20 12h45L9 28z" fill="#b28671" /><path d="M5 12v-50" stroke="#e6cfa4" strokeWidth="3" /><path d="M0-37L-24 6H0z" fill="#c86670" /></g><path d="M47 257h30m353-42h33M84 302h48M344 323h40" stroke="#89d9ca" strokeWidth="2" opacity=".4" />
            </svg>
            <span className="absolute bottom-0 rounded-full border border-emerald-300/20 bg-[#102f3a] px-5 py-2 text-xs text-emerald-100">بناء • دفاع • تحديات الأصدقاء</span>
          </div>
        </div>
      )}
    </section>
  );
}
