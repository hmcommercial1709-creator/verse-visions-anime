import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

import { motionAllowed } from "@/lib/hype";

/**
 * The clash spark: a one-off particle burst on a canvas overlay.
 *
 * Canvas rather than DOM nodes. Sixty animated elements is sixty style
 * recalculations a frame and a layout thrash on a phone; sixty points on a
 * canvas is one draw call into a bitmap the compositor already owns.
 *
 * The overlay is pointer-events-none and fixed, so it never sits between a
 * reader and a button, and it draws nothing at all when the reader has asked
 * for reduced motion — for some people this kind of motion is nausea rather
 * than delight, and a burst they did not want is worse than no burst.
 *
 * The canvas is sized in device pixels and scaled back down, or the sparks
 * are soft blurred blobs on every phone made in the last decade.
 */

export interface BurstHandle {
  /** Fire at a point in viewport coordinates. */
  fire: (x: number, y: number) => void;
  /** Fire at the centre of an element — what a button handler usually wants. */
  fireAt: (el: HTMLElement | null) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
  size: number;
}

const COLORS = [282, 292, 316, 190];

export function ParticleBurst({ ref }: { ref?: Ref<BurstHandle> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const frame = useRef(0);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const alive: Particle[] = [];
    for (const p of particles.current) {
      p.life += 1;
      if (p.life >= p.max) continue;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity, so sparks arc instead of drifting
      p.vx *= 0.985;
      const fade = 1 - p.life / p.max;

      ctx.globalAlpha = fade;
      ctx.fillStyle = `hsl(${p.hue} 95% ${55 + fade * 20}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * fade, 0, Math.PI * 2);
      ctx.fill();
      alive.push(p);
    }
    ctx.globalAlpha = 1;
    particles.current = alive;

    // Stop the loop entirely when nothing is left, rather than burning a frame
    // callback forever on a page that is mostly idle.
    frame.current = alive.length ? window.requestAnimationFrame(tick) : 0;
  }, []);

  const fire = useCallback(
    (x: number, y: number) => {
      if (!motionAllowed()) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      for (let i = 0; i < 46; i += 1) {
        const angle = (Math.PI * 2 * i) / 46 + Math.random() * 0.4;
        const speed = 2.5 + Math.random() * 6.5;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 0,
          max: 34 + Math.random() * 26,
          hue: COLORS[i % COLORS.length],
          size: 1.6 + Math.random() * 2.6,
        });
      }
      if (!frame.current) frame.current = window.requestAnimationFrame(tick);
    },
    [tick],
  );

  const fireAt = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      fire(rect.left + rect.width / 2, rect.top + rect.height / 2);
    },
    [fire],
  );

  useImperativeHandle(ref, () => ({ fire, fireAt }), [fire, fireAt]);

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
