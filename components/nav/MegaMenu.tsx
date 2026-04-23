'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import servicesData from '@/data/services.json';
import caseStudiesData from '@/data/case-studies.json';

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const core = servicesData.services.filter((s) => s.tier === 'core');
  const secondary = servicesData.services.filter((s) => s.tier === 'secondary');
  const fireaway = caseStudiesData.studies.find((s) => s.slug === 'fireaway-pizza');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="region"
          aria-label="Services"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-full -translate-x-1/2 mt-3 w-[min(780px,95vw)] bg-char-2 border border-hairline rounded-xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
          onMouseLeave={onClose}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog mb-3">
              Core services
            </p>
            <ul className="space-y-3">
              {core.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.url}
                    onClick={onClose}
                    className="block group"
                  >
                    <span className="block text-white font-medium group-hover:text-rocket transition-colors">
                      {s.label}
                    </span>
                    <span className="block text-xs text-fog mt-0.5">{s.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog mb-3">
              Also offering
            </p>
            <ul className="space-y-3">
              {secondary.map((s) => (
                <li key={s.slug}>
                  <Link href={s.url} onClick={onClose} className="block group">
                    <span className="block text-mist group-hover:text-rocket transition-colors">
                      {s.label}
                    </span>
                    <span className="block text-xs text-fog mt-0.5">{s.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {fireaway && (
            <Link
              href={`/work/${fireaway.slug}/`}
              onClick={onClose}
              className="bg-ink border border-hairline rounded-lg p-4 hover:border-rocket transition-colors group flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rocket">
                  Featured case study
                </p>
                <p className="mt-2 text-white font-display text-xl leading-tight group-hover:text-rocket transition-colors">
                  {fireaway.client}
                </p>
                <p className="mt-2 text-xs text-fog">{fireaway.excerpt}</p>
              </div>
              {fireaway.metric && (
                <p className="mt-3 font-display text-3xl text-rocket leading-none">
                  {fireaway.metric.value}
                </p>
              )}
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
