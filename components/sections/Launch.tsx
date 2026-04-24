'use client';

import { useEffect, useRef } from 'react';
import { Reveal } from './Reveal';

const STAR_COUNT = 80;
const STAR_COLORS = [
  '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
  '#00E1FF', '#66ECFF',
  '#FFB800', '#FF6E3D', '#FF4D17',
  '#9B3DFF',
];

export function Launch() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const starfieldRef = useRef<HTMLDivElement | null>(null);
  const lblRef = useRef<HTMLSpanElement | null>(null);

  /* Generate the starfield once */
  useEffect(() => {
    const starfield = starfieldRef.current;
    if (!starfield) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < STAR_COUNT; i++) {
      const s = document.createElement('span');
      const left = Math.random() * 100;
      const fast = Math.random() < 0.35;
      const duration = fast ? 2 + Math.random() * 3 : 10 + Math.random() * 10;
      const delay = -Math.random() * duration;
      const size = fast ? 2.5 + Math.random() * 2.5 : 1 + Math.random() * 1.5;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      s.style.cssText = `
        left: ${left}%;
        width: ${size}px; height: ${size}px;
        background: ${color}; color: ${color};
        animation-duration: ${duration.toFixed(2)}s;
        animation-delay: ${delay.toFixed(2)}s;
      `;
      frag.appendChild(s);
    }
    starfield.appendChild(frag);
    return () => {
      while (starfield.firstChild) starfield.removeChild(starfield.firstChild);
    };
  }, []);

  /* Countdown state machine — triggers once when section enters viewport */
  useEffect(() => {
    const section = sectionRef.current;
    const root = countdownRef.current;
    const num = numRef.current;
    const lblEl = lblRef.current;
    if (!section || !root || !num || !lblEl) return;

    let state: 'idle' | 'counting' | 'liftoff' | 'in-flight' = 'idle';
    let value = 5;
    let ticker: number | null = null;
    const TICK = 900;

    const render = () => {
      if (state === 'counting' || state === 'liftoff') {
        num.textContent = String(value).padStart(2, '0');
      }
    };
    const renderLiftoff = () => {
      num.textContent = 'LIFTOFF';
      root.classList.add('liftoff');
    };
    const renderInFlight = () => {
      lblEl.textContent = 'STATUS';
      num.textContent = 'IN FLIGHT';
      root.classList.remove('liftoff');
      root.classList.add('in-flight');
      section.classList.add('launched');
    };

    const tick = () => {
      if (state !== 'counting') return;
      value -= 1;
      if (value > 0) {
        render();
      } else {
        state = 'liftoff';
        if (ticker !== null) { clearInterval(ticker); ticker = null; }
        renderLiftoff();
        window.setTimeout(() => {
          state = 'in-flight';
          renderInFlight();
        }, 1500);
      }
    };

    const begin = () => {
      if (state !== 'idle') return;
      state = 'counting';
      value = 5;
      render();
      ticker = window.setInterval(tick, TICK);
    };

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && state === 'idle') {
              begin();
              observer?.disconnect();
            }
          });
        },
        { threshold: 0.35 },
      );
      observer.observe(section);
    } else {
      begin();
    }

    const onVis = () => {
      if (document.hidden && ticker !== null) {
        clearInterval(ticker);
        ticker = null;
      } else if (!document.hidden && state === 'counting' && ticker === null) {
        ticker = window.setInterval(tick, TICK);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      observer?.disconnect();
      if (ticker !== null) clearInterval(ticker);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <section className="launch" id="launch" ref={sectionRef}>
      <div className="starfield" ref={starfieldRef} aria-hidden="true" />
      <div className="wrap">
        <div className="countdown" ref={countdownRef} aria-live="polite">
          <span className="beacon" aria-hidden="true" />
          <span className="lbl" ref={lblRef}>T-MINUS</span>
          <span className="num" ref={numRef}>10</span>
          <span className="beacon" aria-hidden="true" />
        </div>

        <Reveal as="h2" variant="letters">
          Ready to <em>launch?</em>
        </Reveal>

        <p className="subtext">
          <strong>Two new project slots · Q3 2026.</strong> Thirty minutes, no slides, no fluff —
          leave with a concrete next step whether we work together or not.
        </p>

        <div className="cta-wrap">
          <svg
            className="cta-ring"
            viewBox="0 0 296 296"
            width="296"
            height="296"
            aria-hidden="true"
          >
            <defs>
              <path
                id="launchRingPath"
                d="M 148,148 m -128,0 a 128,128 0 1,1 256,0 a 128,128 0 1,1 -256,0"
              />
            </defs>
            <text>
              <textPath href="#launchRingPath">
                BOOK A DISCOVERY CALL · 30 MIN · FREE · NO DECK ·{' '}
              </textPath>
            </text>
          </svg>
          <a
            href="https://calendly.com/terencemeghani"
            target="_blank"
            rel="noopener noreferrer"
            className="go"
            data-cc="go"
            aria-label="Book a discovery call via Calendly"
          >
            <span className="trail" aria-hidden="true" />
            <span className="big" aria-hidden="true">🚀</span>
            <span>
              Book via
              <br />
              Calendly
            </span>
          </a>
          <span className="exhaust" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </span>
        </div>

        <a href="mailto:hello@terencemeghani.com" className="secondary">
          ✉ Or email hello@terencemeghani.com
        </a>
      </div>

      <div className="launchpad" aria-hidden="true">
        <div className="glow" />
        <div className="ticks">
          <span className="mark" />
          <span className="mark tall" />
          <span className="lbl">LP · 01</span>
          <span className="mark tall" />
          <span className="mark" />
        </div>
      </div>
    </section>
  );
}
