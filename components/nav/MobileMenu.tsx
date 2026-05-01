'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LiveIndicator } from './LiveIndicator';

type Props = {
  open: boolean;
  onClose: () => void;
  notesVisible: boolean;
};

type Item = { href: string; label: string };

const SERVICES: Item[] = [
  { href: '/services/wordpress-operations/', label: 'WordPress Operations' },
  { href: '/services/wordpress-plugin-development/', label: 'Plugin Development' },
  { href: '/services/ai-automation/', label: 'AI & Automation' },
  { href: '/services/brand-identity/', label: 'Brand & Identity' },
];

/**
 * Full-screen mobile overlay. Slides in from the right, traps focus, locks
 * body scroll, closes on Escape. Tapping a nav item closes first, then
 * navigates after the close animation lands so the transition feels
 * intentional. Respects prefers-reduced-motion.
 */
export function MobileMenu({ open, onClose, notesVisible }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [servicesExpanded, setServicesExpanded] = useState(false);

  // Build the items list with conditional Notes + numbered indices
  const items: Item[] = [
    ...(notesVisible ? [{ href: '/notes/', label: 'Notes' }] : []),
    { href: '/about/', label: 'About' },
    { href: '/services/', label: 'Services' },
    { href: '/work/', label: 'Work' },
    { href: '/plugins/', label: 'Plugins' },
    { href: '/engage/', label: 'Engage' },
  ];

  const isActive = (href: string): boolean => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href);
  };

  // Body scroll lock + Escape key + focus first link on open
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      // Basic focus trap — wrap Tab within the dialog
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    const focusId = window.setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(focusId);
    };
  }, [open, onClose]);

  // Close-then-navigate so the slide-out animation reads as intentional
  const navigateThenClose = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    window.setTimeout(() => {
      router.push(href);
    }, 220);
  };

  return (
    <div
      ref={overlayRef}
      className={`mobile-menu ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      // Swallow taps on whitespace so the user can't accidentally dismiss
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mobile-menu-noise" aria-hidden="true" />

      <div className="mobile-menu-inner">
        <p className="mobile-menu-eyebrow">Terence Meghani Studio</p>

        <ul className="mobile-menu-list">
          {items.map((item, i) => {
            const num = String(i + 1).padStart(2, '0');
            const active = isActive(item.href);
            const isServices = item.label === 'Services';
            return (
              <li key={item.href} className={active ? 'is-active' : ''}>
                {isServices ? (
                  <>
                    <button
                      type="button"
                      className="mobile-menu-row"
                      onClick={() => setServicesExpanded((v) => !v)}
                      aria-expanded={servicesExpanded}
                      aria-controls="mobile-menu-services-sub"
                    >
                      <span className="mobile-menu-num">{num}</span>
                      <span className="mobile-menu-label">
                        Services <span className="mobile-menu-caret" aria-hidden="true">{servicesExpanded ? '−' : '+'}</span>
                      </span>
                    </button>
                    <ul
                      id="mobile-menu-services-sub"
                      className={`mobile-menu-sub ${servicesExpanded ? 'is-open' : ''}`}
                      aria-hidden={!servicesExpanded}
                    >
                      {SERVICES.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            onClick={navigateThenClose(s.href)}
                            aria-current={isActive(s.href) ? 'page' : undefined}
                          >
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="mobile-menu-row"
                    onClick={navigateThenClose(item.href)}
                    aria-current={active ? 'page' : undefined}
                    ref={i === 0 ? firstLinkRef : undefined}
                  >
                    <span className="mobile-menu-num">{num}</span>
                    <span className="mobile-menu-label">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <LiveIndicator notesVisible={notesVisible} variant="mobile" className="mobile-menu-live" />

        <a
          href="https://calendly.com/terencemeghani"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-menu-cta"
          onClick={onClose}
        >
          <span aria-hidden="true">🚀</span> Book a discovery call
        </a>

        <nav className="mobile-menu-secondary" aria-label="Secondary">
          <Link href="/reviews/" onClick={navigateThenClose('/reviews/')}>
            Reviews
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/process/" onClick={navigateThenClose('/process/')}>
            Process
          </Link>
        </nav>
      </div>
    </div>
  );
}
