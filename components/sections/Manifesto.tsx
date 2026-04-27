'use client';

import { useEffect, useRef } from 'react';

export function Manifesto() {
  const h2Ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const h2 = h2Ref.current;
    if (!h2) return;

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

  return (
    <section className="manifesto">
      <div className="wrap">
        <div className="lbl mono">
          <span className="bar" />
          <span>02 — Manifesto</span>
        </div>

        <h2 ref={h2Ref} id="manifestoH2">
          <span className="line line-1">
            <span className="word"><span className="wi">A</span></span>{' '}
            <span className="word"><span className="wi">weak</span></span>{' '}
            <span className="word"><span className="wi">brand</span></span>{' '}
            <em className="word"><span className="wi">fades.</span></em>
          </span>

          <span className="line line-1b">
            <span className="word"><span className="wi">A</span></span>{' '}
            <span className="word"><span className="wi">loose</span></span>{' '}
            <span className="word"><span className="wi">codebase</span></span>{' '}
            <em className="word"><span className="wi">fails.</span></em>
          </span>

          <span className="line line-3">
            <span className="word"><span className="wi">Both</span></span>{' '}
            <span className="word"><span className="wi">compound</span></span>{' '}
            <span className="word hl-wrap">
              <span className="wi"><span className="hl">— for or against you.</span></span>
            </span>
          </span>
        </h2>

        <div className="bottom">
          <p>
            <strong>I run an independent studio of one</strong> — brand, code, growth,
            all from the same brain. No account managers, no handoff chain, no committee.
            Twelve years of strategy, design and engineering aimed straight at the problem
            in front of us.
          </p>
          <p>
            Most engagements start with a thirty-minute call and end with something{' '}
            <span className="under">measurable — revenue, performance, time saved</span>{' '}
            — not impressions.
          </p>
        </div>
      </div>
    </section>
  );
}
