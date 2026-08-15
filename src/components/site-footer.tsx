import { Link } from "@tanstack/react-router";
import { CreditCard, Flame, Rss, Shield, ShoppingBag, Wallet } from "lucide-react";
import { LanguageSelector } from "./language-selector";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/rewards/anime-wallpapers", label: "Anime Rewards" },
  { to: "/gaming-hub", label: "Gaming Hub" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
];

const exploreLinks = [
  { to: "/browse", label: "Browse Anime" },
  { to: "/guides", label: "Anime Guides" },
  { to: "/store", label: "Digital Store" },
  { to: "/blog", label: "Blog & News" },
  { to: "/contact", label: "Contact" },
];

const connectLinks = [
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
  { to: "/sitemap-page", label: "Sitemap" },
];

const paymentBadges = [
  { icon: Shield, label: "Secure checkout", color: "text-emerald-400" },
  { icon: ShoppingBag, label: "Powered by Gumroad", color: "text-pink-400" },
  { icon: CreditCard, label: "Visa", color: "text-blue-400" },
  { icon: CreditCard, label: "Mastercard", color: "text-orange-400" },
  { icon: Wallet, label: "PayPal", color: "text-indigo-400" },
];

function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {paymentBadges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
        >
          <badge.icon className={`h-3.5 w-3.5 ${badge.color}`} />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-800 bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" aria-label="GameCastle home" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">
                Game<span className="text-gradient">Castle</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Your trusted hub for anime digital rewards and gaming top-ups. Premium wallpapers,
              curated guides, and instant downloads — built for fans.
            </p>
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Language
              </p>
              <LanguageSelector variant="footer" align="start" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Stay Connected
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
                >
                  <Rss className="h-4 w-4" /> RSS Feed
                </a>
              </li>
              {connectLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-slate-800 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-slate-500">
            © 2026 GameCastle. All rights reserved.
          </p>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
}
