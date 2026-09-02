import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Play, X, Zap, Sparkles, Trophy, Radio, MessageSquare, Heart, Gift, Send, CheckCircle2, Flame, PlusCircle, Video, Lock, Share2, Users } from "lucide-react";
import { FreeVideoDownloads } from "@/components/free-video-downloads";
import { animes } from "@/data/animes";
import { TRAILERS } from "@/data/trailers";
import { uniqueVideos, type FeedVideo } from "@/lib/video-feed";

const BASE_VIDEOS: FeedVideo[] = uniqueVideos([
  ...animes.flatMap((anime): FeedVideo[] => TRAILERS[anime.slug] ? [{ id: TRAILERS[anime.slug], title: anime.title, category: "Anime", description: anime.synopsis, slug: anime.slug }] : []),
  { id: "uHGShqcAHlQ", title: "The Legend of Zelda: Tears of the Kingdom", category: "Gaming", description: "Nintendo's pre-launch epic trailer explores Hyrule's sky islands and Link's new powers." },
  { id: "lMdsrZ1otlA", title: "Genshin Impact — The Outlander Who Caught the Wind", category: "Gaming", description: "The iconic open-world introduction trailer setting the standard for immersive exploration." },
  { id: "9bZkp7q19f0", title: "Classic Animation & Public Domain Vault", category: "Anime", description: "Archived open-source anime features and retro masterpieces from global creators." },
  { id: "jNQXAC9IVRw", title: "Gaming Hub Esports Highlights & Retrospectives", category: "Gaming", description: "High-octane esports moments, tournament clutches, and legendary gaming retrospectives." },
  { id: "M_O5bbkYHIE", title: "Elden Ring — Launch Trailer", category: "Gaming", description: "Journey through the breathtaking and unforgiving Lands Between crafted by FromSoftware." },
  { id: "L_LUpnjgPso", title: "Cyberpunk 2077 — Official Cinematic Trailer", description: "Dive headfirst into Night City, a neon-drenched metropolis obsessed with power and cybernetics." },
  { id: "GONxGNibioM", title: "God of War Ragnarök — Story Trailer", description: "Kratos and Atreus battle destiny and mythic foes before the end of days arrives." },
  { id: "1UQZhXHu0gU", title: "Marvel's Spider-Man 2 — Ultimate Gameplay Reveal", description: "Peter Parker and Miles Morales face their ultimate test against Venom and Kraven the Hunter." },
  { id: "K4DyBUG242c", title: "Demon Slayer: Kimetsu no Yaiba — Infinity Castle Arc", description: "The definitive clash between the Hashira and Muzan Kibutsuji begins in the shadows." },
  { id: "M1V5Nqx0i6U", title: "Jujutsu Kaisen — Shibuya Incident Arc", description: "Absolute chaos consumes Shibuya on Halloween as sorcerers and cursed spirits wage total war." },
  { id: "2Vv-BfVoq4g", title: "One Piece — Wano Country Epic Climax", description: "Luffy shatters limits and unlocks Gear 5 against Emperor Kaido on Onigashima's rooftop." },
  { id: "X8u3MK8b6q4", title: "Solo Leveling — Official Anime Adaptation Trailer", description: "Watch Sung Jinwoo awaken from the weakest hunter to the sovereign of the shadows." },
  { id: "s98mJ51xVog", title: "Dragon Ball Daima — Special World Preview", description: "Goku and the Z-Fighters embark on an unexpected grand adventure in a mysterious realm." },
  { id: "8V764z40sT0", title: "Final Fantasy XVI — Awakening Trailer", description: "A dark fantasy masterpiece where the fate of nations is decided by towering Eikons." }
]);

