import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/trending')({
  component: TrendingHub,
});

function TrendingHub() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-slate-800 pb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Top Trending Anime & Gaming Hub (2026 Edition)
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Discover the most anticipated anime releases, epic gaming series, and instant digital gift cards. Your ultimate gateway to global pop culture and entertainment.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">🔥 Hot Anime Releases</h2>
            <p className="text-slate-300 mb-6">
              Track the biggest epic battles, seasonal masterworks, and high-definition wallpapers from legendary series.
            </p>
            <Link to="/store" className="inline-block bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Explore Anime Collection
            </Link>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">💎 Gaming Gift Cards</h2>
            <p className="text-slate-300 mb-6">
              Get instant access to Roblox, PUBG, PlayStation, and Steam credits securely with crypto or traditional payments.
            </p>
            <Link to="/store" className="inline-block bg-slate-800 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Browse Store Deals
            </Link>
          </div>
        </div>

        <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-purple-300">How do I access trending anime guides?</h3>
              <p className="text-slate-400 text-sm mt-1">Our hub updates daily with the latest episode schedules, character analysis, and streaming portals.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-purple-300">Are the gaming codes delivered instantly?</h3>
              <p className="text-slate-400 text-sm mt-1">Yes, all digital codes and gift cards are dispatched automatically right after checkout confirmation.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
