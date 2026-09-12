import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Fleet Commander — a 2.5D isometric naval base demo rendered entirely in
 * canvas. Everything here is procedural: there are no sprite sheets or
 * texture files, so the lazy-loaded chunk stays tiny and nothing has to
 * be fetched before the scene draws. State is session-only; no network,
 * no persistence, no other players.
 *
 * Rendering pipeline per frame:
 *   water (animated) → island (pre-rendered) → shoreline foam → shadows
 *   → structures (lit prisms) → ships → particles → bloom → vignette
 */

type BuildingKey = "command_center" | "shipyard" | "turret_1" | "turret_2" | "refinery";
type ShipType = "corvette" | "destroyer" | "carrier";

const W = 720;
const H = 460;
const CX = W / 2;
const CY = H / 2 + 26;

/** Vertical squash that gives the scene its isometric tilt. */
const ISO = 0.56;
/** Light comes from the upper-left, so faces and shadows derive from this. */
const LIGHT = { x: -0.6, y: -0.8 };

interface BuildingDef {
  key: BuildingKey;
  name: string;
  kind: "command_center" | "shipyard" | "turret" | "refinery";
  wx: number; // world coords relative to island centre, pre-projection
  wy: number;
}

const BUILDINGS: BuildingDef[] = [
  { key: "command_center", name: "Command Center", kind: "command_center", wx: 0, wy: -6 },
  { key: "shipyard", name: "Shipyard", kind: "shipyard", wx: -104, wy: 62 },
  { key: "refinery", name: "Refinery", kind: "refinery", wx: 96, wy: 50 },
  { key: "turret_1", name: "North Turret", kind: "turret", wx: -70, wy: -82 },
  { key: "turret_2", name: "East Turret", kind: "turret", wx: 108, wy: -40 },
];

const SHIP_DEFS: Record<ShipType, { name: string; steel: number; fuel: number; seconds: number; hull: string; deck: string; len: number }> = {
  corvette: { name: "Stealth Corvette", steel: 90, fuel: 50, seconds: 4, hull: "#6b7f96", deck: "#9fb6cc", len: 13 },
  destroyer: { name: "Destroyer", steel: 220, fuel: 140, seconds: 7, hull: "#5b6b86", deck: "#93a8c4", len: 19 },
  carrier: { name: "Aircraft Carrier", steel: 520, fuel: 360, seconds: 12, hull: "#4a5872", deck: "#b9c8dc", len: 30 },
};

const upgradeCost = (level: number) => ({
  steel: Math.round(80 * Math.pow(1.55, level - 1)),
  fuel: Math.round(45 * Math.pow(1.55, level - 1)),
});
const upgradeSeconds = (level: number) => Math.round(5 + level * 3);

interface BuildingState { level: number; upgrading?: { startedAt: number; duration: number } }
interface Ship { id: string; type: ShipType; phase: number; radius: number; speed: number }
interface Particle { x: number; y: number; dx: number; dy: number; age: number; maxAge: number; hue: string; size: number }
interface Missile { fx: number; fy: number; tx: number; ty: number; progress: number; done: boolean }

/* ---------------------------------------------------------------- audio */

let audioCtx: AudioContext | null = null;
const getAudio = () => (audioCtx ??= new (window.AudioContext || (window as any).webkitAudioContext)());
function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.05, delay = 0, sweepTo?: number) {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const t0 = ctx.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}
const sfx = {
  select: () => tone(880, 0.07, "sine", 0.04, 0, 1200),
  upgradeStart: () => { tone(160, 0.35, "sawtooth", 0.045, 0, 420); tone(320, 0.3, "triangle", 0.025, 0.04); },
  upgradeDone: () => { tone(523, 0.14, "triangle", 0.06); tone(784, 0.18, "triangle", 0.06, 0.11); tone(1046, 0.28, "triangle", 0.05, 0.22); },
  launch: () => tone(110, 0.45, "sawtooth", 0.05, 0, 260),
  turretFire: () => { tone(90, 0.16, "square", 0.05); tone(240, 0.1, "sawtooth", 0.03, 0.01); },
  explosion: () => { tone(60, 0.4, "square", 0.06, 0, 30); tone(140, 0.25, "sawtooth", 0.04); },
};

/* ----------------------------------------------------------- projection */

/** Projects flat world coords + height into screen space. */
const proj = (wx: number, wy: number, h = 0) => ({ x: CX + wx, y: CY + wy * ISO - h });

/** Shades a hex colour by a multiplier, for deriving lit/unlit faces. */
function shade(hex: string, mult: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * mult));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * mult));
  const b = Math.min(255, Math.round((n & 255) * mult));
  return `rgb(${r},${g},${b})`;
}

