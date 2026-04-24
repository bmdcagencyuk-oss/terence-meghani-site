import type { ReactNode } from 'react';

type Props = {
  number: string;
  label: string;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Case-study act. Editorial 2-col split — giant outlined stage number + title
 * on the left (sticky), prose on the right. Alternating background is
 * controlled by passing `className="bg-char-2"` (adds `.alt`).
 */
export function CaseStudyAct({ number, label, id, className = '', children }: Props) {
  const alt = className.includes('bg-char-2');
  const classes = ['cs-act', alt ? 'alt' : '', className].filter(Boolean).join(' ');
  return (
    <section id={id} className={classes}>
      <div className="wrap">
        <header className="head">
          <span className="stage" aria-hidden="true">{number}</span>
          <span className="num">Stage {number} of 03</span>
          <h2>
            The <em>{label.toLowerCase()}.</em>
          </h2>
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}

type ProseProps = { children?: ReactNode; text?: string };
export function ActProse({ children, text }: ProseProps) {
  return (
    <div className="prose">
      {text
        ? text.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)
        : children}
    </div>
  );
}
