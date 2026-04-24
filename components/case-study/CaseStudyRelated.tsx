import type { CaseStudy } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';
import { WorkCard } from './WorkCard';

type Props = { related: CaseStudy[] };

/**
 * Related projects — fixed three-column grid on wide screens so the card row
 * aligns cleanly without auto-fill leaving empty tracks. Collapses 3 -> 2 -> 1
 * at 960 and 640px.
 */
export function CaseStudyRelated({ related }: Props) {
  if (!related.length) return null;
  // Cap at three so the fixed 3-col grid never shows a half-empty row.
  const items = related.slice(0, 3);

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
        <div className="cs-related-grid">
          {items.map((s) => (
            <WorkCard key={s.slug} study={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
