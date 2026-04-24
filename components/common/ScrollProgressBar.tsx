'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgressBar() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    let ticking = false;
    const update = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, scrolled / max) : 0;
      fill.style.width = `${pct * 100}%`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="scroll-bar" aria-hidden="true">
      <div className="fill" ref={fillRef} />
    </div>
  );
}
