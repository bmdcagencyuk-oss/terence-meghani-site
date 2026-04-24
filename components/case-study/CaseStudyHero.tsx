import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

export function CaseStudyHero({ study }: Props) {
  return (
    <section
      className="pt-32 pb-16"
      style={{ background: 'var(--color-ink)' }}
    >
      <div className="wrap">
        <p className="mono" style={{ color: 'var(--color-rocket)' }}>
          {study.industry} · {study.year}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 7vw, 120px)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: '#fff',
            marginTop: 12,
          }}
        >
          {study.projectTitle}
        </h1>
        <p
          style={{
            marginTop: 20,
            maxWidth: '60ch',
            fontSize: 18,
            lineHeight: 1.55,
            color: 'var(--color-mist)',
          }}
        >
          {study.excerpt}
        </p>
      </div>
    </section>
  );
}
