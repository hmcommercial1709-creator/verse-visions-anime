import React from 'react';
import { Link } from 'react-router-dom';

export default function CryptoGiftCardGuide() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-slate-800 pb-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ultimate Guide to Buying Gift Cards with Crypto (2026 Edition)
          </h1>
          <p className="text-xl text-slate-400">
            Learn how to use Bitcoin, Ethereum, and USDT to purchase your favorite gaming credits and digital subscriptions instantly at Game Castle.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-purple-400 mb-6">Why Gamers Prefer Crypto Payments</h2>
              <p className="text-slate-300 leading-relaxed">
                As the digital landscape evolves, so does the way we shop. At <strong>Game Castle</strong>, we have integrated advanced blockchain technology to ensure that our community of fans can access premium content without traditional banking hurdles.
              </p>
            </section>

            <section className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
              <h2 className="text-2xl font-bold mb-6">Explore Our Collections</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/store" className="p-4 bg-slate-800 rounded-lg hover:bg-purple-600 transition text-center font-bold">Gaming Store</Link>
                <Link to="/" className="p-4 bg-slate-800 rounded-lg hover:bg-purple-600 transition text-center font-bold">Home Page</Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
