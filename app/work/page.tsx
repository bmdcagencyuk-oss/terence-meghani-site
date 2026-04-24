import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { WorkGrid } from '@/components/case-study/WorkGrid';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllCaseStudies, getFilterChips } from '@/lib/case-studies';

export const metadata: Metadata = {
  title: 'Work — 24 projects across brand, web, and marketing',
  description:
    'Selected case studies — News UK cyber awareness campaign, Al Jannah Villa Marrakech, TEDx University of Salford, DCD Connect, Fireaway Pizza, and 19 more across brand, web, and marketing.',
};

export default function WorkPage() {
  const studies = getAllCaseStudies();
  const chips = getFilterChips();

  return (
    <>
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div className="kicker-row">
            <Kicker>Work · 24 projects</Kicker>
          </div>
          <h1>
            A decade of projects that{' '}
            <em>shipped, scaled, and stayed.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            Twenty-four projects across brand, web, marketing, and photography. Filter by
            discipline or scan the full set below.
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
          <WorkGrid studies={studies} chips={chips} />
        </div>
      </section>

      <LaunchCTA headline="project" />
    </>
  );
}
