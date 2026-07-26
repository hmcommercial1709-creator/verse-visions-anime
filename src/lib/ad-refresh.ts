import { useEffect, useId, useRef, useState } from "react";

/**
 * Refresh cadence: 45s of accumulated viewable time per slot, plus a tiny
 * jitter so several units on one page never call for creative in lockstep.
 */
const BASE_MS = 45_000;
const JITTER_MS = 2_000;
/** How much of the unit must be on screen to count as viewable (IAB-style). */
const VIEWABLE_RATIO = 0.5;

/** Stable, unique, SSR-safe DOM id per mounted ad unit. */
export function useAdUnitId(prefix: string) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  return `${prefix}-${reactId}`;
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
  const period = useRef(intervalMs ?? BASE_MS + Math.floor(Math.random() * JITTER_MS));

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
      period.current = BASE_MS + Math.floor(Math.random() * JITTER_MS);
    }, period.current);
    return () => window.clearInterval(id);
  }, [active]);

  return { ref, refreshKey, viewable: active, intervalMs: period.current };
}
