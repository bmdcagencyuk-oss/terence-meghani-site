import type { CaseStudy } from '@/lib/case-studies';
import { WorkCard } from './WorkCard';

type Props = { related: CaseStudy[] };

export function CaseStudyRelated({ related }: Props) {
  if (!related.length) return null;
  return (
    <section style={{ background: 'var(--color-char)', padding: 'clamp(60px, 9vw, 120px) 0' }}>
      <div className="wrap">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 56px)',
            color: '#fff',
            marginBottom: 32,
          }}
        >
          Related work
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
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
