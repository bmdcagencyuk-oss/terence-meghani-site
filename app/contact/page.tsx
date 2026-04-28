import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { ContactForm } from '@/components/sections/ContactForm';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';

const CONTACT_TITLE = 'Contact';
const CONTACT_DESCRIPTION =
  'Drop a brief, book a thirty-minute call, or send a question. Direct, first-person reply within 48 hours — no account managers, no handoff chain.';

export const metadata: Metadata = {
  title: CONTACT_TITLE,
  description: CONTACT_DESCRIPTION,
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: `${CONTACT_TITLE} — Terence Meghani`,
    description: CONTACT_DESCRIPTION,
    url: '/contact/',
  },
  twitter: {
    title: `${CONTACT_TITLE} — Terence Meghani`,
    description: CONTACT_DESCRIPTION,
  },
};

const CONTACT_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact/' },
]);

const CONTACT_ROWS: Array<{ k: string; v: string; href?: string }> = [
  { k: 'Email',    v: 'hello@terencemeghani.com', href: 'mailto:hello@terencemeghani.com' },
  { k: 'Office',   v: '020 4524 5111',            href: 'tel:+442045245111' },
  { k: 'Mobile',   v: '07756 267 157',            href: 'tel:+447756267157' },
  { k: 'Studio',   v: 'Hertfordshire & London · UK', href: '/hertfordshire' },
  { k: 'Schedule', v: 'Book 30 min on Calendly ↗', href: 'https://calendly.com/terencemeghani' },
  { k: 'Reply',    v: 'Under 4 hours, typically' },
];

export default function ContactPage() {
  return (
    <>
      <script {...ldJsonProps(CONTACT_BREADCRUMBS)} />
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gap: 'clamp(32px, 5vw, 72px)',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            }}
          >
            <div>
              <div className="kicker-row">
                <Kicker>Contact · Under 4h reply</Kicker>
              </div>
              <h1>
                Ready to <em>build?</em>
              </h1>
              <hr className="hero-rule" aria-hidden="true" />
              <p className="lead">
                Drop a brief below — or book a thirty-minute discovery call. I read every
                enquiry personally and reply within four hours during UK business hours.
              </p>

              <dl
                style={{
                  marginTop: 40,
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  rowGap: 16,
                  columnGap: 24,
                  paddingTop: 28,
                  borderTop: '1px solid var(--color-hairline-2)',
                }}
              >
                {CONTACT_ROWS.map((row) => (
                  <div key={row.k} style={{ display: 'contents' }}>
                    <dt
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10.5,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-fog)',
                        alignSelf: 'center',
                      }}
                    >
                      {row.k}
                    </dt>
                    <dd style={{ color: '#fff', fontSize: 15, alignSelf: 'center' }}>
                      {row.href ? (
                        <a
                          href={row.href}
                          target={row.href.startsWith('http') ? '_blank' : undefined}
                          rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid var(--color-hairline-2)' }}
                        >
                          {row.v}
                        </a>
                      ) : (
                        row.v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              style={{
                background: 'var(--color-char-2)',
                border: '1px solid var(--color-hairline-2)',
                padding: 'clamp(24px, 4vw, 40px)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontVariationSettings: '"wdth" 100, "opsz" 72',
                  fontWeight: 500,
                  fontSize: 24,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                Tell me about the project.
              </h2>
              <p style={{ marginTop: 10, color: 'var(--color-mist)', fontSize: 14.5, lineHeight: 1.55 }}>
                Rough timeline and budget help me scope the reply usefully.
              </p>
              <div style={{ marginTop: 24 }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LaunchCTA title="Prefer a quick call?" />
    </>
  );
}
