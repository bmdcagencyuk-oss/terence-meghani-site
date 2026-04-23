import { cn } from '@/lib/utils';

interface KickerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Kicker({ children, className, as = 'p' }: KickerProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'font-mono text-[11px] uppercase tracking-[0.18em] text-fog',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
