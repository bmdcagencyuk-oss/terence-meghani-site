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
      <section
        style={{
          paddingTop: 'clamp(96px, 12vw, 160px)',
          paddingBottom: 'clamp(32px, 5vw, 56px)',
          background: 'var(--color-char)',
        }}
      >
        <div className="wrap">
          <Kicker>Work</Kicker>
          <h1
            style={{
              marginTop: 20,
              fontFamily: 'var(--font-display)',
              fontVariationSettings: '"wdth" 100, "opsz" 96',
              fontWeight: 500,
              fontSize: 'var(--text-display-lg)',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#fff',
              maxWidth: '16ch',
            }}
          >
            A decade of projects that{' '}
            <em
              style={{
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                color: 'var(--color-rocket)',
                fontWeight: 400,
              }}
            >
              shipped, scaled, and stayed.
            </em>
          </h1>
          <p
            style={{
              marginTop: 24,
              maxWidth: '60ch',
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--color-mist)',
            }}
          >
            Twenty-four projects across brand, web, marketing, and photography. Filter by
            discipline or scan the full set below.
          </p>
        </div>
      </section>

      <section
        style={{
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
