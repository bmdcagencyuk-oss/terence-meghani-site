'use client';

import { useEffect, useRef } from 'react';

const HALF_SECOND = "It's the half-second";

export function Manifesto() {
  const h2Ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const h2 = h2Ref.current;
    if (!h2) return;

    // Stagger the letter cascade on "It's the half-second"
    const letters = h2.querySelectorAll<HTMLElement>('.letter:not(.ls)');
    letters.forEach((el, i) => {
      el.style.transitionDelay = `${0.65 + i * 0.035}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(h2);

    // Magnetic word hover (fine pointer only)
    let cleanup: (() => void) | null = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const strength = 0.22;
      const handlers: Array<{
        el: HTMLElement;
        move: (e: MouseEvent) => void;
        leave: () => void;
      }> = [];
      h2.querySelectorAll<HTMLElement>('.word').forEach((word) => {
        let raf: number | null = null;
        const move = (e: MouseEvent) => {
          if (!h2.classList.contains('revealed')) return;
          const r = word.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * strength;
          const dy = (e.clientY - (r.top + r.height / 2)) * strength;
          if (raf !== null) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            word.style.transform = `translate(${dx}px, ${dy}px)`;
          });
        };
        const leave = () => {
          if (raf !== null) cancelAnimationFrame(raf);
          word.style.transform = '';
        };
        word.addEventListener('mousemove', move);
        word.addEventListener('mouseleave', leave);
        handlers.push({ el: word, move, leave });
      });
      cleanup = () => {
        handlers.forEach(({ el, move, leave }) => {
          el.removeEventListener('mousemove', move);
          el.removeEventListener('mouseleave', leave);
        });
      };
    }

    // Fallback reveal if already in view at load
    const timer = window.setTimeout(() => {
      const r = h2.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) h2.classList.add('revealed');
    }, 200);

    return () => {
      observer.disconnect();
      cleanup?.();
      window.clearTimeout(timer);
    };
  }, []);

  const halfSecondLetters = Array.from(HALF_SECOND).map((ch, i) => (
    <span key={i} className={`letter${ch === ' ' ? ' ls' : ''}`}>
      {ch === ' ' ? ' ' : ch}
    </span>
  ));

  return (
    <section className="manifesto">
      <div className="wrap">
        <div className="lbl mono">
          <span className="bar" />
          <span>02 — Manifesto</span>
        </div>

        <h2 ref={h2Ref} id="manifestoH2">
          <span className="line line-1">
            <span className="word"><span className="wi">Your</span></span>{' '}
            <span className="word"><span className="wi">brand</span></span>{' '}
            <em className="word"><span className="wi">isn&rsquo;t</span></em>{' '}
            <span className="word out-wrap">
              <span className="wi"><span className="out">a logo.</span></span>
              <svg
                className="strike"
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M 4 32 Q 60 10 110 22 T 196 10" />
              </svg>
            </span>
          </span>

          <span className="line line-2">
            <span className="cond" aria-label="It's the half-second">
              {halfSecondLetters}
            </span>
          </span>

          <span className="line line-3">
            <span className="word"><span className="wi">feeling</span></span>{' '}
            <span className="word"><span className="wi">that</span></span>{' '}
            <span className="word"><span className="wi">sells</span></span>{' '}
            <span className="word hl-wrap">
              <span className="wi"><span className="hl">everything else.</span></span>
            </span>
          </span>
        </h2>

        <div className="bottom">
          <p>
            <strong>A weak brand fades. A sharp one compounds.</strong> I work close — no account
            managers, no handoff chain. Just a decade of strategy, design and digital aimed straight
            at the problem in front of us.
          </p>
          <p>
            Most engagements start with a thirty-minute call and end with something loud, defensible
            and on-brief — <span className="under">measured in revenue, not impressions.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
