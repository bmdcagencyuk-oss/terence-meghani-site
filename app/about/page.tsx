/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'About — Terence Meghani',
  description:
    "Creative designer and brand consultant based between Hertfordshire and London. Founded Krazy Media at sixteen, now trading under his own name — over a decade of work with News UK, Royal London, the NHS, TEDx, BBC and Fireaway.",
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About — Terence Meghani',
    description:
      "Creative designer and brand consultant, Hertfordshire & London. 13+ years building brands for independent businesses and global names.",
    images: [
      {
        url: 'https://terencemeghani.com/wp-content/uploads/2025/01/IMG_4739.jpg',
        alt: 'Portrait of Terence Meghani',
      },
    ],
  },
};

const STATS = [
  { n: '13+',  label: 'Years in business' },
  { n: '100+', label: 'Brands shipped' },
  { n: '4.9★', label: 'Trustpilot average' },
  { n: '6',    label: '10+ year clients' },
];

const PILLARS = [
  {
    n: '01',
    k: 'Purpose',
    v: 'Over the last decade I\'ve had the privilege of rebranding established businesses and watching them change shape afterwards. A handful of those clients have been with the studio since I first opened the door. My focus is on helping new and existing businesses grow — and staying invested long enough to see that growth compound.',
  },
  {
    n: '02',
    k: 'Impact',
    v: 'The work started in a bedroom with a copy of Photoshop and no business plan. Every trading name since — Krazy Media, We Krazy, BMDC, and now Terence Meghani — has been the same person doing the same work, just with more clients and more scar tissue. That origin is still the bit I reach for when a brief feels impossible.',
  },
  {
    n: '03',
    k: 'Clients',
    v: 'News UK, Royal London, the NHS, TEDx, the BBC, Fireaway. And dozens of independent businesses across the UK, Morocco, and beyond. The same close, first-person approach to each — whatever the masthead on the brief. Travel over the years has shaped how I think about brand: the best work reads the same way in any room, in any language.',
  },
  {
    n: '04',
    k: 'Why me',
    v: 'You work with the person doing the work. No account managers, no handoff chain. Small, thoughtful changes compound into brands that hold up over years — and when they don\'t, we fix them together. That\'s the trade: trust, craft, and the kind of client relationships that outlast a single engagement.',
  },
];

