import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { ContactForm } from '@/components/sections/ContactForm';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Contact — Terence Meghani',
  description:
    "Got a brief? Drop the details below — or book a 30-minute call. I read every enquiry personally and reply within 48 hours.",
};

const CONTACT_ROWS: Array<{ k: string; v: string; href?: string }> = [
  { k: 'Email',    v: 'hello@terencemeghani.com', href: 'mailto:hello@terencemeghani.com' },
  { k: 'Phone',    v: '+44 (0)7756 267 157',      href: 'tel:+447756267157' },
  { k: 'Studio',   v: 'Hertfordshire & London · UK' },
  { k: 'Schedule', v: 'Book 30 min on Calendly ↗', href: 'https://calendly.com/terencemeghani' },
  { k: 'Reply',    v: 'Under 4 hours, typically' },
];

export default function ContactPage() {
  return (
    <>
      <section
        style={{
          paddingTop: 'clamp(96px, 12vw, 160px)',
          paddingBottom: 'clamp(64px, 9vw, 120px)',
          background: 'var(--color-char)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '120%',
            background:
              'radial-gradient(circle, var(--color-rocket) 0%, transparent 55%)',
            filter: 'blur(120px)',
            opacity: 0.18,
            pointerEvents: 'none',
          }}
        />
        <div className="wrap" style={{ position: 'relative' }}>
          <div
            style={{
              display: 'grid',
              gap: 'clamp(32px, 5vw, 72px)',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            }}
          >
            <div>
              <Kicker>Contact</Kicker>
              <h1
                style={{
                  marginTop: 18,
                  fontFamily: 'var(--font-display)',
                  fontVariationSettings: '"wdth" 100, "opsz" 96',
                  fontWeight: 500,
                  fontSize: 'var(--text-display-lg)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: '#fff',
                }}
              >
                Ready to{' '}
                <em
                  style={{
                    fontFamily: 'var(--font-italic)',
                    fontStyle: 'italic',
                    color: 'var(--color-rocket)',
                    fontWeight: 400,
                  }}
                >
                  build?
                </em>
              </h1>
              <p
                style={{
                  marginTop: 20,
                  maxWidth: '48ch',
                  color: 'var(--color-mist)',
                  fontSize: 17,
                  lineHeight: 1.6,
                }}
              >
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

      <LaunchCTA headline="brief" />
    </>
  );
}
