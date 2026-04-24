type Props = {
  size?: number;
  color?: string;
  className?: string;
};

export function Emblem({ size = 48, color, className = '' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: Math.round(size * (340.17 / 435.8)),
        backgroundImage: 'var(--emblem)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        filter: color ? undefined : 'brightness(0) invert(1)',
        backgroundColor: color,
        WebkitMaskImage: color ? 'var(--emblem)' : undefined,
        maskImage: color ? 'var(--emblem)' : undefined,
        WebkitMaskRepeat: color ? 'no-repeat' : undefined,
        maskRepeat: color ? 'no-repeat' : undefined,
        WebkitMaskPosition: color ? 'center' : undefined,
        maskPosition: color ? 'center' : undefined,
        WebkitMaskSize: color ? 'contain' : undefined,
        maskSize: color ? 'contain' : undefined,
      }}
    />
  );
}
