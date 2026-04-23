import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  count?: number;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, count, active, href, onClick, className }: ChipProps) {
  const base = cn(
    'inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors',
    'border-2',
    active
      ? 'bg-rocket text-white border-rocket'
      : 'bg-transparent text-mist border-hairline hover:border-white hover:text-white',
    className,
  );

  const content = (
    <>
      <span>{label}</span>
      {typeof count === 'number' && (
        <span className={cn('tabular-nums', active ? 'text-white/80' : 'text-fog')}>
          {count}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={base} aria-pressed={active}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base} aria-pressed={active}>
      {content}
    </button>
  );
}
