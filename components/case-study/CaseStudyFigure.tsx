import Image from 'next/image';
import type { ReactNode } from 'react';

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: ReactNode;
  /** Set on the hero/lead figure only. */
  priority?: boolean;
  /** Optional — when paired side-by-side, the wrapper supplies the aspect. */
  className?: string;
  sizes?: string;
};

/**
 * Single figure with caption — full-bleed within the content grid, rounded
 * corners, subtle shadow. Lazy-loaded via next/image except when priority is set.
 */
export function CaseStudyFigure({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
  className = '',
  sizes = '(max-width: 1024px) 100vw, 1100px',
}: FigureProps) {
  return (
    <figure className={`cs-figure ${className}`}>
      <div className="cs-figure-frame">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      <figcaption className="cs-figure-caption">{caption}</figcaption>
    </figure>
  );
}

type PairProps = {
  left: Omit<FigureProps, 'className' | 'sizes'>;
  right: Omit<FigureProps, 'className' | 'sizes'>;
  /** "default" — both same width; "mobile-pair" — narrower frames for portrait shots. */
  variant?: 'default' | 'mobile-pair';
};

/**
 * Side-by-side pair on viewports ≥ 1024px; stacks on smaller viewports.
 * Each half retains its own aspect-ratio frame so mobile screenshots
 * paired with desktop ones don't get stretched.
 */
export function CaseStudyFigurePair({ left, right, variant = 'default' }: PairProps) {
  const sizes =
    variant === 'mobile-pair'
      ? '(max-width: 1024px) 90vw, 380px'
      : '(max-width: 1024px) 100vw, 540px';

  return (
    <div className={`cs-figure-pair cs-figure-pair--${variant}`}>
      <CaseStudyFigure {...left} sizes={sizes} className="cs-figure--pair-half" />
      <CaseStudyFigure {...right} sizes={sizes} className="cs-figure--pair-half" />
    </div>
  );
}
