'use client';

import { useEffect, useRef } from 'react';

const SVG_W = 435.798;
const SVG_H = 340.165;
const PARTICLE_COUNT = 5000;
/* Two-zone cursor field. Close in, the silhouette repels the cursor
   (the original "displacement" feel). At long range across the rest
   of the hero, particles are gently pulled toward the cursor — so the
   gorilla leans toward the headline as the user reads, tying the two
   halves of the hero together without any DOM connection. */
const PUSH_RADIUS = 110;
const PUSH_STRENGTH = 5.5;
const PULL_RADIUS = 900;
const PULL_STRENGTH = 1.4;
const SPRING = 0.055;
const FRICTION = 0.86;
const PARTICLE_RADIUS = 1.15;

/* Same weighted palette as the ambient hero canvas (Hero.tsx). Sharing the
   tone set makes the gorilla read as a denser cluster of the same particle
   layer rather than a separate element. Per-particle alpha is bumped vs.
   the ambient layer because the gorilla is dense — too high and `screen`
   blending blows the silhouette out to white. */
const PALETTE: Array<{ fill: string; weight: number }> = [
  { fill: 'rgba(255, 255, 255, 0.55)', weight: 0.6 },
  { fill: 'rgba(155, 61, 255, 0.65)', weight: 0.25 },
  { fill: 'rgba(255, 77, 23, 0.7)', weight: 0.15 },
];

interface Particle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ampX: number;
  ampY: number;
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  tone: number;
}

const pickTone = () => {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < PALETTE.length; i++) {
    acc += PALETTE[i].weight;
    if (r <= acc) return i;
  }
  return 0;
};

/**
 * Particle silhouette of the gorilla emblem with continuous ambient drift
 * and cursor-driven displacement reaching across the entire hero. Pointer
 * detection is window-level (the hero `.wrap` sits above this canvas at
 * z-index 50, which would eat wrapper-scoped events). Composited via
 * `screen` so particles glow into the gradient backdrop instead of sitting
 * flat on top.
 */
export function HeroLogoDisplace() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    const samplePoints: Array<[number, number]> = [];

    let W = 0;
    let H = 0;
    let fitX = 0;
    let fitY = 0;
    let fitW = 0;
    let fitH = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let cursorActive = false;
    let raf = 0;
    let mounted = true;
    let started = false;
    let startTime = 0;

    const layout = () => {
      W = wrapper.clientWidth;
      H = wrapper.clientHeight;
      if (W === 0 || H === 0) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const aspect = SVG_W / SVG_H;
      let w = W;
      let h = W / aspect;
      if (h > H) {
        h = H;
        w = H * aspect;
      }
      fitW = w;
      fitH = h;
      fitX = W - w;
      fitY = H - h;

      for (let i = 0; i < particles.length && i < samplePoints.length; i++) {
        const [u, v] = samplePoints[i];
        particles[i].ox = fitX + u * fitW;
        particles[i].oy = fitY + v * fitH;
      }
    };

    const loop = (ts: number) => {
      raf = 0;
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'screen';
      const pushR2 = PUSH_RADIUS * PUSH_RADIUS;
      const pullR2 = PULL_RADIUS * PULL_RADIUS;

      // Step physics for every particle once. Drawing is a separate pass
      // grouped by tone so we batch into 3 fills instead of 5000.
      for (const p of particles) {
        const tx = p.ox + Math.sin(t * p.freqX + p.phaseX) * p.ampX;
        const ty = p.oy + Math.cos(t * p.freqY + p.phaseY) * p.ampY;

        if (cursorActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < pushR2 && d2 > 1) {
            const d = Math.sqrt(d2);
            const norm = 1 - d / PUSH_RADIUS;
            const f = norm * norm * PUSH_STRENGTH;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          } else if (d2 < pullR2) {
            const d = Math.sqrt(d2);
            const norm = (PULL_RADIUS - d) / (PULL_RADIUS - PUSH_RADIUS);
            const f = norm * norm * PULL_STRENGTH;
            p.vx -= (dx / d) * f;
            p.vy -= (dy / d) * f;
          }
        }
        p.vx += (tx - p.x) * SPRING;
        p.vy += (ty - p.y) * SPRING;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
      }

      for (let toneIdx = 0; toneIdx < PALETTE.length; toneIdx++) {
        ctx.fillStyle = PALETTE[toneIdx].fill;
        ctx.beginPath();
        for (const p of particles) {
          if (p.tone !== toneIdx) continue;
          ctx.moveTo(p.x + PARTICLE_RADIUS, p.y);
          ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      if (mounted) raf = requestAnimationFrame(loop);
    };

    const sampleSvg = async () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/brand/emblem-gorilla.svg';
      try {
        await img.decode();
      } catch {
        return;
      }
      if (!mounted) return;

      const SW = 800;
      const SH = Math.round(SW * (SVG_H / SVG_W));
      const off = document.createElement('canvas');
      off.width = SW;
      off.height = SH;
      const oc = off.getContext('2d');
      if (!oc) return;
      oc.drawImage(img, 0, 0, SW, SH);

      let data: Uint8ClampedArray;
      try {
        data = oc.getImageData(0, 0, SW, SH).data;
      } catch {
        return;
      }

      const filled: Array<[number, number]> = [];
      const STEP = 2;
      for (let y = 0; y < SH; y += STEP) {
        for (let x = 0; x < SW; x += STEP) {
          if (data[(y * SW + x) * 4 + 3] > 128) {
            filled.push([x / SW, y / SH]);
          }
        }
      }
      if (filled.length === 0) return;

      samplePoints.length = 0;
      particles.length = 0;
      const stride = filled.length / PARTICLE_COUNT;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = Math.min(filled.length - 1, Math.floor(i * stride));
        const [u, v] = filled[idx];
        const ju = u + (Math.random() - 0.5) * 0.004;
        const jv = v + (Math.random() - 0.5) * 0.004;
        samplePoints.push([ju, jv]);
        particles.push({
          ox: 0,
          oy: 0,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          ampX: 0.7 + Math.random() * 1.8,
          ampY: 0.7 + Math.random() * 1.8,
          freqX: 0.5 + Math.random() * 1.3,
          freqY: 0.5 + Math.random() * 1.3,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          tone: pickTone(),
        });
      }
      layout();
      for (const p of particles) {
        p.x = p.ox;
        p.y = p.oy;
      }
      if (!started) {
        started = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const hoverCap = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* Cursor anywhere in the document influences the gorilla — coords are
       stored in wrapper-local space (negative or > W is fine, the radius
       falloff handles it). Without this the gorilla feels dead while the
       user is reading the headline. */
    const onWindowMove = (e: PointerEvent) => {
      cursorActive = true;
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onDocLeave = () => {
      cursorActive = false;
    };

    if (hoverCap) {
      window.addEventListener('pointermove', onWindowMove, { passive: true });
      document.addEventListener('mouseleave', onDocLeave);
    }

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    sampleSvg();

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (hoverCap) {
        window.removeEventListener('pointermove', onWindowMove);
        document.removeEventListener('mouseleave', onDocLeave);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="hero-morph-canvas hero-morph-canvas--displace"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

export default HeroLogoDisplace;
