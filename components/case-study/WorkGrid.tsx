'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Chip } from '@/components/ui/Chip';
import { WorkCard } from '@/components/case-study/WorkCard';
import type { CaseStudy } from '@/lib/case-studies';
import caseStudiesData from '@/data/case-studies.json';

interface WorkGridProps {
  studies: CaseStudy[];
}

export function WorkGrid({ studies }: WorkGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = (searchParams.get('filter') ?? 'all').toLowerCase();

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return studies;
    return studies.filter((s) => s.tags.some((t) => t.toLowerCase() === activeFilter));
  }, [studies, activeFilter]);

  const flagships = filtered.filter((s) => s.featured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
  const rest = filtered.filter((s) => !s.featured);

  const setFilter = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') params.delete('filter');
    else params.set('filter', id);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {caseStudiesData.filterChips.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            count={c.count}
            active={activeFilter === c.id}
            onClick={() => setFilter(c.id)}
          />
        ))}
      </div>

      {/* Featured */}
      {flagships.length > 0 && (
        <div className="mb-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog mb-4">
            Featured
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {flagships.map((s) => (
              <WorkCard key={s.slug} study={s} size="lg" />
            ))}
          </div>
        </div>
      )}

      {/* All other */}
      {rest.length > 0 && (
        <div>
          {flagships.length > 0 && (
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog mb-4">
              All work
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((s) => (
              <WorkCard key={s.slug} study={s} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-fog">
          <p className="font-display text-3xl text-white">No projects match this filter yet.</p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-6 font-mono text-xs uppercase tracking-wider text-rocket hover:underline"
          >
            Show all 24 →
          </button>
        </div>
      )}
    </>
  );
}
