import { useState, useEffect } from "react";

const liveNotifications = [
  "🔥 A gamer just unlocked a free Steam key right now!",
  "⚡ Flash sale with 95% off ending soon!",
  "💎 A user from the USA opened the legendary anime box and got a rare poster."
];

export function AddictionEngine() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [reward, setReward] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState(liveNotifications[0]);

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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBox = () => {
    if (countdown === 0) {
      setIsOpen(true);
      setReward("🎁 You unlocked a free Steam key or rare 4K wallpaper!");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-auto">
      <div className="bg-black/90 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-full text-xs text-center shadow-lg animate-pulse max-w-xs">
        {currentNote}
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl text-white animate-bounce cursor-pointer">
        {!isOpen ? (
          <div onClick={handleOpenBox} className="text-center">
            <p className="font-bold text-sm">📦 Legendary Mystery Box</p>
            <p className="text-xs mt-1">
              {countdown > 0 ? `Open in: ${countdown}s` : "Click to Open Now!"}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-bold text-sm">🎉 Congratulations!</p>
            <p className="text-xs mt-1">{reward}</p>
          </div>
        )}
      </div>
    </div>
  );
}
