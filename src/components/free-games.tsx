import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink } from "lucide-react";
import { getFreeGames } from "@/lib/free-games.functions";

export function FreeGames() {
  const [requested, setRequested] = useState(false);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [count, setCount] = useState(6);
  const query = useQuery({ queryKey: ["free-games"], enabled: requested, queryFn: () => getFreeGames(), staleTime: 60 * 60 * 1000, retry: false });
  const games = (query.data ?? []).filter((game) => game.title.toLowerCase().includes(search.trim().toLowerCase()) && (platform === "all" || (platform === "pc" ? game.platform.includes("PC") : game.platform.includes("Browser"))));
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current || count >= games.length) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setCount((value) => Math.min(value + 6, games.length)); }, { rootMargin: "200px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [count, games.length]);
  return <section id="free-games" className="mb-8 rounded-2xl border border-cyan-300/25 bg-[#101721] p-5 sm:p-6">
    <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Download className="text-cyan-300" /> Free games to download & play</h2>
    <p className="mt-2 text-base text-slate-300">Find free-to-play PC and browser games. Get-game links are supplied by FreeToGame and lead through its directory to the game’s website. Accounts and optional purchases may apply.</p>
    <button type="button" disabled={query.isFetching} onClick={() => { if (!requested) setRequested(true); else void query.refetch(); }} className="mt-4 rounded-lg bg-cyan-300 px-5 py-3 text-base font-bold text-black disabled:opacity-60">{query.isFetching ? "Finding free games…" : query.isError ? "Retry game search" : requested ? "Refresh games" : "Find free games"}</button>
    {query.isError && <p role="status" className="mt-4 text-slate-300">The game directory is temporarily unavailable. Retry or <a href="https://www.freetogame.com/" target="_blank" rel="noopener noreferrer" className="underline">browse FreeToGame</a>.</p>}
    {query.isSuccess && <>
      <div className="mt-5 flex flex-wrap gap-3"><label className="flex-1 text-sm">Game title<input value={search} onChange={(event) => { setSearch(event.target.value); setCount(6); }} className="mt-2 block w-full rounded-lg border border-slate-600 bg-black/30 px-3 py-2 text-base" placeholder="Search games" /></label><label className="text-sm">Platform<select value={platform} onChange={(event) => { setPlatform(event.target.value); setCount(6); }} className="mt-2 block rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-base"><option value="all">All platforms</option><option value="pc">PC downloads</option><option value="browser">Browser games</option></select></label></div>
      <p role="status" className="mt-3 text-sm text-slate-300">{games.length} matching games</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{games.slice(0, count).map((game) => <article key={game.id} className="overflow-hidden rounded-xl border border-slate-700">
        <img src={game.image} alt={game.title} loading="lazy" decoding="async" width={365} height={206} className="aspect-video w-full object-cover" />
        <div className="p-4"><p className="text-sm text-cyan-300">{game.platform} · {game.genre}</p><h3 className="mt-2 text-xl font-bold">{game.title}</h3><p className="mt-2 text-base text-slate-300">{game.description}</p><a href={game.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-black">{game.platform.includes("PC") ? "Get PC game" : "Play browser game"}<ExternalLink size={16} /></a></div>
      </article>)}</div>
      <div ref={sentinel} className="h-2" aria-hidden="true" />
    </>}
    <p className="mt-4 text-sm text-slate-400">Game data and images: <a href="https://www.freetogame.com/" target="_blank" rel="noopener noreferrer" className="underline">FreeToGame.com</a>.</p>
  </section>;
}
