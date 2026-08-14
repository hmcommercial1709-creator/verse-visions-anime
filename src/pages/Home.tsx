import React from "react";
import DownloadBanner from "../components/DownloadBanner";

/**
 * Simple Home page that places the DownloadBanner at the very top.
 */

const Home: React.FC = () => {
  return (
    <>
      <DownloadBanner />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Welcome to GameCastle</h1>
          <p className="text-gray-400 mt-3">Free resources, guides and tools for anime fans.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6">
            <h3 className="font-bold text-xl mb-2">Featured Resource</h3>
            <p className="text-gray-400 text-sm">Ultimate Anime Watchlist 2026 — instant PDF download.</p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6">
            <h3 className="font-bold text-xl mb-2">Tools</h3>
            <p className="text-gray-400 text-sm">Tracker templates, infographics, and more.</p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6">
            <h3 className="font-bold text-xl mb-2">Community</h3>
            <p className="text-gray-400 text-sm">Join our mailing list and Discord to stay updated.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
