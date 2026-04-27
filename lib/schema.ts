import type { CaseStudy, Testimonial } from './case-studies';
import { FAQ_ITEMS } from '@/components/sections/FAQ';

const BASE = 'https://terencemeghani.com';
const PERSON_ID = `${BASE}/#person`;
const ORG_ID = `${BASE}/#organization`;

export function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Terence Meghani',
        jobTitle: 'Brand Consultant & WordPress Engineer',
        email: 'hello@terencemeghani.com',
        telephone: '+44-7756-267157',
        url: `${BASE}/`,
        image: `${BASE}/og-share.png`,
        sameAs: ['https://www.linkedin.com/in/terencemeghani/'],
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Hertfordshire',
          addressCountry: 'GB',
        },
      },
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'Terence Meghani',
        url: `${BASE}/`,
        founder: { '@id': PERSON_ID },
        foundingDate: '2013',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '37',
          bestRating: '5',
        },
      },
      {
        '@type': 'WebSite',
        url: `${BASE}/`,
        name: 'Terence Meghani',
        description: 'Brand consultant & WordPress engineer.',
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.aPlain },
        })),
      },
    ],
  };
}

export function caseStudySchema(cs: CaseStudy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.projectTitle,
    about: cs.client,
    creator: { '@id': PERSON_ID },
    datePublished: String(cs.year),
    image: cs.heroImage,
    description: cs.excerpt,
  };
}

export function reviewsSchema(testimonials: Testimonial[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Terence Meghani',
    url: `${BASE}/`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '37',
      bestRating: '5',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(t.stars),
        bestRating: '5',
      },
      datePublished: t.date,
      name: t.title,
      reviewBody: t.text,
    })),
  };
}
