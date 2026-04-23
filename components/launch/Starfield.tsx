'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;   // twinkle phase
  spd: number;  // twinkle speed
  c: string;    // colour
}

const COLOURS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFB800', '#FF4D17'];

export function Starfield({ density = 80 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

      starsRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.8,
        tw: Math.random() * Math.PI * 2,
        spd: 0.5 + Math.random() * 1.5,
        c: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const stars = starsRef.current;
      for (const s of stars) {
        const alpha = reduceMotion ? 0.75 : 0.4 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.spd + s.tw));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (t: number) => {
      if (visibleRef.current && !reduceMotion) draw(t);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      draw(0); // single static frame
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    // IntersectionObserver — pause when off-screen
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) visibleRef.current = false;
      else visibleRef.current = true;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    />
  );
}
