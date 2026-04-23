import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Cookie Policy — Terence Meghani',
  description: 'This site does not use tracking cookies.',
};

export default function CookiesPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <Kicker>Legal</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            Cookie Policy
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-fog">
            Last updated: April 2026
          </p>

          <div className="mt-10 space-y-5 text-mist leading-relaxed text-lg">
            <p>
              terencemeghani.com does not use advertising, tracking, or marketing cookies.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Analytics</h2>
            <p>
              Anonymous usage data is collected via Plausible Analytics, a cookie-free,
              privacy-friendly analytics provider. Plausible does not use cookies, does not
              collect or store any personal data, and does not track users across sites or
              devices. See{' '}
              <a
                href="https://plausible.io/data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rocket underline underline-offset-4"
              >
                Plausible&rsquo;s data policy
              </a>{' '}
              for details.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Essential cookies</h2>
            <p>
              No essential cookies are set by this site at present. If that changes in
              future, this page will be updated and you will be notified via a banner on
              first visit.
            </p>
          </div>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
