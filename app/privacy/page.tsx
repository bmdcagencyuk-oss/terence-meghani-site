import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How I collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy/' },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <Kicker>Legal</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-fog">
            Last updated: April 2026
          </p>

          <div className="mt-10 space-y-5 text-mist leading-relaxed text-lg">
            <p>
              This site is operated by Terence Meghani. This policy explains how I collect,
              use, and protect information about visitors to terencemeghani.com.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">What I collect</h2>
            <p>
              Only what you voluntarily submit via the contact form: name, email, company
              (optional), service interest, budget range, and your message. I also use
              Plausible Analytics, a privacy-friendly, cookie-free analytics tool that
              collects aggregated, anonymised visit data (no personal identifiers, no
              fingerprinting, no cookies).
            </p>

            <h2 className="font-display text-white text-2xl mt-10">How I use it</h2>
            <p>
              Contact-form submissions are used to reply to your enquiry. I do not sell,
              share, or rent your information to anyone. Enquiries are stored in my email
              (Gmail) and are kept for 24 months unless you ask for them to be deleted sooner.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Your rights</h2>
            <p>
              Under UK GDPR, you have the right to access, correct, or delete information I
              hold about you. To exercise any of these rights, email{' '}
              <a href="mailto:hello@terencemeghani.com" className="text-rocket underline underline-offset-4">
                hello@terencemeghani.com
              </a>.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Contact</h2>
            <p>
              Questions about this policy: email{' '}
              <a href="mailto:hello@terencemeghani.com" className="text-rocket underline underline-offset-4">
                hello@terencemeghani.com
              </a>.
            </p>
          </div>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
