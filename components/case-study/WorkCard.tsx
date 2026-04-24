/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

export function WorkCard({ study }: Props) {
  return (
    <Link href={`/work/${study.slug}/`} className="work-card" data-cc="view">
      <div
        className="cover"
        style={{ backgroundImage: `url('${study.heroImage}')` }}
        role="img"
        aria-label={study.heroImageAlt}
      />
      <div className="body">
        <div className="meta">
          <span>{study.client}</span>
          <span>{study.year}</span>
        </div>
        <h3>{study.projectTitle}</h3>
        <div className="client">{study.industry}</div>
        <div className="tags">
          {study.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <span className="cta">
          View case study <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
