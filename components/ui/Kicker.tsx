import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Kicker({ children, className = '' }: Props) {
  return (
    <span className={`kicker ${className}`.trim()}>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 16,
          height: 2,
          background: 'var(--color-rocket)',
          verticalAlign: 'middle',
          marginRight: 10,
        }}
      />
      {children}
    </span>
  );
}
