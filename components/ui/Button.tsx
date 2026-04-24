import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
  className?: string;
};

type AsLinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; as?: 'a' };
type AsButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; as?: 'button' };

type Props = AsLinkProps | AsButtonProps;

function styleFor(variant: Variant): string {
  switch (variant) {
    case 'secondary':
      return 'btn btn-secondary';
    case 'ghost':
      return 'btn btn-ghost';
    default:
      return 'btn btn-primary';
  }
}

export function Button(props: Props) {
  // Extract CommonProps from the union; the rest spreads onto the element.
  const {
    variant = 'primary',
    size,
    external,
    className = '',
    children,
    ...rest
  } = props as CommonProps & { href?: string } & Record<string, unknown>;
  void size;
  const classes = `${styleFor(variant)} ${className}`.trim();

  if ('href' in rest && rest.href) {
    const aProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    const externalProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' as const }
      : {};
    return (
      <a {...aProps} {...externalProps} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {children}
    </button>
  );
}