/**
 * The core "looks 3D" primitive: an extruded box with a lit top face,
 * two side faces shaded by light direction, and a rim highlight on the
 * light-facing edge. Buildings are composed from a few of these.
 */
function prism(
  ctx: CanvasRenderingContext2D,
  wx: number, wy: number, base: number,
  halfW: number, halfD: number, height: number,
  color: string,
) {
  const topY = CY + wy * ISO - base - height;
  const botY = CY + wy * ISO - base;
  const x = CX + wx;
  const dw = halfW;
  const dd = halfD * ISO;

  // Right face (away from light) — darkest.
  ctx.fillStyle = shade(color, 0.52);
  ctx.beginPath();
  ctx.moveTo(x + dw, topY - dd);
  ctx.lineTo(x + dw, botY - dd);
  ctx.lineTo(x, botY + dd);
  ctx.lineTo(x, topY + dd);
  ctx.closePath();
  ctx.fill();

  // Left face (toward light) — mid.
  ctx.fillStyle = shade(color, 0.74);
  ctx.beginPath();
  ctx.moveTo(x - dw, topY - dd);
  ctx.lineTo(x - dw, botY - dd);
  ctx.lineTo(x, botY + dd);
  ctx.lineTo(x, topY + dd);
  ctx.closePath();
  ctx.fill();

  // Top face — brightest, with a subtle gradient across it.
  const g = ctx.createLinearGradient(x - dw, topY - dd, x + dw, topY + dd);
  g.addColorStop(0, shade(color, 1.22));
  g.addColorStop(1, shade(color, 0.95));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, topY - dd * 2);
  ctx.lineTo(x + dw, topY - dd);
  ctx.lineTo(x, topY + dd);
  ctx.lineTo(x - dw, topY - dd);
  ctx.closePath();
  ctx.fill();

  // Rim light along the top-left edge.
  ctx.strokeStyle = shade(color, 1.5);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - dw, topY - dd);
  ctx.lineTo(x, topY - dd * 2);
  ctx.stroke();
}

/* ------------------------------------------------------------ component */

