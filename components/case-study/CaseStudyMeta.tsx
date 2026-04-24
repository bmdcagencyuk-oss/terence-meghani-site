import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

const metaRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  gap: 16,
  padding: '12px 0',
  borderBottom: '1px solid var(--color-hairline-2)',
  color: 'var(--color-mist)',
};

export function CaseStudyMeta({ study }: Props) {
  const rows: Array<[string, string]> = [
    ['Client', study.client],
    ['Industry', study.industry],
    ['Year', String(study.year)],
    ['Services', study.services.join(' · ')],
  ];
  if (study.location) rows.push(['Location', study.location]);
  if (study.market) rows.push(['Market', study.market]);

  return (
    <section style={{ background: 'var(--color-char)', padding: '36px 0' }}>
      <div className="wrap" style={{ maxWidth: 900 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={metaRow}>
            <span className="mono" style={{ color: 'var(--color-fog)' }}>{k}</span>
            <span style={{ color: '#fff' }}>{v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
