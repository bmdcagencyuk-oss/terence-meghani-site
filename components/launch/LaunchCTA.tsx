import Link from 'next/link';
import { Starfield } from './Starfield';
import { Countdown } from './Countdown';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';

interface LaunchCTAProps {
  headline?: string;
  context?: string;
  primaryCTA?: { label: string; href: string; external?: boolean };
  secondaryCTA?: { label: string; href: string };
}

export function LaunchCTA({
  headline = 'brand',
  context,
  primaryCTA = {
    label: 'Book a call 🚀',
    href: 'https://calendly.com/terencemeghani',
    external: true,
  },
  secondaryCTA = { label: '✎ Send a written enquiry', href: '/contact/' },
}: LaunchCTAProps) {
  return (
    <section
      className="relative overflow-hidden bg-ink section-pad"
      aria-labelledby="launch-heading"
    >
      <Starfield density={100} />
      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-12 text-center">
        <Kicker className="text-rocket">Ready to launch?</Kicker>
        {context && <p className="mt-3 text-sm text-fog italic">{context}</p>}
        <h2
          id="launch-heading"
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-lg)' }}
        >
          Let&rsquo;s give your{' '}
          <em>{headline}</em>{' '}
          fuel.
        </h2>
        <div className="mt-10">
          <Countdown />
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href={primaryCTA.href}
            external={primaryCTA.external}
            variant="primary"
            size="lg"
          >
            {primaryCTA.label}
          </Button>
          <span className="text-fog font-mono text-[11px] uppercase tracking-wider">
            — or —
          </span>
          <Link
            href={secondaryCTA.href}
            className="text-mist hover:text-white underline underline-offset-4 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            {secondaryCTA.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
