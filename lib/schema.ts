import type { CaseStudy } from './case-studies';
import type { Plugin, PluginLongForm } from './plugins';
import type { Service } from './services';
import { FAQ_ITEMS } from '@/components/sections/FAQ';
import { SITE, absoluteUrl } from './site';

/**
 * Site-wide @graph: Person + ProfessionalService + WebSite. Rendered once
 * in the root layout so every page shares the same root entities. Per-page
 * blocks (Service, SoftwareApplication, CreativeWork, FAQPage,
 * BreadcrumbList) reference these via @id.
 *
 * NOTE: deliberately omits aggregateRating / review schema — the visible
 * testimonials are placeholders and fabricating ratings risks a Google
 * manual action.
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
        priceRange: '£1,500–£80,000+',
        serviceType: [
          'WordPress Operations',
          'WordPress Plugin Development',
          'AI & Automation',
          'Brand & Identity',
          'Web Development',
          'SEO & Organic Growth',
        ],
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
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.projectTitle,
    about: cs.industry || cs.client,
    creator: { '@id': SITE.ids.studio },
    datePublished: String(cs.year),
    image: cs.heroImage?.startsWith('http') ? cs.heroImage : absoluteUrl(cs.heroImage ?? ''),
    description: cs.excerpt,
    url: absoluteUrl(`/work/${cs.slug}/`),
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
