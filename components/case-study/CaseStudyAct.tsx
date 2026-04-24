import type { ReactNode } from 'react';

type Props = {
  number: string;
  label: string;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function CaseStudyAct({ number, label, id, className = '', children }: Props) {
  return (
    <section id={id} className={className} style={{ padding: 'clamp(60px, 9vw, 120px) 0' }}>
      <div className="wrap" style={{ maxWidth: 900 }}>
        <p className="mono" style={{ color: 'var(--color-rocket)' }}>
          {number} — {label}
        </p>
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </section>
  );
}

type ProseProps = { children?: ReactNode; text?: string };
export function ActProse({ children, text }: ProseProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        color: 'var(--color-mist)',
        fontSize: 17,
        lineHeight: 1.65,
        maxWidth: '62ch',
      }}
    >
      {text
        ? text.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)
        : children}
    </div>
  );
}
