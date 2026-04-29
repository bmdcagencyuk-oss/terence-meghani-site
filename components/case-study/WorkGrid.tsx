'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PRACTICE_FILTERS, filterByPractice } from '@/lib/practice-filters';
import type { CaseStudy } from '@/lib/case-studies';
import { WorkCard } from './WorkCard';

type Chip = { id: string; label: string; count: number };

type Props = {
  studies: CaseStudy[];
  chips?: Chip[];
};

const VALID_IDS = new Set(PRACTICE_FILTERS.map((p) => p.id));

export function WorkGrid({ studies, chips }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPractice = searchParams.get('practice') ?? 'all';
  const active = VALID_IDS.has(rawPractice) ? rawPractice : 'all';

  const counts = useMemo<Record<string, number>>(() => {
    if (chips && chips.length) {
      return Object.fromEntries(chips.map((c) => [c.id, c.count]));
    }
    return Object.fromEntries(
      PRACTICE_FILTERS.map((p) => [p.id, filterByPractice(studies, p.id).length]),
    );
  }, [chips, studies]);

  const filtered = useMemo(() => filterByPractice(studies, active), [studies, active]);

  const onSelect = (id: string) => {
    if (id === active) return;
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') params.delete('practice');
    else params.set('practice', id);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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
        {filtered.map((s) => (
          <WorkCard key={s.slug} study={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ marginTop: 48, color: 'var(--color-mist)' }}>
          No projects match that filter.
        </p>
      )}
    </>
  );
}
