import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { WorkGrid } from '@/components/case-study/WorkGrid';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllCaseStudies, getFilterChips } from '@/lib/case-studies';
import {
  PRACTICE_FILTERS,
  filterByPractice,
} from '@/lib/practice-filters';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';

const WORK_DESCRIPTION =
  'Selected work from twelve years of brand and engineering — News UK, Royal London, NHS, TEDx, BBC, and dozens of independent businesses. Brand, code, growth.';
const WORK_TITLE = 'Selected work';

export const metadata: Metadata = {
  title: WORK_TITLE,
  description: WORK_DESCRIPTION,
  alternates: { canonical: '/work/' },
  openGraph: {
    title: `${WORK_TITLE} — Terence Meghani`,
    description: WORK_DESCRIPTION,
    url: '/work/',
  },
  twitter: {
    title: `${WORK_TITLE} — Terence Meghani`,
    description: WORK_DESCRIPTION,
  },
};

const WORK_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Work', href: '/work/' },
]);

const VALID_IDS = new Set(PRACTICE_FILTERS.map((p) => p.id));

type SearchParams = Promise<{ practice?: string | string[] }>;

export default async function WorkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.practice) ? params.practice[0] : params.practice;
  const active = raw && VALID_IDS.has(raw) ? raw : 'all';

  const all = getAllCaseStudies();
  const filtered = filterByPractice(all, active);
  const chipList = getFilterChips();
  const counts = Object.fromEntries(chipList.map((c) => [c.id, c.count]));
  const totalCount = all.length;

  return (
    <>
      <script {...ldJsonProps(WORK_BREADCRUMBS)} />
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div className="kicker-row">
            <Kicker>Work · {totalCount} projects</Kicker>
          </div>
          <h1>
            A decade of projects that{' '}
            <em>shipped, scaled, and stayed.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            {totalCount} case studies across brand, plugin development, web, and marketing.
            Filter by discipline or scan the full set below.
          </p>
        </div>
      </section>

      <section
        style={{
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(80px, 12vw, 160px)',
          background: 'var(--color-char)',
        }}
      >
        <div className="wrap">
          <WorkGrid studies={filtered} active={active} counts={counts} />
        </div>
      </section>

      <LaunchCTA title="Your project next?" />
    </>
  );
}
