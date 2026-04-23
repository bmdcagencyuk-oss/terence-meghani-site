'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const COLOURS = ['#FF4D17', '#FFB800', '#7A0FFF', '#FFFFFF'];

export function RocketCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles: Particle[] = [];
    let stars: { x: number; y: number; r: number }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.2,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = () => {
      const { width, height } = canvas.getBoundingClientRect();
      particles.push({
        x: Math.random() * width,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.8 - Math.random() * 1.2,
        life: 0,
        maxLife: 150 + Math.random() * 100,
        size: 1 + Math.random() * 2,
        color: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      });
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Static stars
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reduce) return;

      // Particles
      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      particles = particles.filter((p) => p.life < p.maxLife);
    };

    let lastSpawn = 0;
    const tick = (t: number) => {
      if (visibleRef.current) {
        if (t - lastSpawn > 220) {
          spawnParticle();
          lastSpawn = t;
        }
        draw();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (reduce) {
      draw();
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    />
  );
}
