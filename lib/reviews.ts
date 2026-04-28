import reviewsData from '@/data/reviews.json';

export type ReviewSourceKey = 'trustpilot' | 'facebook_bmdc' | 'facebook_personal';

export type Review = {
  id: string;
  name: string;
  initials: string;
  date: string;
  year: number;
  rating: number;
  title?: string;
  body: string | null;
  tags?: string[];
  company?: string;
  /** Derived during loading; not present in the source JSON. */
  source: ReviewSourceKey;
  /** Display label for the publisher (Trustpilot or Facebook). */
  publisher: 'Trustpilot' | 'Facebook';
};

/** Tags used by layout logic only — filtered out before rendering chip rows. */
const UTILITY_TAGS = new Set(['star-only', 'long-form', 'short']);

const annotate = (raw: unknown[], source: ReviewSourceKey): Review[] => {
  const publisher = source === 'trustpilot' ? 'Trustpilot' : 'Facebook';
  return (raw as Review[]).map((r) => ({ ...r, source, publisher }));
};

export const REVIEWS = {
  trustpilot: annotate(reviewsData.trustpilot, 'trustpilot'),
  facebook_bmdc: annotate(reviewsData.facebook_bmdc, 'facebook_bmdc'),
  facebook_personal: annotate(reviewsData.facebook_personal, 'facebook_personal'),
};

/** Newest-first by ISO date. */
export const sortByDate = (reviews: Review[]): Review[] =>
  [...reviews].sort((a, b) => b.date.localeCompare(a.date));

/** Strip the layout-only utility tags, return display-ready chips. */
export const displayTags = (review: Review): string[] =>
  (review.tags ?? []).filter((t) => !UTILITY_TAGS.has(t));

/** All rendered reviews across the three platforms (67). */
export const ALL_REVIEWS: Review[] = [
  ...REVIEWS.trustpilot,
  ...REVIEWS.facebook_bmdc,
  ...REVIEWS.facebook_personal,
];

/** Reviews with a body — used for Review JSON-LD where reviewBody is required. */
export const REVIEWS_WITH_BODY: Review[] = ALL_REVIEWS.filter((r) => r.body !== null);

export const REVIEWS_AGGREGATE = reviewsData.aggregate;
