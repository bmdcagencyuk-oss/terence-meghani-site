'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Countdown() {
  const [step, setStep] = useState<number | null>(null); // null = idle; 5..1; 0 = liftoff
  const ref = useRef<HTMLDivElement | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !triggered.current) {
          triggered.current = true;
          if (reduce) {
            setStep(0); // skip animation, land on 🚀
            return;
          }
          setStep(5);
          const timers: ReturnType<typeof setTimeout>[] = [];
          for (let i = 0; i < 5; i++) {
            timers.push(setTimeout(() => setStep(4 - i), (i + 1) * 600));
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-3 font-display text-rocket tabular-nums"
      style={{ fontSize: 'var(--text-display-md)' }}
      aria-label="Launch countdown"
    >
      <AnimatePresence mode="wait">
        {step !== null && step > 0 && (
          <motion.span
            key={`t${step}`}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.3, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            T-{step}
          </motion.span>
        )}
        {step === 0 && (
          <motion.span
            key="liftoff"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            aria-label="Liftoff"
            role="img"
          >
            🚀
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
