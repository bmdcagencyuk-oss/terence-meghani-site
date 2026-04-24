type Metric = { value: string; label: string; source: string };
type Props = { metric: Metric };

export function CaseStudyMetric({ metric }: Props) {
  return (
    <div
      style={{
        marginTop: 32,
        padding: 24,
        border: '1px solid var(--color-rocket)',
        background: 'color-mix(in srgb, var(--color-rocket) 10%, transparent)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <strong
        style={{
          fontFamily: 'var(--font-italic)',
          fontStyle: 'italic',
          fontSize: 48,
          lineHeight: 1,
          color: 'var(--color-rocket)',
        }}
      >
        {metric.value}
      </strong>
      <span style={{ color: '#fff', fontSize: 16 }}>{metric.label}</span>
      <span className="mono" style={{ color: 'var(--color-fog)' }}>
        Source: {metric.source}
      </span>
    </div>
  );
}
