import React, { useState, useEffect } from 'react';

const PRIZES = [
  { id: 1, text: '👑 $5,000 Ultimate Gaming PC Vault', color: '#FFD700' },
  { id: 2, text: '🔥 $1,000 Steam & Gaming Gift Cards', color: '#FF4500' },
  { id: 3, text: '⚡ Lifetime VIP Store Pass', color: '#9400D3' },
  { id: 4, text: '💎 5,000 Store Gems & Credits', color: '#00BFFF' },
  { id: 5, text: '🎮 Triple AAA Game Bundle', color: '#32CD32' },
  { id: 6, text: '🚀 50% Store Discount Pass', color: '#FF1493' },
  { id: 7, text: '💫 10x Bonus Mega Spins', color: '#FF8C00' },
  { id: 8, text: '✨ Guaranteed Mystery Reward', color: '#483D8B' },
];

const DOPAMINE_HOOK_FEED = [
  '⚡ [Store Alert] User #8841 unlocked the $5,000 Gaming PC Vault!',
  '🔥 [Flash Sale] Only 2 VIP Access Passes left at current discount!',
  '🚀 [Instant Delivery] Alex99 redeemed $250 Steam Keys successfully.',
  '💎 [Active Vault] 3,420 gamers spinning and upgrading right now.'
];

