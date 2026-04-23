'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import servicesData from '@/data/services.json';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const core = servicesData.services.filter((s) => s.tier === 'core');
  const secondary = servicesData.services.filter((s) => s.tier === 'secondary');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] bg-ink overflow-y-auto"
        >
          <div className="flex items-center justify-end p-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-white hover:text-rocket transition-colors"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <nav className="px-6 pb-12 space-y-10">
            <ul className="space-y-5 text-3xl font-display text-white">
              <li><Link href="/" onClick={onClose}>Home</Link></li>
              <li><Link href="/work/" onClick={onClose}>Work</Link></li>
              <li><Link href="/about/" onClick={onClose}>About</Link></li>
              <li><Link href="/reviews/" onClick={onClose}>Reviews</Link></li>
              <li><Link href="/contact/" onClick={onClose}>Contact</Link></li>
            </ul>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog mb-4">
                Services
              </p>
              <ul className="space-y-3">
                {core.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={s.url}
                      onClick={onClose}
                      className="text-white hover:text-rocket transition-colors text-lg"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
                {secondary.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={s.url}
                      onClick={onClose}
                      className="text-mist hover:text-rocket transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              href="https://calendly.com/terencemeghani"
              external
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              Book a call
            </Button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
