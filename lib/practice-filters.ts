/**
 * Practice filters for /work — five canonical buckets matching the four
 * services (Operations / Plugins / AI / Brand) plus All. Each bucket maps to
 * the historical tag vocabulary so legacy entries don't get orphaned:
 *   operations ← Operations, Web
 *   plugins    ← Plugins, Plugin, Platform
 *   ai         ← AI, Automation
 *   brand      ← Brand, Identity, Marketing, Photography
 *
 * Lives in its own module (no fs/path imports) so client components can
 * consume the filter logic without dragging server-only deps into the bundle.
 */

type FilterableStudy = { tags: string[] };

export const PRACTICE_FILTERS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'all',        label: 'All' },
  { id: 'operations', label: 'Operations' },
  { id: 'plugins',    label: 'Plugins' },
  { id: 'ai',         label: 'AI' },
  { id: 'brand',      label: 'Brand' },
];

const PRACTICE_TAG_MAP: Record<string, string[]> = {
  operations: ['operations', 'web'],
  plugins:    ['plugins', 'plugin', 'platform'],
  ai:         ['ai', 'automation'],
  brand:      ['brand', 'identity', 'marketing', 'photography'],
};

export function filterByPractice<T extends FilterableStudy>(
  list: T[],
  practice: string,
): T[] {
  if (practice === 'all') return list;
  const tags = PRACTICE_TAG_MAP[practice];
  if (!tags) return list;
  return list.filter((s) =>
    s.tags.some((t) => tags.includes(t.toLowerCase())),
  );
}
