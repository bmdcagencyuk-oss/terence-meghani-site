import type { MetadataRoute } from 'next';
import caseStudies from '@/data/case-studies.json';
import services from '@/data/services.json';

const BASE = 'https://terencemeghani.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticPaths = [
    '',
    '/about/',
    '/work/',
    '/reviews/',
    '/contact/',
    '/engage/growth-partnership/',
    '/privacy/',
    '/terms/',
    '/cookies/',
  ];
  const caseStudyPaths = caseStudies.studies.map((s) => `/work/${s.slug}/`);
  const servicePaths = services.services
    .map((s) => s.url)
    // de-dupe in case of collision with growth-partnership
    .filter((url) => !staticPaths.includes(url));

  return [...staticPaths, ...caseStudyPaths, ...servicePaths].map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1.0 : path.startsWith('/work/') ? 0.8 : 0.7,
  }));
}
