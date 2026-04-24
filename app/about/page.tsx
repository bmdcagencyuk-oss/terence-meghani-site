/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'About — Terence Meghani',
  description:
    'Brand consultant & developer, Hertfordshire & London. Founded Krazy Media at 16, now trading under his own name. Over a decade of work with Royal London, News UK, NHS, TEDx, BBC, and Fireaway.',
};

const STATS = [
  { n: '13+',  label: 'Years in business' },
  { n: '100+', label: 'Brands served' },
  { n: '4.9★', label: 'Average on Trustpilot' },
  { n: '6',    label: 'Clients of 10+ years' },
];

const PRACTICES = [
  {
    k: 'Brand & Identity',
    v: 'Strategy, naming, visual systems, and voice for businesses that want to be remembered.',
  },
  {
    k: 'AI & Automation',
    v: 'Custom GPTs trained on your brand voice, content operations automation, and AI-powered WordPress plugins. AI that sounds like you, not like every other AI.',
  },
  {
    k: 'WordPress Plugin Development',
    v: 'Bespoke plugins, API integrations, Gutenberg blocks, WooCommerce extensions. For teams who’ve outgrown off-the-shelf.',
  },
  {
    k: 'Web Development',
    v: 'Modern stacks, performance-first. Next.js and headless WordPress when needed. Built to last.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section
        style={{
          paddingTop: 'clamp(96px, 12vw, 160px)',
          paddingBottom: 'clamp(48px, 7vw, 96px)',
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
              'radial-gradient(circle, var(--color-violet) 0%, transparent 55%)',
            filter: 'blur(100px)',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        />
        <div className="wrap" style={{ position: 'relative' }}>
          <div
            style={{
              display: 'grid',
              gap: 'clamp(32px, 5vw, 72px)',
              alignItems: 'center',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
            }}
            className="about-hero-grid"
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                border: '1px solid var(--color-hairline)',
                background: 'var(--color-char-3)',
                overflow: 'hidden',
              }}
            >
              <img
                src="https://terencemeghani.com/wp-content/uploads/2026/01/grok-image-1d260190-3cb6-4438-9038-a92ceca011e8.png"
                alt="Terence Meghani — brand consultant, Hertfordshire & London"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(0.95) contrast(1.05)',
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  padding: '8px 14px',
                  background: 'var(--color-rocket)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Hertfordshire
              </span>
            </div>

            <div>
              <Kicker>About Terence</Kicker>
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
                Hi, I&rsquo;m{' '}
                <em
                  style={{
                    fontFamily: 'var(--font-italic)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--color-rocket)',
                  }}
                >
                  Terence.
                </em>
              </h1>
              <p
                style={{
                  marginTop: 16,
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px, 2vw, 28px)',
                  color: 'var(--color-mist)',
                  lineHeight: 1.25,
                  maxWidth: '24ch',
                }}
              >
                Brand consultant and developer, based between Hertfordshire and London.
              </p>
              <div
                style={{
                  marginTop: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  color: 'var(--color-mist)',
                  fontSize: 17,
                  lineHeight: 1.65,
                  maxWidth: '58ch',
                }}
              >
                <p>
                  I launched my first venture at sixteen. Founded Krazy Media from my
                  bedroom, rebranded it to We Krazy, then BMDC — and after more than a
                  decade, brought it all under my own name. Along the way I&rsquo;ve been
                  lucky enough to work with Royal London, News UK, the NHS, TEDx, the BBC,
                  and Fireaway — and built brands for dozens of independent businesses
                  across the UK, Morocco, and beyond.
                </p>
                <p>I&rsquo;m a proud dad of two. That keeps the work honest.</p>
              </div>
              <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button href="https://calendly.com/terencemeghani" external variant="primary">
                  Book a call
                </Button>
                <Button href="/contact/" variant="secondary">
                  Send a brief
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <Kicker>What I do</Kicker>
          <h2
            style={{
              marginTop: 14,
              fontFamily: 'var(--font-display)',
              fontVariationSettings: '"wdth" 100, "opsz" 96',
              fontWeight: 500,
              fontSize: 'var(--text-display-md)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#fff',
              maxWidth: '14ch',
            }}
          >
            Four practices. <em style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', color: 'var(--color-rocket)', fontWeight: 400 }}>One studio.</em>
          </h2>
          <p
            style={{
              marginTop: 20,
              maxWidth: '56ch',
              color: 'var(--color-mist)',
              fontSize: 17,
              lineHeight: 1.6,
            }}
          >
            Plus PPC &amp; Paid Media, SEO &amp; Organic Growth, and an ongoing{' '}
            <Link
              href="/engage/growth-partnership/"
              style={{ color: 'var(--color-rocket)', textDecoration: 'underline', textDecorationColor: 'rgba(255,77,23,0.4)' }}
            >
              Growth Partnership
            </Link>{' '}
            retainer for businesses that want the full stack.
          </p>

          <dl
            style={{
              marginTop: 48,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              borderTop: '1px solid var(--color-hairline)',
              paddingTop: 32,
            }}
          >
            {PRACTICES.map((p) => (
              <div key={p.k}>
                <dt
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontVariationSettings: '"wdth" 100, "opsz" 72',
                    fontWeight: 500,
                    fontSize: 22,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {p.k}
                </dt>
                <dd style={{ marginTop: 8, color: 'var(--color-mist)', fontSize: 15.5, lineHeight: 1.55 }}>
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <Kicker>How I work</Kicker>
          <h2
            style={{
              marginTop: 14,
              fontFamily: 'var(--font-display)',
              fontVariationSettings: '"wdth" 100, "opsz" 96',
              fontWeight: 500,
              fontSize: 'var(--text-display-md)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#fff',
              maxWidth: '16ch',
            }}
          >
            Direct. <em style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', color: 'var(--color-rocket)', fontWeight: 400 }}>Senior.</em> No handoffs.
          </h2>
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              maxWidth: '62ch',
              color: 'var(--color-mist)',
              fontSize: 17,
              lineHeight: 1.65,
            }}
          >
            <p>
              First-person. I don&rsquo;t subcontract the thinking. Every strategy session,
              creative direction call, and key decision involves me directly. I collaborate
              with trusted specialists when scope demands — but the throughline stays
              consistent.
            </p>
            <p>
              Projects start with a paid discovery. Fixed-scope projects are transparently
              quoted, with milestones. Retained work is month-to-month with no minimum term.
            </p>
            <p>You own the work. Source files and code transfer on final invoice. No lock-in.</p>
          </div>

          <div
            style={{
              marginTop: 56,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 24,
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} style={{ borderLeft: '2px solid var(--color-rocket)', paddingLeft: 20 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-italic)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--color-rocket)',
                    fontSize: 'clamp(40px, 5vw, 64px)',
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-mist)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LaunchCTA headline="brand" />
    </>
  );
}
