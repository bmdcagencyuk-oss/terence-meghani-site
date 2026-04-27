'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Reveal } from './Reveal';

type Row = { k: string; v: string };
type Service = {
  num: string;
  icon: string;
  title: string;
  face: string;
  back: { rows: Row[]; note: string };
};

const SERVICES: Service[] = [
  {
    num: 'S / 01',
    icon: '◉',
    title: 'WordPress Operations',
    face: 'Engineer-grade WordPress operations on retainer.',
    back: {
      rows: [
        { k: 'Focus',    v: 'Server logs, DB health, deliverability, security, performance' },
        { k: 'Approach', v: 'Diagnose first, fix before it breaks, written reviews' },
        { k: 'Tiers',    v: 'Boost · Orbit · Apogee — from £1,500/mo' },
        { k: 'Best for', v: 'Sites where downtime costs money' },
      ],
      note: 'Not a care plan. An engineering retainer.',
    },
  },
  {
    num: 'S / 02',
    icon: '🧩',
    title: 'WordPress Plugin Development',
    face: 'Custom plugins, bespoke integrations & internal tooling.',
    back: {
      rows: [
        { k: 'Focus',    v: "What WordPress doesn't do out-of-the-box" },
        { k: 'Approach', v: 'Performance-first. Secure. Documented. Yours to keep.' },
        { k: 'Scope',    v: 'Custom plugins, API integrations, admin UX, AI-powered plugins' },
        { k: 'Best for', v: 'Teams outgrowing off-the-shelf WordPress' },
      ],
      note: 'Replace three bloated plugins with one clean one.',
    },
  },
  {
    num: 'S / 03',
    icon: '✦',
    title: 'AI & Automation',
    face: 'Brand-aware AI workflows, custom GPTs & content ops.',
    back: {
      rows: [
        { k: 'Focus',    v: 'AI that sounds like your brand, not ChatGPT' },
        { k: 'Approach', v: 'Your voice, trained in. Your team, trained up.' },
        { k: 'Scope',    v: 'Custom GPTs, prompt systems, content ops, WordPress AI plugins' },
        { k: 'Best for', v: 'Scaling teams, content-heavy brands' },
      ],
      note: 'Want it baked into WordPress? See Plugin Development →',
    },
  },
  {
    num: 'S / 04',
    icon: '🎨',
    title: 'Brand & Identity',
    face: 'Strategy, positioning, naming, visual system & voice.',
    back: {
      rows: [
        { k: 'Focus',        v: 'Positioning, story, identity system' },
        { k: 'Approach',     v: 'Personal. Iterative. Strategy-led.' },
        { k: 'Deliverables', v: 'Naming, logo, type, colour, voice, guidelines' },
        { k: 'Best for',     v: 'Launches, founders with fire' },
      ],
      note: 'Built as long as it needs. No rush, no shortcuts.',
    },
  },
];

export function Services() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Flip-card behaviour: click to flip, auto-flip-back 4s after hover leaves.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const FLIP_BACK_DELAY = 4000;
    const timers = new Map<Element, number>();

    const schedule = (card: HTMLElement) => {
      const existing = timers.get(card);
      if (existing) window.clearTimeout(existing);
      const id = window.setTimeout(() => {
        if (!card.matches(':hover')) card.classList.remove('flipped');
        else schedule(card);
      }, FLIP_BACK_DELAY);
      timers.set(card, id);
    };

    const cards = root.querySelectorAll<HTMLElement>('.flip');
    const listeners: Array<{ el: HTMLElement; type: string; fn: EventListener }> = [];

    cards.forEach((card) => {
      const onClick = () => {
        card.classList.toggle('flipped');
        if (card.classList.contains('flipped')) schedule(card);
        else {
          const existing = timers.get(card);
          if (existing) window.clearTimeout(existing);
          timers.delete(card);
        }
      };
      const onEnter = () => {
        if (card.classList.contains('flipped')) {
          const existing = timers.get(card);
          if (existing) window.clearTimeout(existing);
          timers.delete(card);
        }
      };
      const onLeave = () => {
        if (card.classList.contains('flipped')) schedule(card);
      };
      card.addEventListener('click', onClick);
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      listeners.push(
        { el: card, type: 'click', fn: onClick as EventListener },
        { el: card, type: 'mouseenter', fn: onEnter as EventListener },
        { el: card, type: 'mouseleave', fn: onLeave as EventListener },
      );
    });

    return () => {
      listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="head">
          <Reveal as="h2" variant="blur">
            What I <em>build</em>, with you.
          </Reveal>
          <p className="lead">
            Four core services — WordPress operations, custom WordPress plugin
            development, AI &amp; automation, and brand &amp; identity. Click any
            card to flip.
          </p>
        </div>

        <div className="flip-grid" ref={rootRef}>
          {SERVICES.map((s) => (
            <article
              key={s.num}
              className="flip"
              data-cc="flip"
              itemScope
              itemType="https://schema.org/Service"
            >
              <div className="flip-inner">
                <div className="flip-face">
                  <div className="num">{s.num} · {s.icon}</div>
                  <h3 className="title" itemProp="name">{s.title}</h3>
                  <div className="bottom-row">
                    <div className="desc" itemProp="description">{s.face}</div>
                    <div className="flipper" aria-hidden="true">↻</div>
                  </div>
                </div>
                <div className="flip-back">
                  <div className="num">{s.num} · Detail</div>
                  <h3 className="title">{s.title}</h3>
                  <div className="meta-list">
                    {s.back.rows.map((r) => (
                      <div className="row" key={r.k}>
                        <span className="k">{r.k}</span>
                        <span className="v">{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bottom-row" style={{ marginTop: 20 }}>
                    <div className="desc">{s.back.note}</div>
                    <div className="flipper" aria-hidden="true">↺</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <nav className="also-offering" aria-label="Additional services">
          <span className="ao-label">Also offering</span>
          <Link className="ao-item" href="/services/web-development/">
            Web Development <span className="arrow">→</span>
          </Link>
          <span className="ao-divider" aria-hidden="true" />
          <Link className="ao-item" href="/services/ppc-paid-media/">
            PPC &amp; Paid Media <span className="arrow">→</span>
          </Link>
          <span className="ao-divider" aria-hidden="true" />
          <Link className="ao-item" href="/services/seo-organic-growth/">
            SEO &amp; Organic Growth <span className="arrow">→</span>
          </Link>
          <span className="ao-divider" aria-hidden="true" />
          <Link className="ao-item" href="/engage/growth-partnership/">
            Growth Partnership <span className="arrow">→</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}
