'use client';

import { useEffect, useRef } from 'react';

const FILTER_ID = 'hero-logo-displace';

const HOVER_RAMP_IN_MS = 200;
const HOVER_RAMP_OUT_MS = 300;
const PEAK_SCALE = 28;
const FREQ_LOW = { x: 0.012, y: 0.018 };
const FREQ_HIGH = { x: 0.04, y: 0.05 };
const SEED_PER_SEC = 0.6;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Cursor-driven SVG turbulence/displacement on the gorilla emblem.
 * Filter renders in DOM at scale=0 so SSR matches client idle (no flicker).
 * On `(hover: hover) and (pointer: fine)` devices, pointer enter ramps the
 * displacement in; pointer leave ramps it out. On coarse pointers the filter
 * is mounted but inert — no pointer listeners attached.
 */
export function HeroLogoDisplace() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const turbRef = useRef<SVGFETurbulenceElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const turb = turbRef.current;
    const disp = dispRef.current;
    if (!wrapper || !turb || !disp) return;

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf: number | null = null;
    let pointerInside = false;
    let px = 0.5;
    let py = 0.5;
    let lastClientX = 0;
    let lastClientY = 0;
    let hoverRamp = 0;
    let lastTs = 0;
    let seed = 1;

    const tick = (ts: number) => {
      raf = null;
      const dt = lastTs ? ts - lastTs : 16;
      lastTs = ts;

      const target = pointerInside ? 1 : 0;
      const rampMs = pointerInside ? HOVER_RAMP_IN_MS : HOVER_RAMP_OUT_MS;
      const step = Math.min(1, dt / rampMs);
      hoverRamp = lerp(hoverRamp, target, step);

      const m = (px + py) / 2;
      const fx = lerp(FREQ_LOW.x, FREQ_HIGH.x, m);
      const fy = lerp(FREQ_LOW.y, FREQ_HIGH.y, m);
      turb.setAttribute('baseFrequency', `${fx.toFixed(4)} ${fy.toFixed(4)}`);

      const dx = px - 0.5;
      const dy = py - 0.5;
      const dist = Math.min(1, Math.hypot(dx, dy) / 0.7071);
      const falloff = 1 - dist;
      const scale = PEAK_SCALE * falloff * hoverRamp;
      disp.setAttribute('scale', scale.toFixed(2));

      seed += (dt / 1000) * SEED_PER_SEC;
      turb.setAttribute('seed', (Math.floor(seed * 100) / 100).toString());

      if (pointerInside || hoverRamp > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        disp.setAttribute('scale', '0');
        lastTs = 0;
      }
    };

    const ensureRaf = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    const updatePxPy = () => {
      const r = wrapper.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      px = Math.min(1, Math.max(0, (lastClientX - r.left) / r.width));
      py = Math.min(1, Math.max(0, (lastClientY - r.top) / r.height));
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      pointerInside = true;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      updatePxPy();
      ensureRaf();
    };
    const onMove = (e: PointerEvent) => {
      if (!pointerInside) return;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      updatePxPy();
      ensureRaf();
    };
    const onLeave = () => {
      pointerInside = false;
      ensureRaf();
    };

    wrapper.addEventListener('pointerenter', onEnter);
    wrapper.addEventListener('pointermove', onMove);
    wrapper.addEventListener('pointerleave', onLeave);

    return () => {
      wrapper.removeEventListener('pointerenter', onEnter);
      wrapper.removeEventListener('pointermove', onMove);
      wrapper.removeEventListener('pointerleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="hero-morph-canvas hero-morph-canvas--displace"
      aria-hidden="true"
      style={{ pointerEvents: 'auto' }}
    >
      <svg
        viewBox="0 0 435.798 340.165"
        preserveAspectRatio="xMaxYMax meet"
        width="100%"
        height="100%"
        style={{ display: 'block', opacity: 0.92 }}
      >
        <defs>
          <filter
            id={FILTER_ID}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
          >
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency={`${FREQ_LOW.x} ${FREQ_LOW.y}`}
              numOctaves={2}
              seed={1}
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale={0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <image
          href="/brand/emblem-gorilla.svg"
          width="435.798"
          height="340.165"
          preserveAspectRatio="xMidYMid meet"
          filter={`url(#${FILTER_ID})`}
        />
      </svg>
    </div>
  );
}

export default HeroLogoDisplace;