interface CommentItem {
  id: string;
  user: string;
  text: string;
  time: string;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
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
  const [likes, setLikes] = useState(342 + index * 27);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    { id: "1", user: "OtakuKing99", text: "Absolute masterpiece trailer! The hype is unreal 🔥", time: "2m ago" },
    { id: "2", user: "CyberGamer_X", text: "Been looping this for 10 minutes straight. Can't wait!", time: "12m ago" },
    { id: "3", user: "ShadowMonarch", text: "GameCastle never misses with these drops!", time: "25m ago" }
  ]);

  useEffect(() => {
    if (!playing || !card.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        onStop();
      } else if (!hasScored) {
        setHasScored(true);
        onScore(35);
      }
    }, { threshold: 0.6 });
    observer.observe(card.current);
    const hidden = () => { if (document.hidden) onStop(); };
    document.addEventListener("visibilitychange", hidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hidden); };
  }, [playing, onStop, onScore, hasScored]);

  const handleLike = () => {
    if (!isLiked) {
      setLikes(l => l + 1);
      setIsLiked(true);
      onScore(15);
    } else {
      setLikes(l => l - 1);
      setIsLiked(false);
    }
  };

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newC: CommentItem = {
      id: Date.now().toString(),
      user: "Elite Operator (You)",
      text: commentText.trim(),
      time: "Just now"
    };
    setComments([newC, ...comments]);
    setCommentText("");
    onScore(25);
  };

  const getEmbedId = (idOrUrl: string) => {
    if (!idOrUrl) return "uHGShqcAHlQ";
    if (idOrUrl.includes("youtu.be/")) {
      return idOrUrl.split("youtu.be/")[1]?.split("?")[0] || idOrUrl;
    }
    if (idOrUrl.includes("watch?v=")) {
      return idOrUrl.split("watch?v=")[1]?.split("&")[0] || idOrUrl;
    }
    return idOrUrl;
  };

  const currentEmbedId = getEmbedId(video.id);

  return (
    <article ref={card} className="group relative flex h-[82vh] min-h-[550px] snap-center snap-always flex-col overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0f172a] to-[#020617] shadow-[0_0_60px_rgba(6,182,212,0.25)] transition-all duration-500">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      {/* Side Action Bar */}
      <div className="absolute right-3 bottom-36 z-20 flex flex-col items-center gap-4 bg-slate-950/70 backdrop-blur-md p-2.5 rounded-2xl border border-cyan-500/30 shadow-2xl">
        <button 
          type="button" 
          onClick={handleLike} 
          className="flex flex-col items-center gap-1 group/btn focus:outline-none"
        >
          <span className={`p-3 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] scale-110' : 'bg-slate-900/90 text-cyan-300 hover:bg-slate-800'}`}>
            <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
          </span>
          <span className="text-[11px] font-black text-cyan-200">{likes}</span>
        </button>

        <button 
          type="button" 
          onClick={() => setCommentsOpen(!commentsOpen)} 
          className="flex flex-col items-center gap-1 group/btn focus:outline-none"
        >
          <span className="p-3 rounded-full bg-slate-900/90 text-cyan-300 hover:bg-slate-800 transition-all">
            <MessageSquare size={22} />
          </span>
          <span className="text-[11px] font-black text-cyan-200">{comments.length}</span>
        </button>
      </div>

      <div className="relative min-h-0 flex-1 bg-black overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${currentEmbedId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
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
              src={`https://i.ytimg.com/vi/${currentEmbedId}/maxresdefault.jpg`} 
              onError={(e)=>{(e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${currentEmbedId}/hqdefault.jpg`;}}
              alt={video.title} 
              width={1280} 
              height={720} 
              loading={index < 2 ? "eager" : "lazy"} 
              decoding="async" 
              className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover/btn:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/40 pointer-events-none" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="relative flex items-center justify-center rounded-full bg-cyan-400 p-6 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.8)] transition-transform duration-300 group-hover/btn:scale-125">
                <span className="absolute -inset-2 rounded-full border border-cyan-400/50 animate-ping opacity-75" />
                <Play size={34} fill="currentColor" className="translate-x-0.5" />
              </span>
            </span>
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-slate-900/90 backdrop-blur-md px-4 py-1.5 border border-cyan-500/40 text-xs font-black text-cyan-300 tracking-wider">
              <Radio size={14} className="animate-pulse text-red-500" /> LIVE VIRAL FEED
            </div>
          </button>
        )}
      </div>

      {/* Interactive Comments Drawer */}
      {commentsOpen && (
        <div className="absolute inset-x-0 bottom-0 top-16 z-30 flex flex-col bg-slate-950/98 backdrop-blur-2xl border-t border-cyan-500/50 p-5 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
              <MessageSquare size={18} /> Clip Discussion ({comments.length})
            </h3>
            <button 
              type="button" 
              onClick={() => setCommentsOpen(false)} 
              className="rounded-xl bg-slate-900 p-2 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-cyan-400">{c.user}</span>
                  <span className="text-[10px] text-slate-500">{c.time}</span>
                </div>
                <p className="text-sm text-slate-200 leading-snug">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={addComment} className="flex gap-2.5 pt-3 border-t border-slate-800">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment & earn bonus XP..."
              className="flex-1 rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button type="submit" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-slate-950 font-black hover:scale-105 transition">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <div className="relative z-10 max-h-[42%] shrink-0 overflow-y-auto p-5 sm:p-6 bg-[#090d16]/95 backdrop-blur-xl border-t border-cyan-500/20">
        <div className="flex items-center justify-between gap-3 text-xs font-black tracking-widest text-cyan-400 uppercase">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-300 animate-spin" /> {video.category} · GameCastle Network
          </span>
          {playing && (
            <button 
              type="button" 
              onClick={onStop} 
              className="flex items-center gap-1.5 rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-3.5 py-1.5 text-xs text-cyan-300 transition hover:bg-cyan-500/20 font-bold"
            >
              <X size={14} /> Close Player
            </button>
          )}
        </div>

        <h2 className="mt-2 font-display text-xl font-black tracking-tight text-white sm:text-2xl">{video.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">{video.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          {video.slug && (
            <Link 
              to="/anime/$slug" 
              params={{ slug: video.slug }} 
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              Explore Anime Universe
            </Link>
          )}
          <a 
            href={`https://www.youtube.com/watch?v=${currentEmbedId}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 py-2 text-sm font-bold text-slate-300 underline underline-offset-4 hover:text-cyan-300 transition"
          >
            Source Player <ExternalLink size={14} />
          </a>
        </div>
        <div className="mt-4">
          <FreeVideoDownloads title={video.title} />
        </div>
      </div>
    </article>
  );
}

export function VideoDiscovery() {
  const [category, setCategory] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const [visible, setVisible] = useState(10);
  
  const [userXp, setUserXp] = useState(650);
  const [streakDays] = useState(7);
  const [notification, setNotification] = useState<string | null>("🔥 VIRAL ENGINE: Share to Unlock Live Streaming & Earn Store Vouchers!");
  const [rewardModal, setRewardModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [liveStreamModal, setLiveStreamModal] = useState(false);
  const [globalChatModal, setGlobalChatModal] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);

  // Viral Sharing Gate for Live Streaming
  const [sharesCount, setSharesCount] = useState(0);
  const requiredShares = 3;
  const isLiveUnlocked = sharesCount >= requiredShares || userXp >= 1200;

  // Global Chat Messages
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>([
    { id: "1", user: "ApexPredator", text: "Who is online right now? Let's squad up!", time: "1m ago" },
    { id: "2", user: "AnimeQueen", text: "Solo Leveling season 2 hype is unmatched!!", time: "5m ago" },
    { id: "3", user: "GamerGod", text: "Check the store vault, got 20% off coupon easily!", time: "10m ago" }
  ]);
  const [globalInput, setGlobalInput] = useState("");

  // Custom User Uploads
  const [userVideos, setUserVideos] = useState<FeedVideo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Gaming");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const sentinel = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const stop = useCallback(() => setPlaying(null), []);

  const triggerToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  }, []);

  const claimStoreReward = () => {
    if (userXp >= 500) {
      setUserXp(p => p - 500);
      setClaimedCode("GAMECASTLE-VIP-2026");
      triggerToast("🎁 Success! Store Voucher Unlocked & Credited.");
    } else {
      triggerToast("⚠️ Insufficient XP! Engage more to unlock vouchers.");
    }
  };

  const handleSharePlatform = () => {
    setSharesCount(c => {
      const next = c + 1;
      if (next >= requiredShares) {
        triggerToast("🎉 CONGRATS! Live Streaming Feature UNLOCKED!");
      } else {
        triggerToast(`🔗 Shared! (${next}/${requiredShares}) Share more to unlock Live Streaming instantly.`);
      }
      return next;
    });
  };

  const handleGlobalChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalInput.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: "Elite Member (You)",
      text: globalInput.trim(),
      time: "Just now"
    };
    setGlobalMessages([msg, ...globalMessages]);
    setGlobalInput("");
    setUserXp(p => p + 10);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      triggerToast("⚠️ Provide title and link!");
      return;
    }
    let ytId = newUrl.trim();
    if (ytId.includes("youtu.be/")) ytId = ytId.split("youtu.be/")[1]?.split("?")[0] || ytId;
    if (ytId.includes("watch?v=")) ytId = ytId.split("watch?v=")[1]?.split("&")[0] || ytId;

    const newClip: FeedVideo = {
      id: ytId,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || "Community viral clip."
    };

    setUserVideos([newClip, ...userVideos]);
    setNewTitle("");
    setNewUrl("");
    setNewDesc("");
    setUploadModal(false);
    setUserXp(p => p + 150);
    triggerToast("🚀 Clip published! +150 XP added.");
  };

  const videos = useMemo(() => {
    const combined = [...userVideos, ...BASE_VIDEOS];
    const filtered = combined.filter((video) => category === "All" || video.category === category);
    return [...filtered, ...filtered];
  }, [userVideos, category]);

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
    <div className="relative min-h-screen bg-[#030712] px-3 py-4 text-white sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-cyan-400/60 bg-slate-950/95 px-5 py-3 shadow-[0_0_40px_rgba(6,182,212,0.5)] backdrop-blur-2xl animate-bounce">
          <Zap className="text-cyan-400 animate-pulse" size={20} />
          <span className="text-xs font-black text-cyan-200 tracking-wide">{notification}</span>
        </div>
      )}

      {/* Global Live Chat Modal */}
      {globalChatModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/50 bg-slate-950 p-6 shadow-2xl flex flex-col h-[70vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2">
                <Users className="text-cyan-400" /> Global Syndicate Chat & Hangout
              </h3>
              <button type="button" onClick={() => setGlobalChatModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {globalMessages.map(m => (
                <div key={m.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">{m.user}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="text-sm text-slate-200">{m.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleGlobalChatSubmit} className="flex gap-2 pt-3 border-t border-slate-800">
              <input 
                type="text" 
                value={globalInput}
                onChange={e => setGlobalInput(e.target.value)}
                placeholder="Chat with millions globally..."
                className="flex-1 rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-5 py-3 text-slate-950 font-black hover:scale-105 transition">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Live Stream Gate Modal */}
      {liveStreamModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/50 bg-slate-950 p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 grid place-items-center text-red-400">
              {isLiveUnlocked ? <Radio size={30} className="animate-pulse" /> : <Lock size={30} />}
            </div>
            <h3 className="text-lg font-black text-white">
              {isLiveUnlocked ? "🔴 Go Live Studio Ready!" : "🔒 Live Streaming is Locked!"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isLiveUnlocked 
                ? "You have successfully unlocked the viral streaming room! Broadcast your gameplay or anime reacts to the world instantly."
                : `To prevent spam and keep quality elite, you must share the platform with friends (${sharesCount}/${requiredShares} shares) or reach 1200 XP to unlock Live Streaming.`}
            </p>

            {!isLiveUnlocked ? (
              <div className="space-y-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleSharePlatform}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3.5 text-xs font-black text-white shadow-lg hover:scale-105 transition"
                >
                  <Share2 size={16} /> Share Platform with Friends ({sharesCount}/{requiredShares})
                </button>
                <p className="text-[10px] text-slate-500">Every share brings you closer to massive audience reach!</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-cyan-950/40 border border-cyan-500/50 p-4 space-y-3">
                <p className="text-xs text-cyan-300 font-bold">You are live-ready! Click below to start broadcasting.</p>
                <a href="https://gamecastle.store" target="_blank" rel="noreferrer" className="block rounded-xl bg-cyan-400 text-slate-950 py-3 text-xs font-black">
                  Launch Broadcast Studio 🚀
                </a>
              </div>
            )}

            <button type="button" onClick={() => setLiveStreamModal(false)} className="text-xs font-bold text-slate-400 hover:text-white pt-2">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Upload Clip Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/50 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2">
                <Video className="text-cyan-400" /> Upload Viral Clip
              </h3>
              <button type="button" onClick={() => setUploadModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Insane Boss Fight Clutch"
                  required
                  className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">YouTube Link / ID</label>
                <input 
                  type="text" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Anime">Anime</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setUploadModal(false)} className="px-4 py-2.5 text-xs font-bold text-slate-400">Cancel</button>
                <button type="submit" className="rounded-2xl bg-cyan-400 px-6 py-3 text-xs font-black text-slate-950 shadow-lg hover:scale-105 transition">Publish (+150 XP)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store Voucher Modal */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/50 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2">
                <Gift className="text-amber-400" /> Store Rewards Vault
              </h3>
              <button type="button" onClick={() => setRewardModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            <div className="py-6 space-y-4">
              <p className="text-sm text-slate-300">Exchange XP for 20% OFF vouchers on <span className="text-cyan-400 font-bold">gamecastle.store</span>!</p>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Cost</p>
                  <p className="font-display font-black text-amber-400 text-lg">500 XP</p>
                </div>
                <button type="button" onClick={claimStoreReward} className="rounded-2xl bg-cyan-400 px-6 py-3 text-xs font-black text-slate-950">Redeem</button>
              </div>
              {claimedCode && (
                <div className="rounded-2xl bg-cyan-950/40 border border-cyan-500/50 p-4 text-center space-y-2">
                  <p className="text-xs text-cyan-300 font-bold">Your Store Code:</p>
                  <code className="block bg-black p-3 rounded-2xl font-mono text-amber-300 font-black text-xl">{claimedCode}</code>
                  <a href="https://gamecastle.store" target="_blank" rel="noreferrer" className="text-xs text-cyan-400 underline pt-1 block">Visit gamecastle.store ↗</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-3xl">
        {/* Top Viral Toolbar */}
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-2.5">
            <Trophy size={18} className="text-amber-400" />
            <div>
              <p className="text-[8px] font-black uppercase text-slate-400">XP</p>
              <p className="text-xs font-black text-amber-300">{userXp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-2.5">
            <Flame size={18} className="text-red-500" />
            <div>
              <p className="text-[8px] font-black uppercase text-slate-400">Streak</p>
              <p className="text-xs font-black text-red-400">{streakDays}d 🔥</p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setLiveStreamModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 px-2.5 py-2.5 text-[11px] font-black text-white shadow-lg hover:scale-105 transition"
          >
            <Radio size={16} className="animate-pulse" /> Go Live {isLiveUnlocked ? "" : "🔒"}
          </button>

          <button 
            type="button" 
            onClick={() => setGlobalChatModal(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 border border-cyan-500/40 px-2.5 py-2.5 text-[11px] font-black text-cyan-300 hover:bg-slate-800 transition"
          >
            <Users size={16} /> Global Chat
          </button>

          <button 
            type="button" 
            onClick={() => setUploadModal(true)}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-2.5 py-2.5 text-[11px] font-black text-slate-950 shadow-lg"
          >
            <PlusCircle size={16} /> Upload
          </button>
        </div>

        {/* Category Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
            <h1 className="font-display text-xl font-black tracking-tight sm:text-3xl bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              GameCastle Viral Feed
            </h1>
          </div>
          <div className="flex gap-2">
            {["All", "Anime", "Gaming"].map((tab) => (
              <button 
                key={tab} 
                type="button" 
                onClick={() => { setCategory(tab); setVisible(10); stop(); feed.current?.scrollTo({ top: 0 }); }} 
                className={`rounded-2xl border px-4 py-2 text-xs font-black transition-all ${
                  category === tab 
                    ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105" 
                    : "border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Feed */}
        <div 
          ref={feed} 
          tabIndex={0} 
          role="region" 
          aria-label="Viral vertical feed" 
          className="h-[82vh] min-h-[600px] snap-y snap-mandatory overflow-y-auto overscroll-y-none rounded-3xl border border-slate-800 bg-black/95 p-2.5 shadow-2xl backdrop-blur-2xl scrollbar-none"
        >
          {videos.slice(0, visible).map((video, idx) => (
            <div key={`${video.id}-${idx}`} className="mb-4 h-[82vh] min-h-[550px] snap-center snap-always last:mb-0">
              <VideoCard 
                video= {video} 
                playing={playing === `${video.id}-${idx}`} 
                onPlay={() => setPlaying(`${video.id}-${idx}`)} 
                onStop={stop} 
                onScore={(pts) => setUserXp(p => p + pts)}
                index={idx}
              />
            </div>
          ))}
          
          <div ref={sentinel} className="h-20 w-full grid place-items-center" aria-hidden="true">
            {hasMore && (
              <div className="flex items-center gap-2 text-xs font-black text-cyan-400 animate-pulse bg-cyan-950/40 border border-cyan-500/30 px-5 py-2.5 rounded-full shadow-lg">
                <Sparkles size={16} className="animate-spin" /> Summoning Viral Content…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
