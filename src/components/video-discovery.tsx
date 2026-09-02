import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowDown, ExternalLink, Play, X } from "lucide-react";
import { LiveStreams } from "@/components/live-streams";
import { animes } from "@/data/animes";
import { TRAILERS } from "@/data/trailers";
import { parseTrailerPage, uniqueVideos, type FeedVideo } from "@/lib/video-feed";

const INITIAL: FeedVideo[] = uniqueVideos([
  ...animes.flatMap((anime): FeedVideo[] => TRAILERS[anime.slug] ? [{ id: TRAILERS[anime.slug], title: anime.title, category: "Anime", description: anime.synopsis, slug: anime.slug }] : []),
  { id: "uHGShqcAHlQ", title: "The Legend of Zelda: Tears of the Kingdom", category: "Gaming", description: "Nintendo's third pre-launch trailer explores Hyrule, the sky islands and Link's adventure." },
  { id: "lMdsrZ1otlA", title: "Genshin Impact — The Outlander Who Caught the Wind", category: "Gaming", description: "The announcement trailer from Genshin Impact introduces its open-world adventure." },
]);

function VideoCard({ video, playing, onPlay, onStop }: { video: FeedVideo; playing: boolean; onPlay: () => void; onStop: () => void }) {
  const card = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!playing || !card.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) onStop();
    }, { threshold: 0 });
    observer.observe(card.current);
    const hidden = () => { if (document.hidden) onStop(); };
    document.addEventListener("visibilitychange", hidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hidden); };
  }, [playing, onStop]);
  return (
    <article ref={card} className="snap-start overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#101721] shadow-xl" style={{ scrollMarginTop: "6rem" }}>
      <div className="relative aspect-video bg-black">
        {playing ? <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`}
          title={`${video.title} — video preview`}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        /> : <button type="button" onClick={onPlay} className="group absolute inset-0 w-full focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label={`Play ${video.title} trailer`}>
          <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={`${video.title} video thumbnail`} width={480} height={360} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80" />
          <span className="absolute inset-0 grid place-items-center"><span className="rounded-full bg-cyan-300 p-5 text-black transition-transform group-hover:scale-110"><Play size={32} fill="currentColor" /></span></span>
        </button>}
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3 text-sm text-cyan-300"><span>{video.category} · Trailer / preview</span>{playing && <button type="button" onClick={onStop} className="flex items-center gap-1 rounded border border-cyan-300/40 px-3 py-2"><X size={16} /> Stop</button>}</div>
        <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">{video.title}</h2>
        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-slate-300">{video.description}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-base">
          {video.slug && <Link to="/anime/$slug" params={{ slug: video.slug }} className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-black">Explore anime</Link>}
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 text-slate-200 underline underline-offset-4">Open on YouTube <ExternalLink size={16} /></a>
        </div>
        <p className="mt-3 text-sm text-slate-400">If playback is unavailable, open the original video. This is a preview, not a full episode.</p>
      </div>
    </article>
  );
}

export function VideoDiscovery() {
  const [category, setCategory] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const [discover, setDiscover] = useState(false);
  const [visible, setVisible] = useState(4);
  const sentinel = useRef<HTMLDivElement>(null);
  const lastRequest = useRef(0);
  const stop = useCallback(() => setPlaying(null), []);
  const query = useInfiniteQuery({
    queryKey: ["video-trailers"],
    initialPageParam: 1,
    enabled: discover,
    staleTime: 6 * 60 * 60 * 1000,
    retry: false,
    queryFn: async ({ pageParam, signal }) => {
      // One page per request; a cooldown protects the free metadata service.
      const delay = Math.max(0, 1200 - (Date.now() - lastRequest.current));
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      signal.throwIfAborted();
      lastRequest.current = Date.now();
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${pageParam}&limit=25&sfw=true&filter=bypopularity`, { signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]) });
      if (!response.ok) throw new Error("Trailer discovery is temporarily unavailable.");
      return parseTrailerPage(await response.json());
    },
    getNextPageParam: (page, pages) => page.hasNext ? pages.length + 1 : undefined,
  });
  const videos = useMemo(() => uniqueVideos([...INITIAL, ...(query.data?.pages.flatMap((page) => page.videos) ?? [])]).filter((video) => category === "All" || video.category === category), [category, query.data]);
  // Reveal only existing cards automatically. Another API page is explicitly
  // requested, avoiding request loops when upstream pages contain no trailers.
  useEffect(() => {
    if (!sentinel.current || visible >= videos.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible((count) => Math.min(count + 4, videos.length));
    }, { rootMargin: "300px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [visible, videos.length]);
  const more = () => {
    if (visible < videos.length) { setVisible((count) => Math.min(count + 4, videos.length)); return; }
    if (!discover) setDiscover(true);
    else if (query.isError && !query.data) void query.refetch();
    else void query.fetchNextPage();
  };
  return (
    <div className="min-h-screen bg-[#060709] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div><p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-300">GameCastle · Castle Cinema</p><h1 className="font-display text-3xl font-black sm:text-5xl">Anime & gaming video feed</h1><p className="mt-3 flex items-center gap-2 text-base text-slate-300"><ArrowDown size={18} /> Swipe or scroll to discover your next favorite.</p></div>
          <Link to="/browse" className="rounded-lg border border-cyan-300/40 px-4 py-2 text-cyan-300">Browse anime</Link>
        </div>
        <LiveStreams playing={playing} onPlay={setPlaying} onStop={stop} />
        <div className="mb-6 flex flex-wrap gap-3" aria-label="Filter videos">
          {["All", "Anime", "Gaming"].map((tab) => <button key={tab} type="button" aria-pressed={category === tab} onClick={() => { setCategory(tab); setVisible(4); stop(); }} className={`rounded-full border px-5 py-2 text-base ${category === tab ? "border-cyan-300 bg-cyan-300 font-semibold text-black" : "border-slate-600 text-slate-200"}`}>{tab}</button>)}
        </div>
        <div className="space-y-8">
          {videos.slice(0, visible).map((video) => <VideoCard key={video.id} video={video} playing={playing === video.id} onPlay={() => setPlaying(video.id)} onStop={stop} />)}
        </div>
        <div ref={sentinel} className="h-6" aria-hidden="true" />
        <div className="py-6 text-center">
          {query.isError && category !== "Gaming" && <p role="status" className="mb-3 text-slate-300">More trailers could not load. You can retry; the videos above are still available.</p>}
          {(visible < videos.length || (category !== "Gaming" && (!discover || query.hasNextPage || query.isError))) && <button type="button" disabled={query.isFetching} onClick={more} className="rounded-xl bg-cyan-300 px-6 py-3 text-base font-bold text-black disabled:opacity-60">{query.isFetching ? "Loading trailers…" : query.isError ? "Retry loading trailers" : visible < videos.length ? "Show more videos" : "Discover more anime trailers"}</button>}
          {visible >= videos.length && (category === "Gaming" || (discover && !query.hasNextPage && !query.isFetching && !query.isError)) && <p className="text-slate-300">You have reached the end of this selection.</p>}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400">Videos play through YouTube. GameCastle does not store video files. Additional anime trailer metadata comes from <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="underline">Jikan / MyAnimeList</a>; some titles have no trailer.</p>
        </div>
      </div>
    </div>
  );
}
