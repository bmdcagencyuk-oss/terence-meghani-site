'use client';

import { usePathname, useRouter } from 'next/navigation';
import { PRACTICE_FILTERS } from '@/lib/practice-filters';
import type { CaseStudy } from '@/lib/case-studies';
import { WorkCard } from './WorkCard';

type Props = {
  /** Studies already filtered server-side. */
  studies: CaseStudy[];
  /** Active practice id; one of PRACTICE_FILTERS ids. */
  active: string;
  /** Per-bucket counts over the full unfiltered set. */
  counts: Record<string, number>;
};

export function WorkGrid({ studies, active, counts }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const onSelect = (id: string) => {
    if (id === active) return;
    const url = id === 'all' ? pathname : `${pathname}?practice=${id}`;
    router.push(url, { scroll: false });
  };

  return (
    <>
      <div className="chip-row" role="tablist" aria-label="Filter projects by practice">
        {PRACTICE_FILTERS.map((p) => {
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`chip${isActive ? ' active' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              {p.label} <span className="count">{counts[p.id] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}
      >
        {studies.map((s) => (
          <WorkCard key={s.slug} study={s} />
        ))}
      </div>

      {studies.length === 0 && (
        <p style={{ marginTop: 48, color: 'var(--color-mist)' }}>
          No projects match that filter.
        </p>
      )}
    </>
  );
}
