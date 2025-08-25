"use client";
import { useRef, useEffect } from "react";

type SwipeOpts = {
  threshold?: number;             // px
  onPrev(): void;                 // سحب من اليسار -> اليمين
  onNext(): void;                 // سحب من اليمين -> اليسار
};

export default function useSwipe(elRef: React.RefObject<HTMLElement>, opts: SwipeOpts) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const threshold = opts.threshold ?? 48;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (startX.current == null || startY.current == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      // تجاهل السحب العمودي
      if (Math.abs(dy) > Math.abs(dx)) { startX.current = startY.current = null; return; }
      if (dx > threshold) opts.onPrev();
      if (dx < -threshold) opts.onNext();
      startX.current = startY.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [elRef, threshold, opts]);
}
