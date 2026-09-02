import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowDown, ExternalLink, Play, X, Award, Flame, Zap, Compass, Sparkles, Trophy, Radio } from "lucide-react";
import { FreeDownloadSearch, FreeVideoDownloads } from "@/components/free-video-downloads";
import { FreeGames } from "@/components/free-games";
import { LiveStreams } from "@/components/live-streams";
import { animes } from "@/data/animes";
import { TRAILERS } from "@/data/trailers";
import { parseTrailerPage, uniqueVideos, type FeedVideo } from "@/lib/video-feed";

const INITIAL: FeedVideo[] = uniqueVideos([
  ...animes.flatMap((anime): FeedVideo[] => TRAILERS[anime.slug] ? [{ id: TRAILERS[anime.slug], title: anime.title, category: "Anime", description: anime.synopsis, slug: anime.slug }] : []),
  { id: "uHGShqcAHlQ", title: "The Legend of Zelda: Tears of the Kingdom", category: "Gaming", description: "Nintendo's third pre-launch trailer explores Hyrule, the sky islands and Link's adventure." },
  { id: "lMdsrZ1otlA", title: "Genshin Impact — The Outlander Who Caught the Wind", category: "Gaming", description: "The announcement trailer from Genshin Impact introduces its open-world adventure." },
  { id: "9bZkp7q19f0", title: "Classic Animation & Public Domain Showcase", category: "Anime", description: "Archived open-source anime and classic animation features hosted on public media vaults." },
  { id: "jNQXAC9IVRw", title: "Gaming Hub Live Experience & Highlights", category: "Gaming", description: "Community highlights, esports moments, and retro gaming retrospectives." }
]);

interface Achievement {
  id: string;
  title: string;
  unlocked: boolean;
  icon: string;
}

function VideoCard({ 
  video, 
  playing, 
  onPlay, 
  onStop, 
  onScore,
  index 
}: { 
  video: FeedVideo; 
  playing: boolean; 
  onPlay: () => void; 
  onStop: () => void; 
  onScore: (points: number) => void;
  index: number;
}) {
  const card = useRef<HTMLElement>(null);
  const [hasScored, setHasScored] = useState(false);

  useEffect(() => {
    if (!playing || !card.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        onStop();
      } else if (!hasScored) {
        setHasScored(true);
        onScore(25);
      }
    }, { threshold: 0.6 });
    observer.observe(card.current);
    const hidden = () => { if (document.hidden) onStop(); };
    document.addEventListener("visibilitychange", hidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hidden); };
  }, [playing, onStop, onScore, hasScored]);

  return (
    <article ref={card} className="group relative flex h-[calc(100dvh-12rem)] min-h-[32rem] snap-start snap-always flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0f172a] to-[#020617] shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all duration-500 hover:border-cyan-400/60">
      {/* Absolute Glow Accents */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Media Viewport */}
      <div className="relative min-h-0 flex-1 bg-black overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
            title={`${video.title} — Immersive Stream`}
            className="absolute inset-0 h-full w-full border-0 scale-[1.01]"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button 
            type="button" 
            onClick={onPlay} 
            className="group/btn absolute inset-0 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" 
            aria-label={`Play ${video.title}`}
          >
            <img 
              src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`} 
              onError={(e)=>{(e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;}}
              alt={video.title} 
              width={1280} 
              height={720} 
              loading={index < 2 ? "eager" : "lazy"} 
              decoding="async" 
              className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover/btn:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/30 pointer-events-none" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="relative flex items-center justify-center rounded-full bg-cyan-400 p-6 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-transform duration-300 group-hover/btn:scale-125">
                <span className="absolute -inset-2 rounded-full border border-cyan-400/50 animate-ping opacity-75" />
                <Play size={32} fill="currentColor" className="translate-x-0.5" />
              </span>
            </span>
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Radio size={12} className="animate-pulse text-red-500" /> LIVE IMMERSIVE FEED
            </div>
          </button>
        )}
      </div>

      {/* Content Meta Drawer */}
      <div className="relative z-10 max-h-[45%] shrink-0 overflow-y-auto p-5 sm:p-6 bg-[#090d16]/90 backdrop-blur-xl border-t border-cyan-500/20">
        <div className="flex items-center justify-between gap-3 text-xs font-bold tracking-wider text-cyan-400 uppercase">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-300 animate-spin" /> {video.category} · Neural Stream
          </span>
          {playing && (
            <button 
              type="button" 
              onClick={onStop} 
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 transition hover:bg-cyan-500/20"
            >
              <X size={14} /> Close Stream
            </button>
          )}
        </div>

        <h2 className="mt-2 font-display text-xl font-black tracking-tight text-white sm:text-2xl drop-shadow-sm">{video.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">{video.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          {video.slug && (
            <Link 
              to="/anime/$slug" 
              params={{ slug: video.slug }} 
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Explore Anime Hub
            </Link>
          )}
          <a 
            href={`https://www.youtube.com/watch?v=${video.id}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-slate-300 underline underline-offset-4 hover:text-cyan-300 transition-colors"
          >
            Open Source Player <ExternalLink size={14} />
          </a>
        </div>
        <div className="mt-3">
          <FreeVideoDownloads title={video.title} />
        </div>
      </div>
    </article>
  );
}

