import React, { useEffect, useState } from "react";
import { Compass, Sparkles, Send, MessageCircle, ArrowUp, PlusCircle, Trophy, Search, Flame, Clock, Upload, X, Crown, Activity, Share2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export function VideoDiscovery() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("community");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userXp, setUserXp] = useState<number>(1450);
  const [userStreak] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveTickerText, setLiveTickerText] = useState<string>("🔥 Community milestone reached: 10,000 active anime fans online!");

  const [posts, setPosts] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostCategory, setNewPostCategory] = useState<string>("Anime");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  const leaderboardUsers = [
    { rank: 1, name: "Zoro_King_99", xp: 14200, badge: "👑 Anime Overlord" },
    { rank: 2, name: "Akame_Gamer", xp: 11850, badge: "⚡ Cyberpunk Master" },
    { rank: 3, name: "Luffy_Pirat", xp: 9600, badge: "🔥 Trendsetter" },
    { rank: 4, name: "Gojo_Infinite", xp: 8400, badge: "💎 Elite Curator" },
    { rank: 5, name: "You (Elite Creator)", xp: userXp, badge: "🚀 Rising Star" },
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setIsMounted(true);
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleImageSelect = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e: any) => {
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
          uploadedImageUrl = publicUrlData.publicUrl || "";
        }
      }
    } catch (err) {
      console.error(err);
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
        setUserXp(prev => prev + 300);
        triggerToast("🚀 Masterpiece Published! +300 XP");
        setPosts(prev => [data[0], ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    setNewPostTitle("");
    setNewPostContent("");
    setPostImageFile(null);
    setImagePreview(null);
    setIsPosting(false);
  };

  const handleUpvote = (id: string) => {
    setPosts(posts.map(p => (p.id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p)));
    setUserXp(prev => prev + 25);
    triggerToast("🔥 Upvoted! +25 XP");
  };

  const fetchComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(postId);
    setLoadingComments(true);

    try {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (data) {
        setCommentsMap(prev => ({ ...prev, [postId]: data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (postId: string, e: any) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, author: "Elite User", content: newCommentText }])
        .select();

      if (!error && data) {
        setCommentsMap(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data[0]]
        }));
        setNewCommentText("");
        setUserXp(prev => prev + 50);
        triggerToast("💬 Reply posted! +50 XP");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
    const matchesSearch = (post.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950 text-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 px-5 py-3 text-xs font-black text-slate-950 shadow-xl animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto mb-4 bg-slate-900 border border-purple-500/30 rounded-2xl px-4 py-2 flex items-center justify-between text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-slate-300 font-bold">{liveTickerText}</span>
        </div>
        <div className="text-emerald-400 font-black">🔥 {userStreak} Days Streak</div>
      </div>

      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("community")} className={`px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer ${activeTab === "community" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            Community & Gallery
          </button>
          <button onClick={() => setActiveTab("leaderboard")} className={`px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer ${activeTab === "leaderboard" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            Leaderboard
          </button>
        </div>
        <div className="text-xs font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/30">
          🏆 {userXp} XP
        </div>
      </div>

      {activeTab === "leaderboard" ? (
        <div className="max-w-2xl mx-auto space-y-3 bg-slate-900 p-6 rounded-3xl border border-amber-500/30">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Crown className="text-amber-400" /> Leaderboard</h2>
          {leaderboardUsers.map(u => (
            <div key={u.rank} className="flex justify-between items-center p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              <span className="font-black text-amber-400">#{u.rank} {u.name}</span>
              <span className="text-cyan-400 font-bold">{u.xp} XP</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-3xl border border-slate-800">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white w-64 focus:outline-none"
            />
            <button onClick={() => setIsPosting(!isPosting)} className="bg-emerald-500 text-slate-950 px-5 py-2 rounded-2xl text-xs font-black cursor-pointer flex items-center gap-1.5">
              <PlusCircle size={15} /> Create Post
            </button>
          </div>

          {isPosting && (
            <form onSubmit={handleCreatePost} className="bg-slate-900 border border-emerald-500/40 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-xs font-black text-emerald-400 uppercase">Publish New Post (+300 XP)</h3>
              <input
                type="text"
                placeholder="Title..."
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none"
                required
              />
              <textarea
                placeholder="Content..."
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none resize-none"
              />
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-4 bg-slate-950 cursor-pointer">
                <Upload size={20} className="text-emerald-400 mb-1" />
                <span className="text-xs text-slate-300 font-bold">{postImageFile ? postImageFile.name : "Upload Image"}</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
              <button type="submit" disabled={uploadingImage} className="w-full bg-emerald-500 text-slate-950 py-2.5 rounded-2xl text-xs font-black cursor-pointer">
                {uploadingImage ? "Uploading..." : "Publish Post"}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex gap-4 shadow-lg">
                <div className="flex flex-col items-center bg-slate-950 px-3 py-2.5 rounded-2xl border border-slate-800">
                  <button onClick={() => handleUpvote(post.id)} className="text-slate-400 hover:text-emerald-400 cursor-pointer"><ArrowUp size={18} /></button>
                  <span className="text-xs font-black text-white my-1">{post.upvotes || 0}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg">#{post.category || 'Anime'}</span>
                  <h3 className="text-sm font-black text-white mt-2 mb-1">{post.title}</h3>
                  <p className="text-xs text-slate-300 mb-3">{post.content}</p>
                  {post.image_url && (
                    <div className="mb-3 rounded-2xl overflow-hidden border border-slate-800 max-h-72">
                      <img src={post.image_url} alt="Post attachment" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-4 text-slate-400 text-xs border-t border-slate-800 pt-3">
                    <button onClick={() => fetchComments(post.id)} className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer font-bold">
                      <MessageCircle size={15} /> Comments
                    </button>
                  </div>

                  {activeCommentPostId === post.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-950 p-4 rounded-2xl">
                      {loadingComments ? <p className="text-xs text-slate-500">Loading...</p> : (
                        <div className="space-y-2">
                          {(commentsMap[post.id] || []).map((comm, idx) => (
                            <div key={comm.id || idx} className="bg-slate-900 p-2 rounded-xl text-xs">
                              <span className="font-bold text-emerald-400 mr-2">{comm.author}:</span>
                              <span className="text-slate-200">{comm.content}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <form onSubmit={e => handleAddComment(post.id, e)} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={newCommentText}
                          onChange={e => setNewCommentText(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <button type="submit" className="bg-emerald-500 px-4 py-2 rounded-xl text-xs font-black text-slate-950 cursor-pointer">Send</button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
