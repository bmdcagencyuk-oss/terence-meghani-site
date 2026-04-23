'use client';

import type { CSSProperties } from 'react';

interface FallbackImgProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fallbackText: string;
  fallbackClassName?: string;
}

/**
 * Image with gracefully-degrading text fallback.
 * Shows `fallbackText` (e.g. client initials) in an overlay if the image URL 404s.
 */
export function FallbackImg({
  src,
  alt,
  className,
  style,
  fallbackText,
  fallbackClassName,
}: FallbackImgProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        style={style}
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = 'none';
          const ph = img.nextElementSibling as HTMLElement | null;
          if (ph) ph.style.display = 'flex';
        }}
      />
      <div
        className={
          fallbackClassName ??
          'absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-char to-char-2 border border-hairline-subtle'
        }
        aria-hidden="true"
      >
        <span className="font-display text-5xl text-rocket/70 tracking-tight">
          {fallbackText}
        </span>
      </div>
    </>
  );
}
