import Link from 'next/link';
import { Palette, Sparkles, Puzzle, Code, TrendingUp, Search, Gem, ArrowRight, type LucideIcon } from 'lucide-react';
import servicesData from '@/data/services.json';
import { Kicker } from '@/components/ui/Kicker';

const iconMap: Record<string, LucideIcon> = {
  Palette, Sparkles, Puzzle, Code, TrendingUp, Search, Gem,
};

export function ServicesGrid() {
  const core = servicesData.services.filter((s) => s.tier === 'core');
  const secondary = servicesData.services.filter((s) => s.tier === 'secondary');

  return (
    <section id="services" className="section-pad bg-char">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Kicker>What I do</Kicker>
        <h2
          className="mt-6 font-display text-white"
          style={{ fontSize: 'var(--text-display-lg)' }}
        >
          Four practices,{' '}
          <em className="font-italic italic text-rocket">one studio.</em>
        </h2>

        {/* Core 2x2 grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline-subtle border border-hairline-subtle rounded-2xl overflow-hidden">
          {core.map((s) => {
            const Icon = iconMap[s.icon] ?? Palette;
            return (
              <Link
                key={s.slug}
                href={s.url}
                className="relative bg-char-2 p-8 md:p-12 hover:bg-char transition-colors group"
              >
                <Icon
                  size={28}
                  className="text-rocket mb-6"
                  aria-hidden="true"
                  strokeWidth={1.6}
                />
                <h3
                  className="font-display text-white mb-3"
                  style={{ fontSize: 'var(--text-display-sm)' }}
                >
                  {s.label}
                </h3>
                <p className="text-mist mb-6 max-w-md">{s.shortDescription}</p>
                <span className="inline-flex items-center gap-2 text-rocket font-mono text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Also offering strip */}
        <div className="mt-12 border-t border-hairline-subtle pt-8">
          <Kicker className="text-fog">Also offering</Kicker>
          <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            {secondary.map((s, i) => {
              const Icon = iconMap[s.icon] ?? Gem;
              return (
                <li key={s.slug} className="flex items-center gap-2">
                  <Link
                    href={s.url}
                    className="inline-flex items-center gap-2 text-white hover:text-rocket transition-colors"
                  >
                    <Icon size={16} aria-hidden="true" strokeWidth={1.6} />
                    <span className="font-display text-lg">{s.label}</span>
                  </Link>
                  {i < secondary.length - 1 && (
                    <span aria-hidden="true" className="text-fog">·</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
