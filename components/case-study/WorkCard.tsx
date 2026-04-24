import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

export function WorkCard({ study }: Props) {
  return (
    <Link href={`/work/${study.slug}/`} className="wc" data-cc="view">
      <div
        className="v"
        style={{ backgroundImage: `url('${study.heroImage}')` }}
        aria-hidden="true"
      />
      <div className="content">
        <div className="top">
          <span className="idx">{study.industry}</span>
          <span className="year">{study.year}</span>
        </div>
        <div>
          <span className="tag">{study.tags.join(' · ')}</span>
          <h3>{study.projectTitle}</h3>
          {study.metric && (
            <div className="metrics">
              <div className="m">
                <div className="n">{study.metric.value}</div>
                <div className="k">{study.metric.label}</div>
              </div>
            </div>
          )}
          <span className="open">Case study ↗</span>
        </div>
      </div>
    </Link>
  );
}
