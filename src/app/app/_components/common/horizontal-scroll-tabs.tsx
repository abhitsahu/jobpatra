'use client';

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '@/app/app/_util/cn';

interface HorizontalScrollTabsProps {
  /** The scrollable tab content */
  children: ReactNode;
  className?: string;
  /** Extra class applied to the inner scroll container */
  scrollClassName?: string;
  /** How many px to jump per button click (default: 280) */
  scrollStep?: number;
}

/**
 * Reusable horizontal scroll tab wrapper.
 *
 * Features:
 * - No visible scrollbar
 * - Left / right arrow buttons that appear only when there is hidden content
 * - Wheel/trackpad vertical scroll → horizontal scroll (no page scroll)
 * - Swipe-friendly on mobile (native touch scroll)
 * - Smooth scrolling throughout
 */
export function HorizontalScrollTabs({
  children,
  className,
  scrollClassName,
  scrollStep = 280,
}: HorizontalScrollTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ─── Visibility detection ─────────────────────────────────────────────────

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // scrollLeft can be a sub-pixel float on HiDPI screens — floor/ceil it
    const left = Math.round(el.scrollLeft);
    const maxScroll = Math.round(el.scrollWidth - el.clientWidth);
    setCanScrollLeft(left > 0);
    setCanScrollRight(left < maxScroll);
  }, []);

  // Run on mount and whenever layout changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    // ResizeObserver catches container width changes (e.g. panel resize)
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    el.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', updateScrollState);
    };
  }, [updateScrollState]);

  // ─── Button handlers ──────────────────────────────────────────────────────

  const scrollBy = useCallback(
    (direction: 'left' | 'right') => {
      scrollRef.current?.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth',
      });
    },
    [scrollStep],
  );

  // ─── Wheel → horizontal scroll ────────────────────────────────────────────

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept when the scroll container actually overflows horizontally
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      // Convert vertical delta to horizontal scroll and prevent page scroll
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    };

    // Must be { passive: false } to allow preventDefault()
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // ─── Shared button style ──────────────────────────────────────────────────

  const btnBase =
    'absolute top-0 bottom-0 z-10 flex items-center justify-center w-8 ' +
    'bg-gradient-to-r text-on-surface-variant hover:text-on-surface ' +
    'transition-opacity duration-150 focus-visible:outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-electric-blue/60';

  return (
    <div className={cn('relative', className)}>
      {/* Left fade + button */}
      <button
        aria-label="Scroll tabs left"
        onClick={() => scrollBy('left')}
        tabIndex={canScrollLeft ? 0 : -1}
        className={cn(
          btnBase,
          'left-0 from-surface to-transparent',
          canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Scroll container — hidden scrollbar, touch-friendly */}
      <div
        ref={scrollRef}
        role="tablist"
        className={cn(
          'flex overflow-x-auto',
          // Hide scrollbar cross-browser
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          // Padding so chevron buttons don't overlap first/last tab
          'px-8',
          scrollClassName,
        )}
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>

      {/* Right fade + button */}
      <button
        aria-label="Scroll tabs right"
        onClick={() => scrollBy('right')}
        tabIndex={canScrollRight ? 0 : -1}
        className={cn(
          btnBase,
          'right-0 from-transparent to-surface flex-row-reverse',
          canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
