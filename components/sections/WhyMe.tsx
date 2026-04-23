import { Kicker } from '@/components/ui/Kicker';

const PILLARS = [
  {
    n: '01',
    title: 'First-person throughout.',
    body: 'No account-manager buffer. No junior doing the work. You brief me; I deliver the work.',
  },
  {
    n: '02',
    title: 'Brand + code, in one brain.',
    body: "Most brand consultants hand over to a separate dev shop. Most devs can't think in brand systems. I do both. No translation loss.",
  },
  {
    n: '03',
    title: 'Outcomes over outputs.',
    body: "Every brief starts with commercial outcomes. Every deliverable ties back to them. No beautiful work that doesn't earn its keep.",
  },
  {
    n: '04',
    title: 'Built to be handed over.',
    body: "Source files, clean code, documented decisions. When the engagement ends, your team can run with what I've built.",
  },
];

export function WhyMe() {
  return (
    <section className="section-pad bg-char">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Kicker>Why work with me</Kicker>
        <h2
          className="mt-6 font-display text-white max-w-4xl"
          style={{ fontSize: 'var(--text-display-lg)' }}
        >
          What you get that you{' '}
          <em className="font-italic italic text-rocket">
            won&rsquo;t get somewhere else.
          </em>
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((p) => (
            <div
              key={p.n}
              className="border-l-2 border-rocket pl-6 md:pl-8"
            >
              <span className="font-mono text-xs text-rocket tracking-[0.2em]">{p.n}.</span>
              <h3
                className="mt-2 font-display text-white"
                style={{ fontSize: 'var(--text-display-sm)' }}
              >
                {p.title}
              </h3>
              <p className="mt-3 text-mist text-lg leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
