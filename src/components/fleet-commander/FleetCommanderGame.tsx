import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Fleet Commander — an honest, fully local base-building demo. Every
 * number on screen (resources, levels, timers, ships) is computed and
 * animated client-side in this component; nothing here calls a network,
 * fakes another player, or claims to persist across a reload. Real
 * persistence lives behind the Supabase schema designed separately —
 * this is the visual/interactive layer that will eventually call it.
 */

type BuildingKey = "command_center" | "shipyard" | "turret_1" | "turret_2" | "refinery";
type ShipType = "corvette" | "destroyer" | "carrier";

interface BuildingDef {
  key: BuildingKey;
  name: string;
  kind: "command_center" | "shipyard" | "turret" | "refinery";
  nx: number; // normalized position on the island, 0-1
  ny: number;
}

const BUILDINGS: BuildingDef[] = [
  { key: "command_center", name: "Command Center", kind: "command_center", nx: 0.5, ny: 0.48 },
  { key: "shipyard", name: "Shipyard", kind: "shipyard", nx: 0.28, ny: 0.68 },
  { key: "refinery", name: "Refinery", kind: "refinery", nx: 0.68, ny: 0.66 },
  { key: "turret_1", name: "Defense Turret North", kind: "turret", nx: 0.36, ny: 0.28 },
  { key: "turret_2", name: "Defense Turret East", kind: "turret", nx: 0.74, ny: 0.4 },
];

const SHIP_DEFS: Record<ShipType, { name: string; steel: number; fuel: number; seconds: number; color: string }> = {
  corvette: { name: "Stealth Corvette", steel: 90, fuel: 50, seconds: 4, color: "#7dd3fc" },
  destroyer: { name: "Destroyer", steel: 220, fuel: 140, seconds: 7, color: "#a78bfa" },
  carrier: { name: "Aircraft Carrier", steel: 520, fuel: 360, seconds: 12, color: "#fbbf24" },
};

function upgradeCost(level: number) {
  return { steel: Math.round(80 * Math.pow(1.55, level - 1)), fuel: Math.round(45 * Math.pow(1.55, level - 1)) };
}
function upgradeSeconds(level: number) {
  return Math.round(5 + level * 3);
}

interface BuildingState {
  level: number;
  upgrading?: { startedAt: number; duration: number };
}

interface Ship {
  id: string;
  type: ShipType;
  phase: number;
  radius: number;
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  age: number;
  maxAge: number;
  color: string;
}

interface Missile {
  from: [number, number];
  to: [number, number];
  progress: number;
  done: boolean;
}

let audioCtx: AudioContext | null = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}
function tone(freq: number, duration: number, type: OscillatorType = "sine", gainValue = 0.06, delay = 0) {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const t0 = ctx.currentTime + delay;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(gainValue, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration);
}
const sfx = {
  select: () => tone(660, 0.08, "sine", 0.05),
  upgradeStart: () => { tone(220, 0.25, "sawtooth", 0.05); tone(440, 0.25, "sawtooth", 0.03, 0.05); },
  upgradeDone: () => { tone(523, 0.15, "triangle", 0.07); tone(784, 0.25, "triangle", 0.07, 0.12); },
  launch: () => tone(180, 0.3, "sawtooth", 0.05),
  turretFire: () => tone(120, 0.18, "square", 0.05),
  explosion: () => tone(70, 0.35, "square", 0.06),
};

const W = 640;
const H = 420;

