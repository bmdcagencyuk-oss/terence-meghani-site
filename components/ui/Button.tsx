import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaBusy?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-rocket text-white border-2 border-rocket hover:bg-transparent hover:text-rocket transition-colors',
  secondary:
    'bg-transparent text-white border-2 border-hairline hover:border-white transition-colors',
  ghost:
    'bg-transparent text-mist hover:text-white underline underline-offset-4 transition-colors px-0 border-0',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  icon,
  external = false,
  type = 'button',
  disabled,
  ariaBusy,
  className,
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center gap-2 rounded-full font-mono uppercase tracking-wider font-medium whitespace-nowrap',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rocket',
    variant !== 'ghost' && sizeClasses[size],
    variantClasses[variant],
    className,
  );

  const content = (
    <>
      {children}
      {external && <span aria-hidden="true">↗</span>}
      {icon}
    </>
  );

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return href.startsWith('http') || external ? (
      <a href={href} className={base} {...externalProps}>
        {content}
      </a>
    ) : (
      <Link href={href} className={base}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-busy={ariaBusy}
      className={base}
    >
      {content}
    </button>
  );
}
