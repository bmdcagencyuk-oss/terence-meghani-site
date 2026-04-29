import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Kicker } from '@/components/ui/Kicker';
import { WorkGrid } from '@/components/case-study/WorkGrid';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllCaseStudies, getFilterChips } from '@/lib/case-studies';
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

export default function WorkPage() {
  const studies = getAllCaseStudies();
  const chips = getFilterChips();

  return (
    <>
      <script {...ldJsonProps(WORK_BREADCRUMBS)} />
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div className="kicker-row">
            <Kicker>Work · 12 projects</Kicker>
          </div>
          <h1>
            A decade of projects that{' '}
            <em>shipped, scaled, and stayed.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            Twelve case studies across brand, plugin development, web, and marketing.
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
          <Suspense fallback={null}>
            <WorkGrid studies={studies} chips={chips} />
          </Suspense>
        </div>
      </section>

      <LaunchCTA title="Your project next?" />
    </>
  );
}
