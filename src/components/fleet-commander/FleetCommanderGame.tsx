import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Fleet Commander — a real, self-contained single-player naval combat demo.
 * Classic hidden-fleet targeting on an 8x8 grid, rendered on canvas with
 * animated missile trails and particle explosions at 60fps. No network
 * calls, no persistence, no fake stats — this is an honest local demo,
 * not a stand-in for the full multiplayer game described in the spec.
 */

const GRID_SIZE = 8;
const CELL = 44;
const BOARD_PX = GRID_SIZE * CELL;

type Ship = { cells: [number, number][]; hits: Set<string>; sunk: boolean; name: string };
type Missile = {
  from: [number, number];
  to: [number, number];
  progress: number;
  hit: boolean;
  done: boolean;
};
type Explosion = { x: number; y: number; age: number; particles: { dx: number; dy: number; a: number }[] };

const SHIP_DEFS: { name: string; length: number }[] = [
  { name: "Carrier", length: 4 },
  { name: "Destroyer", length: 3 },
  { name: "Corvette", length: 2 },
];

function key(r: number, c: number) {
  return `${r},${c}`;
}

function placeFleet(): Ship[] {
  const occupied = new Set<string>();
  const ships: Ship[] = [];
  for (const def of SHIP_DEFS) {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() < 0.5;
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const cells: [number, number][] = [];
      for (let i = 0; i < def.length; i++) {
        const rr = horizontal ? r : r + i;
        const cc = horizontal ? c + i : c;
        if (rr >= GRID_SIZE || cc >= GRID_SIZE) break;
        cells.push([rr, cc]);
      }
      if (cells.length !== def.length) continue;
      if (cells.some(([rr, cc]) => occupied.has(key(rr, cc)))) continue;
      cells.forEach(([rr, cc]) => occupied.add(key(rr, cc)));
      ships.push({ cells, hits: new Set(), sunk: false, name: def.name });
      placed = true;
    }
  }
  return ships;
}

