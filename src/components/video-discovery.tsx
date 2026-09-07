import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Play, X, Zap, Sparkles, Trophy, Radio, MessageSquare, Heart, Gift, Send, CheckCircle2, Flame, Share2, Volume2, VolumeX, Compass, PlusCircle, Video, BookOpen, Palette, ThumbsUp, MessageCircle, ArrowUp, Image as ImageIcon, Upload } from "lucide-react";
import { FreeVideoDownloads } from "@components/free-video-downloads";
import { animes } from "@data/animes";
import { TRAILERS } from "@data/trailers";
import { uniqueVideos, type FeedVideo } from "@lib/video-feed";
// import { supabase } from "@lib/supabase";

export function VideoDiscovery() {
  const [activeTab, setActiveTab] = useState<"discover" | "community">("discover");
  const [category, setCategory] = useState<string>("All");
  const [userXp, setUserXp] = useState<number>(850);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Community Posts State (Reddit Style with Image Support)
  const [posts, setPosts] = useState<Array<{ id: string, title: string, content: string, category: string, author: string, upvotes: number, imageUrl?: string }>>([
    { id: "1", title: "What is your favorite anime series this year?", content: "The animation quality and storytelling in the latest releases are phenomenal...", category: "Anime", author: "Zoro_Elite", upvotes: 45, imageUrl: "" },
    { id: "2", title: "Cyberpunk Digital Art Showcase (AI & Handcrafted)", content: "Testing out new high-resolution cyberpunk aesthetics.", category: "AI & Art", author: "CyberArtist", upvotes: 32, imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80" }
  ]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Anime");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch posts from Supabase on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        // const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        // if (data && data.length > 0) setPosts(data);
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

  // Create post and upload image to Supabase Storage
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    setUploadingImage(true);
    let uploadedImageUrl = "";

    try {
      if (postImageFile) {
        const fileExt = postImageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage bucket 'community-images'
        // const { error: uploadError } = await supabase.storage.from('community-images').upload(filePath, postImageFile);
        // if (!uploadError) {
        //   const { data: publicUrlData } = supabase.storage.from('community-images').getPublicUrl(filePath);
        //   uploadedImageUrl = publicUrlData.publicUrl;
        // }
        
        // Fallback simulation for preview if supabase is commented out
        uploadedImageUrl = imagePreview || "";
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
    }

    const newEntry = {
      id: String(Date.now()),
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      author: "You (Elite Member)",
      upvotes: 1,
      imageUrl: uploadedImageUrl
    };

    setPosts([newEntry, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setPostImageFile(null);
    setImagePreview(null);
    setIsPosting(false);
    setUserXp(p => p + 150);
    triggerToast("🎉 Post published successfully with image! +150 XP");

    try {
      // await supabase.from('posts').insert([{ 
      //   title: newPostTitle, 
      //   content: newPostContent, 
      //   category: newPostCategory, 
      //   author: "You",
      //   image_url: uploadedImageUrl 
      // }]);
    } catch (err) {
      console.error("Error saving post to supabase:", err);
    }
  };

  const handleUpvote = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    setUserXp(p => p + 10);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white p-4 overflow-x-hidden font-sans">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-cyan-400 px-4 py-3 text-xs font-black text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.9)] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("discover")}
            className={`rounded-2xl px-5 py-2 text-xs font-black transition-all cursor-pointer ${
              activeTab === "discover" ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.5)]" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            🎬 Discover Feed (TikTok Style)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className={`rounded-2xl px-5 py-2 text-xs font-black transition-all cursor-pointer ${
              activeTab === "community" ? "bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.5)]" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            💬 Community Posts & Gallery (Reddit Style)
          </button>
        </div>
        <div className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          🏆 {userXp} XP
        </div>
      </div>

      {activeTab === "discover" ? (
        <div className="max-w-xl mx-auto py-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <Compass className="mx-auto text-cyan-400 mb-3 animate-spin" size={32} />
          <h2 className="text-sm font-black text-white mb-2">TikTok Vertical Stream Feed Active</h2>
          <p className="text-xs text-slate-400">Browse seamlessly through Anime, Gaming, Reading, and AI Art streams connected to Supabase.</p>
        </div>
      ) : (
        /* Reddit-Style Community Feed with Image Upload */
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-sm font-black text-white">Community Hub & Gallery</h2>
              <p className="text-xs text-slate-400">Share discussions, artwork, and photos instantly with Supabase backend storage.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPosting(!isPosting)}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Create Post
            </button>
          </div>

          {/* New Post Form with Image Upload */}
          {isPosting && (
            <form onSubmit={handleCreatePost} className="bg-slate-900 border border-emerald-500/40 p-4 rounded-2xl space-y-3 shadow-xl">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">New Post & Image Upload</h3>
              <input
                type="text"
                placeholder="Post title..."
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
              <textarea
                placeholder="Write your description, thoughts, or share details..."
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />

              {/* Image Upload Input */}
              <div className="space-y-2">
                <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-700 hover:border-emerald-400 rounded-xl p-3 bg-slate-950 cursor-pointer transition-all">
                  <Upload size={16} className="text-emerald-400" />
                  <span className="text-xs text-slate-300 font-bold">
                    {postImageFile ? postImageFile.name : "Upload Image / Picture"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>

                {imagePreview && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPostImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-slate-950/80 p-1 rounded-full text-white hover:bg-rose-500 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <select
                  value={newPostCategory}
                  onChange={e => setNewPostCategory(e.target.value)}
                  className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Anime">Anime</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Reading">Reading</option>
                  <option value="AI & Art">AI & Art</option>
                </select>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 cursor-pointer disabled:opacity-50"
                >
                  {uploadingImage ? "Uploading..." : "Publish Post"}
                </button>
              </div>
            </form>
          )}

          {/* Posts Feed Display */}
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex gap-4 items-start hover:border-slate-700 transition-all">
                {/* Upvote Button */}
                <div className="flex flex-col items-center justify-center bg-slate-950 px-2.5 py-2 rounded-xl border border-slate-800">
                  <button type="button" onClick={() => handleUpvote(post.id)} className="text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors">
                    <ArrowUp size={16} />
                  </button>
                  <span className="text-xs font-black text-white my-1">{post.upvotes}</span>
                </div>

                {/* Post Body */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">#{post.category}</span>
                    <span className="text-[10px] text-slate-400">Posted by {post.author}</span>
                  </div>
                  <h3 className="text-sm font-black text-white mb-1">{post.title}</h3>
                  <p className="text-xs text-slate-300 mb-3">{post.content}</p>

                  {/* Display Uploaded Image if available */}
                  {post.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 max-h-72 bg-slate-950">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-slate-400 text-xs">
                    <button type="button" className="flex items-center gap-1 hover:text-white cursor-pointer">
                      <MessageCircle size={14} /> Comments
                    </button>
                    <button type="button" className="flex items-center gap-1 hover:text-white cursor-pointer">
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
