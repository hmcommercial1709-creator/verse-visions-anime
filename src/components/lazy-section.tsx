import type { ReactNode } from "react";

/**
 * Below-the-fold section wrapper.
 *
 * Instead of mounting content late (which caused large layout shifts when the
 * real content was taller than the reserved placeholder), the content is always
 * rendered — including in the server HTML, which is better for SEO — and the
 * browser is told it may skip *rendering* work while it is off screen via
 * `content-visibility: auto`. `contain-intrinsic-size` supplies a size estimate
 * so scrollbar geometry stays stable, and because the real DOM is present the
 * measured height is used as soon as the section is reached: zero CLS, while
 * still keeping style/layout/paint off the main thread until needed (better INP).
 */
export function LazySection({
  children,
  minHeight = 320,
  className,
}: {
  children: ReactNode;
  /** Estimated height used while the section is off screen (px). */
  minHeight?: number;
  /** Kept for API compatibility with previous call sites. */
  rootMargin?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${minHeight}px`,
      }}
    >
      {children}
    </div>
  );
}
