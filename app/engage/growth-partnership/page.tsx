import type { Metadata } from 'next';
import Link from 'next/link';
import { Gem, Check } from 'lucide-react';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Growth Partnership — Terence Meghani',
  description:
    'A retained monthly engagement for businesses that want brand, AI, plugin dev, and web on ongoing support. Three tiers, no minimum term, cancel anytime.',
};

const INCLUDED = [
  'Monthly strategy call (90 min)',
  'Agreed hours per month across all practices',
  'Priority turnaround on urgent work',
  'Quarterly brand & performance review',
  'Access to trusted specialist network when needed',
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
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-rocket transition-colors">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#services" className="hover:text-rocket transition-colors">Services</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-rocket">Growth Partnership</li>
            </ol>
          </nav>

          <div className="mt-10 flex items-center gap-3">
            <Gem size={28} className="text-rocket" aria-hidden="true" strokeWidth={1.6} />
            <Kicker className="text-rocket mb-0">Ongoing engagement</Kicker>
          </div>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            Growth{' '}
            <em className="font-italic italic text-rocket">Partnership.</em>
          </h1>
          <p className="mt-4 font-italic italic text-2xl text-mist">
            Ongoing monthly engagement.
          </p>
          <p className="mt-8 max-w-2xl text-lg text-mist leading-relaxed">
            A retained monthly engagement for businesses that want the full stack — brand,
            AI, plugin dev, and web — supporting their growth on an ongoing basis.
            Flexible scope, no minimum term, cancel anytime.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-mist leading-relaxed">
            Best for scale-ups where priorities shift faster than a fixed-scope project
            allows, and where having a senior brand + tech partner on retainer is more
            valuable than assembling a new team every quarter.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="section-pad bg-char-2">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <Kicker>What&rsquo;s included</Kicker>
          <h2
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-md)' }}
          >
            Every{' '}
            <em className="font-italic italic text-rocket">tier includes.</em>
          </h2>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg text-mist">
                <Check size={20} className="text-rocket shrink-0 mt-1" aria-hidden="true" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-pad bg-char">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <Kicker>Tiers</Kicker>
          <h2
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-md)' }}
          >
            Three{' '}
            <em className="font-italic italic text-rocket">commitment levels.</em>
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={cn(
                  'border-2 rounded-2xl p-8 flex flex-col',
                  t.highlight
                    ? 'border-rocket bg-char-2 relative'
                    : 'border-hairline-subtle bg-char-2',
                )}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-8 bg-rocket text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                    Most common
                  </span>
                )}
                <h3 className="font-display text-3xl text-white">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="font-display text-rocket tabular-nums"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
                  >
                    {t.price}
                  </span>
                  <span className="font-mono text-sm text-fog">{t.per}</span>
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-mist">
                  {t.hours} included
                </div>
                <p className="mt-5 text-sm text-mist leading-relaxed">{t.blurb}</p>
                <div className="mt-auto pt-8">
                  <Button
                    href="https://calendly.com/terencemeghani"
                    external
                    variant={t.highlight ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full justify-center"
                  >
                    Book a call
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-fog font-mono text-[10px] uppercase tracking-wider">
            All tiers: no minimum term · cancel anytime · unused hours roll one month
          </p>
        </div>
      </section>

      <LaunchCTA headline="partnership" />
    </>
  );
}
