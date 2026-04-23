import type { CaseStudy } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';
import { WorkCard } from './WorkCard';

export function CaseStudyRelated({ related }: { related: CaseStudy[] }) {
  if (related.length === 0) return null;

  return (
    <section className="section-pad bg-char">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Kicker>While you&rsquo;re here</Kicker>
        <h2
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-md)' }}
        >
          Related{' '}
          <em className="font-italic italic text-rocket">work.</em>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {related.slice(0, 3).map((s) => (
            <WorkCard key={s.slug} study={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
