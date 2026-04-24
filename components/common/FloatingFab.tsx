'use client';

import { useEffect, useRef } from 'react';

/**
 * Floating "Book a call" FAB, ported from v23.
 * Slides in after the user scrolls past ~60% of the hero; hides again at the top.
 */
export function FloatingFab() {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const triggerY = () => {
      const hero = document.querySelector<HTMLElement>('.hero');
      return hero ? hero.getBoundingClientRect().height * 0.6 : 400;
    };

    let ticking = false;
    const update = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      if (scrolled > triggerY()) el.classList.add('visible');
      else el.classList.remove('visible');
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
    <a
      ref={ref}
      href="https://calendly.com/terencemeghani"
      target="_blank"
      rel="noopener noreferrer"
      className="fab"
      data-cc="go"
      aria-label="Book a 30-minute discovery call on Calendly"
    >
      <span className="rocket" aria-hidden="true">🚀</span>
      <span className="txt">
        Book a call<small>30 min · free · no fluff</small>
      </span>
    </a>
  );
}
