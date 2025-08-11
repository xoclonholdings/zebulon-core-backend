import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

type Props = PropsWithChildren<{
  autoAdvance?: boolean;
  intervalMs?: number; // only if autoAdvance=true
  onIndexChange?: (i: number) => void;
}>;

export function SystemCarousel({ children, autoAdvance = false, intervalMs = 6000, onIndexChange }: Props) {
  const items = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  // keep refs aligned with items
  itemRefs.current = useMemo(() => items.map((_, i) => itemRefs.current[i] || document.createElement('div')), [items.length]);

  // Observe which card is most visible → active index
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const opts: IntersectionObserverInit = { root: wrap, threshold: [0.5, 0.7, 0.9] };
    const io = new IntersectionObserver((entries) => {
      let bestIdx = active;
      let bestRatio = -1;
      for (const e of entries) {
        const idx = itemRefs.current.findIndex((el) => el === e.target);
        if (idx >= 0 && e.intersectionRatio > bestRatio) {
          bestRatio = e.intersectionRatio;
          bestIdx = idx;
        }
      }
      if (bestIdx !== active && bestRatio >= 0.5) {
        setActive(bestIdx);
        onIndexChange?.(bestIdx);
      }
    }, opts);
    itemRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onIndexChange, active]);

  // Auto-advance (optional)
  useEffect(() => {
    if (!autoAdvance || items.length <= 1) return;
    const id = setInterval(() => scrollToIndex((active + 1) % items.length, true), intervalMs);
    return () => clearInterval(id);
  }, [autoAdvance, intervalMs, active, items.length]);

  // Smooth scroll to an index, with centering in viewport
  function scrollToIndex(index: number, smooth = true) {
    const wrap = wrapRef.current;
    const el = itemRefs.current[index];
    if (!wrap || !el) return;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta = (elRect.left + elRect.width / 2) - (wrapRect.left + wrapRect.width / 2);
    wrap.scrollBy({ left: delta, behavior: smooth ? 'smooth' : 'auto' });
  }

  // On mount/resize, center the active card
  useEffect(() => {
    const onResize = () => scrollToIndex(active, false);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation (focus the scroller; left/right keys)
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(Math.min(active + 1, items.length - 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(Math.max(active - 1, 0)); }
  }

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-2 py-1"
        aria-label="System carousel"
        role="region"
      >
        <div className="flex gap-3">
          {items.map((child, i) => (
            <div
              key={i}
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
              className="snap-center"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Pager dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${i === active ? 'bg-black/70 scale-110' : 'bg-black/20 hover:bg-black/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CarouselCard({ children, onClick }: PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <div
      onClick={onClick}
      className="tile-3d min-w-[260px] max-w-[320px] rounded p-4 cursor-pointer select-none border border-black/10"
    >
      {children}
    </div>
  );
}
