import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using terencemeghani.com.',
  alternates: { canonical: '/terms/' },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <Kicker>Legal</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            Terms of Service
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-fog">
            Last updated: April 2026
          </p>

          <div className="mt-10 space-y-5 text-mist leading-relaxed text-lg">
            <p>
              These terms govern your use of terencemeghani.com. By using the site you
              agree to these terms. Project engagements are governed by separate statements
              of work (SoWs) signed at engagement kickoff — those documents take precedence
              for any project-specific terms.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Content & IP</h2>
            <p>
              All content on this site (copy, illustrations, photography, code) is © Terence
              Meghani unless otherwise attributed. You may link to pages freely. Do not
              reproduce or republish site content without permission.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Client work</h2>
            <p>
              Case studies on this site describe client engagements with the permission of
              each client. Commercially sensitive details are omitted or generalised where
              requested. Photography, copy, and design shown is either original or used
              with client permission.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Limitation of liability</h2>
            <p>
              This site is provided &quot;as is.&quot; While I take care to keep information accurate
              and up to date, I make no warranties and accept no liability for reliance on
              site content in the absence of a signed engagement.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Changes</h2>
            <p>
              I may update these terms from time to time. The &quot;last updated&quot; date above will
              reflect the most recent revision.
            </p>
          </div>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
