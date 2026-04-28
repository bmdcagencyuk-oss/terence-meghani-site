/**
 * Single source of truth for site-wide constants used in metadata, JSON-LD,
 * sitemap, robots, OG generation, and canonical URL resolution.
 */
export const SITE = {
  url: 'https://www.terencemeghani.com',
  name: 'Terence Meghani',
  studioName: 'Terence Meghani Studio',
  shortName: 'T·M',
  tagline: 'Built to compound.',
  defaultTitle: 'Terence Meghani — Built to compound.',
  titleTemplate: '%s — Terence Meghani',
  /** Use as <html lang>, JSON-LD inLanguage, OG locale. */
  locale: 'en-GB',
  /** Hex used for theme-color, OG background, manifest. Matches the dark hero token. */
  themeColor: '#0a0a0a',
  /** Hertfordshire-based; trades to UK + worldwide. */
  area: { locality: 'Watford', region: 'Hertfordshire', country: 'GB' },
  contact: {
    email: 'hello@terencemeghani.com',
    telephone: '+44 (0)20 4524 5111',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/terencemeghani/',
  },
  /** IRIs used by the site-wide @graph. */
  ids: {
    person: 'https://www.terencemeghani.com/#person',
    studio: 'https://www.terencemeghani.com/#studio',
    website: 'https://www.terencemeghani.com/#website',
  },
} as const;

/** Build an absolute URL on the canonical host. Path should start with '/'. */
export const absoluteUrl = (path: string) => `${SITE.url}${path}`;
