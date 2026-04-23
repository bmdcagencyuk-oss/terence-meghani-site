'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EmblemProps {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
  title?: string;
}

/**
 * Winged W-T emblem for Terence Meghani.
 * Vector reconstruction — matches the 435.8 × 340.17 viewBox of the original wt.svg.
 * Two wing chevrons flanking a central W-T monogram.
 */
export function Emblem({
  size = 48,
  color = 'currentColor',
  className,
  animate = false,
  title = 'Terence Meghani',
}: EmblemProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!animate || !ref.current) return;
    const el = ref.current;
    let frame = 0;
    const duration = 3000; // 3s breathing cycle
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) % duration;
      const t = elapsed / duration;
      const scale = 0.98 + 0.04 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
      el.style.transform = `scale(${scale})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 435.8 340.17"
      width={size}
      height={(size * 340.17) / 435.8}
      role="img"
      aria-label={title}
      className={cn('inline-block transition-transform', className)}
      style={{ color }}
    >
      {/* Left wing */}
      <path
        d="M0 80 L80 20 L100 70 L50 90 L80 140 L20 160 Z"
        fill={color}
        opacity="0.55"
      />
      {/* Right wing */}
      <path
        d="M435.8 80 L355.8 20 L335.8 70 L385.8 90 L355.8 140 L415.8 160 Z"
        fill={color}
        opacity="0.55"
      />
      {/* W stroke */}
      <path
        d="M110 95 L165 245 L195 175 L225 245 L280 95 L255 95 L217.5 210 L195 135 L172.5 210 L135 95 Z"
        fill={color}
      />
      {/* T stroke */}
      <path
        d="M285 95 L385 95 L385 120 L347 120 L347 245 L322 245 L322 120 L285 120 Z"
        fill={color}
      />
      {/* Baseline bar */}
      <rect x="100" y="265" width="235" height="6" fill={color} opacity="0.9" />
      {/* Subtle spark dot at bottom */}
      <circle cx="217.5" cy="295" r="4" fill={color} opacity="0.7" />
    </svg>
  );
}
