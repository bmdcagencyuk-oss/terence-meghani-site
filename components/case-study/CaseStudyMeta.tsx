import type { CaseStudy } from '@/lib/case-studies';

export function CaseStudyMeta({ study }: { study: CaseStudy }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Client', value: study.client },
    { label: 'Industry', value: study.industry },
    { label: 'Year', value: String(study.year) },
    { label: 'Services', value: study.services.join(' · ') },
  ];
  if (study.location) {
    rows.splice(2, 0, { label: 'Location', value: study.location });
  }

  return (
    <div className="border-y border-hairline-subtle bg-char-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
              {r.label}
            </div>
            <div className="mt-2 text-sm text-white leading-tight">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
