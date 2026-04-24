import type { Metadata } from 'next';
import Link from 'next/link';
import { Gem, Check } from 'lucide-react';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Growth Partnership — Terence Meghani',
  description:
    'A retained monthly engagement for businesses that want brand, AI, plugin dev, and web on ongoing support. Three tiers, no minimum term, cancel anytime.',
};

const INCLUDED = [
  { n: '01', t: 'Monthly strategy call',         d: '90-minute working session covering priorities, progress, and the next month’s plan.' },
  { n: '02', t: 'Agreed hours per month',        d: 'Banked across every practice — brand, AI, plugins, web. Use them where they land hardest.' },
  { n: '03', t: 'Priority turnaround',           d: 'Urgent work jumps the queue. Typical reply under four hours during UK business hours.' },
  { n: '04', t: 'Quarterly review',              d: 'Brand and performance review every three months — what’s working, what to change.' },
  { n: '05', t: 'Specialist network access',     d: 'Trusted collaborators (photo, motion, copy) brought in at cost when scope demands.' },
  { n: '06', t: 'No minimum term',               d: 'Month-to-month, cancel with 30 days’ notice. Unused hours roll one month forward.' },
];

const TIERS = [
  {
    name: 'Partner',
    price: '£2.5k',
    per: '/month',
    hours: '16 hours',
    highlight: false,
    blurb: 'For growing businesses that want a senior brand & tech partner on tap.',
  },
  {
    name: 'Senior',
    price: '£5k',
    per: '/month',
    hours: '32 hours',
    highlight: true,
    blurb: 'For scale-ups running multiple concurrent initiatives.',
  },
  {
    name: 'Executive',
    price: '£8k',
    per: '/month',
    hours: '50 hours',
    highlight: false,
    blurb: 'Weekly calls, fastest turnaround, deep integration with your leadership team.',
  },
];

export default function GrowthPartnershipPage() {
  return (
    <>
      <section className="page-hero with-glow">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#services">Services</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>Growth Partnership</li>
            </ol>
          </nav>

          <div className="kicker-row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Gem size={24} style={{ color: 'var(--color-rocket)' }} aria-hidden="true" strokeWidth={1.6} />
            <Kicker>Ongoing engagement</Kicker>
          </div>
          <h1>
            Growth <em>Partnership.</em>
          </h1>
          <p
            style={{
              marginTop: 18,
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              fontSize: 'clamp(22px, 2vw, 30px)',
              color: 'var(--color-rocket)',
              maxWidth: '30ch',
            }}
          >
            Brand, AI, plugin dev, web — one monthly retainer.
          </p>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            A retained monthly engagement for businesses that want the full stack on
            ongoing support. Flexible scope, no minimum term, cancel anytime. Best for
            scale-ups where priorities shift faster than a fixed-scope project allows.
          </p>
          <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button href="https://calendly.com/terencemeghani" external variant="primary">
              Book a call
            </Button>
            <Button href="/contact/" variant="secondary">
              Send a brief
            </Button>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>What&rsquo;s included</Kicker></span>
              <h2>
                Every tier <em>includes.</em>
              </h2>
            </div>
            <span className="sec-aside">06 · core benefits</span>
          </div>
          <div className="feature-grid">
            {INCLUDED.map((item) => (
              <article key={item.n} className="feature-card">
                <span className="num">{item.n}</span>
                <span className="title">
                  <Check
                    size={18}
                    style={{ verticalAlign: '-4px', marginRight: 6, color: 'var(--color-rocket)' }}
                    aria-hidden="true"
                    strokeWidth={2.2}
                  />
                  {item.t}
                </span>
                <span className="desc">{item.d}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Tiers</Kicker></span>
              <h2>
                Three <em>commitment levels.</em>
              </h2>
            </div>
            <span className="sec-aside">No lock-in · cancel anytime</span>
          </div>
          <div className="tier-grid">
            {TIERS.map((t) => (
              <div key={t.name} className={`tier${t.highlight ? ' highlight' : ''}`}>
                <span className="name">{t.name}</span>
                <div className="price">
                  <span className="amount">{t.price}</span>
                  <span className="per">{t.per}</span>
                </div>
                <span className="hours">{t.hours} per month</span>
                <p className="blurb">{t.blurb}</p>
                <div style={{ marginTop: 'auto', paddingTop: 18 }}>
                  <Button
                    href="https://calendly.com/terencemeghani"
                    external
                    variant={t.highlight ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Book a call
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: 40,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-fog)',
            }}
          >
            All tiers · no minimum term · cancel anytime · unused hours roll one month
          </p>
        </div>
      </section>

      <LaunchCTA headline="partnership" />
    </>
  );
}
