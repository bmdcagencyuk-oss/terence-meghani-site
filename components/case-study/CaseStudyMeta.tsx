import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

export function CaseStudyMeta({ study }: Props) {
  const rows: Array<[string, string]> = [
    ['Client', study.client],
    ['Industry', study.industry],
    ['Services', study.services.join(' · ')],
  ];
  if (study.location) rows.push(['Location', study.location]);
  if (study.market) rows.push(['Market', study.market]);

  return (
    <section className="cs-meta">
      <div className="wrap">
        <div className="rail">
          {rows.map(([k, v]) => (
            <div className="cell" key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
