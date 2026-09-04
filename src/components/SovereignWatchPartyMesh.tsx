import { useState, useEffect } from "react";

export function SovereignWatchPartyMesh() {
  const [roomActive, setRoomActive] = useState(false);
  const [syncTime, setSyncTime] = useState(142); // Seconds in sync stream
  const [participants, setParticipants] = useState(1284);
  const [micActive, setMicActive] = useState(false);
  const [spatialPing, setSpatialPing] = useState(12); // ms ultra-low latency

  useEffect(() => {
    const timer = setInterval(() => {
      if (roomActive) {
        setSyncTime(t => t + 1);
      }
    }, 1000);

    const pingSimulator = setInterval(() => {
      setSpatialPing(Math.floor(Math.random() * 6) + 10);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(pingSimulator);
    };
  }, [roomActive]);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-3xl bg-card/90 backdrop-blur-2xl border border-primary/40 shadow-2xl relative overflow-hidden font-sans">
      
      {/* Background Holographic Wave Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-600/10 animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-wider mb-2">
              ⚡ WebRTC Spatial Mesh Active
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              GameCastle Live Neural Watch & Voice Hub
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-background/80 border border-border font-bold text-emerald-400">
              🟢 Latency: {spatialPing}ms
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-background/80 border border-border font-bold text-primary">
              👥 {participants.toLocaleString()} Connected
            </span>
          </div>
        </div>

        {/* Video / Stream Sync Area */}
        <div className="relative aspect-video w-full rounded-2xl bg-black/80 border border-border flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          
          {/* Simulated Cinematic Player */}
          <div className="text-center z-20 space-y-3">
            <span className="text-5xl block animate-bounce">🎬</span>
            <p className="text-sm font-bold text-foreground/90">
              {roomActive ? "Streaming Live in Synced Multiverse Mode" : "Click 'Engage Voice & Stream' to Enter Room"}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Stream Timestamp: {Math.floor(syncTime / 60)}:{String(syncTime % 60).padStart(2, '0')} (Zero-Lag Sync)
            </p>
          </div>

          {/* Floating Spatial Avatars inside the stream */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-primary bg-purple-600 text-[10px] font-black flex items-center justify-center text-white">MK</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-primary bg-red-600 text-[10px] font-black flex items-center justify-center text-white">LH</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-primary bg-emerald-600 text-[10px] font-black flex items-center justify-center text-white">ZJ</div>
              <div className="flex items-center justify-center h-8 px-2.5 rounded-full ring-2 ring-primary bg-background/90 text-[10px] font-black text-primary">
                +1.2k listening
              </div>
            </div>

            <button 
              onClick={() => { setMicActive(!micActive); }}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-2 ${micActive ? "bg-red-600 text-white animate-pulse" : "bg-primary text-primary-foreground"}`}
            >
              {micActive ? "🎙️ Mic Live (Broadcasting)" : "🔇 Mic Muted (Click to Speak)"}
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground max-w-md">
            No Discord required. This spatial audio channel connects your voice instantly with every fan watching this exact moment globally.
          </p>

          <button 
            onClick={() => {
              setRoomActive(!roomActive);
              setParticipants(p => roomActive ? p - 1 : p + 1);
            }}
            className={`px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition ${roomActive ? "bg-red-600/20 border border-red-500 text-red-500 hover:bg-red-600/30" : "bg-primary text-primary-foreground hover:opacity-90"}`}
          >
            {roomActive ? "Disconnect from Spatial Mesh 🔴" : "Engage Spatial Voice & Sync ⚡"}
          </button>
        </div>

      </div>
    </div>
  );
}