const PRACTICES = [
  {
    k: 'Brand & Identity',
    v: 'Strategy, naming, visual systems, and voice for businesses that want to be remembered.',
    href: '/services/brand-identity/',
  },
  {
    k: 'AI & Automation',
    v: 'Custom GPTs trained on your brand voice, content operations automation, AI-powered WordPress plugins. AI that sounds like you, not like every other AI.',
    href: '/services/ai-automation/',
  },
  {
    k: 'WordPress Plugin Development',
    v: 'Bespoke plugins, API integrations, Gutenberg blocks, WooCommerce extensions. For teams who\'ve outgrown off-the-shelf.',
    href: '/services/wordpress-plugin-development/',
  },
  {
    k: 'Web Development',
    v: 'Modern stacks, performance-first. Next.js and headless WordPress when needed. Built to last.',
    href: '/services/web-development/',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ======== HERO ======== */}
      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>About</li>
            </ol>
          </nav>

          <div
            className="about-hero-grid"
            style={{
              marginTop: 32,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 4fr)',
              gap: 'clamp(32px, 5vw, 80px)',
              alignItems: 'center',
            }}
          >
            <div>
              <Kicker>About Terence</Kicker>
              <h1>
                Hi, I&rsquo;m <em>Terence.</em>
              </h1>
              <p
                style={{
                  marginTop: 18,
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px, 2vw, 30px)',
                  lineHeight: 1.25,
                  color: 'var(--color-rocket)',
                  maxWidth: '28ch',
                }}
              >
                Creative designer, brand consultant, proud dad of two.
              </p>
              <p className="lead">
                Based between <strong>Hertfordshire and London</strong> — helping businesses
                build impactful brands worldwide since launching my first venture at sixteen.
                Over a decade of close, first-person work for News UK, Royal London, the NHS,
                TEDx, BBC and Fireaway alongside dozens of independent businesses.
              </p>
              <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button href="https://calendly.com/terencemeghani" external variant="primary">
                  Book a call
                </Button>
                <Button href="/contact/" variant="secondary">
                  Send a brief
                </Button>
              </div>
            </div>

            <figure
              style={{
                position: 'relative',
                margin: 0,
                aspectRatio: '4 / 5',
                border: '1px solid var(--color-hairline)',
                background: 'var(--color-char-3)',
                overflow: 'hidden',
                boxShadow: '0 50px 100px -40px rgba(0,0,0,0.6)',
              }}
            >
              <img
                src="https://terencemeghani.com/wp-content/uploads/2025/01/IMG_4739.jpg"
                alt="Portrait of Terence Meghani"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
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
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  boxShadow: '0 8px 18px -6px rgba(0,0,0,0.5)',
                }}
              >
                Hertfordshire &middot; London
              </span>
            </figure>
          </div>
        </div>
      </section>

      {/* ======== TURNING IDEAS INTO BRANDS ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>The story</Kicker>
              <h2>
                Turning ideas <em>into brands.</em>
              </h2>
              <p>
                From a Photoshop install in a bedroom to a studio with a decade of work
                behind it — the names have changed, the approach hasn&rsquo;t.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                fontSize: 18,
                lineHeight: 1.65,
                color: 'var(--color-mist)',
                maxWidth: '68ch',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px, 2vw, 28px)',
                  lineHeight: 1.25,
                  color: '#fff',
                  borderLeft: '2px solid var(--color-rocket)',
                  paddingLeft: 20,
                }}
              >
                A dream transformed into reality as my journey took unexpected twists and
                turns. From the humble beginnings of my bedroom, <em style={{ color: 'var(--color-rocket)' }}>Krazy Media</em> was born.
              </p>
              <p>
                <strong style={{ color: '#fff', fontWeight: 500 }}>I launched my first venture at sixteen.</strong>{' '}
                Founded Krazy Media from my bedroom in Watford, rebranded it to We Krazy,
                then BMDC — and after more than a decade, brought it all under my own name.
                Every trading name was the same person doing the same work, just with more
                clients and more scar tissue.
              </p>
              <p>
                Along the way I&rsquo;ve been lucky enough to work with Royal London, News
                UK, the NHS, TEDx, the BBC, and Fireaway — and built brands for dozens of
                independent businesses across the UK, Morocco, and beyond. A handful of
                those clients have been with the studio since the beginning. Most
                engagements still start the way the first ones did: a thirty-minute call
                and a clear next step.
              </p>
              <p>
                I&rsquo;m a proud dad of two. That keeps the work honest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== STATS RAIL ======== */}
      <section
        style={{
          padding: 'clamp(48px, 7vw, 96px) 0',
          background: 'var(--color-char)',
          borderTop: '1px solid var(--color-hairline-2)',
          borderBottom: '1px solid var(--color-hairline-2)',
        }}
      >
        <div
          className="wrap"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{ borderLeft: '2px solid var(--color-rocket)', paddingLeft: 20 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-rocket)',
                  fontSize: 'clamp(40px, 5vw, 72px)',
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
      </section>

      {/* ======== FOUR PILLARS ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>How I work</Kicker></span>
              <h2>
                Four principles. <em>One studio.</em>
              </h2>
            </div>
            <span className="sec-aside">04 · principles</span>
          </div>
          <div className="feature-grid">
            {PILLARS.map((p) => (
              <article key={p.k} className="feature-card">
                <span className="num">{p.n}</span>
                <span className="title">{p.k}</span>
                <span className="desc">{p.v}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======== PRACTICES ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>What I do</Kicker></span>
              <h2>
                Four practices. <em>Under one roof.</em>
              </h2>
            </div>
            <Link
              href="/#services"
              className="sec-aside"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--color-rocket)',
              }}
            >
              All services →
            </Link>
          </div>
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 28,
              borderTop: '1px solid var(--color-hairline)',
              paddingTop: 36,
              margin: 0,
            }}
          >
            {PRACTICES.map((p) => (
              <div key={p.k}>
                <dt>
                  <Link
                    href={p.href}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontVariationSettings: '"wdth" 100, "opsz" 72',
                      fontWeight: 500,
                      fontSize: 22,
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      textDecoration: 'none',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.2s ease, color 0.2s ease',
                    }}
                    onMouseEnter={undefined}
                  >
                    {p.k} <span style={{ color: 'var(--color-rocket)' }}>→</span>
                  </Link>
                </dt>
                <dd style={{ marginTop: 10, color: 'var(--color-mist)', fontSize: 15.5, lineHeight: 1.55 }}>
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>
          <p style={{ marginTop: 36, color: 'var(--color-fog)', fontSize: 14, fontStyle: 'italic', fontFamily: 'var(--font-italic)' }}>
            Plus PPC &amp; Paid Media, SEO &amp; Organic Growth, and an ongoing{' '}
            <Link
              href="/engage/growth-partnership/"
              style={{ color: 'var(--color-rocket)', fontStyle: 'normal', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              Growth Partnership
            </Link>{' '}
            retainer for businesses that want the full stack.
          </p>
        </div>
      </section>

      <LaunchCTA headline="brand" />
    </>
  );
}