function playBlip(ctx: AudioContext, freq: number, duration: number, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export default function FleetCommanderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [fleet, setFleet] = useState<Ship[]>(() => placeFleet());
  const [fired, setFired] = useState<Set<string>>(new Set());
  const [shots, setShots] = useState(0);
  const missilesRef = useRef<Missile[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const rafRef = useRef<number>(0);

  const totalCells = fleet.reduce((n, s) => n + s.cells.length, 0);
  const totalHits = fleet.reduce((n, s) => n + s.hits.size, 0);
  const victory = totalHits === totalCells;

  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const reset = useCallback(() => {
    setFleet(placeFleet());
    setFired(new Set());
    setShots(0);
    missilesRef.current = [];
    explosionsRef.current = [];
  }, []);

  const fireAt = useCallback(
    (r: number, c: number) => {
      const k = key(r, c);
      if (fired.has(k) || victory) return;

      setShots((s) => s + 1);
      const nextFired = new Set(fired);
      nextFired.add(k);
      setFired(nextFired);

      let hitShip: Ship | null = null;
      for (const ship of fleet) {
        if (ship.cells.some(([rr, cc]) => rr === r && cc === c)) {
          hitShip = ship;
          break;
        }
      }
      const isHit = !!hitShip;

      missilesRef.current.push({
        from: [GRID_SIZE - 1, Math.floor(GRID_SIZE / 2)],
        to: [r, c],
        progress: 0,
        hit: isHit,
        done: false,
      });

      const audio = getAudio();
      playBlip(audio, 220, 0.15, "sawtooth");

      window.setTimeout(() => {
        if (isHit && hitShip) {
          setFleet((prev) =>
            prev.map((s) => {
              if (s !== hitShip) return s;
              const hits = new Set(s.hits);
              hits.add(k);
              return { ...s, hits, sunk: hits.size === s.cells.length };
            }),
          );
          playBlip(audio, 90, 0.3, "square");
        } else {
          playBlip(audio, 440, 0.1, "sine");
        }
      }, 480);
    },
    [fired, fleet, victory, getAudio],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = BOARD_PX * dpr;
    canvas.height = BOARD_PX * dpr;
    canvas.style.width = `${BOARD_PX}px`;
    canvas.style.height = `${BOARD_PX}px`;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, BOARD_PX, BOARD_PX);

      // Ocean
      const grad = ctx.createLinearGradient(0, 0, 0, BOARD_PX);
      grad.addColorStop(0, "#0b3a5c");
      grad.addColorStop(1, "#061f33");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, BOARD_PX, BOARD_PX);

      // Grid
      ctx.strokeStyle = "rgba(148, 210, 255, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, BOARD_PX);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(BOARD_PX, i * CELL);
        ctx.stroke();
      }

      // Fired cells (hit/miss markers)
      for (const k of fired) {
        const [r, c] = k.split(",").map(Number);
        const isHit = fleet.some((s) => s.cells.some(([rr, cc]) => rr === r && cc === c));
        ctx.beginPath();
        ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 6, 0, Math.PI * 2);
        ctx.fillStyle = isHit ? "#ff6b5e" : "rgba(255,255,255,0.5)";
        ctx.fill();
      }

      // Sunk ship outlines
      for (const ship of fleet) {
        if (!ship.sunk) continue;
        for (const [r, c] of ship.cells) {
          ctx.fillStyle = "rgba(255, 80, 60, 0.25)";
          ctx.fillRect(c * CELL + 3, r * CELL + 3, CELL - 6, CELL - 6);
        }
      }

      // Missiles in flight
      missilesRef.current = missilesRef.current.filter((m) => !m.done);
      for (const m of missilesRef.current) {
        m.progress += 0.045;
        const [fr, fc] = m.from;
        const [tr, tc] = m.to;
        const fx = fc * CELL + CELL / 2;
        const fy = fr * CELL + CELL / 2;
        const tx = tc * CELL + CELL / 2;
        const ty = tr * CELL + CELL / 2;
        const t = Math.min(1, m.progress);
        const arcHeight = 60;
        const x = fx + (tx - fx) * t;
        const y = fy + (ty - fy) * t - Math.sin(Math.PI * t) * arcHeight;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        for (let s = 0; s <= t; s += 0.05) {
          const xx = fx + (tx - fx) * s;
          const yy = fy + (ty - fy) * s - Math.sin(Math.PI * s) * arcHeight;
          ctx.lineTo(xx, yy);
        }
        ctx.strokeStyle = "rgba(255, 210, 120, 0.55)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd27a";
        ctx.fill();

        if (t >= 1) {
          m.done = true;
          explosionsRef.current.push({
            x: tx,
            y: ty,
            age: 0,
            particles: Array.from({ length: 14 }, () => ({
              dx: (Math.random() - 0.5) * 3,
              dy: (Math.random() - 0.5) * 3,
              a: 1,
            })),
          });
        }
      }

      // Explosions
      explosionsRef.current = explosionsRef.current.filter((e) => e.age < 30);
      for (const e of explosionsRef.current) {
        e.age += 1;
        for (const p of e.particles) {
          p.a = Math.max(0, 1 - e.age / 24);
          const px = e.x + p.dx * e.age;
          const py = e.y + p.dy * e.age;
          ctx.beginPath();
          ctx.arc(px, py, 3 * p.a + 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, ${120 + Math.floor(80 * p.a)}, 60, ${p.a})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [fired, fleet]);

  return (
    <div className="rounded-3xl border border-primary/30 bg-card/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary">Fleet Commander — Tactical Demo</div>
          <p className="text-xs text-muted-foreground mt-1">
            Target the enemy grid. {totalHits}/{totalCells} sections destroyed · {shots} shots fired
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs font-semibold rounded-lg border border-border/60 px-3 py-1.5 hover:border-primary transition"
        >
          Reset
        </button>
      </div>

      <div className="relative mx-auto" style={{ width: BOARD_PX, maxWidth: "100%" }}>
        <canvas
          ref={canvasRef}
          className="rounded-xl cursor-crosshair max-w-full"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const scale = BOARD_PX / rect.width;
            const x = (e.clientX - rect.left) * scale;
            const y = (e.clientY - rect.top) * scale;
            const c = Math.floor(x / CELL);
            const r = Math.floor(y / CELL);
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) fireAt(r, c);
          }}
        />
        {victory && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-black text-primary mb-2">Fleet Destroyed! 🎉</div>
              <p className="text-sm text-muted-foreground mb-4">Cleared in {shots} shots.</p>
              <button
                onClick={reset}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
