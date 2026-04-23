import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Kicker } from '@/components/ui/Kicker';
import { WorkCard } from '@/components/case-study/WorkCard';
import { getFlagshipCaseStudies } from '@/lib/case-studies';

export function WorkCarousel() {
  const flagships = getFlagshipCaseStudies();

  return (
    <section id="work" className="section-pad bg-char-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <Kicker>Selected work</Kicker>
            <h2
              className="mt-6 font-display text-white max-w-3xl"
              style={{ fontSize: 'var(--text-display-lg)' }}
            >
              A decade of projects that{' '}
              <em className="font-italic italic text-rocket">
                shipped, scaled, and stayed.
              </em>
            </h2>
          </div>
          <Link
            href="/work/"
            className="inline-flex items-center gap-2 text-rocket font-mono text-xs uppercase tracking-wider hover:gap-3 transition-all"
          >
            View all 24 projects <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-8 max-w-2xl text-lg text-mist">
          From News UK to TEDx to an independent veterinary practice in Mill Hill — the
          work changes industry and scale but carries the same commitment to craft,
          clarity, and commercial outcome.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flagships.map((s) => (
            <WorkCard key={s.slug} study={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
