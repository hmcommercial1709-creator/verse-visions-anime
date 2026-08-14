import React from "react";
import EmailSignup from "./EmailSignup";

const DownloadBanner = () => {
  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f0f1a] py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-white">Get the FREE Ultimate Anime Watchlist 2026</h2>
          <p className="text-gray-400 mb-6">
            100 curated anime organized by genre with ratings, episode counts & descriptions. PDF + Tracker included.
          </p>
          <ul className="space-y-2 mb-6 text-gray-300">
            <li>✓ 100 curated anime across 10 genres</li>
            <li>✓ Beginner-friendly roadmap included</li>
            <li>✓ Instant PDF download</li>
            <li>✓ Free Anime Tracker Template (CSV)</li>
          </ul>
          <EmailSignup />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#1a1a2e] border border-[#e94560] rounded-xl p-6 w-64 text-center shadow-2xl shadow-[#e94560]/20">
            <div className="text-5xl mb-3">📖</div>
            <h3 className="font-bold mb-2 text-white">Ultimate Anime Watchlist</h3>
            <span className="bg-[#e94560] text-white text-xs font-bold px-3 py-1 rounded-full">FREE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadBanner;