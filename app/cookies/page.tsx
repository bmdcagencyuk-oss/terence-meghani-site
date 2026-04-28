import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: "How terencemeghani.com handles cookies (it doesn't).",
  alternates: { canonical: '/cookies/' },
  robots: { index: false, follow: true },
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
            Last updated: 28 April 2026
          </p>

          <div className="mt-10 space-y-5 text-mist leading-relaxed text-lg">
            <p>
              This site does not set tracking cookies, advertising cookies, or any
              cookies that would require consent under UK GDPR.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              What that means in practice
            </h2>
            <p>I&rsquo;ve built this site deliberately without behavioural tracking. Specifically:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">No advertising cookies.</strong> No
                Google Ads, no Meta Pixel, no LinkedIn Insight Tag, no retargeting of
                any kind.
              </li>
              <li>
                <strong className="text-white">No third-party tracking cookies.</strong>{' '}
                No DoubleClick, no embedded YouTube/Twitter/Facebook widgets that drop
                cookies before consent.
              </li>
              <li>
                <strong className="text-white">No fingerprinting.</strong> No tracking
                that works around cookie controls by reading browser features, IP,
                screen dimensions, or other identifying signals.
              </li>
              <li>
                <strong className="text-white">No persistent identifiers.</strong> No
                cookies that follow you between visits or sessions.
              </li>
            </ul>
            <p>
              For analytics I use{' '}
              <a
                href="https://plausible.io/data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rocket underline underline-offset-4"
              >
                Plausible
              </a>
              {' '}— a privacy-friendly, cookieless service hosted in the EU. Plausible
              counts page views without identifying individual visitors. There&rsquo;s
              no consent banner because there&rsquo;s nothing to consent to.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              Strictly necessary cookies
            </h2>
            <p>
              Like almost all websites, this one may rely on a small number of
              &ldquo;strictly necessary&rdquo; cookies set by the hosting platform
              (Vercel) for security, edge routing, and load balancing. These are
              essential to deliver the site to you and don&rsquo;t track behaviour.
              Under UK GDPR they are exempt from the consent requirement.
            </p>
            <p>
              If you&rsquo;d like to know more about Vercel&rsquo;s use of cookies, see
              their{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rocket underline underline-offset-4"
              >
                privacy policy
              </a>
              .
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              Third-party services you may interact with
            </h2>
            <p>
              Some interactions take you to third-party services that may set their own
              cookies on their own domains:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a
                  href="https://calendly.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Calendly
                </a>{' '}
                — when you click through to book a call, you&rsquo;re on Calendly&rsquo;s
                site, governed by Calendly&rsquo;s cookie policy.
              </li>
              <li>
                <a
                  href="https://uk.legal.trustpilot.com/end-user-privacy-terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Trustpilot
                </a>{' '}
                and{' '}
                <a
                  href="https://www.facebook.com/policy.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Facebook
                </a>{' '}
                — when you click through from the reviews page to verify reviews on the
                source platforms.
              </li>
            </ul>
            <p>
              Cookies set on those services are governed by their respective policies.
              None are set by terencemeghani.com itself.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              Managing cookies in your browser
            </h2>
            <p>
              If you&rsquo;d like to control cookies more broadly, modern browsers
              offer comprehensive controls:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-gb/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rocket underline underline-offset-4"
                >
                  Edge
                </a>
              </li>
            </ul>

            <h2 className="font-display text-white text-2xl mt-10">
              Changes to this policy
            </h2>
            <p>
              If I ever introduce cookies that require consent, I&rsquo;ll update this
              policy and add a clear consent banner before the change takes effect.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Contact</h2>
            <p>Questions about cookies or about how this site handles your data?</p>
            <p>
              <a
                href="mailto:hello@terencemeghani.com"
                className="text-rocket underline underline-offset-4"
              >
                hello@terencemeghani.com
              </a>
            </p>
            <p className="text-fog text-base">
              See also: <Link href="/privacy/" className="text-rocket underline underline-offset-4">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
