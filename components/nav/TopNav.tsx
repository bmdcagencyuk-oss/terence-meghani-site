'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MegaMenu } from './MegaMenu';
import { LiveIndicator } from './LiveIndicator';
import { MobileMenu } from './MobileMenu';

// Whether the Notes section is publicly discoverable. Set
// NEXT_PUBLIC_NOTES_VISIBLE=true in the Vercel env (production, preview,
// development) when you're ready to surface the Notes nav link, the
// "Latest:" live-indicator entry, and the mobile-menu Notes row. Default
// is false so /notes URLs stay reachable but unlinked.
const NOTES_VISIBLE = process.env.NEXT_PUBLIC_NOTES_VISIBLE === 'true';

/**
 * Top navigation. Two layouts share the same component:
 *  - Desktop (>= 1080px): logo + lockup, left-grouped items, live indicator,
 *    outline CTA. Compacts on scroll past 60px.
 *  - Mobile (< 1080px): hamburger toggle reveals a stacked drawer menu.
 *
 * The Notes link is conditional on NOTES_VISIBLE so the rest of the section
 * can ship while it stays hidden behind a flag.
 */
export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const servicesLiRef = useRef<HTMLLIElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        servicesLiRef.current?.querySelector('button')?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (servicesLiRef.current && !servicesLiRef.current.contains(target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [servicesOpen]);

  const closeAll = () => {
    setServicesOpen(false);
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen((v) => {
      const next = !v;
      if (!next) setServicesOpen(false);
      return next;
    });
  };

  const isActive = (href: string): boolean => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/') || pathname === href.replace(/\/$/, '');
  };

  const navClass = [
    'nav-top',
    scrolled ? 'is-scrolled' : '',
    mobileOpen ? 'is-mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  type Item = { href: string; label: string };
  const baseItems: Item[] = [
    ...(NOTES_VISIBLE ? [{ href: '/notes/', label: 'Notes' }] : []),
    { href: '/about/', label: 'About' },
  ];
  const tailItems: Item[] = [
    { href: '/work/', label: 'Work' },
    { href: '/plugins/', label: 'Plugins' },
    { href: '/engage/', label: 'Engage' },
  ];

  return (
    <nav ref={navRef} className={navClass} id="nav" aria-label="Primary">
      <Link
        href="/"
        className="nav-lockup"
        onClick={closeAll}
        data-cursor="link"
        aria-label="Terence Meghani Studio — home"
      >
        <img
          className="nav-gorilla"
          src="/brand/emblem-gorilla.svg"
          alt=""
          aria-hidden="true"
        />
        <span className="nav-lockup-text">
          <span className="nav-lockup-name">terence meghani</span>
          <span className="nav-lockup-strap">studio · est. 2014</span>
        </span>
      </Link>

      <ul className="nav-menu" role="menubar">
        {baseItems.map((item) => (
          <li key={item.href} role="none" className={isActive(item.href) ? 'is-active' : ''}>
            <Link
              href={item.href}
              role="menuitem"
              onClick={closeAll}
              data-cursor="link"
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}

        <li
          ref={servicesLiRef}
          role="none"
          className={`has-dropdown ${servicesOpen ? 'is-open' : ''} ${pathname?.startsWith('/services') ? 'is-active' : ''}`}
        >
          <button
            type="button"
            id="servicesTrigger"
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            aria-controls="servicesMenu"
            role="menuitem"
            onClick={() => setServicesOpen((v) => !v)}
            data-cursor="link"
          >
            Services <span className="caret" aria-hidden="true" />
          </button>
          <MegaMenu
            id="servicesMenu"
            labelledBy="servicesTrigger"
            onItemClick={closeAll}
          />
        </li>

        {tailItems.map((item) => (
          <li key={item.href} role="none" className={isActive(item.href) ? 'is-active' : ''}>
            <Link
              href={item.href}
              role="menuitem"
              onClick={closeAll}
              data-cursor="link"
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <LiveIndicator notesVisible={NOTES_VISIBLE} variant="desktop" />

      <div className="nav-right">
        <a
          href="https://calendly.com/terencemeghani"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
          data-cursor="go"
        >
          Book a discovery <span aria-hidden="true">→</span>
        </a>
      </div>

      <button
        type="button"
        className={`nav-hamburger nav-hamburger--two ${mobileOpen ? 'is-open' : ''}`}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        onClick={toggleMobile}
      >
        <span /><span />
      </button>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        notesVisible={NOTES_VISIBLE}
      />
    </nav>
  );
}
