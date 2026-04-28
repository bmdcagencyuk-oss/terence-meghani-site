import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { ReviewCard } from '@/components/sections/ReviewCard';
import {
  REVIEWS,
  REVIEWS_AGGREGATE,
  REVIEWS_WITH_BODY,
  sortByDate,
} from '@/lib/reviews';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';
import { SITE, absoluteUrl } from '@/lib/site';

const REVIEWS_TITLE = 'Reviews';
const REVIEWS_DESCRIPTION =
  '101+ verifiable client reviews from Trustpilot and Facebook. 4.7 / 5 across 37 Trustpilot reviews, 100% recommend across 64 Facebook recommendations. Twelve years of work for News UK, TEDx, Royal London, NHS, BBC, and independents.';

export const metadata: Metadata = {
  title: REVIEWS_TITLE,
  description: REVIEWS_DESCRIPTION,
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: REVIEWS_TITLE,
    description:
      '101+ verifiable client reviews · 4.7 / 5 on Trustpilot · 100% recommend on Facebook.',
    url: '/reviews',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
};

const REVIEWS_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Reviews', href: '/reviews' },
]);

const REVIEW_SCHEMA = REVIEWS_WITH_BODY.map((r) => ({
  '@type': 'Review',
  '@id': `${SITE.url}/reviews#${r.id}`,
  author: { '@type': 'Person', name: r.name },
  datePublished: r.date,
  reviewBody: r.body,
  reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
  publisher: { '@type': 'Organization', name: r.publisher },
  itemReviewed: { '@id': SITE.ids.studio },
}));

const REVIEW_LIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE.url}/reviews#list`,
  name: 'Client reviews of Terence Meghani Studio',
  numberOfItems: REVIEWS_WITH_BODY.length,
  itemListElement: REVIEWS_WITH_BODY.map((r, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@id': `${SITE.url}/reviews#${r.id}` },
  })),
};

const REVIEW_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': REVIEW_SCHEMA,
};

const TRUSTPILOT_BREAKDOWN = REVIEWS_AGGREGATE.platform_breakdown.trustpilot;
const FB_BMDC_BREAKDOWN = REVIEWS_AGGREGATE.platform_breakdown.facebook_bmdc;
const FB_PERSONAL_BREAKDOWN = REVIEWS_AGGREGATE.platform_breakdown.facebook_personal;
const PLATFORM_LINKS = REVIEWS_AGGREGATE.platform_links;

export default function ReviewsPage() {
  const trustpilot = sortByDate(REVIEWS.trustpilot);
  const fbBmdc = sortByDate(REVIEWS.facebook_bmdc);
  const fbPersonal = sortByDate(REVIEWS.facebook_personal);

  return (
    <>
      <script {...ldJsonProps(REVIEWS_BREADCRUMBS)} />
      <script {...ldJsonProps(REVIEW_GRAPH)} />
      <script {...ldJsonProps(REVIEW_LIST_SCHEMA)} />

      {/* Page hero */}
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div className="kicker-row">
            <Kicker>Reviews · 2014–present</Kicker>
          </div>
          <h1>
            Words from <em>the room.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginBottom: 18,
              color: 'var(--color-rocket)',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 20, letterSpacing: '0.08em' }}>
              ★★★★★
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontVariationSettings: '"wdth" 85, "opsz" 72',
                fontWeight: 600,
                fontSize: 30,
                color: '#fff',
                letterSpacing: '-0.01em',
              }}
            >
              {REVIEWS_AGGREGATE.rating} / 5
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-mist)',
              }}
            >
              {REVIEWS_AGGREGATE.total_reviews}+ recommendations · Trustpilot &amp; Facebook
            </span>
          </div>
          <p className="lead">
            4.7 / 5 across 101+ recommendations on Trustpilot and Facebook. The originals
            live on the source platforms — these are the verbatim words clients chose to
            leave.
          </p>
        </div>
      </section>

      {/* Trustpilot section */}
      <section
        className="reviews-section"
        style={{ background: 'var(--color-char)' }}
        aria-labelledby="reviews-trustpilot-heading"
      >
        <div className="wrap">
          <div className="reviews-section-head">
            <span className="label" id="reviews-trustpilot-heading">
              <span className="platform">Trustpilot</span>
              {TRUSTPILOT_BREAKDOWN.rating} / 5 · {TRUSTPILOT_BREAKDOWN.total_reviews} reviews
            </span>
            <span className="count">
              Rendering {TRUSTPILOT_BREAKDOWN.rendered_on_page} most-recent
            </span>
          </div>

          <div className="reviews-grid">
            {trustpilot.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>

          <div className="reviews-section-foot">
            <a
              href={PLATFORM_LINKS.trustpilot}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all {TRUSTPILOT_BREAKDOWN.total_reviews} reviews on Trustpilot{' '}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Facebook BMDC page section */}
      <section
        className="reviews-section"
        style={{ background: 'var(--color-char-2)' }}
        aria-labelledby="reviews-fb-bmdc-heading"
      >
        <div className="wrap">
          <div className="reviews-section-head">
            <span className="label" id="reviews-fb-bmdc-heading">
              <span className="platform">Facebook · BMDC page</span>
              {FB_BMDC_BREAKDOWN.rating} · {FB_BMDC_BREAKDOWN.total_reviews} reviews
            </span>
            <span className="count">
              Rendering {FB_BMDC_BREAKDOWN.rendered_on_page} most-recent
            </span>
          </div>

          <div className="reviews-grid">
            {fbBmdc.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>

          <div className="reviews-section-foot">
            <a
              href={PLATFORM_LINKS.facebook_bmdc}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all {FB_BMDC_BREAKDOWN.total_reviews} recommendations on Facebook{' '}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Facebook Terence Meghani page section */}
      <section
        className="reviews-section"
        style={{ background: 'var(--color-char)' }}
        aria-labelledby="reviews-fb-personal-heading"
      >
        <div className="wrap">
          <div className="reviews-section-head">
            <span className="label" id="reviews-fb-personal-heading">
              <span className="platform">Facebook · Terence Meghani page</span>
              {FB_PERSONAL_BREAKDOWN.rating} · {FB_PERSONAL_BREAKDOWN.total_reviews} reviews
            </span>
            <span className="count">
              Rendering {FB_PERSONAL_BREAKDOWN.rendered_on_page} most-recent
            </span>
          </div>

          <div className="reviews-grid">
            {fbPersonal.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>

          <div className="reviews-section-foot">
            <a
              href={PLATFORM_LINKS.facebook_personal}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all {FB_PERSONAL_BREAKDOWN.total_reviews} recommendations on Facebook{' '}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <LaunchCTA
        title="Want to be next?"
        body="Book a discovery call · 30 min · free · no deck. Thirty minutes, no slides — leave with a concrete next step whether we work together or not."
      />
    </>
  );
}
