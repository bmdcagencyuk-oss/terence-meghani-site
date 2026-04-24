'use client';

import { useEffect } from 'react';

/**
 * Custom cursor, ported from v23.
 * Toggles body classes (cc-link / cc-drag / cc-view / cc-go / cc-flip)
 * based on `data-cc` or `data-cursor` on any element under the pointer.
 * Touch devices are opted out via the `no-cc` class.
 */
export function CustomCursor() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) {
      document.body.classList.add('no-cc');
      return;
    }

    const cc = document.createElement('div');
    cc.className = 'cc';
    const label = document.createElement('div');
    label.className = 'cc-label';
    document.body.appendChild(cc);
    document.body.appendChild(label);

    const onMove = (e: MouseEvent) => {
      cc.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      label.style.left = `${e.clientX}px`;
      label.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', onMove);

    // Delegate enter/leave using event listeners on document
    const onOver = (e: Event) => {
      const target = (e.target as Element | null)?.closest('[data-cc],[data-cursor]');
      if (!target) return;
      const mode = target.getAttribute('data-cc') ?? target.getAttribute('data-cursor');
      if (mode) document.body.classList.add(`cc-${mode}`);
    };
    const onOut = (e: Event) => {
      const target = (e.target as Element | null)?.closest('[data-cc],[data-cursor]');
      if (!target) return;
      const mode = target.getAttribute('data-cc') ?? target.getAttribute('data-cursor');
      if (mode) document.body.classList.remove(`cc-${mode}`);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cc.remove();
      label.remove();
    };
  }, []);

  return null;
}
