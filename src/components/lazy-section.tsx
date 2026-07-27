import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defers rendering of below-the-fold content until it is about to scroll into
 * view. Keeps the initial render (and hydration) cheap so the LCP paint isn't
 * competing with heavy widgets, while reserving height to avoid layout shift.
 */
export function LazySection({
  children,
  minHeight = 320,
  rootMargin = "400px",
  className,
}: {
  children: ReactNode;
  /** Placeholder height reserved before the content mounts (px). */
  minHeight?: number;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
}
