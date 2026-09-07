import React, { useCallback, useEffect, useState } from "react";
import { 
  Compass, PlusCircle, MessageCircle, Share2, ArrowUp, 
  Image as ImageIcon, Upload, Sparkles, Trophy, Search, 
  Flame, Clock, Filter, Send, X, CheckCircle2, Heart, 
  Award, Zap, Crown, Activity, Star, Smile, ShieldAlert 
} from "lucide-react";
import { supabase } from "@lib/supabase";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  upvotes: number;
  imageUrl?: string;
  created_at?: string;
  reactions?: { fire: number; love: number; mindblown: number };
}

interface Comment {
  id: string;
  post_id: string;
  author: string;
  content: string;
  created_at?: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  badge: string;
}

export function VideoDiscovery() {
  const [activeTab, setActiveTab] = useState<"discover" | "community" | "leaderboard">("community");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"trending" | "latest">("trending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Gamification State (Addictive Loop)
  const [userXp, setUserXp] = useState<number>(1450);
  const [userStreak, setUserStreak] = useState<number>(5);
  const [userRankTitle, setUserRankTitle] = useState<string>("Elite Otaku");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveTickerText, setLiveTickerText] = useState<string>("🔥 Zoro_Elite just unlocked 'Legendary Creator' badge (+500 XP)!");

  // Posts State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostCategory, setNewPostCategory] = useState<string>("Anime");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Comments State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: Comment[] }>({});
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  // Leaderboard Mock Data (Driven by addiction)
  const leaderboardUsers: LeaderboardUser[] = [
    { rank: 1, name: "Zoro_King_99", xp: 14200, badge: "👑 Anime Overlord" },
    { rank: 2, name: "Akame_Gamer", xp: 11850, badge: "⚡ Cyberpunk Master" },
    { rank: 3, name: "Luffy_Pirat", xp: 9600, badge: "🔥 Trendsetter" },
    { rank: 4, name: "Gojo_Infinite", xp: 8400, badge: "💎 Elite Curator" },
    { rank: 5, name: "You (Elite Creator)", xp: userXp, badge: "🚀 Rising Star" },
  ].sort((a, b) => b.xp - a.xp);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Live Ticker simulation
  useEffect(() => {
    const tickers = [
      "⚡ New high-res Cyberpunk wallpaper added in Wallpapers!",
      "🔥 Community milestone reached: 10,000 active anime fans online!",
      "🏆 User Gojo_Infinite just claimed the Weekly Crown!",
      "💎 Daily streak bonus available: Check-in now for +250 XP!"
    ];
    const interval = setInterval(() => {
      const randomMsg = tickers[Math.floor(Math.random() * tickers.length)];
      setLiveTickerText(randomMsg);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Posts from Supabase
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category || "General",
            author: item.author || "Elite Member",
            upvotes: item.upvotes || 0,
            imageUrl: item.image_url || "",
            created_at: item.created_at,
            reactions: { fire: 12, love: 8, mindblown: 5 }
          }));
          setPosts(formatted);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchPosts();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    setUploadingImage(true);
    let uploadedImageUrl = "";

    try {
      if (postImageFile) {
        const fileExt = postImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(fileName, postImageFile);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('community-images')
            .getPublicUrl(fileName);
          uploadedImageUrl = publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          title: newPostTitle, 
          content: newPostContent, 
          category: newPostCategory, 
          author: "Elite Creator",
          image_url: uploadedImageUrl,
          upvotes: 1
        }])
        .select();

      if (!error && data) {
        const newXp = userXp + 300;
        setUserXp(newXp);
        if (newXp > 2000) setUserRankTitle("Anime Overlord 👑");
        triggerToast("🚀 Masterpiece Published! +300 XP & Streak Bonus!");
        
        const newEntry: Post = {
          id: data[0]?.id || String(Date.now()),
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          author: "Elite Creator",
          upvotes: 1,
          imageUrl: uploadedImageUrl,
          created_at: new Date().toISOString(),
          reactions: { fire: 1, love: 0, mindblown: 0 }
        };
        setPosts([newEntry, ...posts]);
      }
    } catch (err) {
      console.error("Error saving post:", err);
      triggerToast("⚠️ Failed to publish post.");
    }

    setNewPostTitle("");
    setNewPostContent("");
    setPostImageFile(null);
    setImagePreview(null);
    setIsPosting(false);
  };

  const handleUpvote = async (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    setUserXp(prev => prev + 25);
    triggerToast("🔥 Massive Upvote! +25 XP");
  };

  const handleReaction = (id: string, type: 'fire' | 'love' | 'mindblown') => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        const currentReactions = p.reactions || { fire: 0, love: 0, mindblown: 0 };
        return {
          ...p,
          reactions: { ...currentReactions, [type]: currentReactions[type] + 1 }
        };
      }
      return p;
    }));
    setUserXp(prev => prev + 10);
    triggerToast(`✨ Reaction added! +10 XP`);
  };

  const fetchComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(postId);
    setLoadingComments(true);

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setCommentsMap(prev => ({ ...prev, [postId]: data }));
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, author: "Elite User", content: newCommentText }])
        .select();

      if (!error && data) {
        const addedComment = data[0] as Comment;
        setCommentsMap(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), addedComment]
        }));
        setNewCommentText("");
        setUserXp(prev => prev + 50);
        triggerToast("💬 Reply posted! +50 XP");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Filter & Sort Logic
  const filteredPosts = posts.filter(post => {
    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "trending") return b.upvotes - a.upvotes;
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 md:p-6 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification System */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 px-5 py-3 text-xs font-black text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.8)] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Live Activity Ticker Bar */}
      <div className="max-w-4xl mx-auto mb-4 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl px-4 py-2 flex items-center justify-between text-xs shadow-lg">
        <div className="flex items-center gap-2 overflow-hidden">
          <Activity size={16} className="text-cyan-400 animate-pulse shrink-0" />
          <span className="text-slate-300 font-bold truncate">{liveTickerText}</span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 text-[11px] font-black text-emerald-400">
          <span>🔥 {userStreak} Days Streak</span>
        </div>
      </div>

      {/* Top Header & Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("discover")}
            className={`rounded-2xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "discover" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] scale-105" 
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Compass size={16} /> Discover Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className={`rounded-2xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "community" 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.5)] scale-105 font-extrabold" 
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Sparkles size={16} /> Community & Gallery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`rounded-2xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "leaderboard" 
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-105 font-extrabold" 
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Trophy size={16} /> Leaderboard
          </button>
        </div>

        {/* User XP & Rank Badge Widget */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-xs font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/30 flex items-center gap-2 shadow-inner">
            <Trophy size={15} /> {userXp} XP • <span className="text-cyan-400">{userRankTitle}</span>
          </div>
        </div>
      </div>

      {activeTab === "discover" ? (
        <div className="max-w-3xl mx-auto py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Compass className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-lg font-black text-white mb-2 tracking-wide">Discovery Stream Active</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Immerse yourself in top-tier anime feeds, high-definition digital aesthetics, and cutting-edge visual streams.
          </p>
        </div>
      ) : activeTab === "leaderboard" ? (
        /* LEADERBOARD TAB (Addictive Competition) */
        <div className="max-w-2xl mx-auto space-y-6 bg-slate-900/80 border border-amber-500/30 p-6 rounded-3xl backdrop-blur-xl shadow-2xl animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Crown size={28} />
            </div>
            <h2 className="text-base font-black text-white">Global Weekly Elite Leaderboard</h2>
            <p className="text-xs text-slate-400">Compete with creators worldwide, earn XP, and claim the weekly throne.</p>
          </div>

          <div className="space-y-3">
            {leaderboardUsers.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  user.rank === 1 
                    ? "bg-gradient-to-r from-amber-500/20 to-slate-900 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    user.rank === 1 ? "bg-amber-400 text-slate-950" :
                    user.rank === 2 ? "bg-slate-300 text-slate-950" :
                    user.rank === 3 ? "bg-amber-700 text-white" : "bg-slate-900 text-slate-400"
                  }`}>
                    #{user.rank}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">{user.name}</h3>
                    <span className="text-[10px] text-amber-400 font-bold">{user.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-cyan-400">{user.xp.toLocaleString()} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* COMMUNITY & GALLERY TAB */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Action Header & Search */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search community posts & wallpapers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setSortBy(sortBy === "trending" ? "latest" : "trending")}
                className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                {sortBy === "trending" ? <Flame size={14} className="text-amber-400" /> : <Clock size={14} className="text-cyan-400" />}
                {sortBy === "trending" ? "Trending" : "Latest"}
              </button>
              <button
                type="button"
                onClick={() => setIsPosting(!isPosting)}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-black text-slate-950 hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              >
                <PlusCircle size={15} /> Create Post
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Anime", "Gaming", "AI & Art", "Wallpapers"].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat 
                    ? "bg-emerald-400 text-slate-950 shadow-md scale-105" 
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                #{cat}
              </button>
            ))}
          </div>

          {/* New Post Creator Modal / Card */}
          {isPosting && (
            <form onSubmit={handleCreatePost} className="bg-slate-900/95 border border-emerald-500/50 p-6 rounded-3xl space-y-4 shadow-2xl backdrop-blur-xl animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={16} /> Publish New Community Post (+300 XP)
                </h3>
                <button type="button" onClick={() => setIsPosting(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Catchy title for your post or wallpaper..."
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all"
                required
              />
              <textarea
                placeholder="Write your thoughts, anime review, or describe your artwork..."
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                rows={4}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all resize-none"
              />

              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-800 hover:border-emerald-400 rounded-2xl p-4 bg-slate-950/60 cursor-pointer transition-all group">
                  <Upload size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-300 font-bold">
                    {postImageFile ? postImageFile.name : "Click to upload image, wallpaper or artwork"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>

                {imagePreview && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPostImageFile(null); setImagePreview(null); }}
                      className="absolute top-3 right-3 bg-slate-950/80 p-1.5 rounded-full text-white hover:bg-rose-500 cursor-pointer transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                <select
                  value={newPostCategory}
                  onChange={e => setNewPostCategory(e.target.value)}
                  className="w-full md:w-auto rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Anime">Anime</option>
                  <option value="Gaming">Gaming</option>
                  <option value="AI & Art">AI & Art</option>
                  <option value="Wallpapers">Wallpapers</option>
                </select>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full md:w-auto rounded-2xl bg-emerald-500 px-8 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 cursor-pointer disabled:opacity-50 transition-all shadow-lg"
                >
                  {uploadingImage ? "Syncing to Cloud..." : "Publish Now (+300 XP)"}
                </button>
              </div>
            </form>
          )}

          {/* Posts Feed Stream */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold">No posts found matching your criteria.</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl flex gap-4 items-start hover:border-slate-700 transition-all shadow-xl backdrop-blur-md">
                  {/* Upvote Column */}
                  <div className="flex flex-col items-center justify-center bg-slate-950 px-3 py-2.5 rounded-2xl border border-slate-800/80 shadow-inner">
                    <button 
                      type="button" 
                      onClick={() => handleUpvote(post.id)} 
                      className="text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors p-1"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <span className="text-xs font-black text-white my-1">{post.upvotes}</span>
                  </div>

                  {/* Post Content Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                        #{post.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">By {post.author}</span>
                    </div>

                    <h3 className="text-sm font-black text-white mb-2 tracking-wide">{post.title}</h3>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed whitespace-pre-line">{post.content}</p>

                    {post.imageUrl && (
                      <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800 max-h-96 bg-slate-950 shadow-2xl">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" />
                      </div>
                    )}

                    {/* Reactions Bar (🔥 💖 🤯) */}
                    <div className="flex items-center gap-3 mb-3">
                      <button 
                        type="button" 
                        onClick={() => handleReaction(post.id, 'fire')}
                        className="bg-slate-950 border border-slate-800 hover:border-amber-500 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        🔥 {post.reactions?.fire || 12}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleReaction(post.id, 'love')}
                        className="bg-slate-950 border border-slate-800 hover:border-rose-500 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        💖 {post.reactions?.love || 8}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleReaction(post.id, 'mindblown')}
                        className="bg-slate-950 border border-slate-800 hover:border-cyan-500 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        🤯 {post.reactions?.mindblown || 5}
                      </button>
                    </div>

                    {/* Post Actions Bar */}
                    <div className="flex items-center gap-6 text-slate-400 text-xs border-t border-slate-800/80 pt-3">
                      <button 
                        type="button" 
                        onClick={() => fetchComments(post.id)}
                        className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer transition-colors font-bold"
                      >
                        <MessageCircle size={15} /> 
                        {activeCommentPostId === post.id ? "Hide Comments" : "Comments"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          triggerToast("📋 Post link copied to clipboard! +10 XP");
                          setUserXp(prev => prev + 10);
                        }}
                        className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer transition-colors font-bold"
                      >
                        <Share2 size={15} /> Share
                      </button>
                    </div>

                    {/* Comments Expandable Drawer */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-950/60 p-4 rounded-2xl animate-fadeIn">
                        <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Discussion Thread</h4>
                        
                        {loadingComments ? (
                          <p className="text-xs text-slate-500 py-2">Loading comments...</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {(!commentsMap[post.id] || commentsMap[post.id].length === 0) ? (
                              <p className="text-xs text-slate-500 italic">No comments yet. Be the first to join the conversation!</p>
                            ) : (
                              commentsMap[post.id].map(comm => (
                                <div key={comm.id} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
                                  <span className="font-bold text-emerald-400 mr-2">{comm.author}:</span>
                                  <span className="text-slate-200">{comm.content}</span>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Write a reply (+50 XP)..."
                            value={newCommentText}
                            onChange={e => setNewCommentText(e.target.value)}
                            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 cursor-pointer transition-all"
                          >
                            <Send size={14} />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
