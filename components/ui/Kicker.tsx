import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Kicker — the small rocket-orange label that sits above H1s.
 * Mirrors the v23 ".lbl .bar" pattern: 64px bar + mono caps text.
 */
export function Kicker({ children, className = '' }: Props) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: 'var(--color-rocket)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 48,
          height: 2,
          background: 'currentColor',
        }}
      />
      <span>{children}</span>
    </span>
  );
}
