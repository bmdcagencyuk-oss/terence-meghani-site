import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';

type Props = { study: CaseStudy; hideHeroImage?: boolean };

function italicLastWord(title: string) {
  const words = title.split(' ');
  if (words.length < 2) {
    return <em>{title}</em>;
  }
  return (
    <>
      {words.slice(0, -1).join(' ')}{' '}
      <em>{words[words.length - 1]}</em>
    </>
  );
}

export function CaseStudyHero({ study, hideHeroImage = false }: Props) {
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
          <Kicker>Case study</Kicker>
        </div>

        <h1>{italicLastWord(study.projectTitle)}</h1>

        <p className="client">
          {study.client} · {study.industry}
          {study.location ? ` · ${study.location}` : ''}
        </p>

        {study.excerpt && (
          <p
            style={{
              marginTop: 20,
              maxWidth: '62ch',
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--color-mist)',
            }}
          >
            {study.excerpt}
          </p>
        )}

        {study.heroImage && !hideHeroImage && (
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
