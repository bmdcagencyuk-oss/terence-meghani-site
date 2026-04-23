import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { RocketCanvas } from './RocketCanvas';
import { HeroFuelLetters } from './HeroFuelLetters';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-16 bg-char">
      <RocketCanvas />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
        <Kicker className="mb-8">Brand consultant · Hertfordshire &amp; London</Kicker>

        <h1
          className="font-display text-white leading-[0.92]"
          style={{ fontSize: 'var(--text-display-xl)' }}
          aria-label="Give your brand fuel."
        >
          <span className="block">
            <HeroFuelLetters />
          </span>
          <em aria-hidden="true">fuel.</em>
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl text-mist leading-relaxed">
          Brand strategy · AI &amp; automation · Plugin development · Web —{' '}
          <span className="text-white">for businesses that want to be remembered.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            href="https://calendly.com/terencemeghani"
            external
            variant="primary"
            size="lg"
          >
            Book a call
          </Button>
          <Link
            href="#work"
            className="font-mono text-xs uppercase tracking-wider text-mist hover:text-white transition-colors underline underline-offset-4"
          >
            See the work ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
