import type { ReactNode } from 'react';

type Props = {
  number: string;
  label: string;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function CaseStudyAct({ number, label, id, className = '', children }: Props) {
  const classes = `cs-act ${className.includes('bg-char-2') ? 'alt' : ''} ${className}`.trim();
  return (
    <section id={id} className={classes}>
      <div className="wrap">
        <span className="num">{number} — {label}</span>
        <h2>
          The <em>{label.toLowerCase()}.</em>
        </h2>
        <div style={{ marginTop: 0 }}>{children}</div>
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
