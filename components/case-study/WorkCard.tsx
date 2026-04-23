import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/case-studies';
import { FallbackImg } from '@/components/common/FallbackImg';

interface WorkCardProps {
  study: CaseStudy;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WorkCard({ study, size = 'md', className }: WorkCardProps) {
  const initials = study.client
    .split(' ')
    .map((w) => w[0])
    .slice(0, 3)
    .join('');

  return (
    <Link
      href={`/work/${study.slug}/`}
      className={cn(
        'group block relative overflow-hidden bg-char-2 border border-hairline-subtle rounded-xl hover:border-rocket transition-colors',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        {study.heroImage && (
          <FallbackImg
            src={study.heroImage}
            alt={study.heroImageAlt || `${study.client} project imagery`}
            fallbackText={initials}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className={cn('p-5', size === 'lg' && 'p-7')}>
        <h3
          className={cn(
            'font-display text-white group-hover:text-rocket transition-colors',
            size === 'lg'
              ? 'text-3xl md:text-4xl'
              : size === 'sm'
              ? 'text-xl'
              : 'text-2xl',
          )}
        >
          {study.client}
        </h3>
        <p className={cn('mt-2 text-fog', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {study.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {study.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-2 py-1 rounded-full border border-hairline text-[10px] font-mono uppercase tracking-wider text-mist"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-rocket font-mono text-[11px] uppercase tracking-wider group-hover:gap-3 transition-all">
          Case study <ArrowRight size={12} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
