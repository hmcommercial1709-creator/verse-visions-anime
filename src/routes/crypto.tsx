import React from 'react';
import { Link } from 'react-router-dom';

export default function CryptoGuide() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-400">
          <Link to="/" className="text-purple-400 hover:underline">GameCastle Store</Link> &gt; <span className="text-slate-200">Crypto Gift Cards Guide</span>
        </nav>

        {/* H1 Heading */}
        <header className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ultimate Guide to Buying Gift Cards Online with Cryptocurrency
          </h1>
          <p className="text-lg text-slate-300">
            Discover how to securely purchase digital gaming gift cards using USDT, USDC, and other cryptocurrencies on <a href="https://gamecastle.store" className="text-purple-400 underline font-medium">GameCastle Store</a> with instant 24/7 delivery.
          </p>
        </header>

        {/* Main Content Section */}
        <section className="space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-2xl font-bold text-white">Why Pay with Crypto?</h2>
          <p className="text-slate-300 leading-relaxed">
            Using cryptocurrency for your digital purchases offers complete privacy, avoids traditional banking fees, and bypasses regional restrictions. At GameCastle, our automated checkout ensures your codes arrive instantly.
          </p>
        </section>

        {/* Call to Action */}
        <footer className="text-center bg-gradient-to-r from-purple-900/40 to-slate-900 p-8 rounded-2xl border border-purple-500/30 space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to Browse Our Store?</h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Explore our collections and experience fast, secure crypto checkout today.
          </p>
          <div>
            <Link 
              to="/" 
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              Go to Homepage
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
