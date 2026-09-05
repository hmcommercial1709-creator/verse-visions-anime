import React, { useState, useEffect } from 'react';

const REAL_PRIZES = [
  { id: 1, text: '🎉 10% Off Storewide Coupon', code: 'SPIN10', color: '#32CD32' },
  { id: 2, text: '🎁 $5 Game Store Credit', code: 'GAME5USD', color: '#00BFFF' },
  { id: 3, text: '⚡ Free Express Code Delivery', code: 'FASTSHIP', color: '#9400D3' },
  { id: 4, text: '💎 50 Store Loyalty Points', code: 'GEMS50', color: '#FFD700' },
  { id: 5, text: '🔥 15% Off Gift Cards', code: 'GIFT15', color: '#FF4500' },
  { id: 6, text: '🚀 5% Discount Voucher', code: 'LUCKY5', color: '#FF1493' },
];

export const SpinWheel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<{ text: string; code: string } | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [copied, setCopied] = useState(false);

  // التحقق من عدد الدورات المسموحة للمستخدم يومياً عبر localStorage
  useEffect(() => {
    const lastSpinDate = localStorage.getItem('last_spin_date');
    const today = new Date().toDateString();
    if (lastSpinDate === today) {
      setSpinsLeft(0);
    }
  }, []);

  const playTickSound = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  const spinTheWheel = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setWonPrize(null);
    setSpinsLeft(0);

    // حفظ تاريخ آخر دورة لمنع التلاعب
    localStorage.setItem('last_spin_date', new Date().toDateString());

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 20) clearInterval(tickInterval);
    }, 150);

    const randomIndex = Math.floor(Math.random() * REAL_PRIZES.length);
    const degreesPerItem = 360 / REAL_PRIZES.length;
    const targetRotation = rotation + 1800 + (360 - (randomIndex * degreesPerItem + degreesPerItem / 2));

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(REAL_PRIZES[randomIndex]);
    }, 3500);
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="font-sans" dir="ltr">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-3 rounded-r-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center gap-1 cursor-pointer"
        >
          <span className="text-2xl">🎁</span>
          <div className="text-[10px] tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
            Daily Spin
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg font-bold bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">🎮 Daily Reward Wheel</h2>
            <p className="text-xs text-gray-400 mb-4">Spin once a day to win store discounts and points!</p>

            <div className="relative w-44 h-44 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-yellow-400"></div>
              <div
                className="w-full h-full rounded-full border-4 border-slate-700 relative overflow-hidden transition-all duration-[3500ms]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(#32CD32 0deg 60deg, #00BFFF 60deg 120deg, #9400D3 120deg 180deg, #FFD700 180deg 240deg, #FF4500 240deg 300deg, #FF1493 300deg 360deg)',
                }}
              ></div>
              <div className="absolute w-10 h-10 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center font-bold text-[10px] text-white z-10">
                WIN
              </div>
            </div>

            {wonPrize ? (
              <div className="mb-4 p-3 bg-slate-800 border border-emerald-500/50 rounded-xl">
                <p className="text-xs text-emerald-400 font-bold mb-1">🎉 Congratulations! You won:</p>
                <p className="text-white font-bold text-sm mb-2">{wonPrize.text}</p>
                <div className="flex items-center justify-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-700">
                  <span className="font-mono text-yellow-400 text-xs font-bold">{wonPrize.code}</span>
                  <button
                    onClick={() => copyCoupon(wonPrize.code)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded font-bold cursor-pointer transition-all"
                  >
                    {copied ? 'Copied ✓' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={spinTheWheel}
                disabled={spinning || spinsLeft <= 0}
                className={`w-full py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  spinsLeft > 0 && !spinning
                    ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {spinning ? 'Spinning...' : spinsLeft > 0 ? 'Spin the Wheel Now!' : 'Come Back Tomorrow'}
              </button>
            )}

            <p className="text-[10px] text-gray-500 mt-3">
              * Coupons can be applied directly at store checkout. Free daily promotion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
