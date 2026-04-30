import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import {
  breadcrumbSchema,
  localBusinessSchema,
  ldJsonProps,
} from '@/lib/schema';

const HERTS_TITLE = 'Hertfordshire — based here, working everywhere';
const HERTS_DESCRIPTION =
  'Engineer-grade WordPress operations, plugin development, AI workflows, and brand work — operated from Hertfordshire, delivered across the UK. Working with senior buyers in Watford, St Albans, Hemel Hempstead, and beyond.';

export const metadata: Metadata = {
  title: HERTS_TITLE,
  description: HERTS_DESCRIPTION,
  alternates: { canonical: '/hertfordshire' },
  openGraph: {
    title: 'Hertfordshire — Terence Meghani Studio',
    description:
      'Engineer-grade WordPress operations, plugin development, AI workflows, and brand work — operated from Hertfordshire, delivered across the UK.',
    url: '/hertfordshire',
  },
  twitter: {
    title: 'Hertfordshire — Terence Meghani Studio',
    description:
      'Engineer-grade WordPress operations, plugin development, AI workflows, and brand work — operated from Hertfordshire, delivered across the UK.',
  },
};

const HERTS_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Hertfordshire', href: '/hertfordshire' },
]);

const PRACTICES = [
  {
    k: 'WordPress Operations',
    href: '/services/wordpress-operations/',
    v: 'Engineer-grade retainers diagnosing server logs, database health, scheduler integrity, mail authentication, and performance. Three tiers from £1,500/month. The audit fee is fixed at £1,950, deductible against the first three months at Orbit or Apogee.',
  },
  {
    k: 'WordPress Plugin Development',
    href: '/services/wordpress-plugin-development/',
    v: 'Bespoke plugins, API integrations, AI-extended admin tooling. For teams who’ve outgrown off-the-shelf WordPress.',
  },
  {
    k: 'AI & Automation',
    href: '/services/ai-automation/',
    v: 'Custom GPTs trained on your brand voice, content operations automation, AI-powered WordPress plugins. AI that sounds like your brand, not ChatGPT.',
  },
  {
    k: 'Brand & Identity',
    href: '/services/brand-identity/',
    v: 'Strategy, positioning, naming, visual systems, voice. Twelve years of work for News UK, Royal London, NHS, TEDx, BBC, and Fireaway alongside dozens of independent brands.',
  },
];

