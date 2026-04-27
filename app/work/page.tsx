import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { WorkGrid } from '@/components/case-study/WorkGrid';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllCaseStudies, getFilterChips } from '@/lib/case-studies';

const COUNT = getAllCaseStudies().length;

export const metadata: Metadata = {
  title: `Work — ${COUNT} projects across brand, web, and marketing`,
  description:
    'Selected case studies — Kinnovis self-storage booking platform, News UK cyber awareness campaign, Al Jannah Villa Marrakech, TEDx University of Salford, and more across brand, web, and marketing.',
};

export default function WorkPage() {
  const studies = getAllCaseStudies();
  const chips = getFilterChips();

  return (
    <>
      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <div className="kicker-row">
            <Kicker>Work · {studies.length} projects</Kicker>
          </div>
          <h1>
            A decade of projects that{' '}
            <em>shipped, scaled, and stayed.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            {studies.length} selected projects across brand, web, marketing, and photography.
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
          <WorkGrid studies={studies} chips={chips} />
        </div>
      </section>

      <LaunchCTA title="Your project next?" />
    </>
  );
}
