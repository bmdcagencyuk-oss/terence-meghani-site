'use client';

import { useMemo, useState } from 'react';
import type { CaseStudy } from '@/lib/case-studies';
import { WorkCard } from './WorkCard';

type Chip = { id: string; label: string; count: number };

type Props = {
  studies: CaseStudy[];
  chips?: Chip[];
};

const DEFAULT_CHIPS: Chip[] = [
  { id: 'all',         label: 'All',         count: 0 },
  { id: 'brand',       label: 'Brand',       count: 0 },
  { id: 'web',         label: 'Web',         count: 0 },
  { id: 'marketing',   label: 'Marketing',   count: 0 },
  { id: 'photography', label: 'Photography', count: 0 },
];

export function WorkGrid({ studies, chips }: Props) {
  const [active, setActive] = useState<string>('all');

  // Derive chip counts from the actual data if they weren't passed in.
  const resolvedChips = useMemo<Chip[]>(() => {
    if (chips && chips.length) return chips;
    const base = DEFAULT_CHIPS.map((c) => ({ ...c }));
    base[0].count = studies.length;
    for (let i = 1; i < base.length; i++) {
      const label = base[i].label.toLowerCase();
      base[i].count = studies.filter((s) =>
        s.tags.some((t) => t.toLowerCase() === label),
      ).length;
    }
    return base;
  }, [chips, studies]);

  const filtered = useMemo(() => {
    if (active === 'all') return studies;
    const label = active.toLowerCase();
    return studies.filter((s) =>
      s.tags.some((t) => t.toLowerCase() === label),
    );
  }, [studies, active]);

  return (
    <>
      <div className="chip-row" role="tablist" aria-label="Filter projects by discipline">
        {resolvedChips.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={`chip${active === c.id ? ' active' : ''}`}
            onClick={() => setActive(c.id)}
          >
            {c.label} <span className="count">{c.count}</span>
          </button>
        ))}
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
