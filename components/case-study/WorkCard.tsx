import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

export function WorkCard({ study }: Props) {
  return (
    <Link href={`/work/${study.slug}/`} className="work-card" data-cc="view">
      {study.heroImage && (
        <span className="cover">
          <Image
            src={study.heroImage}
            alt={study.heroImageAlt}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 360px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </span>
      )}
      <div className="body">
        <div className="meta">
          <span>{study.client}</span>
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
