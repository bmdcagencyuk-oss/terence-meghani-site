'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Kicker } from '@/components/ui/Kicker';
import type { Testimonial } from '@/lib/case-studies';

interface TestimonialsProps {
  items: Testimonial[];
}

export function Testimonials({ items }: TestimonialsProps) {
  // Filter to 5-star, prefer medium/long, take up to 5
  const pool = items
    .filter((t) => t.stars === 5 && (t.lengthBucket === 'medium' || t.lengthBucket === 'long'))
    .slice(0, 5);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || pool.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % pool.length), 6000);
    return () => clearInterval(id);
  }, [paused, pool.length]);

  if (pool.length === 0) return null;
  const t = pool[idx];

  return (
    <section
      className="section-pad bg-char-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-12 text-center">
        <Kicker>What clients say</Kicker>
        <h2
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-md)' }}
        >
          4.9★ on Trustpilot.{' '}
          <em className="font-italic italic text-rocket">37 reviews.</em>{' '}
          13 years in business.
        </h2>

        <div className="mt-12 min-h-[260px] relative">
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-italic italic text-2xl md:text-3xl text-white leading-relaxed max-w-3xl mx-auto">
                &ldquo;{t.text.split('\n')[0]}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs uppercase tracking-wider text-fog">
                — {t.name}
                {t.attachedToCaseStudy ? `, ${t.attachedToCaseStudy.replace(/-/g, ' ')}` : ''}
                {' · '}
                <span className="text-rocket">{'★'.repeat(t.stars)}</span>
                {' on Trustpilot'}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {pool.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-8 bg-rocket' : 'w-1.5 bg-hairline hover:bg-mist'
              }`}
            />
          ))}
        </div>

        <Link
          href="/reviews/"
          className="mt-10 inline-flex items-center gap-2 text-rocket font-mono text-xs uppercase tracking-wider hover:gap-3 transition-all"
        >
          Read all reviews <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
