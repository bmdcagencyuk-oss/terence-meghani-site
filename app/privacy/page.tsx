import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Terence Meghani Studio handles your personal data.',
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
          <div className="mt-10 space-y-5 text-mist leading-relaxed text-lg">
            <p>
              This Privacy Policy explains how I handle personal data when you visit
              terencemeghani.com, contact me, or engage me as a client.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Who I am</h2>
            <p>
              This site is operated by{' '}
              <strong className="text-white">Branding Marketing UK Ltd</strong> (company
              number 13859038), trading as <strong className="text-white">Terence Meghani</strong>{' '}
              (&ldquo;the studio,&rdquo; &ldquo;I,&rdquo; &ldquo;me,&rdquo; &ldquo;my&rdquo;).
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Registered office: Hertfordshire, United Kingdom</li>
              <li>
                Contact:{' '}
                <a
                  href="mailto:hello@terencemeghani.com"
                  className="text-rocket underline underline-offset-4"
                >
                  hello@terencemeghani.com
                </a>
              </li>
              <li>
                I am the data controller for the personal data described in this policy
                under the UK GDPR.
              </li>
            </ul>

            <h2 className="font-display text-white text-2xl mt-10">
              What personal data I collect
            </h2>
            <p>I collect personal data in three situations:</p>
            <p>
              <strong className="text-white">When you contact me</strong> — via the
              contact form, email, phone, or by booking a discovery call. This includes
              your name, email address, phone number (if provided), company name (if
              provided), and the content of your message.
            </p>
            <p>
              <strong className="text-white">When you become a client</strong> —
              additional information needed to deliver the engagement and meet
              legal/tax obligations: billing address, VAT number (if applicable), bank
              details for invoicing, and any project-specific information you choose to
              share.
            </p>
            <p>
              <strong className="text-white">When you visit this website</strong> —
              limited technical data through privacy-friendly analytics. I use{' '}
              <a
                href="https://plausible.io/data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rocket underline underline-offset-4"
              >
                Plausible Analytics
              </a>
              , which is GDPR-compliant by design and does not use cookies,
              fingerprinting, or persistent identifiers. Plausible aggregates page-view
              data anonymously; no individual visitor is identifiable.
            </p>
            <p>
              I do <strong className="text-white">not</strong> use behavioural
              advertising trackers, retargeting pixels, or third-party cookies.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              Why I collect it (lawful basis)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-base border-collapse">
                <thead>
                  <tr className="text-white border-b border-hairline-2">
                    <th className="py-3 pr-4 text-left font-display font-medium">Purpose</th>
                    <th className="py-3 pl-4 text-left font-display font-medium">Lawful basis under UK GDPR</th>
                  </tr>
                </thead>
                <tbody className="text-mist">
                  <tr className="border-b border-hairline-2">
                    <td className="py-3 pr-4">Responding to your enquiry</td>
                    <td className="py-3 pl-4">Legitimate interest</td>
                  </tr>
                  <tr className="border-b border-hairline-2">
                    <td className="py-3 pr-4">Delivering services to you as a client</td>
                    <td className="py-3 pl-4">Contract</td>
                  </tr>
                  <tr className="border-b border-hairline-2">
                    <td className="py-3 pr-4">Issuing invoices and meeting tax obligations</td>
                    <td className="py-3 pl-4">Legal obligation</td>
                  </tr>
                  <tr className="border-b border-hairline-2">
                    <td className="py-3 pr-4">Understanding how the site is used (anonymous analytics)</td>
                    <td className="py-3 pl-4">Legitimate interest</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Sending occasional newsletters (only if you opt in)</td>
                    <td className="py-3 pl-4">Consent</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-display text-white text-2xl mt-10">
              Who I share your data with
            </h2>
            <p>
              I work with a small number of trusted service providers (&ldquo;data
              processors&rdquo;) who help me run the studio. Each is bound by their own
              privacy obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Vercel
                </a>{' '}
                — hosts this website
              </li>
              <li>
                <a
                  href="https://cloudinary.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Cloudinary
                </a>{' '}
                — serves images on this website
              </li>
              <li>
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Resend
                </a>{' '}
                — sends transactional emails
              </li>
              <li>
                <a
                  href="https://plausible.io/data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Plausible Analytics
                </a>{' '}
                — measures site usage (anonymous, EU-hosted)
              </li>
              <li>
                <a
                  href="https://calendly.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Calendly
                </a>{' '}
                — bookings page (only if you click through to book a call)
              </li>
              <li>
                HM Revenue &amp; Customs and my accountants — for statutory tax and
                accounting purposes
              </li>
            </ul>
            <p>
              I do not sell, rent, or trade your personal data with any third party.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              How long I keep your data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Enquiries that don&rsquo;t become engagements</strong>{' '}
                — deleted within 12 months.
              </li>
              <li>
                <strong className="text-white">Active client records</strong> — kept for
                the duration of the engagement and for 7 years after the final invoice
                (HMRC retention requirement).
              </li>
              <li>
                <strong className="text-white">Anonymous analytics</strong> — Plausible
                retains aggregate data; no individual data is held.
              </li>
              <li>
                <strong className="text-white">Newsletter list</strong> (if you opt in) —
                retained until you unsubscribe.
              </li>
            </ul>

            <h2 className="font-display text-white text-2xl mt-10">
              International data transfers
            </h2>
            <p>
              Some of my service providers are based outside the UK or EEA. Where this
              happens, the transfer is covered by appropriate safeguards (UK
              International Data Transfer Agreement, EU Standard Contractual Clauses,
              or an adequacy decision).
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Your rights</h2>
            <p>Under UK GDPR you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Access</strong> — request a copy of the
                personal data I hold about you
              </li>
              <li>
                <strong className="text-white">Rectify</strong> — ask me to correct
                inaccurate data
              </li>
              <li>
                <strong className="text-white">Erase</strong> — ask me to delete your
                data (subject to legal retention obligations)
              </li>
              <li>
                <strong className="text-white">Restrict</strong> — limit how I use your
                data
              </li>
              <li>
                <strong className="text-white">Object</strong> — object to processing
                based on legitimate interest
              </li>
              <li>
                <strong className="text-white">Portability</strong> — receive your data
                in a portable format
              </li>
              <li>
                <strong className="text-white">Withdraw consent</strong> — for any
                processing based on consent
              </li>
              <li>
                <strong className="text-white">Complain to the ICO</strong> — if you
                believe your rights have been infringed:{' '}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  ico.org.uk
                </a>{' '}
                or 0303 123 1113
              </li>
            </ul>
            <p>
              To exercise any of these rights, email me at{' '}
              <a
                href="mailto:hello@terencemeghani.com"
                className="text-rocket underline underline-offset-4"
              >
                hello@terencemeghani.com
              </a>
              . I&rsquo;ll respond within one calendar month.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Security</h2>
            <p>
              I take reasonable technical and organisational steps to protect your
              personal data — including encrypted connections (HTTPS), authenticated
              email, password managers, two-factor authentication on critical accounts,
              and minimum-access principles for service providers. No system is
              perfectly secure, and I cannot guarantee absolute security — but I take
              this seriously and treat client data with the same care I&rsquo;d want
              for my own.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Cookies</h2>
            <p>
              This website does not set tracking cookies. See the{' '}
              <Link href="/cookies/" className="text-rocket underline underline-offset-4">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              Changes to this policy
            </h2>
            <p>
              I&rsquo;ll update this policy if my practices change. The &ldquo;Last
              updated&rdquo; date at the top reflects the most recent change. Material
              changes will be flagged on the homepage for at least 30 days.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Contact</h2>
            <p>Questions about this policy or about your data?</p>
            <p>
              <a
                href="mailto:hello@terencemeghani.com"
                className="text-rocket underline underline-offset-4"
              >
                hello@terencemeghani.com
              </a>
            </p>
          </div>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
