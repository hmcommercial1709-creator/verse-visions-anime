import React from "react";
import EmailSignup from "./EmailSignup";

const DownloadBanner: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#0f0f1a] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Left: copy + bullets + email signup */}
          <div className="w-full md:w-3/5 bg-transparent flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Get the FREE Ultimate Anime Watchlist 2026
            </h2>

            <p className="text-gray-300 mt-3 max-w-xl">
              100 curated anime organized by genre with ratings, episode counts & descriptions. PDF + Tracker
              included.
            </p>

            <ul className="mt-6 space-y-2 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-[#e94560] text-lg">✓</span>
                <span>100 curated anime across 10 genres</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#e94560] text-lg">✓</span>
                <span>Beginner-friendly roadmap included</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#e94560] text-lg">✓</span>
                <span>Instant PDF download</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#e94560] text-lg">✓</span>
                <span>Free Anime Tracker Template (CSV)</span>
              </li>
            </ul>

            <div className="mt-6 max-w-md">
              <EmailSignup />
            </div>
          </div>

          {/* Right: mockup card */}
          <div className="w-full md:w-2/5 flex items-center justify-center">
            <div className="w-full max-w-sm bg-[#0f0f1a] border border-[#e94560] rounded-xl shadow-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📖</div>
                  <div>
                    <h3 className="text-white font-bold">Ultimate Anime Watchlist 2026</h3>
                    <p className="text-gray-400 text-sm">PDF • 15 pages</p>
                  </div>
                </div>

                <span className="inline-block bg-[#e94560] text-white text-xs font-bold px-3 py-1 rounded-full">
                  FREE
                </span>
              </div>

              <div className="mt-2 bg-[#0b0b12] rounded-md h-40 flex items-center justify-center text-gray-600">
                <span className="text-sm">[PDF preview mockup]</span>
              </div>

              <div className="mt-3">
                <a
                  href="/downloads/ultimate-anime-watchlist-2026.pdf"
                  download
                  className="block w-full text-center bg-[#e94560] text-white py-3 rounded-lg font-bold hover:brightness-95 transition"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadBanner;
