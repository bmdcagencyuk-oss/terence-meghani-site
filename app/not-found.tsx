import Link from 'next/link';
import { Emblem } from '@/components/ui/Emblem';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export default function NotFound() {
  return (
    <>
      <section className="pt-32 pb-20 bg-char">
        <div className="mx-auto max-w-3xl px-6 lg:px-12 text-center">
          <Emblem size={120} color="var(--color-rocket)" className="mx-auto opacity-70" />
          <Kicker className="mt-8 text-rocket">Error · 404</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            404 — <em className="font-italic italic text-rocket">Off course.</em>
          </h1>
          <p className="mt-6 font-italic italic text-2xl text-mist">
            This page drifted out of orbit.
          </p>
          <p className="mt-6 text-lg text-mist max-w-xl mx-auto">
            The URL you followed doesn&rsquo;t match anything on the current site. It might
            have moved in our recent rebuild — try one of these:
          </p>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wider">
            <li><Link href="/" className="text-white hover:text-rocket transition-colors">Home</Link></li>
            <li><Link href="/work/" className="text-white hover:text-rocket transition-colors">Work (all 24 projects)</Link></li>
            <li><Link href="/#services" className="text-white hover:text-rocket transition-colors">Services</Link></li>
            <li><Link href="/about/" className="text-white hover:text-rocket transition-colors">About</Link></li>
            <li><Link href="/reviews/" className="text-white hover:text-rocket transition-colors">Reviews</Link></li>
          </ul>
        </div>
      </section>
      <LaunchCTA headline="search" />
    </>
  );
}
