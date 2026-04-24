import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';

type Props = { study: CaseStudy };

export function CaseStudyHero({ study }: Props) {
  return (
    <section className="cs-hero">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/work/">Work</Link></li>
            <li aria-hidden="true">›</li>
            <li style={{ color: 'var(--color-rocket)' }}>{study.client}</li>
          </ol>
        </nav>

        <div style={{ marginTop: 28 }}>
          <Kicker>Case study · {study.year}</Kicker>
        </div>
        <h1>
          {study.projectTitle.includes(' ')
            ? (
                <>
                  {study.projectTitle.split(' ').slice(0, -1).join(' ')}{' '}
                  <em>{study.projectTitle.split(' ').slice(-1)[0]}</em>
                </>
              )
            : <em>{study.projectTitle}</em>}
        </h1>
        <p className="client">{study.client} · {study.industry}</p>

        {study.heroImage && (
          <div
            className="image"
            style={{ backgroundImage: `url('${study.heroImage}')` }}
            role="img"
            aria-label={study.heroImageAlt}
          />
        )}
      </div>
    </section>
  );
}
