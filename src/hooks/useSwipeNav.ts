'use client';
import * as React from 'react';

type Opts = {
  onNext: () => void;
  onPrev: () => void;
  threshold?: number;   // px
};

export default function useSwipeNav({ onNext, onPrev, threshold = 80 }: Opts) {
  const startX = React.useRef<number | null>(null);
  const startY = React.useRef<number | null>(null);
  const active = React.useRef(false);

  React.useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.isPrimary === false) return;
      startX.current = e.clientX;
      startY.current = e.clientY;
      active.current = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!active.current || startX.current == null || startY.current == null) return;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      // نتأكد أنه سحب أفقي بوضوح
      if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
      active.current = false;
      if (dx <= -threshold) onNext?.();
      else if (dx >= threshold) onPrev?.();
    };
    const onUp = () => { active.current = false; startX.current = null; startY.current = null; };

    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointercancel', onUp, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };
  }, [onNext, onPrev, threshold]);
}
