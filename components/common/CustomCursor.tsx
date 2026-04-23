'use client';

import { useEffect, useRef } from 'react';

/**
 * Singleton custom cursor ported from v23.
 *
 * Usage on any element in the page:
 *   <a data-cursor="link">…</a>      → body.cc-link
 *   <button data-cursor="go">…</button> → body.cc-go  (big rocket + "Book now")
 *   <img data-cursor="view" />       → body.cc-view ("Launch")
 *   <div data-cursor="drag">…</div>  → body.cc-drag ("Drag / Throw")
 *   <div data-cursor="flip">…</div>  → body.cc-flip ("Flip")
 *
 * Automatically disabled on touch devices (CSS @media query handles visuals;
 * JS event listeners are skipped to avoid wasted work).
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Skip entirely on touch / coarse-pointer devices — matches v23
    const isCoarse =
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      document.body.classList.add('no-cc');
      return;
    }

    const cursor = cursorRef.current;
    const label  = labelRef.current;
    if (!cursor || !label) return;

    // Track raw pointer position; render loop eases into place
    let targetX = window.innerWidth  / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number | null = null;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Lerp for silky movement — 0.22 matches v23's feel
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      label.style.left = `${currentX}px`;
      label.style.top  = `${currentY}px`;
      rafId = requestAnimationFrame(tick);
    };

    // Hover state driven by [data-cursor] attribute on ancestors
    const classStates = ['cc-link', 'cc-drag', 'cc-view', 'cc-go', 'cc-flip', 'cc-grabbing'];

    const onOver = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>('[data-cursor]');
      // Clear previous states
      for (const c of classStates) document.body.classList.remove(c);
      if (!el) return;
      const state = el.getAttribute('data-cursor');
      if (state) document.body.classList.add(`cc-${state}`);
    };

    const onOut = () => {
      for (const c of classStates) document.body.classList.remove(c);
    };

    // Native anchors/buttons without data-cursor default to 'link'
    const onFallbackOver = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-cursor]')) return; // more-specific handler wins
      const interactive = target.closest('a, button, [role="button"]');
      if (interactive) document.body.classList.add('cc-link');
    };
    const onFallbackOut = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-cursor]')) return;
      if (target.closest('a, button, [role="button"]')) {
        document.body.classList.remove('cc-link');
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout',  onOut);
    document.addEventListener('pointerover', onFallbackOver);
    document.addEventListener('pointerout',  onFallbackOut);

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout',  onOut);
      document.removeEventListener('pointerover', onFallbackOver);
      document.removeEventListener('pointerout',  onFallbackOut);
      for (const c of classStates) document.body.classList.remove(c);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cc" aria-hidden="true" />
      <div ref={labelRef}  className="cc-label" aria-hidden="true" />
    </>
  );
}
