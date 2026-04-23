import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Kicker } from '@/components/ui/Kicker';
import { WorkGrid } from '@/components/case-study/WorkGrid';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllCaseStudies } from '@/lib/case-studies';

export const metadata: Metadata = {
  title: 'Work — 24 projects across brand, web, and marketing',
  description:
    'Selected case studies — News UK cyber awareness campaign, Al Jannah Villa Marrakech, TEDx University of Salford, DCD Connect, Fireaway Pizza (+75% organic), and 19 more across brand, web, and marketing.',
};

export default function WorkPage() {
  const studies = getAllCaseStudies();
  return (
    <>
      <section className="pt-32 pb-10 bg-char">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Kicker>Work</Kicker>
          <h1
            className="mt-6 font-display text-white max-w-4xl"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            A decade of projects that{' '}
            <em className="font-italic italic text-rocket">shipped, scaled, and stayed.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-mist">
            Twenty-four projects across brand, web, marketing, and photography. Filter by
            discipline or scan the full set below.
          </p>
        </div>
      </section>
      <section className="pb-20 bg-char">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Suspense fallback={<div className="text-fog">Loading…</div>}>
            <WorkGrid studies={studies} />
          </Suspense>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
