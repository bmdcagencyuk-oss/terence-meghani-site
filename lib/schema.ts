import type { CaseStudy } from './case-studies';
import type { Plugin, PluginLongForm } from './plugins';
import type { Service } from './services';
import { FAQ_ITEMS } from '@/components/sections/FAQ';
import { TESTIMONIAL_ITEMS } from '@/components/sections/Testimonials';
import { SITE, absoluteUrl } from './site';

/**
 * Site-wide @graph: Person + ProfessionalService + WebSite. Rendered once
 * in the root layout so every page shares the same root entities. Per-page
 * blocks (Service, SoftwareApplication, CreativeWork, FAQPage,
 * BreadcrumbList) reference these via @id.
 *
 * Includes aggregateRating + Review nodes — testimonials are real
 * Trustpilot quotes; aggregate values are sourced from Trustpilot only.
 */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': SITE.ids.person,
        name: SITE.name,
        url: SITE.url,
        image: absoluteUrl('/about/terence-portrait.webp'),
        jobTitle: 'Brand consultant and WordPress engineer',
        description:
          'Studio of one — brand, code, growth. Twelve years of strategy, design and engineering for News UK, Royal London, NHS, TEDx, BBC and independents.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.area.locality,
          addressRegion: SITE.area.region,
          addressCountry: SITE.area.country,
        },
        sameAs: [SITE.social.linkedin],
        worksFor: { '@id': SITE.ids.studio },
      },
      {
        '@type': 'ProfessionalService',
        '@id': SITE.ids.studio,
        name: SITE.studioName,
        alternateName: 'Meghani Studio',
        url: SITE.url,
        logo: absoluteUrl('/brand/emblem-gorilla.svg'),
        image: absoluteUrl('/brand/emblem-gorilla.svg'),
        founder: { '@id': SITE.ids.person },
        foundingDate: '2014',
        slogan: SITE.tagline,
        description:
          'Independent studio for brand, code and growth — WordPress operations, plugin development, AI and automation, strategy-led brand work.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE.area.locality,
          addressRegion: SITE.area.region,
          addressCountry: SITE.area.country,
        },
        areaServed: ['GB', 'United Kingdom', 'Worldwide'],
        telephone: SITE.contact.telephone,
        email: SITE.contact.email,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+442045245111',
            contactType: 'Customer Service',
            areaServed: 'GB',
            availableLanguage: 'English',
          },
          {
            '@type': 'ContactPoint',
            contactType: 'Office',
            telephone: SITE.contact.telephone,
            email: SITE.contact.email,
            areaServed: 'GB',
            availableLanguage: ['en'],
          },
          {
            '@type': 'ContactPoint',
            contactType: 'Mobile',
            telephone: SITE.contact.mobile,
            areaServed: 'GB',
            availableLanguage: ['en'],
          },
        ],
        priceRange: '£1,500–£80,000+',
        serviceType: [
          'WordPress Operations',
          'WordPress Plugin Development',
          'AI & Automation',
          'Brand & Identity',
          'Web Development',
          'SEO & Organic Growth',
        ],
        // Aggregate sourced from Trustpilot only (4.7 / 37). Facebook
        // recommendations are binary and don't combine cleanly with a
        // five-point scale — keeping this source-pure.
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.7',
          bestRating: '5',
          ratingCount: '37',
          reviewCount: '37',
        },
        review: TESTIMONIAL_ITEMS.map((t) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: t.name },
          datePublished: t.datePublished,
          reviewBody: t.quote,
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          publisher: { '@type': 'Organization', name: t.source },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': SITE.ids.website,
        url: SITE.url,
        name: SITE.name,
        publisher: { '@id': SITE.ids.studio },
        inLanguage: SITE.locale,
      },
    ],
  };
}

/** Breadcrumb list reflecting the visible breadcrumb trail on a page. */
export function breadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

/** Service-page Service entity. */
export function serviceSchema(service: Service, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.label,
    provider: { '@id': SITE.ids.studio },
    areaServed: 'GB',
    description,
    url: absoluteUrl(service.url),
  };
}

/** WordPress Operations page extends Service with an OfferCatalog of tiers. */
export function wpOperationsSchema(opts: {
  url: string;
  description: string;
  tiers: Array<{ name: string; price: number; pitch: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${absoluteUrl(opts.url)}#service`,
        name: 'WordPress Operations',
        url: absoluteUrl(opts.url),
        serviceType: 'Managed WordPress operations retainer',
        provider: { '@id': SITE.ids.studio },
        areaServed: 'GB',
        description: opts.description,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'WordPress Operations tiers',
          itemListElement: opts.tiers.map((tier) => ({
            '@type': 'Offer',
            name: tier.name,
            price: tier.price,
            priceCurrency: 'GBP',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: tier.price,
              priceCurrency: 'GBP',
              referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
            },
            description: tier.pitch,
            url: absoluteUrl(opts.url),
          })),
        },
      },
    ],
  };
}

