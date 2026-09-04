import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { isLocaleCode } from "@/lib/i18n";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/$locale/$")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale)) throw notFound();
    const path = `/${params._splat ?? ""}`;
    if (params.locale === "en") {
      throw redirect({ href: path, statusCode: 301 });
    }
    if (params.locale === "ar" && path === "/") {
      throw redirect({ href: "/ar/anime", statusCode: 301 });
    }
    // Instead of throwing a dead 404, we intercept to render the Ultimate Magnet Capture Screen
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: () => {
    const globalMonopolySchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://gamecastle.store/#website",
          "url": "https://gamecastle.store",
          "name": "GameCastle Store",
          "description": "The ultimate global entertainment, anime, and gaming multiverse hub.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://gamecastle.store/anime?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://gamecastle.store/#organization",
          "name": "GameCastle Store",
          "url": "https://gamecastle.store",
          "logo": "https://gamecastle.store/logo.png"
        }
      ]
    };

    return {
      meta: [
        { title: "GameCastle Multiverse · Absolute Global Entertainment Hub" },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "GameCastle Store" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(globalMonopolySchema),
        },
      ],
    };
  },
  component: function AbsoluteMagnetCatchAll() {
    const [xp, setXp] = useState<number>(() => {
      if (typeof window === "undefined") return 500;
      return parseInt(localStorage.getItem("gc_user_xp") || "500", 10);
    });
    const [activeUsers, setActiveUsers] = useState(3890);
    const [portalUnlocked, setPortalUnlocked] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveUsers(prev => Math.min(6500, Math.max(2200, prev + Math.floor(Math.random() * 40) - 20)));
      }, 2500);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      localStorage.setItem("gc_user_xp", xp.toString());
    }, [xp]);

    return (
      <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-primary-foreground overflow-hidden">
        {/* Background Ambient Glows for Dopamine Visual Loop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

        {/* Top Sticky Live Telemetry */}
        <div className="absolute top-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-b border-primary/20 px-4 py-3 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-primary flex items-center gap-2 animate-pulse">
              🔥 {activeUsers.toLocaleString()} Users Binging Across Multiverse
            </span>
            <span className="text-yellow-500 flex items-center gap-1">
              👑 Elite Dimension Master ({xp} XP)
            </span>
          </div>
        </div>

        {/* Central Magnet Interface */}
        <div className="relative z-10 max-w-2xl w-full text-center space-y-8 mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black tracking-widest uppercase">
            ⚡ Quantum Portal Redirect Active
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            You Entered a <span className="text-primary underline decoration-primary/50">Legendary Nexus</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            You've breached an uncharted sector of GameCastle. Claim your instant dimensional reward or jump directly into the global high-traffic streams below.
          </p>

          {/* Interactive Claim Reward Engine */}
          <div className="p-6 rounded-3xl border border-primary/30 bg-card/60 backdrop-blur-2xl shadow-2xl space-y-4">
            {!portalUnlocked ? (
              <button 
                onClick={() => { setPortalUnlocked(true); setXp(x => x + 250); }}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-xl hover:scale-[1.02] transition active:scale-95 cursor-pointer"
              >
                Claim +250 XP & Unlock Secret Vault 🚀
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-primary/20 border border-primary/40 text-primary font-bold animate-fade-in">
                🎉 Vault Unlocked! +250 XP added to your global profile. Redirecting to top-tier entertainment...
              </div>
            )}
          </div>

          {/* Fast Escape / Direct Omnipresent Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/anime" className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary hover:bg-primary/5 transition font-bold text-sm shadow-md">
              🔥 Anime Universe
            </Link>
            <Link to="/store" className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary hover:bg-primary/5 transition font-bold text-sm shadow-md">
              💎 Game Store & Codes
            </Link>
            <Link to="/trending" className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary hover:bg-primary/5 transition font-bold text-sm shadow-md">
              ⚡ Global Trending
            </Link>
          </div>
        </div>
      </div>
    );
  },
});
