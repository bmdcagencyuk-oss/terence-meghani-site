'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Emblem } from '@/components/ui/Emblem';
import { Button } from '@/components/ui/Button';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-char/90 backdrop-blur-md border-b border-hairline-subtle'
            : 'bg-transparent',
        )}
      >
        <nav
          className={cn(
            'mx-auto max-w-7xl flex items-center justify-between px-6 lg:px-12 transition-all',
            scrolled ? 'h-14' : 'h-20',
          )}
        >
          <Link
            href="/"
            aria-label="Terence Meghani home"
            className="text-white hover:text-rocket transition-colors"
          >
            <Emblem size={scrolled ? 30 : 36} color="currentColor" />
          </Link>

          <ul className="hidden lg:flex items-center gap-8 font-mono text-xs uppercase tracking-wider">
            <li>
              <Link href="/work/" className="text-mist hover:text-white transition-colors">
                Work
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-haspopup="true"
                onClick={() => setMegaOpen((v) => !v)}
                className="text-mist hover:text-white transition-colors flex items-center gap-1"
              >
                Services
                <span aria-hidden="true" className="text-fog">▾</span>
              </button>
              <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
            </li>
            <li>
              <Link href="/about/" className="text-mist hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/reviews/" className="text-mist hover:text-white transition-colors">
                Reviews
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button
                href="https://calendly.com/terencemeghani"
                external
                size="sm"
                variant="primary"
              >
                Book a call
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 text-white hover:text-rocket transition-colors"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
