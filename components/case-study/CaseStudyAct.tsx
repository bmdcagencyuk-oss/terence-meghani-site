import { cn } from '@/lib/utils';

interface CaseStudyActProps {
  number: '01' | '02' | '03';
  label: 'Challenge' | 'Approach' | 'Outcome';
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function CaseStudyAct({
  number,
  label,
  title,
  children,
  className,
  id,
}: CaseStudyActProps) {
  return (
    <section id={id} className={cn('section-pad bg-char', className)}>
      <div className="mx-auto max-w-6xl px-6 lg:px-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12">
        <div
          className="font-display text-rocket leading-none"
          style={{ fontSize: 'clamp(4rem, 7vw, 6rem)' }}
          aria-hidden="true"
        >
          ({number})
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
            The {label}
          </div>
          {title && (
            <h2
              className="mt-3 font-display text-white"
              style={{ fontSize: 'var(--text-display-md)' }}
            >
              {title}
            </h2>
          )}
          <div className="mt-6 text-lg leading-relaxed text-mist max-w-[65ch] space-y-5 [&_p]:mt-0">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Splits prose paragraphs (double-newline separated) into <p> elements.
 */
export function ActProse({ text }: { text: string }) {
  const paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}
