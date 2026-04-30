import Link from 'next/link';
import { Reveal } from './Reveal';
import { getCoreServices } from '@/lib/services';

type Row = { k: string; v: string };
type CardDetail = {
  icon: string;
  face: string;
  rows: Row[];
  note: string;
};

// Per-service detail. Keyed by slug; ordering and label come from
// data/services.json so the home grid can't drift from the canonical source.
const CARD_DETAIL: Record<string, CardDetail> = {
  'brand-identity': {
    icon: '🎨',
    face: 'Strategy, positioning, naming, visual system & voice.',
    rows: [
      { k: 'Focus',        v: 'Positioning, story, identity system' },
      { k: 'Approach',     v: 'Personal. Iterative. Strategy-led.' },
      { k: 'Deliverables', v: 'Naming, logo, type, colour, voice, guidelines' },
      { k: 'Best for',     v: 'Launches, founders with fire' },
    ],
    note: 'Built as long as it needs. No rush, no shortcuts.',
  },
  'wordpress-plugin-development': {
    icon: '🧩',
    face: 'Custom plugins, bespoke integrations & internal tooling.',
    rows: [
      { k: 'Focus',    v: "What WordPress doesn't do out-of-the-box" },
      { k: 'Approach', v: 'Performance-first. Secure. Documented. Yours to keep.' },
      { k: 'Scope',    v: 'Custom plugins, API integrations, admin UX, AI-powered plugins' },
      { k: 'Best for', v: 'Teams outgrowing off-the-shelf WordPress' },
    ],
    note: 'Replace three bloated plugins with one clean one.',
  },
  'ai-automation': {
    icon: '✦',
    face: 'Brand-aware AI workflows, custom GPTs & content ops.',
    rows: [
      { k: 'Focus',    v: 'AI that sounds like your brand, not ChatGPT' },
      { k: 'Approach', v: 'Your voice, trained in. Your team, trained up.' },
      { k: 'Scope',    v: 'Custom GPTs, prompt systems, content ops, WordPress AI plugins' },
      { k: 'Best for', v: 'Scaling teams, content-heavy brands' },
    ],
    note: 'Want it baked into WordPress? See Plugin Development →',
  },
  'wordpress-operations': {
    icon: '◉',
    face: 'Engineer-grade WordPress operations on retainer.',
    rows: [
      { k: 'Focus',    v: 'Server logs, DB health, deliverability, security, performance' },
      { k: 'Approach', v: 'Diagnose first, fix before it breaks, written reviews' },
      { k: 'Tiers',    v: 'Boost · Orbit · Apogee — from £1,500/mo' },
      { k: 'Best for', v: 'Sites where downtime costs money' },
    ],
    note: 'Not a care plan. An engineering retainer.',
  },
};

const SERVICES = getCoreServices()
  .filter((s) => CARD_DETAIL[s.slug])
  .map((s, i) => ({
    slug: s.slug,
    num: `S / ${String(i + 1).padStart(2, '0')}`,
    title: s.label,
    ...CARD_DETAIL[s.slug],
  }));

export function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="head">
          <Reveal as="h2" variant="blur">
            What I <em>build</em>, with you.
          </Reveal>
          <p className="lead">
            Four core practices — strategy-led brand and three engineering disciplines
            that put it on the internet properly.
          </p>
        </div>

        <div className="svc-grid">
          {SERVICES.map((s) => (
            <article
              key={s.slug}
              className="svc-card"
              itemScope
              itemType="https://schema.org/Service"
            >
              <div className="num">{s.num}</div>
              <div className="icon" aria-hidden="true">{s.icon}</div>
              <h3 className="title" itemProp="name">{s.title}</h3>
              <p className="face-tagline" itemProp="description">{s.face}</p>
              <hr className="rule" />
              <div className="meta-list">
                {s.rows.map((r) => (
                  <div className="row" key={r.k}>
                    <span className="k">{r.k}</span>
                    <span className="v">{r.v}</span>
                  </div>
                ))}
              </div>
              <p className="note">{s.note}</p>
              <Link href={`/services/${s.slug}/`} className="read-more">
                Read more <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <nav className="also-offering" aria-label="Also offering">
          <span className="ao-label">Also offering</span>
          <Link className="ao-item" href="/plugins/">
            WordPress plugins <span className="arrow">→</span>
          </Link>
          <span className="ao-divider" aria-hidden="true" />
          <Link className="ao-item" href="/services/web-development/">
            Web Development <span className="arrow">→</span>
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
