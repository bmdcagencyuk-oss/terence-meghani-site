type Metric = { value: string; label: string; source: string };
type Props = { metric: Metric };

export function CaseStudyMetric({ metric }: Props) {
  return (
    <div className="cs-metric">
      <div className="value">{metric.value}</div>
      <div className="label">{metric.label}</div>
      <div className="source">Source · {metric.source}</div>
    </div>
  );
}
