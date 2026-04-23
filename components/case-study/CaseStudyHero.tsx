import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';
import { FallbackImg } from '@/components/common/FallbackImg';

interface CaseStudyHeroProps {
  study: CaseStudy;
}

export function CaseStudyHero({ study }: CaseStudyHeroProps) {
  return (
    <section className="relative pt-32 pb-12 md:pb-20 bg-char">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-rocket transition-colors">Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/work/" className="hover:text-rocket transition-colors">Work</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-rocket">{study.client}</li>
          </ol>
        </nav>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-14 items-start">
          {/* Left column */}
          <div>
            <Kicker className="text-rocket">
              Case study · {study.year} · {study.tags.join(' · ')}
            </Kicker>
            <h1
              className="mt-6 font-display text-white leading-[0.92]"
              style={{ fontSize: 'var(--text-display-lg)' }}
            >
              {study.client}
            </h1>
            <p className="mt-4 font-italic italic text-2xl md:text-3xl text-rocket">
              {study.projectTitle}.
            </p>
            <p className="mt-6 text-lg text-mist leading-relaxed max-w-xl">
              {study.excerpt}
            </p>
            <div className="mt-8 flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-mist">
              <a href="#outcome" className="hover:text-rocket transition-colors">
                Read outcome ↓
              </a>
            </div>
          </div>

          {/* Right column — hero image */}
          <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[560px] overflow-hidden rounded-xl bg-char-2 border border-hairline-subtle">
            {study.heroImage && (
              <FallbackImg
                src={study.heroImage}
                alt={study.heroImageAlt}
                className="absolute inset-0 w-full h-full object-cover"
                fallbackText={study.client.split(' ').map((w) => w[0]).slice(0, 3).join('')}
                fallbackClassName="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-char to-ink"
              />
            )}
            {/* Rocket-orange accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rocket" />
          </div>
        </div>
      </div>
    </section>
  );
}