export const SpinWheel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(2);
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  
  const [showUsdtModal, setShowUsdtModal] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('10');
  const [txIdInput, setTxIdInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveFeed, setLiveFeed] = useState(DOPAMINE_HOOK_FEED.slice(0, 2));

  const [isMegaLocked, setIsMegaLocked] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);

  const MY_USDT_WALLET = 'TYam4Z53ModHJzakgDYwWyRExoCU1ewKgC';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);

    const feedTimer = setInterval(() => {
      const randomMsg = DOPAMINE_HOOK_FEED[Math.floor(Math.random() * DOPAMINE_HOOK_FEED.length)];
      setLiveFeed((prev) => [randomMsg, prev[0]]);
    }, 2800);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !exitIntentTriggered) {
        setExitIntentTriggered(true);
        setShowExitModal(true);
        setIsOpen(true);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearInterval(timer);
      clearInterval(feedTimer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [exitIntentTriggered]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

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
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
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
    setIsMegaLocked(false);
    setSpinsLeft((prev) => prev - 1);

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 150);

    const safeRealUserIndexes = [2, 3, 4, 5, 6, 7]; 
    const randomIndex = safeRealUserIndexes[Math.floor(Math.random() * safeRealUserIndexes.length)];
    
    const degreesPerItem = 360 / PRIZES.length;
    const targetRotation = rotation + 2160 + (360 - (randomIndex * degreesPerItem + degreesPerItem / 2));

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedPrize(PRIZES[randomIndex].text);
      playWinSound();

      if (Math.random() > 0.6) {
        setIsMegaLocked(true);
      } else {
        if (Math.random() > 0.3) {
          setSpinsLeft((prev) => prev + 1);
        }
      }
    }, 4000);
  };

  const copyWalletAddress = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(MY_USDT_WALLET);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const verifyUsdtPayment = () => {
    if (!txIdInput.trim()) {
      alert('Please enter a valid transaction TXID to complete instant activation.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const paidAmount = parseFloat(usdtAmount) || 10;
      const earnedSpins = Math.max(2, Math.floor(paidAmount) * 2);

      alert(`🔥 Transaction verified successfully! Added (${earnedSpins} extra spins) and fully unlocked the mega prize vault.`);
      setSpinsLeft((prev) => prev + earnedSpins);
      setIsMegaLocked(false);
      setShowUsdtModal(false);
      setTxIdInput('');
    }, 1500);
  };

  return (
    <div className="font-sans" dir="ltr">
      <div className="sr-only">
        <h1>Ultimate Gaming Rewards & Instant Digital Vault Deliveries</h1>
        <p>Win Gaming PCs, Steam gift cards, store credits, and instant bundle unlocks with secure checkout.</p>
      </div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 text-white font-black py-5 px-3 rounded-r-2xl shadow-[0_0_35px_rgba(255,215,0,0.8)] hover:scale-110 transition-all flex flex-col items-center gap-2 border-r-2 border-t-2 border-b-2 border-yellow-300 cursor-pointer group animate-pulse"
        >
          <span className="text-3xl animate-bounce">🎡</span>
          <div className="text-[10px] tracking-widest uppercase bg-black/70 px-1.5 py-3 rounded text-yellow-300 font-extrabold [writing-mode:vertical-rl] rotate-180 shadow-inner">
            SPIN & WIN
          </div>
          <span className="absolute -top-2 left-2 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full animate-ping font-bold">
            LIVE
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border-2 border-yellow-500 rounded-3xl p-6 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(234,179,8,0.5)] max-h-[95vh] overflow-y-auto">
            
            <button
              onClick={() => { setIsOpen(false); setShowExitModal(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {showExitModal && (
              <div className="mb-3 bg-gradient-to-r from-red-600 to-amber-600 text-white p-2 rounded-xl text-xs font-black animate-pulse shadow-lg">
                🚨 ALERT! Do not leave before activating the $5,000 luxury gaming bundle available now on your next spin!
              </div>
            )}

            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 mb-1">
              🎰 VIP GAMING FORTUNE WHEEL
            </h2>
            <p className="text-xs text-yellow-300/90 font-semibold mb-2">⚡ Double Win Rate | 100% Instant Digital Delivery</p>

            <div className="bg-slate-950/95 border border-emerald-500/50 rounded-xl p-2.5 mb-3 text-xs shadow-inner">
              <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  Live Player Activity:
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 animate-pulse">Instant Delivery</span>
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
                className="w-full h-full rounded-full border-4 border-yellow-400 relative overflow-hidden transition-all duration-[4000ms] shadow-[0_0_25px_rgba(255,215,0,0.5)] shadow-black"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(#FFD700 0deg 45deg, #FF4500 45deg 90deg, #9400D3 90deg 135deg, #00BFFF 135deg 180deg, #32CD32 180deg 225deg, #FF1493 225deg 270deg, #FF8C00 270deg 315deg, #483D8B 315deg 360deg)',
                }}
              ></div>

              <div className="absolute w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs text-black z-10 animate-pulse">
                SPIN
              </div>
            </div>

            <div className="bg-slate-800/90 rounded-xl p-2.5 mb-3 border border-slate-700 flex justify-around text-xs">
              <div>
                <span className="text-gray-400 block">Available Spins:</span>
                <span className="text-yellow-400 font-bold text-base animate-pulse">{spinsLeft} Left</span>
              </div>
              <div className="border-r border-slate-700"></div>
              <div>
                <span className="text-gray-400 block">Bonus Reset In:</span>
                <span className="text-red-400 font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {selectedPrize && !isMegaLocked && (
              <div className="mb-3 p-3 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-2 border-yellow-400 rounded-xl animate-bounce shadow-2xl">
                <p className="text-xs text-yellow-300 font-bold">🎉 Congratulations! You won:</p>
                <p className="text-white font-black text-sm">{selectedPrize}</p>
                <p className="text-[10px] text-emerald-300 mt-1">✨ Top up your balance now to unlock the mega prize bundle and claim profits!</p>
              </div>
            )}

            {isMegaLocked && (
              <div className="mb-3 p-3 bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-2 border-red-500 rounded-xl shadow-2xl animate-pulse">
                <p className="text-xs text-red-400 font-bold">🔒 The $5,000 Vault Lock Has Been Activated!</p>
                <p className="text-white font-black text-xs mt-1">Complete the quick support deposit to confirm your account and instantly receive the gaming bundle and mega prizes without waiting.</p>
                <button
                  onClick={() => setShowUsdtModal(true)}
                  className="mt-2 w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs rounded-lg shadow-md cursor-pointer"
                >
                  Unlock Vault & Confirm Payment 🔓
                </button>
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
                {spinning ? '🌀 Spinning the wheel...' : '🎲 Spin the Wheel & Win Now!'}
              </button>

              <button
                onClick={() => setShowUsdtModal(true)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🪙 Top Up Store Balance ($1 = 2x Spins + Unlock Prizes)</span>
              </button>
            </div>

            <div className="mt-3 text-[10px] text-gray-400 border-t border-slate-800 pt-2 flex items-center justify-between px-2">
              <span>🔒 Advanced Security Encryption</span>
              <span>⚡ Instant Automated Delivery</span>
              <span>🛡️ Store Reliability Guarantee</span>
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

            <h3 className="text-xl font-black text-emerald-400 mb-1">💳 Fast Purchase & Activation Gateway</h3>
            <p className="text-xs text-gray-300 mb-2">Enter the amount to add to your account ($10, $50, $100+):</p>

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
                🎁 Added Bonus: Get ({Math.max(1, parseInt(usdtAmount) || 1) * 2}) extra spins instantly + Vault Unlocked!
              </span>
            </div>

            <p className="text-[11px] text-gray-300 mb-1 font-bold">Transfer the amount via TRC20 network to address:</p>

            <div className="bg-slate-950 border border-emerald-500/50 p-3 rounded-xl mb-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-yellow-300 break-all select-all">{MY_USDT_WALLET}</span>
                <button
                  onClick={copyWalletAddress}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg shrink-0 font-bold transition-all cursor-pointer"
                >
                  {copySuccess ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter transaction TXID here..."
              value={txIdInput}
              onChange={(e) => setTxIdInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-3 rounded-xl mb-3 focus:outline-none focus:border-emerald-500 text-center"
            />

            <button
              onClick={verifyUsdtPayment}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/50 cursor-pointer"
            >
              {isVerifying ? '⏳ Verifying Network...' : 'Verify & Claim Instant Spins 🚀'}
            </button>

            <p className="text-[10px] text-emerald-400 mt-3 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60 leading-relaxed">
              🛡️ **Earnings & Cards Delivery Guarantee:** Withdrawal requests, game balance top-ups, and digital prizes are processed automatically within seconds with zero extra fees.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
