'use client';

import { useEffect, useRef } from 'react';

const SVG_W = 435.798;
const SVG_H = 340.165;
const PARTICLE_COUNT = 2800;
const HOVER_RADIUS = 130;
const PUSH_STRENGTH = 4.5;
const SPRING = 0.06;
const FRICTION = 0.82;
const PARTICLE_RADIUS = 1.15;
const SETTLE_THRESHOLD = 0.04;

interface Particle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Particle silhouette of the gorilla emblem rendered to a 2D canvas.
 * The SVG is rasterised once into an offscreen canvas, alpha-thresholded,
 * and a fixed pool of points is drawn from the filled pixels. On hover the
 * cursor pushes nearby particles outward; spring + friction return them to
 * rest. Idle = static. Pointer interaction is gated on hover-capable, fine
 * pointer devices — coarse pointers see only the static silhouette.
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
    let drewOnce = false;

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

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(232, 232, 240, 0.86)';
      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x + PARTICLE_RADIUS, p.y);
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      }
      ctx.fill();
      drewOnce = true;
    };

    const loop = () => {
      raf = 0;
      ctx.clearRect(0, 0, W, H);
      const r = HOVER_RADIUS;
      const r2 = r * r;
      let totalMovement = 0;

      ctx.fillStyle = 'rgba(232, 232, 240, 0.86)';
      ctx.beginPath();

      for (const p of particles) {
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
        p.vx += (p.ox - p.x) * SPRING;
        p.vy += (p.oy - p.y) * SPRING;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        totalMovement += Math.abs(p.vx) + Math.abs(p.vy);

        ctx.moveTo(p.x + PARTICLE_RADIUS, p.y);
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      }
      ctx.fill();
      drewOnce = true;

      const settled = totalMovement < particles.length * SETTLE_THRESHOLD;
      if (hoverActive || !settled) {
        raf = requestAnimationFrame(loop);
      }
    };

    const ensureRaf = () => {
      if (!raf) raf = requestAnimationFrame(loop);
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

      const SW = 600;
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
      const stride = Math.max(1, filled.length / PARTICLE_COUNT);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = Math.min(filled.length - 1, Math.floor(i * stride));
        const [u, v] = filled[idx];
        const ju = u + (Math.random() - 0.5) * 0.005;
        const jv = v + (Math.random() - 0.5) * 0.005;
        samplePoints.push([ju, jv]);
        particles.push({ ox: 0, oy: 0, x: 0, y: 0, vx: 0, vy: 0 });
      }
      layout();
      for (const p of particles) {
        p.x = p.ox;
        p.y = p.oy;
      }
      drawStatic();
    };

    const hoverCap = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const onEnter = (e: PointerEvent) => {
      hoverActive = true;
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      ensureRaf();
    };
    const onMove = (e: PointerEvent) => {
      if (!hoverActive) return;
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      ensureRaf();
    };
    const onLeave = () => {
      hoverActive = false;
      mouseX = -9999;
      mouseY = -9999;
      ensureRaf();
    };

    if (hoverCap) {
      wrapper.addEventListener('pointerenter', onEnter);
      wrapper.addEventListener('pointermove', onMove);
      wrapper.addEventListener('pointerleave', onLeave);
    }

    const onResize = () => {
      layout();
      if (drewOnce) drawStatic();
    };
    window.addEventListener('resize', onResize);

    sampleSvg();

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (hoverCap) {
        wrapper.removeEventListener('pointerenter', onEnter);
        wrapper.removeEventListener('pointermove', onMove);
        wrapper.removeEventListener('pointerleave', onLeave);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="hero-morph-canvas hero-morph-canvas--displace"
      aria-hidden="true"
      style={{ pointerEvents: 'auto' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

export default HeroLogoDisplace;
