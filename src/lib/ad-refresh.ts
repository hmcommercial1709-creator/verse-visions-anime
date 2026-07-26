import { useEffect, useRef, useState } from "react";

/** Minimum / maximum refresh interval (ms) — jittered per slot. */
const MIN_MS = 45_000;
const MAX_MS = 60_000;
/** How much of the unit must be on screen to count as viewable (IAB-style). */
const VIEWABLE_RATIO = 0.5;

let seq = 0;
/** Stable, unique DOM id per mounted ad unit (survives re-renders). */
export function useAdUnitId(prefix: string) {
  const ref = useRef<string>();
  if (!ref.current) ref.current = `${prefix}-${++seq}`;
  return ref.current;
}

interface Options {
  /** Disable refreshing entirely (e.g. one-shot placements). */
  enabled?: boolean;
  intervalMs?: number;
}

/**
 * Viewability-gated ad refresh.
 *
 * The timer only runs while the slot is at least 50% inside the viewport AND
 * the tab is visible. Scrolling away or switching tabs pauses it immediately;
 * coming back resumes with a fresh interval. Returns a ref to attach to the
 * unit plus the current refresh key — bump the key to re-request creative.
 */
export function useViewableAdRefresh<T extends HTMLElement>({ enabled = true, intervalMs }: Options = {}) {
  const ref = useRef<T | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewable, setViewable] = useState(false);
  const period = useRef(intervalMs ?? MIN_MS + Math.floor(Math.random() * (MAX_MS - MIN_MS)));

  // Track viewability of the slot itself.
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setViewable(!!entry && entry.intersectionRatio >= VIEWABLE_RATIO),
      { threshold: [0, VIEWABLE_RATIO, 1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  // Track tab visibility.
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    if (!enabled) return;
    const onChange = () => setTabVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, [enabled]);

  const active = enabled && viewable && tabVisible;

  // Timer runs only while active; unmounting/pausing clears it instantly.
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setRefreshKey((k) => k + 1);
      // Re-jitter so multiple slots never refresh in lockstep.
      period.current = MIN_MS + Math.floor(Math.random() * (MAX_MS - MIN_MS));
    }, period.current);
    return () => window.clearInterval(id);
  }, [active]);

  return { ref, refreshKey, viewable: active, intervalMs: period.current };
}
