import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllTestimonials } from '@/lib/case-studies';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';

const REVIEWS_TITLE = 'Reviews';
const REVIEWS_DESCRIPTION =
  'Client reviews from twelve years of brand and engineering work — Google, Clutch, LinkedIn. Direct, first-person work for studios, scaleups and senior teams.';

export const metadata: Metadata = {
  title: REVIEWS_TITLE,
  description: REVIEWS_DESCRIPTION,
  alternates: { canonical: '/reviews/' },
  openGraph: {
    title: `${REVIEWS_TITLE} — Terence Meghani`,
    description: REVIEWS_DESCRIPTION,
    url: '/reviews/',
  },
  twitter: {
    title: `${REVIEWS_TITLE} — Terence Meghani`,
    description: REVIEWS_DESCRIPTION,
  },
};

const REVIEWS_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Reviews', href: '/reviews/' },
]);

export default function ReviewsPage() {
  const testimonials = getAllTestimonials();
  const sorted = [...testimonials].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <script {...ldJsonProps(REVIEWS_BREADCRUMBS)} />
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gap: 'clamp(24px, 4vw, 64px)',
              gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
              alignItems: 'end',
            }}
            className="reviews-hero-grid"
          >
            <div>
              <div className="kicker-row">
                <Kicker>Reviews · Trustpilot verified</Kicker>
              </div>
              <h1>
                4.9 / 5. <em>37 reviews.</em>
              </h1>
              <hr className="hero-rule" aria-hidden="true" />
              <p className="lead">
                Showing the most recent {sorted.length} of 37 verified reviews. All were
                originally posted to Trustpilot for BMDC (the studio&rsquo;s former name)
                and carry across to Terence Meghani.
              </p>
              <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button
                  href="https://www.trustpilot.com/review/bmdc.agency"
                  external
                  variant="primary"
                >
                  View on Trustpilot ↗
                </Button>
                <Button href="https://calendly.com/terencemeghani" external variant="secondary">
                  Book a call
                </Button>
              </div>
            </div>

            <aside
              style={{
                padding: '32px 32px 36px',
                background: 'var(--color-char-2)',
                border: '1px solid var(--color-hairline-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                Aggregate rating
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontVariationSettings: '"wdth" 100, "opsz" 96',
                    fontWeight: 700,
                    fontSize: 'clamp(60px, 7vw, 96px)',
                    lineHeight: 1,
                    color: '#fff',
                  }}
                >
                  4.9
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-mist)',
                  }}
                >
                  / 5
                </span>
              </div>
              <span style={{ color: 'var(--color-rocket)', letterSpacing: '0.1em', fontSize: 20 }}>
                ★★★★★
              </span>
              <span
                style={{
                  marginTop: 12,
                  paddingTop: 14,
                  borderTop: '1px solid var(--color-hairline-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-mist)',
                }}
              >
                {sorted.length} verified · source: Trustpilot
              </span>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="reviews-grid">
            {sorted.map((t) => (
              <article key={t.id} className="review-card">
                <span className="stars" aria-label={`${t.stars} of 5 stars`}>
                  {'★'.repeat(t.stars)}
                </span>
                <h2 className="rc-title">{t.title}</h2>
                <p className="rc-body">{t.text}</p>
                <footer>
                  <span>— {t.name}</span>
                  <time dateTime={t.date}>{t.date}</time>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LaunchCTA title="Add yours next?" />
    </>
  );
}
