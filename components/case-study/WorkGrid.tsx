import type { CaseStudy } from '@/lib/case-studies';
import { WorkCard } from './WorkCard';

type Props = { studies: CaseStudy[] };

export function WorkGrid({ studies }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
      }}
    >
      {studies.map((s) => (
        <WorkCard key={s.slug} study={s} />
      ))}
    </div>
  );
}