export function VideoDiscovery() {
  const [category, setCategory] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const [discover] = useState(true);
  const [visible, setVisible] = useState(8);
  
  // Immersive Gamification Engine State
  const [userXp, setUserXp] = useState(350);
  const [streakCount, setStreakCount] = useState(5);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(["Novice Explorer", "Stream Addict"]);
  const [notification, setNotification] = useState<string | null>("⚡ Hyper-Stream Mode Active: Scroll infinitely to accumulate XP!");

  const sentinel = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const lastRequest = useRef(0);
  const stop = useCallback(() => setPlaying(null), []);

  // Trigger temporary notification toast
  const triggerToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleEarnScore = useCallback((basePoints: number) => {
    const earned = basePoints * comboMultiplier;
    setUserXp((prev) => {
      const next = prev + earned;
      if (next >= 1000 && !unlockedBadges.includes("Cyber Master")) {
        setUnlockedBadges((b) => [...b, "Cyber Master"]);
        triggerToast("🏆 Achievement Unlocked: Cyber Master!");
      }
      return next;
    });
    setComboMultiplier((c) => Math.min(c + 0.5, 3));
  }, [comboMultiplier, unlockedBadges, triggerToast]);

  const query = useInfiniteQuery({
    queryKey: ["video-trailers-hyper-feed"],
    initialPageParam: 1,
    enabled: discover,
    staleTime: 6 * 60 * 60 * 1000,
    retry: true,
    queryFn: async ({ pageParam, signal }) => {
      const delay = Math.max(0, 800 - (Date.now() - lastRequest.current));
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      signal.throwIfAborted();
      lastRequest.current = Date.now();
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${pageParam}&limit=25&sfw=true&filter=bypopularity`, { signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]) });
      if (!response.ok) throw new Error("Stream synchronization busy.");
      return parseTrailerPage(await response.json());
    },
    getNextPageParam: (page, pages) => page.hasNext ? pages.length + 1 : undefined,
  });

  const videos = useMemo(() => {
    const combined = uniqueVideos([...INITIAL, ...(query.data?.pages.flatMap((page) => page.videos) ?? [])]);
    return combined.filter((video) => category === "All" || video.category === category);
  }, [category, query.data]);

  const { isFetching, isError, hasNextPage, fetchNextPage } = query;

  const loadMore = useCallback(() => {
    if (visible < videos.length) { 
      setVisible((count) => Math.min(count + 6, videos.length)); 
      return; 
    }
    if (isFetching || isError) return;
    if (hasNextPage) {
      void fetchNextPage();
      setVisible((count) => count + 6);
    }
  }, [visible, videos.length, isFetching, isError, hasNextPage, fetchNextPage]);

  // Infinite Scroll Observer Intersection
  useEffect(() => {
    if (!sentinel.current || !feed.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    }, { root: feed.current, rootMargin: "0px 0px 400px 0px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadMore]);

  // Keyboard navigation immersion handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        // Quick toggle fullscreen vibe
        triggerToast("🚀 Hyper-Focus Immersive Engine Triggered!");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerToast]);

  return (
    <div className="relative min-h-screen bg-[#030712] px-3 py-6 text-white sm:px-6 overflow-hidden">
      {/* Background Ambient Cyber Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Floating Dynamic Toast Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-cyan-400/50 bg-slate-950/90 px-5 py-3 shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-2xl animate-bounce">
          <Zap className="text-cyan-400 animate-pulse" size={20} />
          <span className="text-sm font-bold text-cyan-200">{notification}</span>
        </div>
      )}

      <div className="relative mx-auto max-w-4xl">
        
        {/* Immersive Gamification Dashboard Header */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#0b1329] to-slate-950 p-4 shadow-xl backdrop-blur-xl">
          
          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/30">
              <Flame size={24} fill="currentColor" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Otaku Streak Status</p>
              <p className="font-display text-lg font-black text-cyan-300">{streakCount} Days Active 🔥</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-y sm:border-y-0 sm:border-x border-cyan-500/20 py-2 sm:py-0 sm:px-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30">
              <Trophy size={24} />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Neural XP Vault</p>
              <p className="font-display text-lg font-black text-amber-300">{userXp} <span className="text-xs text-slate-400">({comboMultiplier}x Multiplier)</span></p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Unlocked Badges</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {unlockedBadges.map((badge) => (
                  <span key={badge} className="rounded-md bg-cyan-500/10 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Header Title Section */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <p className="text-xs font-black uppercase tracking-widest text-cyan-400">GameCastle · Quantum Cinema Hub</p>
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Endless Immersive Feed
            </h1>
            <p className="mt-2 text-sm text-slate-300 flex items-center gap-2">
              <ArrowDown size={16} className="text-cyan-400 animate-bounce" /> Swipe or scroll infinitely like TikTok — time flows endlessly here.
            </p>
          </div>
          <Link 
            to="/browse" 
            className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-300 backdrop-blur-md transition-all hover:bg-cyan-400/20 hover:border-cyan-300 shadow-lg"
          >
            Explore Catalog
          </Link>
        </div>

        {/* Collapsible Utility & Tools Vault */}
        <details className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl transition-all open:border-cyan-500/40">
          <summary className="cursor-pointer text-sm font-bold text-cyan-300 flex items-center gap-2 select-none">
            <Compass size={18} /> 🛠️ Advanced Tools Hub: Downloads, Free Games & Live Streams
          </summary>
          <div className="mt-4 space-y-4 pt-2 border-t border-slate-800">
            <FreeDownloadSearch />
            <FreeGames />
            <LiveStreams playing={playing} onPlay={setPlaying} onStop={stop} />
          </div>
        </details>

        {/* Category Navigation Pills */}
        <div className="mb-6 flex flex-wrap gap-2.5" aria-label="Filter category streams">
          {["All", "Anime", "Gaming"].map((tab) => (
            <button 
              key={tab} 
              type="button" 
              aria-pressed={category === tab} 
              onClick={() => { setCategory(tab); setVisible(8); stop(); feed.current?.scrollTo({ top: 0 }); }} 
              className={`rounded-full border px-6 py-2 text-sm font-bold transition-all duration-300 ${
                category === tab 
                  ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105" 
                  : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Infinite Vertical Snap Container (TikTok Style Immersion) */}
        <div 
          ref={feed} 
          tabIndex={0} 
          role="region" 
          aria-label="Swipe video feed" 
          className="h-[calc(100dvh-16rem)] min-h-[32rem] snap-y snap-mandatory overflow-y-auto overscroll-y-contain rounded-3xl border border-slate-800 bg-black/80 p-2.5 shadow-2xl backdrop-blur-2xl focus-visible:outline-2 focus-visible:outline-cyan-400 scrollbar-none"
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || !["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;
            event.preventDefault();
            const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1;
            event.currentTarget.scrollBy({ top: direction * event.currentTarget.clientHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
          }}
        >
          {videos.slice(0, visible).map((video, idx) => (
            <div key={`${video.id}-${idx}`} className="mb-5 last:mb-0">
              <VideoCard 
                video={video} 
                playing={playing === video.id} 
                onPlay={() => setPlaying(video.id)} 
                onStop={stop} 
                onScore={handleEarnScore}
                index={idx}
              />
            </div>
          ))}
          
          {/* Sentinel Observer Trigger for Infinite Fetch */}
          <div ref={sentinel} className="h-24 w-full grid place-items-center" aria-hidden="true">
            {isFetching && (
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 animate-pulse bg-cyan-950/40 border border-cyan-500/30 px-4 py-2 rounded-full">
                <Sparkles size={14} className="animate-spin" /> Synchronizing next quantum stream batch…
              </div>
            )}
          </div>
        </div>

        {/* Footer Disclaimer & Legal Vault Status */}
        <div className="py-6 text-center">
          {query.isError && <p role="status" className="mb-2 text-xs text-amber-400">Stream feed operating on high-speed cached archive vaults.</p>}
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500">
            GameCastle is an elite interactive entertainment platform. All embedded feeds operate via public domain vectors and open third-party distribution APIs. No direct copyright infringement intended.
          </p>
        </div>

      </div>
    </div>
  );
}
