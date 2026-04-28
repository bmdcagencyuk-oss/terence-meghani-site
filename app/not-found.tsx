import type { Metadata } from 'next';
import { Emblem } from '@/components/ui/Emblem';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="pt-32 pb-32 bg-char">
      <div className="mx-auto max-w-3xl px-6 lg:px-12 text-center">
        <Emblem size={120} color="var(--color-rocket)" className="mx-auto opacity-70" />
        <Kicker className="mt-8 text-rocket">Error · 404</Kicker>
        <h1
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-lg)' }}
        >
          Lost in the <em className="font-italic italic text-rocket">studio.</em>
        </h1>
        <p className="mt-6 text-lg text-mist max-w-xl mx-auto">
          The URL you followed doesn&rsquo;t match anything on the current site. It might
          have moved in the recent rebuild — try the work or head back to the studio.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary">Back to studio</Button>
          <Button href="/work/" variant="secondary">Browse the work</Button>
        </div>
      </div>
    </section>
  );
}