export default function FleetCommanderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const islandRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLCanvasElement | null>(null);
  const noiseRef = useRef<CanvasPattern | null>(null);
  const rafRef = useRef(0);
  const shipsRef = useRef<Ship[]>([]);
  const partsRef = useRef<Particle[]>([]);
  const missilesRef = useRef<Missile[]>([]);
  const flashRef = useRef(0);
  const nextFireRef = useRef(performance.now() + 3500);

  const [resources, setResources] = useState({ steel: 320, fuel: 220 });
  const [buildings, setBuildings] = useState<Record<BuildingKey, BuildingState>>(
    () => Object.fromEntries(BUILDINGS.map((b) => [b.key, { level: 1 }])) as Record<BuildingKey, BuildingState>,
  );
  const [selected, setSelected] = useState<BuildingKey | null>(null);
  const [shipyardOpen, setShipyardOpen] = useState(false);
  const [, forceTick] = useState(0);

  const refineryLevel = buildings.refinery.level;

  /** Organic island outline in world space, generated once. */
  const outline = useMemo(() => {
    const pts: [number, number][] = [];
    const n = 20;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 0.84 + 0.16 * Math.sin(a * 3 + 1.1) + 0.07 * Math.sin(a * 7 + 0.4);
      pts.push([Math.cos(a) * 232 * r, Math.sin(a) * 176 * r]);
    }
    return pts;
  }, []);

  const tracePath = useCallback((ctx: CanvasRenderingContext2D, scale: number, lift: number) => {
    ctx.beginPath();
    outline.forEach(([wx, wy], i) => {
      const p = proj(wx * scale, wy * scale, lift);
      const [nwx, nwy] = outline[(i + 1) % outline.length];
      const np = proj(nwx * scale, nwy * scale, lift);
      const mx = (p.x + np.x) / 2;
      const my = (p.y + np.y) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(p.x, p.y, mx, my);
    });
    ctx.closePath();
  }, [outline]);

  /* Pre-render the static landmass and build the noise pattern once. */
  useEffect(() => {
    // Noise tile for surface texture.
    const nt = document.createElement("canvas");
    nt.width = nt.height = 96;
    const nctx = nt.getContext("2d")!;
    const img = nctx.createImageData(96, 96);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 90;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 26;
    }
    nctx.putImageData(img, 0, 0);

    const island = document.createElement("canvas");
    island.width = W;
    island.height = H;
    const ctx = island.getContext("2d")!;
    noiseRef.current = ctx.createPattern(nt, "repeat");

    // Rock skirt under the beach gives the island visible thickness.
    ctx.fillStyle = "#4a3b2c";
    tracePath(ctx, 1.0, -14);
    ctx.fill();

    // Beach.
    const sand = ctx.createLinearGradient(CX - 200, CY - 150, CX + 180, CY + 140);
    sand.addColorStop(0, "#f0dbaf");
    sand.addColorStop(0.5, "#dcbf8c");
    sand.addColorStop(1, "#b99d6f");
    ctx.fillStyle = sand;
    tracePath(ctx, 1.0, 0);
    ctx.fill();

    // Grass plateau, lifted so the beach reads as a lower terrace.
    const grass = ctx.createLinearGradient(CX - 170, CY - 140, CX + 150, CY + 120);
    grass.addColorStop(0, "#5da368");
    grass.addColorStop(0.55, "#3d7c4c");
    grass.addColorStop(1, "#2a5c39");
    ctx.fillStyle = grass;
    tracePath(ctx, 0.8, 10);
    ctx.fill();

    // Cliff edge between terraces.
    ctx.strokeStyle = "rgba(38,70,44,0.85)";
    ctx.lineWidth = 3;
    tracePath(ctx, 0.8, 10);
    ctx.stroke();

    // Surface grain.
    if (noiseRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = noiseRef.current;
      tracePath(ctx, 1.0, 0);
      ctx.fill();
      ctx.restore();
    }

    // Ambient occlusion where the land meets the water.
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    const ao = ctx.createRadialGradient(CX, CY, 90, CX, CY, 250);
    ao.addColorStop(0, "rgba(255,255,255,1)");
    ao.addColorStop(1, "rgba(120,140,150,1)");
    ctx.fillStyle = ao;
    tracePath(ctx, 1.02, 0);
    ctx.fill();
    ctx.restore();

    islandRef.current = island;

    const glow = document.createElement("canvas");
    glow.width = Math.round(W / 3);
    glow.height = Math.round(H / 3);
    glowRef.current = glow;

    forceTick((n) => n + 1);
  }, [tracePath]);

  const screenPos = useCallback((key: BuildingKey) => {
    const d = BUILDINGS.find((b) => b.key === key)!;
    return proj(d.wx, d.wy, 12);
  }, []);

  const canAfford = (c: { steel: number; fuel: number }) => resources.steel >= c.steel && resources.fuel >= c.fuel;

  const burst = (x: number, y: number, hue: string, count: number, power = 2.4) => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 0.6 + Math.random() * power;
      partsRef.current.push({
        x, y, dx: Math.cos(a) * s, dy: Math.sin(a) * s * ISO - 0.8,
        age: 0, maxAge: 24 + Math.random() * 22, hue, size: 1.5 + Math.random() * 2.5,
      });
    }
  };

  const startUpgrade = (key: BuildingKey) => {
    const st = buildings[key];
    if (st.upgrading) return;
    const cost = upgradeCost(st.level);
    if (!canAfford(cost)) return;
    setResources((r) => ({ steel: r.steel - cost.steel, fuel: r.fuel - cost.fuel }));
    setBuildings((p) => ({ ...p, [key]: { ...p[key], upgrading: { startedAt: performance.now(), duration: upgradeSeconds(st.level) * 1000 } } }));
    const s = screenPos(key);
    burst(s.x, s.y, "#67e8f9", 14, 1.6);
    sfx.upgradeStart();
  };

  const trainShip = (type: ShipType) => {
    const d = SHIP_DEFS[type];
    if (resources.steel < d.steel || resources.fuel < d.fuel) return;
    setResources((r) => ({ steel: r.steel - d.steel, fuel: r.fuel - d.fuel }));
    sfx.launch();
    const yard = screenPos("shipyard");
    burst(yard.x, yard.y, "#a78bfa", 12, 1.4);
    window.setTimeout(() => {
      shipsRef.current.push({
        id: `${type}-${Date.now()}`,
        type,
        phase: Math.random() * Math.PI * 2,
        radius: 1.34 + Math.random() * 0.2,
        speed: 0.00022 + Math.random() * 0.00008,
      });
    }, d.seconds * 1000);
  };

  /* Upgrade completion + passive income. */
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
            const s = screenPos(key);
            burst(s.x, s.y, "#7dffb0", 30, 3);
            flashRef.current = 0.5;
            sfx.upgradeDone();
          }
        }
        return changed ? next : prev;
      });
      setResources((r) => ({
        steel: r.steel + 1 + refineryLevel,
        fuel: r.fuel + 1 + Math.floor(refineryLevel * 0.7),
      }));
      forceTick((n) => n + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [screenPos, refineryLevel]);

  /* Main render loop. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = "100%";
    canvas.style.aspectRatio = `${W} / ${H}`;
    ctx.scale(dpr, dpr);

    const drawWater = (t: number) => {
      const deep = ctx.createLinearGradient(0, 0, 0, H);
      deep.addColorStop(0, "#04192e");
      deep.addColorStop(0.55, "#062a45");
      deep.addColorStop(1, "#020c18");
      ctx.fillStyle = deep;
      ctx.fillRect(0, 0, W, H);

      // Shallow reef halo around the island.
      const reef = ctx.createRadialGradient(CX, CY, 120, CX, CY, 300);
      reef.addColorStop(0, "rgba(34,180,205,0.30)");
      reef.addColorStop(0.6, "rgba(20,120,160,0.12)");
      reef.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = reef;
      ctx.fillRect(0, 0, W, H);

      // Moving swell bands.
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 7; i++) {
        const phase = t / 3600 + i * 0.9;
        const yy = ((phase * 60) % (H + 120)) - 60;
        const alpha = 0.05 + 0.035 * Math.sin(phase * 2);
        ctx.strokeStyle = `rgba(140,220,255,${Math.max(0, alpha)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 12) {
          const y = yy + Math.sin(x / 70 + phase * 3) * 5 + Math.sin(x / 27 + phase) * 2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Specular glitter.
      for (let i = 0; i < 26; i++) {
        const sx = (Math.sin(i * 12.9898 + t / 2400) * 0.5 + 0.5) * W;
        const sy = (Math.sin(i * 78.233 + t / 3100) * 0.5 + 0.5) * H;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t / 400 + i));
        ctx.fillStyle = `rgba(190,235,255,${0.22 * tw})`;
        ctx.fillRect(sx, sy, 2.2, 1.1);
      }
      ctx.restore();
    };

    const drawFoam = (t: number) => {
      ctx.save();
      const pulse = 1.03 + Math.sin(t / 700) * 0.008;
      ctx.strokeStyle = "rgba(214,241,255,0.5)";
      ctx.lineWidth = 4;
      tracePath(ctx, pulse, 0);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.5;
      tracePath(ctx, pulse + 0.022 + Math.sin(t / 900) * 0.006, -2);
      ctx.stroke();
      ctx.restore();
    };

    const shadowFor = (x: number, y: number, r: number) => {
      ctx.fillStyle = "rgba(12,24,20,0.34)";
      ctx.beginPath();
      ctx.ellipse(x - LIGHT.x * 9, y - LIGHT.y * 4 + 8, r, r * ISO * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStructure = (def: BuildingDef, t: number, glowCtx: CanvasRenderingContext2D) => {
      const st = buildings[def.key];
      const lvl = st.level;
      const base = 12;
      const p = proj(def.wx, def.wy, base);
      const grow = 1 + (lvl - 1) * 0.1;

      shadowFor(p.x, p.y, 26 * grow);

      if (def.kind === "command_center") {
        prism(ctx, def.wx, def.wy, base, 30, 30, 16, "#3c4a5e");
        prism(ctx, def.wx, def.wy - 4, base + 16, 18, 18, 26 * grow, "#4e6076");
        prism(ctx, def.wx, def.wy - 6, base + 16 + 26 * grow, 9, 9, 10, "#66809b");
        // Rotating radar dish with a neon sweep, contributed to the bloom pass.
        const top = proj(def.wx, def.wy - 6, base + 26 * grow + 28);
        const a = t / 900;
        ctx.strokeStyle = "#7dd3fc";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(top.x + Math.cos(a) * 14, top.y + Math.sin(a) * 14 * ISO);
        ctx.stroke();
        glowCtx.fillStyle = "rgba(125,211,252,0.9)";
        glowCtx.beginPath();
        glowCtx.arc(top.x / 3, top.y / 3, 3.2, 0, Math.PI * 2);
        glowCtx.fill();
        // Level pips along the base.
        for (let i = 0; i < Math.min(lvl, 6); i++) {
          const pip = proj(def.wx - 22 + i * 9, def.wy + 22, base + 3);
          ctx.fillStyle = "#22d3ee";
          ctx.fillRect(pip.x, pip.y, 4, 3);
        }
      } else if (def.kind === "shipyard") {
        prism(ctx, def.wx, def.wy, base, 38, 26, 9, "#4a4740");
        prism(ctx, def.wx - 22, def.wy, base + 9, 6, 6, 30, "#7b7468");
        prism(ctx, def.wx + 16, def.wy, base + 9, 6, 6, 18, "#7b7468");
        const a1 = proj(def.wx - 22, def.wy, base + 39);
        const a2 = proj(def.wx + 16, def.wy, base + 27);
        ctx.strokeStyle = "#9a9282";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.stroke();
        for (let i = 0; i < Math.min(lvl - 1, 3); i++) {
          const c = proj(def.wx - 10 + i * 14, def.wy + 6, base + 9);
          ctx.strokeStyle = "rgba(250,204,21,0.75)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x, c.y - 14);
          ctx.stroke();
        }
      } else if (def.kind === "refinery") {
        prism(ctx, def.wx, def.wy, base, 34, 26, 7, "#4c4438");
        for (let i = 0; i < Math.min(1 + lvl, 4); i++) {
          const ox = -18 + i * 13;
          prism(ctx, def.wx + ox, def.wy + (i % 2 ? 8 : -8), base + 7, 7, 7, 20 + i * 3, "#c88a2e");
        }
        // Flare stack.
        const fl = proj(def.wx + 22, def.wy - 10, base + 34);
        const flick = 0.6 + Math.random() * 0.4;
        ctx.fillStyle = `rgba(255,170,60,${flick})`;
        ctx.beginPath();
        ctx.ellipse(fl.x, fl.y, 3, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        glowCtx.fillStyle = `rgba(255,160,50,${0.8 * flick})`;
        glowCtx.beginPath();
        glowCtx.arc(fl.x / 3, fl.y / 3, 3, 0, Math.PI * 2);
        glowCtx.fill();
      } else {
        prism(ctx, def.wx, def.wy, base, 20, 20, 10, "#2f3a49");
        prism(ctx, def.wx, def.wy, base + 10, 13, 13, 9 * grow, "#3f4d60");
        const piv = proj(def.wx, def.wy, base + 19 + 9 * grow);
        const aim = Math.sin(t / 1500 + def.wx) * 0.9;
        ctx.strokeStyle = "#8fa3bb";
        ctx.lineWidth = 4 + Math.min(lvl - 1, 3);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(piv.x, piv.y);
        ctx.lineTo(piv.x + Math.cos(aim) * 26, piv.y + Math.sin(aim) * 26 * ISO - 5);
        ctx.stroke();
        ctx.lineCap = "butt";
      }

      // Selection ring + upgrade progress arc.
      if (selected === def.key) {
        ctx.strokeStyle = "rgba(34,211,238,0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 10, 40 * grow, 40 * grow * ISO, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (st.upgrading) {
        const frac = Math.min(1, (t - st.upgrading.startedAt) / st.upgrading.duration);
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 10, 44 * grow, 44 * grow * ISO, 0, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
        ctx.stroke();
        glowCtx.strokeStyle = "rgba(34,211,238,0.85)";
        glowCtx.lineWidth = 2;
        glowCtx.beginPath();
        glowCtx.ellipse(p.x / 3, (p.y + 10) / 3, (44 * grow) / 3, (44 * grow * ISO) / 3, 0, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
        glowCtx.stroke();
        if (Math.random() < 0.3) burst(p.x + (Math.random() - 0.5) * 30, p.y, "#22d3ee", 1, 0.8);
      }
    };

    const drawShip = (s: Ship, t: number) => {
      const ang = s.phase + t * s.speed;
      const wx = Math.cos(ang) * 268 * s.radius;
      const wy = Math.sin(ang) * 206 * s.radius;
      const p = proj(wx, wy, 0);
      const d = SHIP_DEFS[s.type];
      const heading = Math.atan2(Math.cos(ang) * ISO, -Math.sin(ang));

      // Wake.
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const wake = ctx.createLinearGradient(p.x, p.y, p.x - Math.cos(heading) * 46, p.y - Math.sin(heading) * 46);
      wake.addColorStop(0, "rgba(200,240,255,0.30)");
      wake.addColorStop(1, "rgba(200,240,255,0)");
      ctx.fillStyle = wake;
      ctx.beginPath();
      ctx.ellipse(p.x - Math.cos(heading) * 22, p.y - Math.sin(heading) * 22, d.len * 1.7, d.len * 0.5, heading, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(heading);
      ctx.scale(1, ISO + 0.2);
      // Hull shadow.
      ctx.fillStyle = "rgba(3,12,22,0.45)";
      ctx.beginPath();
      ctx.ellipse(1.5, 2.5, d.len, d.len * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      // Hull.
      const hg = ctx.createLinearGradient(0, -d.len * 0.3, 0, d.len * 0.3);
      hg.addColorStop(0, shade(d.deck, 1.1));
      hg.addColorStop(1, shade(d.hull, 0.7));
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.moveTo(d.len, 0);
      ctx.lineTo(d.len * 0.35, d.len * 0.3);
      ctx.lineTo(-d.len, d.len * 0.24);
      ctx.lineTo(-d.len, -d.len * 0.24);
      ctx.lineTo(d.len * 0.35, -d.len * 0.3);
      ctx.closePath();
      ctx.fill();
      // Superstructure / deck detail.
      ctx.fillStyle = shade(d.deck, s.type === "carrier" ? 1.15 : 0.95);
      if (s.type === "carrier") ctx.fillRect(-d.len * 0.6, -d.len * 0.17, d.len * 1.25, d.len * 0.34);
      else ctx.fillRect(-d.len * 0.25, -d.len * 0.16, d.len * 0.5, d.len * 0.32);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillRect(-d.len * 0.1, -d.len * 0.07, d.len * 0.2, d.len * 0.14);
      ctx.restore();
    };

    const draw = (t: number) => {
      const glow = glowRef.current;
      const gctx = glow?.getContext("2d") ?? null;
      if (gctx && glow) gctx.clearRect(0, 0, glow.width, glow.height);

      drawWater(t);
      drawFoam(t);
      if (islandRef.current) ctx.drawImage(islandRef.current, 0, 0, W, H);

      // Ships behind the island silhouette read as "far side" first.
      const sorted = [...shipsRef.current].sort((a, b) => {
        const ay = Math.sin(a.phase + t * a.speed);
        const by = Math.sin(b.phase + t * b.speed);
        return ay - by;
      });
      for (const s of sorted) drawShip(s, t);

      // Depth-sort structures so nearer ones overlap correctly.
      const ordered = [...BUILDINGS].sort((a, b) => a.wy - b.wy);
      for (const def of ordered) if (gctx) drawStructure(def, t, gctx);

      // Missiles.
      missilesRef.current = missilesRef.current.filter((m) => !m.done);
      for (const m of missilesRef.current) {
        m.progress += 0.025;
        const p = Math.min(1, m.progress);
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.beginPath();
        for (let s = Math.max(0, p - 0.35); s <= p; s += 0.03) {
          const xx = m.fx + (m.tx - m.fx) * s;
          const yy = m.fy + (m.ty - m.fy) * s - Math.sin(Math.PI * s) * 84;
          s === Math.max(0, p - 0.35) ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
        }
        ctx.strokeStyle = "rgba(255,190,120,0.95)";
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();
        const hx = m.fx + (m.tx - m.fx) * p;
        const hy = m.fy + (m.ty - m.fy) * p - Math.sin(Math.PI * p) * 84;
        if (gctx) {
          gctx.fillStyle = "rgba(255,200,130,0.95)";
          gctx.beginPath();
          gctx.arc(hx / 3, hy / 3, 2.4, 0, Math.PI * 2);
          gctx.fill();
        }
        if (p >= 1) {
          m.done = true;
          burst(m.tx, m.ty, "#ffb45e", 26, 3.2);
          burst(m.tx, m.ty, "#fff2d0", 10, 1.6);
          flashRef.current = 0.35;
          sfx.explosion();
        }
      }

      // Particles, additively blended so they read as light not dots.
      partsRef.current = partsRef.current.filter((p) => p.age < p.maxAge);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const p of partsRef.current) {
        p.age += 1;
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.045;
        const a = Math.max(0, 1 - p.age / p.maxAge);
        ctx.globalAlpha = a;
        ctx.fillStyle = p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a + 0.6, 0, Math.PI * 2);
        ctx.fill();
        if (gctx) {
          gctx.globalAlpha = a * 0.8;
          gctx.fillStyle = p.hue;
          gctx.beginPath();
          gctx.arc(p.x / 3, p.y / 3, (p.size * a) / 2 + 0.5, 0, Math.PI * 2);
          gctx.fill();
          gctx.globalAlpha = 1;
        }
      }
      ctx.restore();

      // Bloom: upscale the low-res glow buffer back over the frame.
      if (glow) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.85;
        ctx.filter = "blur(6px)";
        ctx.drawImage(glow, 0, 0, W, H);
        ctx.filter = "none";
        ctx.restore();
      }

      // Impact flash.
      if (flashRef.current > 0.01) {
        ctx.fillStyle = `rgba(255,235,200,${flashRef.current * 0.28})`;
        ctx.fillRect(0, 0, W, H);
        flashRef.current *= 0.86;
      }

      // Cinematic vignette + cool grade.
      const vig = ctx.createRadialGradient(CX, CY, 120, CX, CY, 460);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,6,14,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Turret fire on a jittered cadence.
      if (t > nextFireRef.current) {
        nextFireRef.current = t + 3200 + Math.random() * 3200;
        const key: BuildingKey = Math.random() < 0.5 ? "turret_1" : "turret_2";
        const from = screenPos(key);
        const a = Math.random() * Math.PI * 2;
        const target = proj(Math.cos(a) * 300, Math.sin(a) * 240, 0);
        missilesRef.current.push({ fx: from.x, fy: from.y - 20, tx: target.x, ty: target.y, progress: 0, done: false });
        sfx.turretFire();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [buildings, selected, tracePath, screenPos]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    for (const def of BUILDINGS) {
      const p = proj(def.wx, def.wy, 12);
      if (Math.hypot(x - p.x, (y - p.y - 6) / ISO) < 46) {
        sfx.select();
        setSelected(def.key);
        setShipyardOpen(def.kind === "shipyard");
        return;
      }
    }
    setSelected(null);
    setShipyardOpen(false);
  };

  const selDef = selected ? BUILDINGS.find((b) => b.key === selected)! : null;
  const selState = selected ? buildings[selected] : null;
  const cost = selState ? upgradeCost(selState.level) : null;

  return (
    <div className="fc-root relative overflow-hidden rounded-[26px] p-[1px]">
      <div className="relative rounded-[25px] bg-[#050a14] p-3 sm:p-4">
        {/* HUD */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="fc-dot" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-300/90">Fleet Commander</div>
              <div className="text-[11px] text-slate-400">Tap a structure to upgrade · open the Shipyard to build</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="fc-pill fc-pill-amber">
              <span className="fc-ico">▰</span>
              <span className="tabular-nums">{resources.steel.toLocaleString()}</span>
            </div>
            <div className="fc-pill fc-pill-cyan">
              <span className="fc-ico">◆</span>
              <span className="tabular-nums">{resources.fuel.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Viewport */}
        <div className="fc-viewport relative overflow-hidden rounded-2xl">
          <canvas ref={canvasRef} onClick={onCanvasClick} className="block w-full cursor-crosshair" />
          <div className="fc-scan pointer-events-none absolute inset-0" />
          <span className="fc-corner fc-corner-tl" />
          <span className="fc-corner fc-corner-tr" />
          <span className="fc-corner fc-corner-bl" />
          <span className="fc-corner fc-corner-br" />

          {selDef && !shipyardOpen && cost && selState && (
            <div className="fc-panel absolute bottom-3 left-3 right-3 sm:left-auto sm:w-[286px]">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-50">{selDef.name}</div>
                  <div className="text-[11px] text-cyan-300/80">Level {selState.level}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 transition hover:text-slate-200">✕</button>
              </div>
              {selState.upgrading ? (
                <div className="fc-progress">
                  <div
                    className="fc-progress-bar"
                    style={{ width: `${Math.min(100, ((performance.now() - selState.upgrading.startedAt) / selState.upgrading.duration) * 100)}%` }}
                  />
                  <span className="fc-progress-label">Upgrading…</span>
                </div>
              ) : (
                <button onClick={() => startUpgrade(selDef.key)} disabled={!canAfford(cost)} className="fc-btn fc-btn-cyan w-full">
                  <span>Upgrade</span>
                  <span className="opacity-90">▰{cost.steel} ◆{cost.fuel}</span>
                </button>
              )}
            </div>
          )}

          {shipyardOpen && (
            <div className="fc-panel absolute bottom-3 left-3 right-3 sm:left-auto sm:w-[318px]">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-50">Shipyard</div>
                <button onClick={() => setShipyardOpen(false)} className="text-slate-500 transition hover:text-slate-200">✕</button>
              </div>
              <div className="space-y-1.5">
                {(Object.keys(SHIP_DEFS) as ShipType[]).map((type) => {
                  const d = SHIP_DEFS[type];
                  const ok = resources.steel >= d.steel && resources.fuel >= d.fuel;
                  return (
                    <button key={type} onClick={() => trainShip(type)} disabled={!ok} className="fc-ship-row">
                      <span className="font-semibold text-slate-100">{d.name}</span>
                      <span className="text-[11px] text-slate-400">▰{d.steel} ◆{d.fuel} · {d.seconds}s</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fc-root {
          background: linear-gradient(140deg, rgba(34,211,238,0.55), rgba(56,89,140,0.15) 38%, rgba(168,85,247,0.4));
          box-shadow: 0 30px 80px -30px rgba(6,182,212,0.55), 0 0 0 1px rgba(148,163,184,0.06);
        }
        .fc-dot {
          width: 9px; height: 9px; border-radius: 99px; background: #22d3ee;
          box-shadow: 0 0 0 3px rgba(34,211,238,0.18), 0 0 14px 2px rgba(34,211,238,0.9);
          animation: fc-pulse 2.2s ease-in-out infinite;
        }
        @keyframes fc-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.45 } }
        .fc-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 13px; border-radius: 999px; font-size: 12.5px; font-weight: 700;
          background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 6px 18px -8px rgba(0,0,0,0.9);
          backdrop-filter: blur(10px);
        }
        .fc-pill .fc-ico { font-size: 10px; opacity: 0.95 }
        .fc-pill-amber { color: #fcd34d; border-color: rgba(252,211,77,0.32) }
        .fc-pill-amber .fc-ico { color: #f59e0b; text-shadow: 0 0 10px rgba(245,158,11,0.9) }
        .fc-pill-cyan { color: #67e8f9; border-color: rgba(103,232,249,0.32) }
        .fc-pill-cyan .fc-ico { color: #22d3ee; text-shadow: 0 0 10px rgba(34,211,238,0.9) }
        .fc-viewport { box-shadow: inset 0 0 60px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(148,163,184,0.12) }
        .fc-scan {
          background: repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 3px);
          mix-blend-mode: overlay;
        }
        .fc-corner { position: absolute; width: 16px; height: 16px; border-color: rgba(34,211,238,0.65); }
        .fc-corner-tl { top: 8px; left: 8px; border-top: 2px solid; border-left: 2px solid; border-top-left-radius: 6px }
        .fc-corner-tr { top: 8px; right: 8px; border-top: 2px solid; border-right: 2px solid; border-top-right-radius: 6px }
        .fc-corner-bl { bottom: 8px; left: 8px; border-bottom: 2px solid; border-left: 2px solid; border-bottom-left-radius: 6px }
        .fc-corner-br { bottom: 8px; right: 8px; border-bottom: 2px solid; border-right: 2px solid; border-bottom-right-radius: 6px }
        .fc-panel {
          padding: 14px; border-radius: 16px;
          background: linear-gradient(165deg, rgba(15,27,45,0.93), rgba(8,15,28,0.96));
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 24px 60px -22px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.09);
          backdrop-filter: blur(18px) saturate(140%);
          animation: fc-rise 180ms cubic-bezier(0.2,0.9,0.3,1);
        }
        @keyframes fc-rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        .fc-btn {
          position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between;
          gap: 10px; padding: 11px 15px; border-radius: 12px; font-size: 12.5px; font-weight: 800;
          letter-spacing: 0.01em; transition: transform 120ms ease, filter 120ms ease;
        }
        .fc-btn:disabled { opacity: 0.4; cursor: not-allowed }
        .fc-btn:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.08) }
        .fc-btn:not(:disabled):active { transform: translateY(0) scale(0.985) }
        .fc-btn-cyan {
          color: #04202a;
          background: linear-gradient(180deg, #7ee9fb, #16b6d4);
          box-shadow: 0 10px 26px -10px rgba(34,211,238,0.95), inset 0 1px 0 rgba(255,255,255,0.65);
        }
        .fc-btn-cyan::after {
          content: ""; position: absolute; inset: 0; transform: translateX(-120%);
          background: linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
        }
        .fc-btn-cyan:not(:disabled):hover::after { transform: translateX(120%); transition: transform 620ms ease }
        .fc-ship-row {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 9px 12px; border-radius: 11px; font-size: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012));
          border: 1px solid rgba(148,163,184,0.16);
          transition: border-color 140ms ease, transform 140ms ease, background 140ms ease;
        }
        .fc-ship-row:not(:disabled):hover {
          border-color: rgba(167,139,250,0.7); transform: translateX(2px);
          background: linear-gradient(180deg, rgba(167,139,250,0.14), rgba(167,139,250,0.04));
        }
        .fc-ship-row:disabled { opacity: 0.38; cursor: not-allowed }
        .fc-progress {
          position: relative; height: 38px; border-radius: 12px; overflow: hidden;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(34,211,238,0.28);
        }
        .fc-progress-bar {
          position: absolute; inset: 0 auto 0 0;
          background: linear-gradient(90deg, rgba(34,211,238,0.35), rgba(34,211,238,0.75));
          box-shadow: 0 0 22px rgba(34,211,238,0.6); transition: width 260ms linear;
        }
        .fc-progress-label {
          position: absolute; inset: 0; display: grid; place-items: center;
          font-size: 11.5px; font-weight: 800; color: #cffafe; letter-spacing: 0.08em; text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