export default function HertfordshirePage() {
  return (
    <>
      <script {...ldJsonProps(localBusinessSchema())} />
      <script {...ldJsonProps(HERTS_BREADCRUMBS)} />

      {/* ======== HERO ======== */}
      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>Hertfordshire</li>
            </ol>
          </nav>

          <div style={{ marginTop: 32 }}>
            <Kicker>Local presence · UK studio</Kicker>
          </div>

          <h1>
            Hertfordshire — <em>based here,</em> working everywhere.
          </h1>

          <p
            style={{
              marginTop: 18,
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 1.8vw, 26px)',
              lineHeight: 1.35,
              color: 'var(--color-rocket)',
              maxWidth: '46ch',
            }}
          >
            Studio of one — brand, code, growth — operated from Hertfordshire,
            delivered across the UK and beyond.
          </p>

          <hr className="hero-rule" aria-hidden="true" />

          <div
            style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}
          >
            <Button
              href="https://calendly.com/terencemeghani"
              external
              variant="primary"
            >
              Book a 30-minute audit
            </Button>
            <Button href="/work/" variant="secondary">
              See the work
            </Button>
          </div>
        </div>
      </section>

      {/* ======== A SHORT NOTE ON GEOGRAPHY ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>The honest answer</Kicker>
              <h2>
                A short note on <em>geography.</em>
              </h2>
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
              <p>
                Most of my clients aren’t in Hertfordshire. Most of them aren’t even
                in the UK. The studio’s portfolio runs from News UK and Royal London
                in central London, to the Al Jannah Villa rebuild in Marrakech, to a
                fintech launch in Manchester, to a tuition club five minutes from the
                studio in Ilford. Geography turns out to mean less than it used to.
              </p>
              <p>
                But it isn’t nothing. Senior buyers in Hertfordshire still occasionally
                want to know whether the person they’re hiring is genuinely local, or
                whether <em>“Hertfordshire &amp; London”</em> is just two postcodes on
                a website. So this page is the honest answer.
              </p>
              <p>
                The studio is operated from Hertfordshire — specifically, from Watford.
                I’ve lived and worked here long enough to know which trains run on time,
                which coffee shops have decent wifi, and which client meetings need an
                Uber to St Albans rather than a Zoom from a desk. The work happens here.
                The clients are mostly elsewhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== WHO I WORK WITH LOCALLY ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>Local clients</Kicker>
              <h2>
                Who I work <em>with locally.</em>
              </h2>
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
              <p>
                Hertfordshire-based clients have included independent businesses,
                professional services firms, and a handful of brand and operations
                engagements that started over coffee in St Albans or Watford. Most stay
                private — the kind of relationships that thrive on direct work rather
                than promotional case studies. A few are visible in the{' '}
                <Link
                  href="/work/"
                  style={{ color: 'var(--color-rocket)', textDecoration: 'none', borderBottom: '1px solid currentColor' }}
                >
                  main work portfolio
                </Link>
                .
              </p>
              <p>
                What’s true across all of them: the work is the same as the work I do
                for News UK or Royal London. Same diagnostic depth, same engineering
                rigour, same honest reporting. Hertfordshire clients don’t get a
                stripped-down version of the offer because the postcode is closer.
              </p>
              <p>
                Some of that work has spun out into productised tooling — including a{' '}
                <Link
                  href="/plugins/#self-storage"
                  style={{ color: 'var(--color-rocket)', textDecoration: 'none', borderBottom: '1px solid currentColor' }}
                >
                  self-storage suite
                </Link>{' '}
                of WordPress plugins built around quoting, booking, and Stora
                integration, used by operators across the UK.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== HOW WORKING LOCALLY ACTUALLY WORKS ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>How it works</Kicker>
              <h2>
                How working locally <em>actually works.</em>
              </h2>
              <p>
                For Hertfordshire-based clients, three things change versus the
                standard remote-first engagement.
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
              <p>
                <strong>In-person kickoffs are easy.</strong> I’ll come to your office
                in Watford, St Albans, Hemel Hempstead, Hatfield, or anywhere
                reasonable across the county. Discovery calls still default to thirty
                minutes over Zoom — that scales better and respects everyone’s time —
                but the moment a project starts, in-person becomes an option rather
                than an exception.
              </p>
              <p>
                <strong>The studio is twenty minutes from London.</strong> Watford
                Junction to Euston is fifteen minutes on the fast train; Marylebone to
                Euston is twelve minutes on foot. For clients with offices in central
                London, the meeting commute is shorter than most cross-London journeys.
                This matters for board-level work where in-person attendance is
                non-negotiable.
              </p>
              <p>
                <strong>Quarterly reviews can happen in person.</strong> WordPress
                Operations Apogee clients receive a quarterly review document; if
                you’re Hertfordshire-based and want that review delivered face-to-face
                rather than as a PDF and a Loom, that’s a standing offer. Most clients
                don’t take it up. The few who do find it useful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== CONTACT INFO (machine-readable local signals) ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char-3, var(--color-char-2))' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>Contact</Kicker>
              <h2>
                Studio <em>contact details.</em>
              </h2>
            </div>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(140px, 180px) 1fr',
                rowGap: 18,
                columnGap: 24,
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--color-mist)',
                maxWidth: '68ch',
                borderTop: '1px solid var(--color-hairline)',
                paddingTop: 28,
              }}
            >
              <dt
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                Studio location
              </dt>
              <dd style={{ margin: 0, color: '#fff' }}>
                Watford, Hertfordshire (service area, by appointment)
              </dd>

              <dt
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                Phone
              </dt>
              <dd style={{ margin: 0, color: '#fff' }}>
                <a
                  href="tel:+442045245111"
                  style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid var(--color-hairline)' }}
                >
                  020 4524 5111
                </a>
              </dd>

              <dt
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                Email
              </dt>
              <dd style={{ margin: 0, color: '#fff' }}>
                <a
                  href="mailto:hello@terencemeghani.com"
                  style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid var(--color-hairline)' }}
                >
                  hello@terencemeghani.com
                </a>
              </dd>

              <dt
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                Hours
              </dt>
              <dd style={{ margin: 0, color: '#fff' }}>
                Monday–Friday, 09:00–18:00 UK
              </dd>

              <dt
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                Service area
              </dt>
              <dd style={{ margin: 0, color: '#fff' }}>
                Hertfordshire, Greater London, UK-wide remote
              </dd>
            </dl>
          </div>
        </div>
      </section>

      {/* ======== FOUR PRACTICES ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow">
                <Kicker>What I do</Kicker>
              </span>
              <h2>
                The four practices, <em>locally and otherwise.</em>
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

          <p
            style={{
              marginTop: 12,
              maxWidth: '68ch',
              color: 'var(--color-mist)',
              fontSize: 17,
              lineHeight: 1.6,
            }}
          >
            The studio runs four core practices.
          </p>

          <dl
            style={{
              marginTop: 36,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 28,
              borderTop: '1px solid var(--color-hairline)',
              paddingTop: 36,
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
                    }}
                  >
                    {p.k}{' '}
                    <span style={{ color: 'var(--color-rocket)' }}>→</span>
                  </Link>
                </dt>
                <dd
                  style={{
                    marginTop: 10,
                    color: 'var(--color-mist)',
                    fontSize: 15.5,
                    lineHeight: 1.55,
                  }}
                >
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>

          <p
            style={{
              marginTop: 32,
              color: 'var(--color-fog)',
              fontSize: 14,
              fontStyle: 'italic',
              fontFamily: 'var(--font-italic)',
            }}
          >
            For clients wanting all four under a single monthly engagement,{' '}
            <Link
              href="/engage/growth-partnership/"
              style={{
                color: 'var(--color-rocket)',
                fontStyle: 'normal',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Growth Partnership
            </Link>{' '}
            bundles them.
          </p>
        </div>
      </section>

      {/* ======== WHAT THIS PAGE IS AND ISN'T ======== */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>Discipline</Kicker>
              <h2>
                What this page <em>is and isn’t.</em>
              </h2>
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
              <p>
                This page exists because Hertfordshire is genuinely the studio’s base,
                and saying so once — properly, with substance — is more useful than
                saying so vaguely on every page. It isn’t a thin SEO landing page
                targeting every town in the county. The studio doesn’t have a separate
                page for Watford, St Albans, Hemel Hempstead, Hatfield, Welwyn, or
                Stevenage, because there isn’t enough genuinely different to say about
                each one. The work is the work, regardless of postcode.
              </p>
              <p>
                If you’re searching for a WordPress agency, a brand consultant, a
                plugin developer, or a fractional engineering partner — and
                Hertfordshire happens to be the relevant geography — this page tells
                you the studio is here, the work is real, and the next step is a
                conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LaunchCTA
        title="The next step"
        body="Thirty-minute discovery call. No slides, no fluff — leave with a concrete next step whether we work together or not."
      />
    </>
  );
}
