import type { CaseStudy } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';
import { WorkCard } from './WorkCard';

type Props = { related: CaseStudy[] };

export function CaseStudyRelated({ related }: Props) {
  if (!related.length) return null;
  return (
    <section className="section-pad" style={{ background: 'var(--color-char)' }}>
      <div className="wrap">
        <Kicker>Related work</Kicker>
        <h2
          style={{
            marginTop: 14,
            fontFamily: 'var(--font-display)',
            fontVariationSettings: '"wdth" 100, "opsz" 72',
            fontWeight: 500,
            fontSize: 'var(--text-display-md)',
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          More from the studio.
        </h2>
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {related.map((s) => (
            <WorkCard key={s.slug} study={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
