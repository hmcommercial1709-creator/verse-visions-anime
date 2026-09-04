import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { loadEntity, entityHead } from "@/lib/entity-catalog";
import { CatalogEntityPage } from "@/components/catalog-entity";
import { getAnime } from "@/data/animes";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/$locale/anime/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
    if (getAnime(params.slug)) throw redirect({ href: `/anime/${params.slug}`, statusCode: 301 });
  },
  loader: async ({ params }) => {
    const entity = await loadEntity("anime", params.slug);
    if (!entity) throw notFound();
    return entity;
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: ({ loaderData }) => {
    const baseHead = entityHead(loaderData);
    
    // Ultimate SEO Schema: TVSeries, AggregateRating, and BreadcrumbList for absolute Google Monopoly
    const ultimateMagnetSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "TVSeries",
          "@id": `https://gamecastle.store/anime/${loaderData.slug}#tvseries`,
          "name": loaderData.title || loaderData.name,
          "description": loaderData.description,
          "image": loaderData.posterUrl || loaderData.image,
          "genre": loaderData.genres || ["Anime", "Action", "Adventure", "Shonen", "Fantasy"],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": loaderData.rating || "9.8",
            "bestRating": "10",
            "ratingCount": loaderData.ratingCount || "215400"
          },
          "productionCompany": {
            "@type": "Organization",
            "name": loaderData.studio || "Studio Glimmer"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gamecastle.store" },
            { "@type": "ListItem", "position": 2, "name": "Anime Hub", "item": "https://gamecastle.store/anime" },
            { "@type": "ListItem", "position": 3, "name": loaderData.title || loaderData.name, "item": `https://gamecastle.store/anime/${loaderData.slug}` }
          ]
        }
      ]
    };

    return {
      ...baseHead,
      meta: [
        ...(baseHead.meta || []),
        { property: "og:type", content: "video.tv_show" },
        { property: "og:site_name", content: "GameCastle Store" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@GameCastleStore" },
      ],
      scripts: [
        ...(baseHead.scripts || []),
        {
          type: "application/ld+json",
          children: JSON.stringify(ultimateMagnetSchema),
        },
      ],
    };
  },
  component: function AbsoluteOmniMagnetRoute() {
    const entity = Route.useLoaderData();
    
    // 1. Ultimate Gamification & Retention State Engines
    const [xp, setXp] = useState<number>(() => {
      if (typeof window === "undefined") return 350;
      return parseInt(localStorage.getItem("gc_user_xp") || "350", 10);
    });
    const [watched, setWatched] = useState<number>(() => {
      if (typeof window === "undefined") return 0;
      return parseInt(localStorage.getItem(`progress_${entity.slug}`) || "0", 10);
    });
    const [pollVoted, setPollVoted] = useState(false);
    const [activeReaders, setActiveReaders] = useState(2450);

    // 2. Interactive Reddit-Style Comments State
    const [comments, setComments] = useState([
      { id: 1, user: "Zoro_King99", text: "The animation in the latest arc completely redefines shonen standards!", votes: 342, spoiler: false },
      { id: 2, user: "OtakuLord_X", text: "Wait until you see the plot twist revealed in chapter 1120...", votes: 189, spoiler: true },
    ]);
    const [newCommentText, setNewCommentText] = useState("");
    const [hasSpoilerToggle, setHasSpoilerToggle] = useState(false);

    // 3. Power Scaling / Tier Voting State
    const [tierVotes, setTierVotes] = useState({ ss: 1420, s: 430, a: 85 });

    // Dynamic Live FOMO Counter Simulator
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveReaders(prev => Math.min(4500, Math.max(1500, prev + Math.floor(Math.random() * 35) - 17)));
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      localStorage.setItem("gc_user_xp", xp.toString());
      localStorage.setItem(`progress_${entity.slug}`, watched.toString());
    }, [xp, watched, entity.slug]);

    const addXp = (amount: number) => setXp(prev => prev + amount);

    // Rank calculation based on XP
    const getRank = (currentXp: number) => {
      if (currentXp < 500) return { title: "Novice Scout", badge: "🥉" };
      if (currentXp < 1000) return { title: "Lore Master", badge: "🥈" };
      return { title: "Pirate King Legend", badge: "👑" };
    };

    const userRank = getRank(xp);

    const handleAddComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCommentText.trim()) return;
      setComments([{ id: Date.now(), user: "You (Elite Member)", text: newCommentText, votes: 1, spoiler: hasSpoilerToggle }, ...comments]);
      setNewCommentText("");
      setHasSpoilerToggle(false);
      addXp(75);
    };

    return (
      <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-32">
        {/* 1. STICKY OMNI-RETENTION HUD & GAMIFICATION HEADER */}
        <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-2xl border-b border-primary/20 px-4 py-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-black text-primary animate-pulse">
                🔥 {activeReaders.toLocaleString()} Binging Live
              </span>
              <span className="hidden md:inline-block text-muted-foreground">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-yellow-500 font-bold">
                <span>{userRank.badge}</span> {userRank.title} ({xp} XP)
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium">
                Tracked: <strong className="text-foreground">{watched} Ep</strong>
              </span>
              <button 
                onClick={() => { setWatched(w => w + 1); addXp(50); }}
                className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-xl font-bold shadow-lg hover:scale-105 transition active:scale-95 cursor-pointer"
              >
                + Checkpoint (+50 XP)
              </button>
            </div>
          </div>
        </div>

        {/* 2. CORE ENTERPRISE PAGE CONTENT */}
        <CatalogEntityPage entity={entity} />

        {/* 3. INTERACTIVE POWER SCALING & TIER VOTING MATRIX */}
        <section className="max-w-4xl mx-auto my-12 px-4">
          <div className="p-6 sm:p-8 rounded-3xl border border-primary/30 bg-card/60 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-black mb-2 text-primary flex items-center gap-2">
              ⚡ Community Power Scaling & Tier Matrix
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Vote on this universe's true power ranking to boost global database metrics and earn +50 XP!</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => { setTierVotes(v => ({ ...v, ss: v.ss + 1 })); addXp(50); }} className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition text-center font-bold">
                <div className="text-xl text-primary font-black">SS-Tier</div>
                <div className="text-xs text-muted-foreground mt-1">{tierVotes.ss} Votes</div>
              </button>
              <button onClick={() => { setTierVotes(v => ({ ...v, s: v.s + 1 })); addXp(50); }} className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition text-center font-bold">
                <div className="text-xl text-yellow-500 font-black">S-Tier</div>
                <div className="text-xs text-muted-foreground mt-1">{tierVotes.s} Votes</div>
              </button>
              <button onClick={() => { setTierVotes(v => ({ ...v, a: v.a + 1 })); addXp(50); }} className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition text-center font-bold">
                <div className="text-xl text-blue-400 font-black">A-Tier</div>
                <div className="text-xs text-muted-foreground mt-1">{tierVotes.a} Votes</div>
              </button>
            </div>
          </div>
        </section>

        {/* 4. REDDIT-STYLE MICRO-COMMUNITY DISCUSSION HUB */}
        <section className="max-w-4xl mx-auto my-12 px-4">
          <div className="p-6 sm:p-8 rounded-3xl border border-primary/30 bg-card/60 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-black mb-4 text-primary flex items-center gap-2">
              💬 Live Community Lore Threads
            </h3>
            
            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your absolute breakdown or theory... (+75 XP)"
                className="w-full p-4 rounded-2xl bg-background/80 border border-border focus:border-primary focus:outline-none text-sm resize-none h-24 mb-3"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={hasSpoilerToggle} onChange={(e) => setHasSpoilerToggle(e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
                  Contains Spoilers ⚠️
                </label>
                <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-black text-xs sm:text-sm rounded-xl shadow-lg hover:opacity-90 transition">
                  Post Lore ⚡
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-2xl bg-background/40 border border-border/60 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-primary">{comment.user}</span>
                      {comment.spoiler && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">Spoiler</span>}
                    </div>
                    <p className={`text-xs sm:text-sm text-foreground/90 ${comment.spoiler ? "blur-sm hover:blur-none transition duration-300 cursor-pointer" : ""}`}>
                      {comment.text}
                    </p>
                  </div>
                  <button onClick={() => setComments(comments.map(c => c.id === comment.id ? { ...c, votes: c.votes + 1 } : c))} className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition min-w-[45px]">
                    <span className="text-xs font-black">▲</span>
                    <span className="text-xs font-bold">{comment.votes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. INSTANT GLOBAL VERDICT FLASH POLL */}
        <section className="max-w-4xl mx-auto my-12 px-4">
          <div className="p-6 sm:p-8 rounded-3xl border border-primary/30 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xl sm:text-2xl font-black mb-2 text-primary flex items-center gap-2">
              ⚡ Instant Global Verdict
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Cast your vote to unlock secret database metrics and instantly claim +100 XP!</p>
            {!pollVoted ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => { setPollVoted(true); addXp(100); }} className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary hover:bg-primary/5 transition text-left font-bold shadow-sm cursor-pointer">
                  🔥 Absolute Masterpiece (SS-Tier)
                </button>
                <button onClick={() => { setPollVoted(true); addXp(100); }} className="p-4 rounded-2xl border border-border bg-background/50 hover:border-primary hover:bg-primary/5 transition text-left font-bold shadow-sm cursor-pointer">
                  ⭐ Exceptional Storytelling & World
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold text-center animate-fade-in">
                🎉 Vote locked! +100 XP added. 97.4% of global users share your exact rating!
              </div>
            )}
          </div>
        </section>

        {/* 6. SMART RECOMMENDATION MATRIX (TIKTOK-STYLE INFINITE BINGE STREAM) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-3xl border-t border-primary/20 p-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary text-lg shadow-inner">
                🚀
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-widest">Endless Binge Stream Active</p>
                <p className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md">Next Universe Loaded: Discover Exclusive Lore & Rewards</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                to="/$locale/anime/$slug" 
                params={{ locale: "en", slug: "solo-leveling" }}
                className="px-4 sm:px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs sm:text-sm shadow-xl hover:opacity-90 hover:scale-105 transition active:scale-95 whitespace-nowrap"
              >
                Next Binge Universe ⚡
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
