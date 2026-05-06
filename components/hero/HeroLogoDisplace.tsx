'use client';

import { useEffect, useRef } from 'react';

const SVG_W = 435.798;
const SVG_H = 340.165;
const PARTICLE_COUNT = 5000;
const HOVER_RADIUS = 150;
const PUSH_STRENGTH = 6.0;
const SPRING = 0.05;
const FRICTION = 0.86;
const PARTICLE_RADIUS = 1.1;

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
}

/**
 * Particle silhouette of the gorilla emblem with continuous ambient drift
 * and cursor-driven displacement on hover. Pointer detection runs on window
 * — the hero `.wrap` sits at z-index 50 above this canvas (z-index 25), so
 * a wrapper-scoped listener never fires. We test the cursor against the
 * wrapper's bounding rect each move instead.
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
    let hoverActive = false;
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
      const r = HOVER_RADIUS;
      const r2 = r * r;

      ctx.fillStyle = 'rgba(232, 232, 240, 0.86)';
      ctx.beginPath();

      for (const p of particles) {
        const tx = p.ox + Math.sin(t * p.freqX + p.phaseX) * p.ampX;
        const ty = p.oy + Math.cos(t * p.freqY + p.phaseY) * p.ampY;

        if (hoverActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / r) * PUSH_STRENGTH;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx += (tx - p.x) * SPRING;
        p.vy += (ty - p.y) * SPRING;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        ctx.moveTo(p.x + PARTICLE_RADIUS, p.y);
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      }
      ctx.fill();

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

    const onWindowMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (inside) {
        hoverActive = true;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      } else if (hoverActive) {
        hoverActive = false;
        mouseX = -9999;
        mouseY = -9999;
      }
    };
    const onWindowLeave = () => {
      hoverActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };

    if (hoverCap) {
      window.addEventListener('pointermove', onWindowMove, { passive: true });
      window.addEventListener('pointerleave', onWindowLeave);
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
        window.removeEventListener('pointerleave', onWindowLeave);
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