export default function FleetCommanderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const shipsRef = useRef<Ship[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const missilesRef = useRef<Missile[]>([]);
  const lastTickRef = useRef<number>(performance.now());
  const nextTurretFireRef = useRef<number>(performance.now() + 4000);

  const [resources, setResources] = useState({ steel: 320, fuel: 220 });
  const [buildings, setBuildings] = useState<Record<BuildingKey, BuildingState>>(() =>
    Object.fromEntries(BUILDINGS.map((b) => [b.key, { level: 1 }])) as Record<BuildingKey, BuildingState>,
  );
  const [selected, setSelected] = useState<BuildingKey | null>(null);
  const [shipyardOpen, setShipyardOpen] = useState(false);
  const [tickN, setTickN] = useState(0); // forces re-render so HUD/progress rings stay live

  const refineryLevel = buildings.refinery.level;

  const islandPoints = useMemo(() => {
    const cx = W / 2;
    const cy = H / 2 + 10;
    const pts: [number, number][] = [];
    const n = 14;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const wobble = 0.82 + 0.18 * Math.sin(a * 3 + 1.3) + 0.06 * Math.sin(a * 7);
      pts.push([cx + Math.cos(a) * 210 * wobble, cy + Math.sin(a) * 140 * wobble]);
    }
    return pts;
  }, []);

  const drawBlobPath = (ctx: CanvasRenderingContext2D, pts: [number, number][], scale: number, cx: number, cy: number) => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const sx = cx + (x - cx) * scale;
      const sy = cy + (y - cy) * scale;
      const [nx, ny] = pts[(i + 1) % pts.length];
      const nsx = cx + (nx - cx) * scale;
      const nsy = cy + (ny - cy) * scale;
      const mx = (sx + nsx) / 2;
      const my = (sy + nsy) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(sx, sy, mx, my);
    });
    ctx.closePath();
  };

  // Pre-render the static island + water backdrop once — it never
  // changes frame to frame, so redrawing it every tick would be wasted
  // canvas work.
  useEffect(() => {
    const bg = document.createElement("canvas");
    bg.width = W;
    bg.height = H;
    const ctx = bg.getContext("2d")!;
    const cx = W / 2;
    const cy = H / 2 + 10;

    const water = ctx.createLinearGradient(0, 0, 0, H);
    water.addColorStop(0, "#062033");
    water.addColorStop(1, "#03101c");
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(125, 211, 252, 0.08)";
    for (let r = 40; r < 320; r += 26) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.5, r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    drawBlobPath(ctx, islandPoints, 1.12, cx, cy);
    ctx.fill();

    ctx.fillStyle = "#e7cfa1";
    drawBlobPath(ctx, islandPoints, 1.0, cx, cy);
    ctx.fill();

    ctx.fillStyle = "#3f7d4f";
    drawBlobPath(ctx, islandPoints, 0.82, cx, cy);
    ctx.fill();

    const grassGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 190);
    grassGlow.addColorStop(0, "rgba(120, 200, 130, 0.25)");
    grassGlow.addColorStop(1, "rgba(120, 200, 130, 0)");
    ctx.fillStyle = grassGlow;
    drawBlobPath(ctx, islandPoints, 0.82, cx, cy);
    ctx.fill();

    bgCanvasRef.current = bg;
    setTickN((n) => n + 1);
  }, [islandPoints]);

  const buildingPos = useCallback((key: BuildingKey) => {
    const def = BUILDINGS.find((b) => b.key === key)!;
    return { x: def.nx * W, y: def.ny * H, def };
  }, []);

  const canAfford = (cost: { steel: number; fuel: number }) => resources.steel >= cost.steel && resources.fuel >= cost.fuel;

  const startUpgrade = (key: BuildingKey) => {
    const state = buildings[key];
    if (state.upgrading) return;
    const cost = upgradeCost(state.level);
    if (!canAfford(cost)) return;
    setResources((r) => ({ steel: r.steel - cost.steel, fuel: r.fuel - cost.fuel }));
    setBuildings((prev) => ({
      ...prev,
      [key]: { ...prev[key], upgrading: { startedAt: performance.now(), duration: upgradeSeconds(state.level) * 1000 } },
    }));
    sfx.upgradeStart();
  };

  const trainShip = (type: ShipType) => {
    const def = SHIP_DEFS[type];
    if (resources.steel < def.steel || resources.fuel < def.fuel) return;
    setResources((r) => ({ steel: r.steel - def.steel, fuel: r.fuel - def.fuel }));
    sfx.launch();
    window.setTimeout(() => {
      shipsRef.current.push({
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        phase: Math.random() * Math.PI * 2,
        radius: 1.55 + Math.random() * 0.18,
        speed: 0.00025 + Math.random() * 0.0001,
      });
    }, def.seconds * 1000);
  };

  const spawnBurst = (x: number, y: number, color: string, count = 16) => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.2;
      particlesRef.current.push({ x, y, dx: Math.cos(a) * speed, dy: Math.sin(a) * speed, age: 0, maxAge: 26 + Math.random() * 10, color });
    }
  };

  // Resolve finished upgrades (checked every frame; cheap comparison).
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = performance.now();
      setBuildings((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const key of Object.keys(prev) as BuildingKey[]) {
          const b = prev[key];
          if (b.upgrading && now - b.upgrading.startedAt >= b.upgrading.duration) {
            next[key] = { level: b.level + 1 };
            changed = true;
            const { x, y } = buildingPos(key);
            spawnBurst(x, y, "#7dffb0", 22);
            sfx.upgradeDone();
          }
        }
        return changed ? next : prev;
      });
      // Passive resource generation from the refinery.
      setResources((r) => ({
        steel: r.steel + (1 + refineryLevel),
        fuel: r.fuel + (1 + Math.floor(refineryLevel * 0.7)),
      }));
      setTickN((n) => n + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [buildingPos, refineryLevel]);

  // Main render loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2 + 10;

    const drawBuilding = (def: BuildingDef, x: number, y: number) => {
      const state = buildings[def.key];
      const level = state.level;
      const isSelected = selected === def.key;
      const scale = 1 + (level - 1) * 0.12;

      ctx.save();
      ctx.translate(x, y);

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(0, 0, 34 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(10, 15, 25, 0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 14 * scale, 22 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      if (def.kind === "command_center") {
        ctx.fillStyle = "#334155";
        ctx.fillRect(-16 * scale, -6 * scale, 32 * scale, 20 * scale);
        ctx.fillStyle = "#475569";
        ctx.fillRect(-10 * scale, -22 * scale, 20 * scale, 18 * scale);
        const sweep = (performance.now() / 900) % (Math.PI * 2);
        ctx.save();
        ctx.translate(0, -24 * scale);
        ctx.rotate(sweep);
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10 * scale, 0);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#0ea5b7";
        for (let i = 0; i < Math.min(level, 5); i++) {
          ctx.fillRect(-14 * scale + i * 6 * scale, 8 * scale, 3, 4);
        }
      } else if (def.kind === "shipyard") {
        ctx.fillStyle = "#57534e";
        ctx.fillRect(-24 * scale, 4 * scale, 48 * scale, 8 * scale);
        ctx.strokeStyle = "#a8a29e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-18 * scale, 4 * scale);
        ctx.lineTo(-18 * scale, -18 * scale);
        ctx.lineTo(4 * scale, -18 * scale);
        ctx.stroke();
        for (let i = 0; i < Math.min(level - 1, 3); i++) {
          ctx.beginPath();
          ctx.moveTo(-18 * scale + (i + 1) * 10 * scale, 4 * scale);
          ctx.lineTo(-18 * scale + (i + 1) * 10 * scale, -14 * scale);
          ctx.stroke();
        }
      } else if (def.kind === "refinery") {
        for (let i = 0; i < Math.min(1 + level, 4); i++) {
          const tx = -12 * scale + i * 10 * scale;
          const grad = ctx.createLinearGradient(tx - 6, -20, tx + 6, 6);
          grad.addColorStop(0, "#fbbf24");
          grad.addColorStop(1, "#b45309");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(tx - 5 * scale, -18 * scale, 10 * scale, 24 * scale, 4);
          ctx.fill();
        }
      } else if (def.kind === "turret") {
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(0, 2 * scale, 13 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f87171";
        ctx.lineWidth = 4 + Math.min(level - 1, 3);
        const aim = Math.sin(performance.now() / 1400 + x) * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 2 * scale);
        ctx.lineTo(Math.cos(aim) * 20 * scale, 2 * scale - Math.sin(Math.abs(aim)) * 10 * scale - 6);
        ctx.stroke();
      }

      if (state.upgrading) {
        const p = Math.min(1, (performance.now() - state.upgrading.startedAt) / state.upgrading.duration);
        ctx.beginPath();
        ctx.arc(0, 0, 30 * scale, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
      ctx.font = "10px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`Lv.${level}`, x, y + 30 * scale);
    };

    const drawShip = (ship: Ship, t: number) => {
      const angle = ship.phase + t * ship.speed;
      const rx = 250 * ship.radius;
      const ry = 160 * ship.radius;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      const heading = angle + Math.PI / 2;
      const def = SHIP_DEFS[ship.type];
      const size = ship.type === "carrier" ? 16 : ship.type === "destroyer" ? 11 : 8;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(heading);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.ellipse(-size * 1.4, 0, size * 1.6, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size, size * 0.5);
      ctx.lineTo(-size, -size * 0.5);
      ctx.closePath();
      ctx.fill();
      if (ship.type === "carrier") {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(-size * 0.6, -size * 0.18, size * 1.1, size * 0.36);
      }
      ctx.restore();
    };

    const draw = (t: number) => {
      const bg = bgCanvasRef.current;
      if (bg) ctx.drawImage(bg, 0, 0, W, H);
      else {
        ctx.fillStyle = "#03101c";
        ctx.fillRect(0, 0, W, H);
      }

      // Radar sweep overlay for atmosphere.
      const sweepAngle = (t / 4000) % (Math.PI * 2);
      const sweepGrad = ctx.createConicGradient
        ? (ctx as any).createConicGradient(sweepAngle, cx, cy)
        : null;
      if (sweepGrad) {
        sweepGrad.addColorStop(0, "rgba(56,189,248,0.16)");
        sweepGrad.addColorStop(0.06, "rgba(56,189,248,0)");
        sweepGrad.addColorStop(1, "rgba(56,189,248,0)");
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 300, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const ship of shipsRef.current) drawShip(ship, t);
      for (const def of BUILDINGS) {
        const { x, y } = buildingPos(def.key);
        drawBuilding(def, x, y);
      }

      // Missiles
      missilesRef.current = missilesRef.current.filter((m) => !m.done);
      for (const m of missilesRef.current) {
        m.progress += 0.03;
        const [fx, fy] = m.from;
        const [tx, ty] = m.to;
        const p = Math.min(1, m.progress);
        const arc = 50;
        ctx.beginPath();
        for (let s = 0; s <= p; s += 0.05) {
          const xx = fx + (tx - fx) * s;
          const yy = fy + (ty - fy) * s - Math.sin(Math.PI * s) * arc;
          if (s === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.strokeStyle = "rgba(248, 113, 113, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
        if (p >= 1) {
          m.done = true;
          spawnBurst(tx, ty, "#f87171", 18);
          sfx.explosion();
        }
      }

      particlesRef.current = particlesRef.current.filter((p) => p.age < p.maxAge);
      for (const p of particlesRef.current) {
        p.age += 1;
        p.x += p.dx;
        p.y += p.dy;
        const a = Math.max(0, 1 - p.age / p.maxAge);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * a + 1, 0, Math.PI * 2);
        ctx.fillStyle = p.color.startsWith("#")
          ? p.color
          : p.color;
        ctx.globalAlpha = a;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Turret auto-fire for atmosphere.
      if (t > nextTurretFireRef.current) {
        nextTurretFireRef.current = t + 3500 + Math.random() * 3000;
        const turretKey = Math.random() < 0.5 ? "turret_1" : "turret_2";
        const { x, y } = buildingPos(turretKey);
        const targetAngle = Math.random() * Math.PI * 2;
        const target: [number, number] = [cx + Math.cos(targetAngle) * 260, cy + Math.sin(targetAngle) * 170];
        missilesRef.current.push({ from: [x, y], to: target, progress: 0, done: false });
        sfx.turretFire();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildings, selected, buildingPos]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    for (const def of BUILDINGS) {
      const bx = def.nx * W;
      const by = def.ny * H;
      if (Math.hypot(x - bx, y - by) < 34) {
        sfx.select();
        setSelected(def.key);
        setShipyardOpen(def.kind === "shipyard");
        return;
      }
    }
    setSelected(null);
    setShipyardOpen(false);
  };

  const selectedDef = selected ? BUILDINGS.find((b) => b.key === selected) : null;
  const selectedState = selected ? buildings[selected] : null;
  const cost = selectedState ? upgradeCost(selectedState.level) : null;

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/80 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(34,211,238,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">Fleet Commander — Base Demo</div>
          <p className="text-xs text-slate-400 mt-0.5">Tap a building to upgrade it or open the Shipyard.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300">
            🔩 {resources.steel.toLocaleString()}
          </span>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-cyan-300">
            ⛽ {resources.fuel.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="rounded-2xl w-full cursor-pointer" onClick={handleCanvasClick} />

        {selectedDef && !shipyardOpen && cost && selectedState && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:w-72 rounded-2xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-sm text-slate-100">{selectedDef.name}</div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
            </div>
            <div className="text-xs text-slate-400 mb-3">Level {selectedState.level}</div>
            {selectedState.upgrading ? (
              <div className="text-xs text-cyan-300 font-semibold">Upgrading…</div>
            ) : (
              <button
                onClick={() => startUpgrade(selectedDef.key)}
                disabled={!canAfford(cost)}
                className="w-full rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-400 transition"
              >
                Upgrade — 🔩{cost.steel} ⛽{cost.fuel}
              </button>
            )}
          </div>
        )}

        {shipyardOpen && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:w-80 rounded-2xl border border-purple-500/30 bg-slate-900/90 backdrop-blur-xl p-4 shadow-2xl space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-sm text-slate-100">Shipyard — Train a ship</div>
              <button onClick={() => setShipyardOpen(false)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
            </div>
            {(Object.keys(SHIP_DEFS) as ShipType[]).map((type) => {
              const def = SHIP_DEFS[type];
              const affordable = resources.steel >= def.steel && resources.fuel >= def.fuel;
              return (
                <button
                  key={type}
                  onClick={() => trainShip(type)}
                  disabled={!affordable}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-700 px-3 py-2 text-xs hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span className="font-semibold text-slate-100">{def.name}</span>
                  <span className="text-slate-400">🔩{def.steel} ⛽{def.fuel} · {def.seconds}s</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
