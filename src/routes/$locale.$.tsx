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
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: () => ({
    meta: [
      { title: "GameCastle Sovereign Multiverse · The Ultimate Global Hub" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "GameCastle Store" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: function SovereignMultiverseOS() {
    // Core Gamification & Faction State
    const [xp, setXp] = useState<number>(() => {
      if (typeof window === "undefined") return 1500;
      return parseInt(localStorage.getItem("gc_user_xp") || "1500", 10);
    });
    const [activeFaction, setActiveFaction] = useState<"pirates" | "monarchs" | "titans">(() => {
      if (typeof window === "undefined") return "pirates";
      return (localStorage.getItem("gc_faction") as any) || "pirates";
    });
    
    // Active OS Windows State
    const [activeWindow, setActiveWindow] = useState<"none" | "chat" | "factions" | "ai_story" | "vault">("none");
    const [activeUsers, setActiveUsers] = useState(6420);

    // Live Chat State
    const [messages, setMessages] = useState([
      { id: 1, user: "Monarch_Jinwoo", text: "Shadow extraction initiated in sector 7! ⚡", time: "Now" },
      { id: 2, user: "StrawHatLuffy", text: "We are dominating the Faction Turf War today! Let's go pirates!", time: "1m ago" },
    ]);
    const [chatInput, setChatInput] = useState("");

    // AI Canonical Story Vote State
    const [storyVotes, setStoryVotes] = useState({ pathA: 1420, pathB: 980 });
    const [votedStory, setVotedStory] = useState(false);

    // Dynamic Loops
    useEffect(() => {
      const userInterval = setInterval(() => {
        setActiveUsers(prev => Math.min(12000, Math.max(4500, prev + Math.floor(Math.random() * 60) - 30)));
      }, 3000);

      const chatInterval = setInterval(() => {
        const randomUsers = ["AnyaForger", "ZoroSwordsman", "SungJinwoo", "ErenYeager", "GoatSatoru"];
        const randomTexts = [
          "Who else is farming XP in the secret vault right now?",
          "The AI storyline vote is getting intense!",
          "GameCastle just replaced all my other apps 😂",
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

    const factionColors = {
      pirates: "from-red-600/20 to-orange-600/20 border-red-500/40 text-red-500",
      monarchs: "from-purple-600/25 to-blue-600/25 border-purple-500/40 text-purple-400",
      titans: "from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-400"
    };

    return (
      <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 selection:bg-primary selection:text-primary-foreground overflow-x-hidden font-sans">
        
        {/* Dynamic Faction Background Glow */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${factionColors[activeFaction]} rounded-full blur-[180px] pointer-events-none animate-pulse`} />

        {/* 1. TOP SOVEREIGN HUD BAR */}
        <div className="w-full max-w-6xl bg-background/90 backdrop-blur-2xl border border-primary/20 rounded-2xl p-3 mb-6 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm z-30">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-primary font-black">🔥 {activeUsers.toLocaleString()} Citizens Active in Neural Grid</span>
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

        {/* 2. OS-WITHIN-AN-OS FLOATING DOCK (The Command Hub) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card/80 backdrop-blur-2xl border border-primary/40 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => setActiveWindow(activeWindow === "chat" ? "none" : "chat")}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm hover:scale-110 transition ${activeWindow === "chat" ? "text-primary" : "text-muted-foreground"}`}
          >
            💬 <span className="hidden sm:inline">Global Chat</span>
          </button>
          <div className="w-px h-4 bg-border" />
          <button 
            onClick={() => setActiveWindow(activeWindow === "ai_story" ? "none" : "ai_story")}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm hover:scale-110 transition ${activeWindow === "ai_story" ? "text-primary" : "text-muted-foreground"}`}
          >
            ⚡ <span className="hidden sm:inline">AI Multiverse Story</span>
          </button>
          <div className="w-px h-4 bg-border" />
          <button 
            onClick={() => setActiveWindow(activeWindow === "vault" ? "none" : "vault")}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm hover:scale-110 transition ${activeWindow === "vault" ? "text-primary" : "text-muted-foreground"}`}
          >
            🎁 <span className="hidden sm:inline">XP Vault & Store</span>
          </button>
        </div>

        {/* MAIN HERO LANDING INTERFACE */}
        <div className="w-full max-w-5xl text-center space-y-6 mt-12 z-20 mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black tracking-widest uppercase">
            ⚡ Sovereign Neural Grid Active
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-tight">
            You Have Breached the <span className="text-primary underline decoration-primary/50">Ultimate Nexus</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            This sector is fully integrated into the GameCastle Multiverse. Engage with global factions, participate in live AI storytelling, and accumulate sovereign XP instantly.
          </p>

          {/* Quick Access Portals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <Link to="/anime" className="p-6 rounded-3xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition font-bold shadow-xl group">
              <span className="text-2xl block mb-2 group-hover:scale-125 transition">🔥</span>
              Anime Multiverse
            </Link>
            <Link to="/store" className="p-6 rounded-3xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition font-bold shadow-xl group">
              <span className="text-2xl block mb-2 group-hover:scale-125 transition">💎</span>
              Game Store & Codes
            </Link>
            <Link to="/trending" className="p-6 rounded-3xl border border-border bg-card/50 hover:border-primary hover:bg-primary/5 transition font-bold shadow-xl group">
              <span className="text-2xl block mb-2 group-hover:scale-125 transition">⚡</span>
              Global Trending
            </Link>
          </div>
        </div>

        {/* 3. FLOATING OS WINDOW MODALS (Interactive Overlays) */}
        {activeWindow === "chat" && (
          <div className="fixed bottom-24 right-4 sm:right-10 w-96 max-w-[90vw] h-[450px] bg-card/90 backdrop-blur-2xl border border-primary/40 rounded-3xl p-5 shadow-2xl z-50 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-black text-primary text-sm flex items-center gap-2">💬 Global Neural Chat</h3>
              <button onClick={() => setActiveWindow("none")} className="text-muted-foreground hover:text-foreground font-bold">✕</button>
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
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Broadcast to world..." 
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs focus:border-primary focus:outline-none"
              />
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
              <p className="text-xs text-muted-foreground">Join a faction to dominate the global hourly turf wars and alter the platform's core energy.</p>
              
              <div className="space-y-3">
                <button onClick={() => { setActiveFaction("pirates"); setActiveWindow("none"); setXp(x => x + 200); }} className="w-full p-4 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-left font-bold transition">
                  🏴‍☠️ Straw Hat Pirates (+200 XP)
                </button>
                <button onClick={() => { setActiveFaction("monarchs"); setActiveWindow("none"); setXp(x => x + 200); }} className="w-full p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left font-bold transition">
                  ⚡ Shadow Monarchs (+200 XP)
                </button>
                <button onClick={() => { setActiveFaction("titans"); setActiveWindow("none"); setXp(x => x + 200); }} className="w-full p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left font-bold transition">
                  ⚔️ Survey Corps / Titans (+200 XP)
                </button>
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
              <p className="text-xs text-muted-foreground">Your vote directly rewrites the official canonical storyline in our AI database right now!</p>
              
              {!votedStory ? (
                <div className="space-y-3">
                  <button onClick={() => { setStoryVotes(s => ({...s, pathA: s.pathA + 1})); setVotedStory(true); setXp(x => x + 300); }} className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary text-left text-xs font-bold transition">
                    📖 Path A: Jinwoo and Luffy merge their powers to defeat the Void King. ({storyVotes.pathA} votes)
                  </button>
                  <button onClick={() => { setStoryVotes(s => ({...s, pathB: s.pathB + 1})); setVotedStory(true); setXp(x => x + 300); }} className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary text-left text-xs font-bold transition">
                    🔥 Path B: Enter the Dark Dimension and unlock the Legendary Gaming Vault. ({storyVotes.pathB} votes)
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-primary/20 border border-primary/40 text-primary text-center font-bold text-xs">
                  🎉 Vote Recorded! +300 XP Awarded. The AI Multiverse has adapted to your choice.
                </div>
              )}
            </div>
          </div>
        )}

        {activeWindow === "vault" && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full bg-card border border-primary/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg text-primary">🎁 Sovereign XP Reward Vault</h3>
                <button onClick={() => setActiveWindow("none")} className="font-bold text-muted-foreground">✕</button>
              </div>
              <p className="text-xs text-muted-foreground">You currently hold <strong className="text-yellow-500">{xp} XP</strong>. Redeem them for GameCastle store discounts and game codes.</p>
              
              <button 
                onClick={() => { setXp(x => x + 500); alert("Claimed +500 XP Daily Bonus!"); }}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl hover:opacity-90 transition"
              >
                Claim Daily +500 XP Burst 🚀
              </button>
            </div>
          </div>
        )}

      </div>
    );
  },
});
