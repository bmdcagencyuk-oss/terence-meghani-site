'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MegaMenu } from './MegaMenu';

/**
 * Top navigation, ported from v23.
 *
 * Behaviours:
 * - `.is-scrolled` class added when user scrolls past 60px (padding shrinks,
 *   backdrop darkens, shadow appears).
 * - Services trigger opens a mega-menu dropdown. Click outside / Escape closes.
 * - Mobile (≤ 1080px): hamburger toggle reveals full-width menu stack.
 * - All nav links are standard `<Link>` — use /#section for in-page anchors
 *   from other routes; on the home page those resolve to hash navigation.
 */
export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const servicesLiRef = useRef<HTMLLIElement | null>(null);

  // Scroll-aware state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega-menu on: click outside, Escape, route change (via anchor click)
  useEffect(() => {
    if (!servicesOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        // Return focus to the trigger button for screen-reader users
        const btn = servicesLiRef.current?.querySelector('button');
        btn?.focus();
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

  // When mobile menu closes (either via hamburger or link click), we also
  // want any open submenu closed. This is handled in the click handlers
  // (closeAll / the hamburger toggle) rather than as an effect — a cascading
  // setState in an effect is a react-hooks/set-state-in-effect violation.

  const closeAll = () => {
    setServicesOpen(false);
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen((v) => {
      const next = !v;
      if (!next) setServicesOpen(false);   // closing mobile → close submenu too
      return next;
    });
  };

  const navClass = [
    'nav-top',
    scrolled   ? 'is-scrolled'    : '',
    mobileOpen ? 'is-mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav ref={navRef} className={navClass} id="nav" aria-label="Primary">
      {/* Brand lockup — gorilla mark + wordmark, mirrors the footer signoff treatment. */}
      <Link href="/" className="nav-brand" onClick={closeAll} data-cursor="link">
        <img
          className="nav-gorilla"
          src="/brand/emblem-gorilla.svg"
          alt=""
          aria-hidden="true"
        />
        Meghani / Studio
      </Link>

      {/* Center menu */}
      <ul className="nav-menu" role="menubar">
        <li role="none">
          <Link href="/about/" role="menuitem" onClick={closeAll} data-cursor="link">
            About
          </Link>
        </li>

        <li
          ref={servicesLiRef}
          role="none"
          className={`has-dropdown ${servicesOpen ? 'is-open' : ''}`}
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

        <li role="none">
          <Link href="/work/" role="menuitem" onClick={closeAll} data-cursor="link">
            Work
          </Link>
        </li>
        <li role="none">
          <Link href="/plugins/" role="menuitem" onClick={closeAll} data-cursor="link">
            Plugins
          </Link>
        </li>
        <li role="none">
          <Link href="/#why" role="menuitem" onClick={closeAll} data-cursor="link">
            Why me
          </Link>
        </li>
        <li role="none">
          <Link href="/reviews/" role="menuitem" onClick={closeAll} data-cursor="link">
            Reviews
          </Link>
        </li>
      </ul>

      {/* Right-side CTA */}
      <div className="nav-right">
        <a
          href="https://calendly.com/terencemeghani"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
          data-cursor="go"
        >
          🚀 Book a call
        </a>
      </div>

      {/* Hamburger toggle (mobile only, CSS-hidden above 1080px) */}
      <button
        type="button"
        className="nav-hamburger"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={toggleMobile}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
