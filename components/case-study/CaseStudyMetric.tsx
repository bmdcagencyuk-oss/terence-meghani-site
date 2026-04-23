import type { CaseStudy } from '@/lib/case-studies';

export function CaseStudyMetric({ metric }: { metric: NonNullable<CaseStudy['metric']> }) {
  return (
    <div className="my-10 md:my-14 max-w-md">
      <div className="border-l-2 border-rocket pl-6 py-2">
        <div
          className="font-display text-rocket leading-none tabular-nums"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
        >
          {metric.value}
        </div>
        <div className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-white">
          {metric.label}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
          {metric.source}
        </div>
      </div>
    </div>
  );
}
