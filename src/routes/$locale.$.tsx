import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { isLocaleCode } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SovereignWatchPartyMesh } from "@/components/SovereignWatchPartyMesh";
import { ViralLoopMatrix } from "@/components/ViralLoopMatrix";

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
  },
  loader: async ({ params }) => {
    const splat = params._splat ?? "";
    if (!splat || splat === "/") {
      return { type: "home" };
    }

    const segments = splat.split("/");
    const slug = segments[segments.length - 1] || "nexus-core";
    const category = segments.length > 1 ? segments[0] : "anime";

    // 1. Safe Supabase lookup without breaking (.single() avoided)
    let { data } = await supabase
      .from('anime_nexus_matrix')
      .select('*')
      .eq('slug', slug)
      .limit(1);

    if (data && data.length > 0) {
      return { type: "programmatic", item: data[0] };
    }

    // 2. On-the-fly programmatic generation fallback for the 80,000+ indexed URLs
    const cleanTitle = slug.replace(/-/g, " ");
    const generatedItem = {
      slug,
      category,
      title: cleanTitle,
      title_ar: `الأرشيف الشامل والتحليل البرمجي: ${cleanTitle}`,
      description: `Complete programmatic deep-dive, lore index, and exclusive community resources for ${cleanTitle} on GameCastle.`,
      description_ar: `التغطية البرمجية الشاملة، التحليلات المتقدمة، والأسرار المتعلقة بـ ${cleanTitle} عبر منصة غيم كاسل.`,
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200",
      content_ar: `هذه الصفحة جزء من مصفوفة المحتوى الضخمة لـ GameCastle، والتي توفر تحديثات فورية وتحليلات عميقة لآلاف العناوين لضمان أعلى سرعة أرشفة واستجابة لمحركات البحث.`
    };

    return { type: "programmatic", item: generatedItem };
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    "X-Robots-Tag": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  }),
  head: ({ params, loaderData }) => {
    const currentPath = params._splat ? `/${params.locale}/${params._splat}` : `/${params.locale}`;
    const isProg = loaderData?.type === "programmatic";
    const progItem = loaderData?.item;

    const pageTitle = isProg 
      ? `${progItem?.title_ar || progItem?.title} | GameCastle Multiverse`
      : "GameCastle Multiverse · Absolute Global Anime & Gaming Hub";
      
    const pageDesc = isProg 
      ? (progItem?.description_ar || progItem?.description)
      : "Enter the world's most advanced interactive anime and gaming multiverse. Join live factions, chat globally, vote on AI canonical storylines, and claim XP rewards.";

    const aiSeoGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://gamecastle.store/#website",
          "url": "https://gamecastle.store",
          "name": "GameCastle Store",
          "alternateName": ["GameCastle Multiverse", "غيم كاسل"],
          "description": "The ultimate global anime multiverse, gaming hub, and interactive neural community.",
          "inLanguage": ["ar", "en"]
        },
        {
          "@type": isProg ? "Article" : "WebPage",
          "@id": `https://gamecastle.store${currentPath}#webpage`,
          "url": `https://gamecastle.store${currentPath}`,
          "name": pageTitle,
          "description": pageDesc,
          "isPartOf": { "@id": "https://gamecastle.store/#website" }
        }
      ]
    };

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: pageDesc },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
        { property: "og:locale", content: params.locale === "ar" ? "ar_AR" : "en_US" },
        { property: "og:type", content: isProg ? "article" : "website" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: pageDesc },
        { property: "og:url", content: `https://gamecastle.store${currentPath}` },
        { property: "og:site_name", content: "GameCastle Store" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: pageDesc }
      ],
      links: [
        { rel: "canonical", href: `https://gamecastle.store${currentPath}` },
        { rel: "alternate", href: `https://gamecastle.store/ar/${params._splat ?? ""}`, hreflang: "ar" },
        { rel: "alternate", href: `https://gamecastle.store/en/${params._splat ?? ""}`, hreflang: "en" },
        { rel: "alternate", href: `https://gamecastle.store/ar/${params._splat ?? ""}`, hreflang: "x-default" }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(aiSeoGraph),
        },
      ],
    };
  },
  component: function UnifiedMultiverseRouter() {
    const data = Route.useLoaderData() as any;

    // IF IT'S A PROGRAMMATIC PAGE (Fixes the 80,000 empty pages issue completely)
    if (data?.type === "programmatic") {
      const item = data.item;
      return (
        <div className="min-h-screen bg-background text-foreground pb-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-primary mb-4 uppercase tracking-widest">
              <Link to="/ar/anime" className="hover:underline">GameCastle Nexus</Link> / <span>{item.category || 'Archive'}</span>
            </div>

            {item.image && (
              <div className="mb-8 aspect-video overflow-hidden rounded-3xl border border-border/60 bg-secondary/30 shadow-2xl">
                <img src={item.image} alt={item.title_ar} className="w-full h-full object-cover" />
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-primary via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {item.title_ar || item.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 p-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-xl">
              {item.description_ar || item.description}
            </p>

            <div className="p-8 rounded-3xl bg-card/60 border border-primary/30 backdrop-blur-2xl shadow-2xl space-y-6 mb-12">
              <h3 className="text-xl font-black text-foreground">التحليل البرمجي الشامل والتغطية</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                <p>{item.content_ar || item.description_ar}</p>
              </div>
            </div>

            {/* Programmatic Affiliate & Internal Linking Engine */}
            <div className="p-6 rounded-3xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-primary text-base">احصل على أكخصم وأكواد الألعاب الحصرية ⚡</h4>
                <p className="text-xs text-muted-foreground">تصفح متجر جيم كاسل للحصول على أرخص مفاتيح الألعاب وبطاقات الشحن.</p>
              </div>
              <a 
                href="https://www.gamivo.com?glv=gamecastle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground font-black rounded-xl text-xs shadow-lg hover:opacity-90 transition whitespace-nowrap"
              >
                تصفح المتجر الآن 💎
              </a>
            </div>
          </div>
        </div>
      );
    }

    // OTHERWISE: RENDER THE FULL INTERACTIVE HOMEPAGE
    return <SovereignMultiverseOSHome />;
  },
});

// Full Homepage Component extracted cleanly
function SovereignMultiverseOSHome() {
  const [xp, setXp] = useState<number>(() => {
    if (typeof window === "undefined") return 1500;
    return parseInt(localStorage.getItem("gc_user_xp") || "1500", 10);
  });
  const [activeFaction, setActiveFaction] = useState<"pirates" | "monarchs" | "titans">(() => {
    if (typeof window === "undefined") return "pirates";
    return (localStorage.getItem("gc_faction") as any) || "pirates";
  });
  
  const [activeWindow, setActiveWindow] = useState<"none" | "chat" | "factions" | "ai_story" | "vault" | "loot_box" | "matchmaker">("none");
  const [activeUsers, setActiveUsers] = useState(7840);

  const [messages, setMessages] = useState([
    { id: 1, user: "Monarch_Jinwoo", text: "Global SEO crawler indexing speed is maxed out! ⚡", time: "Now" },
    { id: 2, user: "StrawHatLuffy", text: "We are ranking #1 worldwide across all search engines!", time: "1m ago" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const [storyVotes, setStoryVotes] = useState({ pathA: 2140, pathB: 1820 });
  const [votedStory, setVotedStory] = useState(false);

  const [lootOpened, setLootOpened] = useState(false);
  const [lootReward, setLootReward] = useState<{ title: string; code: string; link: string } | null>(null);
  const [matchResult, setMatchResult] = useState<{ game: string; discount: string; link: string } | null>(null);

  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveUsers(prev => Math.min(15000, Math.max(5200, prev + Math.floor(Math.random() * 80) - 40)));
    }, 3000);

    const chatInterval = setInterval(() => {
      const randomUsers = ["AnyaForger", "ZoroSwordsman", "SungJinwoo", "ErenYeager", "GoatSatoru"];
      const randomTexts = [
        "Google AI Overviews picked up our site structure instantly!",
        "The programmatic SEO indexing here is unreal 🔥",
        "Farming XP while ranking top in search results!",
      ];
      setMessages(prev => [
        { id: Date.now(), user: randomUsers[Math.floor(Math.random() * randomUsers.length)], text: randomTexts[Math.floor(Math.random() * randomTexts.length)], time: "Just now" },
        ...prev.slice(0, 10)
      ]);
    }, 7000);

    return () => {
      clearInterval(userInterval);
      clearInterval(chatInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("gc_user_xp", xp.toString());
    localStorage.setItem("gc_faction", activeFaction);
  }, [xp, activeFaction]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([{ id: Date.now(), user: "You (Elite Master)", text: chatInput, time: "Now" }, ...messages]);
    setChatInput("");
    setXp(x => x + 50);
  };

  const handleOpenLootBox = () => {
    if (xp < 200) {
      alert("You need at least 200 XP to open the neural mystery box!");
      return;
    }
    setXp(x => x - 200);
    const rewards = [
      { title: "50% Exclusive Discount on Solo Leveling: Arise Key", code: "SOLO50GAMIVO", link: "https://www.gamivo.com?glv=gamecastle" },
      { title: "Free Random AAA Game Key", code: "ANIMEKINGKEY", link: "https://www.gamivo.com?glv=gamecastle" },
      { title: "$20 Steam Gift Card", code: "STEAM20GC", link: "https://www.gamivo.com?glv=gamecastle" }
    ];
    const selected = rewards[Math.floor(Math.random() * rewards.length)];
    setLootReward(selected);
    setLootOpened(true);
  };

  const handleAIAsyncMatch = (mood: string) => {
    const recommendations: Record<string, { game: string; discount: string; link: string }> = {
      action: { game: "Elden Ring Deluxe Edition (GAMIVO)", discount: "65% OFF + GCBOX Code", link: "https://www.gamivo.com?glv=gamecastle" },
      anime: { game: "Dragon Ball Sparking! ZERO Steam Key", discount: "45% OFF + Instant Delivery", link: "https://www.gamivo.com?glv=gamecastle" },
      chill: { game: "Stardew Valley / RPG Master Bundle", discount: "70% Exclusive Discount", link: "https://www.gamivo.com?glv=gamecastle" }
    };
    setMatchResult(recommendations[mood] || recommendations.action);
  };

  const factionColors = {
    pirates: "from-red-600/20 to-orange-600/20 border-red-500/40 text-red-500",
    monarchs: "from-purple-600/25 to-blue-600/25 border-purple-500/40 text-purple-400",
    titans: "from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-400"
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 selection:bg-primary selection:text-primary-foreground overflow-x-hidden font-sans w-full">
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${factionColors[activeFaction]} rounded-full blur-[180px] pointer-events-none animate-pulse`} />

      <div className="w-full max-w-6xl bg-background/90 backdrop-blur-2xl border border-primary/20 rounded-2xl p-3 mb-6 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm z-30">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-primary font-black">🔥 {activeUsers.toLocaleString()} Global Citizens Active (Neural AI & Affiliate Engine Active)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 font-bold">👑 {xp.toLocaleString()} XP</span>
          <button 
            onClick={() => setActiveWindow(activeWindow === "factions" ? "none" : "factions")}
            className="px-3 py-1 bg-primary/20 border border-primary/40 text-primary rounded-lg font-bold hover:bg-primary/30 transition"
          >
            🛡️ Faction: {activeFaction.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card/80 backdrop-blur-2xl border border-primary/40 rounded-full px-6 py-3 shadow-2xl flex items-center gap-3 sm:gap-5">
        <button onClick={() => setActiveWindow(activeWindow === "chat" ? "none" : "chat")} className="font-bold text-xs sm:text-sm text-muted-foreground hover:text-primary transition">💬 Chat</button>
        <div className="w-px h-4 bg-border" />
        <button onClick={() => setActiveWindow(activeWindow === "ai_story" ? "none" : "ai_story")} className="font-bold text-xs sm:text-sm text-muted-foreground hover:text-primary transition">⚡ AI Story</button>
        <div className="w-px h-4 bg-border" />
        <button onClick={() => setActiveWindow(activeWindow === "matchmaker" ? "none" : "matchmaker")} className="font-bold text-xs sm:text-sm text-muted-foreground hover:text-primary transition">🎯 Matchmaker</button>
        <div className="w-px h-4 bg-border" />
        <button onClick={() => setActiveWindow(activeWindow === "loot_box" ? "none" : "loot_box")} className="font-bold text-xs sm:text-sm text-yellow-400 hover:scale-110 transition">🎁 Loot</button>
      </div>

      <div className="w-full max-w-5xl text-center space-y-6 mt-12 z-20 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black tracking-widest uppercase">
          ⚡ AI-Powered Global Search Magnet & Neural Vault Active
        </div>

        <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-tight">
          Absolute Global Domination via <span className="text-primary underline decoration-primary/50">Neural SEO & Loot</span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Engineered with multi-language hreflang alternates, automated JSON-LD semantic graphs, and real-time neural monetization loops to capture top rankings and convert traffic instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <Link to="/ar/anime" className="p-6 rounded-3xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition font-bold shadow-xl group">
            <span className="text-2xl block mb-2 group-hover:scale-125 transition">🔥</span>
            Anime Multiverse
          </Link>
          <Link to="/ar/store" className="p-6 rounded-3xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition font-bold shadow-xl group">
            <span className="text-2xl block mb-2 group-hover:scale-125 transition">💎</span>
            Game Store & Codes
          </Link>
          <Link to="/ar/trending" className="p-6 rounded-3xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition font-bold shadow-xl group">
            <span className="text-2xl block mb-2 group-hover:scale-125 transition">⚡</span>
            Global Trending
          </Link>
        </div>
      </div>

      <div className="w-full max-w-5xl z-20 mb-12"><SovereignWatchPartyMesh /></div>
      <div className="w-full max-w-5xl z-20 mb-32"><ViralLoopMatrix /></div>

      {activeWindow === "chat" && (
        <div className="fixed bottom-24 right-4 sm:right-10 w-96 max-w-[90vw] h-[450px] bg-card/90 backdrop-blur-2xl border border-primary/40 rounded-3xl p-5 shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-black text-primary text-sm">💬 Global Neural Chat</h3>
            <button onClick={() => setActiveWindow("none")} className="text-muted-foreground font-bold">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
            {messages.map((m) => (
              <div key={m.id} className="p-2.5 rounded-xl bg-background/60 border border-border/50">
                <div className="flex justify-between font-bold text-primary mb-1">
                  <span>{m.user}</span>
                  <span className="text-[9px] text-muted-foreground">{m.time}</span>
                </div>
                <p className="text-foreground/90">{m.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Broadcast..." className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs focus:outline-none" />
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-black rounded-xl text-xs">Send</button>
          </form>
        </div>
      )}

      {activeWindow === "factions" && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-card border border-primary/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-primary">🛡️ Choose Your Faction Turf</h3>
              <button onClick={() => setActiveWindow("none")} className="font-bold text-muted-foreground">✕</button>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setActiveFaction("pirates"); setActiveWindow("none"); setXp(x => x + 200); }} className="w-full p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-left font-bold transition">🏴‍☠️ Straw Hat Pirates (+200 XP)</button>
              <button onClick={() => { setActiveFaction("monarchs"); setActiveWindow("none"); setXp(x => x + 200); }} className="w-full p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 text-left font-bold transition">⚡ Shadow Monarchs (+200 XP)</button>
              <button onClick={() => { setActiveFaction("titans"); setActiveWindow("none"); setXp(x => x + 200); }} className="w-full p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left font-bold transition">⚔️ Survey Corps / Titans (+200 XP)</button>
            </div>
          </div>
        </div>
      )}

      {activeWindow === "ai_story" && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-card border border-primary/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-primary">⚡ AI Canonical Multiverse Vote</h3>
              <button onClick={() => setActiveWindow("none")} className="font-bold text-muted-foreground">✕</button>
            </div>
            {!votedStory ? (
              <div className="space-y-3">
                <button onClick={() => { setStoryVotes(s => ({...s, pathA: s.pathA + 1})); setVotedStory(true); setXp(x => x + 300); }} className="w-full p-4 rounded-2xl border border-border bg-background/50 text-left text-xs font-bold">Path A: Optimize SEO Vectors ({storyVotes.pathA})</button>
                <button onClick={() => { setStoryVotes(s => ({...s, pathB: s.pathB + 1})); setVotedStory(true); setXp(x => x + 300); }} className="w-full p-4 rounded-2xl border border-border bg-background/50 text-left text-xs font-bold">Path B: Unlock Gaming Vault ({storyVotes.pathB})</button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-primary/20 border border-primary/40 text-primary text-center font-bold text-xs">🎉 Vote Recorded! +300 XP Awarded.</div>
            )}
          </div>
        </div>
      )}

      {activeWindow === "matchmaker" && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-card border border-primary/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-primary">🎯 AI Matchmaker</h3>
              <button onClick={() => setActiveWindow("none")} className="font-bold text-muted-foreground">✕</button>
            </div>
            {!matchResult ? (
              <div className="grid grid-cols-1 gap-2 text-left">
                <button onClick={() => handleAIAsyncMatch("action")} className="p-3 rounded-xl bg-background border border-border text-xs font-bold">🔥 Action & Epic Adventure</button>
                <button onClick={() => handleAIAsyncMatch("anime")} className="p-3 rounded-xl bg-background border border-border text-xs font-bold">⚡ Anime & Battle Hype</button>
                <button onClick={() => handleAIAsyncMatch("chill")} className="p-3 rounded-xl bg-background border border-border text-xs font-bold">🌿 Chill RPG & Simulation</button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-3 text-left">
                <div className="font-black text-sm">{matchResult.game}</div>
                <div className="text-yellow-400 font-bold text-xs">{matchResult.discount}</div>
                <a href={matchResult.link} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-primary text-primary-foreground font-black text-center rounded-xl text-xs shadow-lg">Buy Now 🚀</a>
                <button onClick={() => setMatchResult(null)} className="block w-full text-center text-[10px] text-muted-foreground underline">Choose Another</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeWindow === "loot_box" && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-card border border-yellow-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-yellow-400">🎁 Neural Mystery Loot Box</h3>
              <button onClick={() => setActiveWindow("none")} className="font-bold text-muted-foreground">✕</button>
            </div>
            {!lootOpened ? (
              <div className="py-6 space-y-4">
                <div className="w-24 h-24 mx-auto bg-yellow-500/25 border-2 border-yellow-500 rounded-3xl flex items-center justify-center text-4xl animate-bounce shadow-xl">📦</div>
                <button onClick={handleOpenLootBox} className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-sm shadow-xl">Open Box (Costs 200 XP) ⚡</button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 space-y-3 text-center">
                <div className="font-black text-sm text-foreground">{lootReward?.title}</div>
                <div className="p-2 bg-background rounded-xl border border-border font-mono text-primary text-xs font-bold tracking-widest">{lootReward?.code}</div>
                <a href={lootReward?.link} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-yellow-500 text-black font-black text-center rounded-xl text-xs shadow-lg">Use Code 💎</a>
                <button onClick={() => setLootOpened(false)} className="block w-full text-center text-[10px] text-muted-foreground underline">Open Another</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