/** Plugin-detail SoftwareApplication entity. */
export function pluginSchema(plugin: Plugin, longForm: PluginLongForm | undefined) {
  const url = absoluteUrl(`/plugins/${plugin.slug}/`);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: plugin.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'WordPress',
    url,
    softwareVersion: plugin.version,
    description: longForm?.whatItDoes?.[0] ?? plugin.tagline,
    creator: { '@id': SITE.ids.studio },
    offers:
      plugin.status === 'available'
        ? { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'GBP' }
        : { '@type': 'Offer', availability: 'https://schema.org/PreOrder', priceCurrency: 'GBP' },
  };
}

/** Case study CreativeWork entity. */
export function caseStudySchema(cs: CaseStudy) {
  const toAbs = (src: string) => (src.startsWith('http') ? src : absoluteUrl(src));
  const image =
    cs.gallery && cs.gallery.length > 0
      ? cs.gallery.map(toAbs)
      : cs.heroImage
        ? toAbs(cs.heroImage)
        : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.projectTitle,
    about: cs.industry || cs.client,
    creator: { '@id': SITE.ids.studio },
    datePublished: String(cs.year),
    image,
    description: cs.excerpt,
    url: absoluteUrl(`/work/${cs.slug}/`),
  };
}

/**
 * Site-wide LocalBusiness (ProfessionalService) emitted from the root layout.
 * Uses E.164-format telephone, geo coordinates, and a public-facing
 * priceRange band so Google can populate the knowledge panel directly.
 * Distinct @id from the @graph studio entity so the two coexist cleanly.
 */
export function siteLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://terencemeghani.com/#localbusiness',
    name: 'Terence Meghani Studio',
    image: 'https://terencemeghani.com/brand/emblem-gorilla.svg',
    url: 'https://terencemeghani.com',
    telephone: '+442045245111',
    email: 'hello@terencemeghani.com',
    priceRange: '££££',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Watford',
      addressRegion: 'Hertfordshire',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.6565,
      longitude: -0.3903,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Hertfordshire' },
      { '@type': 'AdministrativeArea', name: 'Greater London' },
      { '@type': 'Country', name: 'United Kingdom' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.linkedin.com/in/terencemeghani/',
      'https://www.trustpilot.com/review/bmdc.agency',
      'https://g.page/r/CS13tYjkbwqMEBM',
    ],
    knowsAbout: [
      'WordPress development',
      'WordPress plugin development',
      'Brand identity',
      'AI automation',
      'Website operations',
      'WordPress engineering',
    ],
  };
}

/**
 * LocalBusiness schema for the /hertfordshire page. Exists in addition to
 * the site-wide ProfessionalService entity (re-keyed via parentOrganization)
 * and uses the canonical office telephone resolved in the pre-launch audit.
 */
export function localBusinessSchema() {
  const url = absoluteUrl('/hertfordshire');
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#localbusiness`,
    name: SITE.studioName,
    description:
      'Engineer-grade WordPress operations, plugin development, AI workflows, and brand work — operated from Hertfordshire, delivered across the UK.',
    url,
    telephone: SITE.contact.telephone,
    email: SITE.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.area.locality,
      addressRegion: SITE.area.region,
      addressCountry: SITE.area.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Watford' },
      { '@type': 'City', name: 'St Albans' },
      { '@type': 'City', name: 'Hemel Hempstead' },
      { '@type': 'City', name: 'Hatfield' },
      { '@type': 'AdministrativeArea', name: 'Hertfordshire' },
      { '@type': 'AdministrativeArea', name: 'Greater London' },
      { '@type': 'Country', name: 'United Kingdom' },
    ],
    founder: { '@id': SITE.ids.person },
    parentOrganization: { '@id': SITE.ids.studio },
  };
}

/**
 * Article entity for /notes/[slug] — used for Google's article rich result
 * and to keep author / publisher / date relationships explicit. The note's
 * heroImage may be a relative path; absoluteUrl handles both.
 */
export function articleSchema(note: {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  heroImage: string;
  author: string;
}) {
  const url = absoluteUrl(`/notes/${note.slug}/`);
  const image = note.heroImage
    ? note.heroImage.startsWith('http')
      ? note.heroImage
      : absoluteUrl(note.heroImage)
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.excerpt,
    datePublished: note.date,
    dateModified: note.date,
    author: {
      '@type': 'Person',
      name: note.author,
      url: absoluteUrl('/about'),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.studioName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/brand/emblem-gorilla.svg'),
      },
    },
    image,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

/** FAQPage entity from a list of {q, a} pairs. */
export function faqPageSchema(items: Array<{ q: string; aPlain: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.aPlain },
    })),
  };
}

/** Home page schema combines the site graph with the home FAQ. */
export function homeSchema() {
  return {
    ...siteGraph(),
    '@graph': [
      ...siteGraph()['@graph'],
      {
        '@type': 'FAQPage',
        '@id': `${SITE.url}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.aPlain },
        })),
      },
    ],
  };
}

/**
 * Helper to inline-embed any schema object as a JSON-LD script. Returns the
 * `dangerouslySetInnerHTML` value; callers wrap with <script type="application/ld+json"/>.
 */
export const ldJsonProps = (schema: object) => ({
  type: 'application/ld+json',
  dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
});
