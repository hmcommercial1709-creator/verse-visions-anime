import { useState, useEffect } from "react";

const liveNotifications = [
  "🔥 A gamer from Tokyo unlocked a free Steam key!",
  "⚡ Flash drop: 95% off active for 3 minutes!",
  "💎 New user from London claimed a rare 4K anime pack."
];

export function AddictionEngine() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [currentNote, setCurrentNote] = useState(liveNotifications[0]);
  const [rewardCode, setRewardCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * liveNotifications.length);
      setCurrentNote(liveNotifications[randomIdx]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleViralShare = (platform: 'telegram' | 'whatsapp' | 'discord' | 'twitter') => {
    const siteUrl = encodeURIComponent(window.location.origin + "?ref=viral_box");
    const text = encodeURIComponent("🔥 Get Free Steam Keys & Legendary Anime Wallpapers Instantly here:");
    
    let shareUrl = "";
    if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${siteUrl}&text=${text}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${siteUrl}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${siteUrl}`;
    } else {
      // Discord / General Copy Fallback
      navigator.clipboard.writeText(window.location.origin + "?ref=viral_box");
      alert("Link copied! Paste it in Discord servers to unlock your reward!");
    }

    if (platform !== 'discord') {
      window.open(shareUrl, '_blank');
    }

    // تفعيل الجائزة مباشرة بعد المشاركة
    setIsOpen(true);
    setRewardCode("GAME-KEY-8821-ULTRA-FREE");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-auto">
      {/* شريط التنبيهات الحية العالمية */}
      <div className="bg-black/95 border border-purple-500 text-purple-300 px-4 py-2 rounded-full text-xs shadow-xl animate-pulse max-w-xs">
        {currentNote}
      </div>

      {/* صندوق الغموض الفيروسي متعدد المنصات */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl text-white max-w-xs border border-white/20">
        {!isOpen ? (
          <div className="text-center">
            <p className="font-bold text-sm">📦 Global Mystery Box</p>
            {countdown > 0 ? (
              <p className="text-xs mt-1 text-yellow-300">Unlocks in: {countdown}s</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <p className="text-[11px] text-yellow-200 font-semibold">Share to 1 Group to Unlock Free Key:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => handleViralShare('telegram')}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold py-1 px-2 rounded transition"
                  >
                    🚀 Telegram
                  </button>
                  <button 
                    onClick={() => handleViralShare('whatsapp')}
                    className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold py-1 px-2 rounded transition"
                  >
                    💬 WhatsApp
                  </button>
                  <button 
                    onClick={() => handleViralShare('discord')}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-bold py-1 px-2 rounded transition"
                  >
                    🎮 Discord
                  </button>
                  <button 
                    onClick={() => handleViralShare('twitter')}
                    className="bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold py-1 px-2 rounded transition"
                  >
                    🐦 Twitter/X
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="font-bold text-sm text-yellow-300">🎉 Key Unlocked!</p>
            <p className="text-xs mt-1 bg-black/40 p-1.5 rounded select-all font-mono text-green-400">{rewardCode}</p>
            <p className="text-[10px] mt-1 text-gray-200">Share with more friends to get unlimited keys!</p>
          </div>
        )}
      </div>
    </div>
  );
}
