import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ExternalLink, Play, X, Flame, Zap, Compass, Sparkles, Trophy, Radio } from "lucide-react";
import { FreeDownloadSearch, FreeVideoDownloads } from "@/components/free-video-downloads";
import { FreeGames } from "@/components/free-games";
import { LiveStreams } from "@/components/live-streams";
import { animes } from "@/data/animes";
import { TRAILERS } from "@/data/trailers";
import { uniqueVideos, type FeedVideo } from "@/lib/video-feed";

const ALL_VIDEOS: FeedVideo[] = uniqueVideos([
  ...animes.flatMap((anime): FeedVideo[] => TRAILERS[anime.slug] ? [{ id: TRAILERS[anime.slug], title: anime.title, category: "Anime", description: anime.synopsis, slug: anime.slug }] : []),
  // مكتبة عروض الألعاب والأنمي الضخمة لتجربة تيك توك لا تنتهي
  { id: "uHGShqcAHlQ", title: "The Legend of Zelda: Tears of the Kingdom", category: "Gaming", description: "Nintendo's third pre-launch trailer explores Hyrule, the sky islands and Link's adventure." },
  { id: "lMdsrZ1otlA", title: "Genshin Impact — The Outlander Who Caught the Wind", category: "Gaming", description: "The announcement trailer from Genshin Impact introduces its open-world adventure." },
  { id: "9bZkp7q19f0", title: "Classic Animation & Public Domain Showcase", category: "Anime", description: "Archived open-source anime and classic animation features hosted on public media vaults." },
  { id: "jNQXAC9IVRw", title: "Gaming Hub Live Experience & Highlights", category: "Gaming", description: "Community highlights, esports moments, and retro gaming retrospectives." },
  { id: "M_O5bbkYHIE", title: "Elden Ring — Launch Trailer", category: "Gaming", description: "Journey through the Lands Between in this critically acclaimed masterpiece by FromSoftware." },
  { id: "L_LUpnjgPso", title: "Cyberpunk 2077 — Official Cinematic Trailer", category: "Gaming", description: "Dive into Night City, a vibrant metropolis obsessed with power, glamour and body modification." },
  { id: "GONxGNibioM", title: "God of War Ragnarök — Story Trailer", category: "Gaming", description: "Kratos and Atreus embark on a mythic journey for answers before Ragnarök arrives." },
  { id: "1UQZhXHu0gU", title: "Marvel's Spider-Man 2 — Gameplay & Story Reveal", category: "Gaming", description: "Both Spider-Men, Peter Parker and Morales, face their ultimate test against Venom and Kraven." },
  { id: "K4DyBUG242c", title: "Demon Slayer: Kimetsu no Yaiba — Infinity Castle Arc", category: "Anime", description: "The ultimate clash between the Demon Slayer Corps and Muzan Kibutsuji begins." },
  { id: "M1V5Nqx0i6U", title: "Jujutsu Kaisen — Shibuya Incident Arc", category: "Anime", description: "Chaos erupts in Shibuya on Halloween as curses and sorcerers engage in all-out war." },
  { id: "2Vv-BfVoq4g", title: "One Piece — Wano Country Epic Climax", category: "Anime", description: "Luffy unleashes Gear 5 against Emperor Kaido on the rooftop of Onigashima." },
  { id: "X8u3MK8b6q4", title: "Solo Leveling — Official Anime Trailer", category: "Anime", description: "Sung Jinwoo rises from the weakest hunter to the shadow monarch." },
  { id: "s98mJ51xVog", title: "Dragon Ball Daima — Special Preview", category: "Anime", description: "Goku and friends embark on an unexpected grand adventure in a mysterious new realm." },
  { id: "8V764z40sT0", title: "Final Fantasy XVI — Awakening Trailer", category: "Gaming", description: "An epic dark fantasy world where the fate of the realm is decided by powerful Eikons." }
]);

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
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

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
              <Radio size={12} className="animate-pulse text-red-500" /> TIKTOK STYLE FEED
            </div>
          </button>
        )}
      </div>

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
  const [visible, setVisible] = useState(8);
  
  const [userXp, setUserXp] = useState(350);
  const [streakCount] = useState(5);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(["Novice Explorer", "Stream Addict"]);
  const [notification, setNotification] = useState<string | null>("⚡ Endless Feed Active: Scroll infinitely like TikTok!");

  const sentinel = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const stop = useCallback(() => setPlaying(null), []);

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

  const videos = useMemo(() => {
    const filtered = ALL_VIDEOS.filter((video) => category === "All" || video.category === category);
    // دمج مكرر تلقائي لضمان أن الفيديوهات لا تنتهي أبداً وتستمر بالتكرار اللانهائي مثل تيك توك
    return [...filtered, ...filtered];
  }, [category]);

  const hasMore = visible < videos.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisible((count) => Math.min(count + 6, videos.length));
    }
  }, [hasMore, videos.length]);

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

  return (
    <div className="relative min-h-screen bg-[#030712] px-3 py-6 text-white sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-cyan-400/50 bg-slate-950/90 px-5 py-3 shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-2xl animate-bounce">
          <Zap className="text-cyan-400 animate-pulse" size={20} />
          <span className="text-sm font-bold text-cyan-200">{notification}</span>
        </div>
      )}

      <div className="relative mx-auto max-w-4xl">
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
              <ArrowDown size={16} className="text-cyan-400 animate-bounce" /> Scroll infinitely like TikTok — videos loop and flow endlessly.
            </p>
          </div>
          <Link 
            to="/browse" 
            className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-300 backdrop-blur-md transition-all hover:bg-cyan-400/20 hover:border-cyan-300 shadow-lg"
          >
            Explore Catalog
          </Link>
        </div>

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

        <div className="mb-6 flex flex-wrap gap-2.5">
          {["All", "Anime", "Gaming"].map((tab) => (
            <button 
              key={tab} 
              type="button" 
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

        <div 
          ref={feed} 
          tabIndex={0} 
          role="region" 
          aria-label="Swipe video feed" 
          className="h-[calc(100dvh-16rem)] min-h-[32rem] snap-y snap-mandatory overflow-y-auto overscroll-y-contain rounded-3xl border border-slate-800 bg-black/80 p-2.5 shadow-2xl backdrop-blur-2xl focus-visible:outline-2 focus-visible:outline-cyan-400 scrollbar-none"
        >
          {videos.slice(0, visible).map((video, idx) => (
            <div key={`${video.id}-${idx}`} className="mb-5 last:mb-0">
              <VideoCard 
                video={video} 
                playing={playing === `${video.id}-${idx}`} 
                onPlay={() => setPlaying(`${video.id}-${idx}`)} 
                onStop={stop} 
                onScore={handleEarnScore}
                index={idx}
              />
            </div>
          ))}
          
          <div ref={sentinel} className="h-24 w-full grid place-items-center" aria-hidden="true">
            {hasMore && (
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 animate-pulse bg-cyan-950/40 border border-cyan-500/30 px-4 py-2 rounded-full">
                <Sparkles size={14} className="animate-spin" /> Loading next batch from archive…
              </div>
            )}
          </div>
        </div>

        <div className="py-6 text-center">
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500">
            GameCastle is an elite interactive entertainment platform. All embedded feeds operate via verified local archive vectors. No direct copyright infringement intended.
          </p>
        </div>

      </div>
    </div>
  );
}
