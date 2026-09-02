import { useEffect, useRef, useState } from "react";
import { ExternalLink, Radio, X } from "lucide-react";
import { twitchEmbedUrl } from "@/lib/video-feed";

const CHANNELS = [
  { id: "riotgames", name: "Riot Games", category: "Gaming", description: "League of Legends esports and broadcasts from Riot Games." },
  { id: "crunchyroll", name: "Crunchyroll", category: "Anime", description: "Anime events and publisher broadcasts from the official Crunchyroll channel." },
  { id: "drawinglikeasir", name: "DrawinglikeaSir", category: "Anime & art", description: "Drawing and illustration streams from DrawinglikeaSir." },
];

export function LiveStreams({ playing, onPlay, onStop }: { playing: string | null; onPlay: (id: string) => void; onStop: () => void }) {
  const container = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);
  const [hostname, setHostname] = useState("");
  const selected = CHANNELS.find((channel) => playing === `twitch:${channel.id}`);
  useEffect(() => {
    setHostname(window.location.hostname);
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!selected || !container.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) onStop(); });
    observer.observe(container.current);
    const hidden = () => { if (document.hidden) onStop(); };
    document.addEventListener("visibilitychange", hidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hidden); };
  }, [selected, onStop]);
  return (
    <section ref={container} id="live" className="mb-9 scroll-mt-24 rounded-2xl border border-cyan-300/25 bg-[#101721] p-4 sm:p-6" aria-labelledby="live-title">
      <h2 id="live-title" className="flex items-center gap-2 font-display text-2xl font-bold"><Radio className="text-cyan-300" /> Live channels</h2>
      <p className="mt-2 text-base text-slate-300">Choose a channel. The Twitch player shows whether it is broadcasting or offline; channels are not live around the clock.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {CHANNELS.map((channel) => <div key={channel.id} className="rounded-xl border border-slate-700 p-4">
          <span className="text-sm text-cyan-300">{channel.category}</span>
          <h3 className="mt-1 text-lg font-bold">{channel.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{channel.description}</p>
          {width >= 400 ? <button type="button" aria-pressed={selected?.id === channel.id} onClick={() => onPlay(`twitch:${channel.id}`)} className="mt-4 rounded-lg bg-cyan-300 px-4 py-2 text-base font-semibold text-black">Watch channel</button> : <a href={`https://www.twitch.tv/${channel.id}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-base text-cyan-300 underline">Watch on Twitch <ExternalLink size={16} /></a>}
        </div>)}
      </div>
      {selected && hostname && width >= 400 && <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">{selected.name}</h3><button type="button" onClick={onStop} className="flex items-center gap-1 rounded border border-slate-600 px-3 py-2"><X size={16} /> Stop</button></div>
        <iframe key={selected.id} src={twitchEmbedUrl(selected.id, hostname)} title={`${selected.name} Twitch channel`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="w-full rounded-lg border-0 bg-black" style={{ height: Math.max(300, width * 9 / 16) }} />
        <a href={`https://www.twitch.tv/${selected.id}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-base text-cyan-300 underline">Open channel on Twitch <ExternalLink size={16} /></a>
      </div>}
      <p className="mt-4 text-sm text-slate-400">{width > 0 && width < 400 ? "On smaller screens, channels open on Twitch for the full player. " : ""}Anime channels may show events and artwork. Full episodes are available only when the rights holder provides an authorized broadcast.</p>
    </section>
  );
}
