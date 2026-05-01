import type { MetadataRoute } from 'next';
import { getAllCaseStudies } from '@/lib/case-studies';
import { getAllServices } from '@/lib/services';
import { getAllPlugins } from '@/lib/plugins';
import { getAllNotes } from '@/lib/notes';
import { SITE } from '@/lib/site';

/** Routes that must be crawled and indexed. */
const STATIC_PATHS = [
  '/',
  '/about/',
  '/process/',
  '/engage/',
  '/hertfordshire',
  '/work/',
  '/plugins/',
  '/reviews/',
  '/contact/',
  '/engage/growth-partnership/',
];

/** Pages excluded from the sitemap (legal + utility). */
const EXCLUDED = new Set([
  '/privacy/',
  '/terms/',
  '/cookies/',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const caseStudyPaths = getAllCaseStudies().map((s) => `/work/${s.slug}/`);
  const pluginPaths = getAllPlugins().map((p) => `/plugins/${p.slug}/`);
  const servicePaths = getAllServices()
    .map((s) => s.url)
    // de-dupe in case of collision with /engage/growth-partnership/
    .filter((url) => !STATIC_PATHS.includes(url));

  // Notes index + per-note paths. Published-only — yields nothing until the
  // section goes live, so the sitemap stays clean until then.
  const publishedNotes = getAllNotes();
  const notePaths = publishedNotes.length > 0
    ? ['/notes/', ...publishedNotes.map((n) => `/notes/${n.slug}/`)]
    : [];

  const allPaths = [
    ...STATIC_PATHS,
    ...caseStudyPaths,
    ...pluginPaths,
    ...servicePaths,
    ...notePaths,
  ].filter((p) => !EXCLUDED.has(p));

  return allPaths.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    priority:
      path === '/' ? 1.0 :
      path.startsWith('/work/') ? 0.8 :
      path.startsWith('/services/') || path === '/services/wordpress-operations/' ? 0.8 :
      path.startsWith('/plugins/') ? 0.8 :
      path === '/hertfordshire' ? 0.7 :
      path.startsWith('/notes/') ? 0.7 :
      0.6,
  }));
}
