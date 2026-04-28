/* eslint-disable @next/next/no-img-element */
// Eight client logos in deliberate visual-weight order:
// heavy · heavy · type-only · heavy · heavy · heavy · type-only · heavy.
// TEDx, Royal London and DCD wordmarks live under /clients/ as type-only
// stand-ins (the original brand SVGs weren't recoverable from Wayback).
const LOGOS = [
  { src: '/legacy/2024/12/bbc.svg',                 alt: 'BBC' },
  { src: '/legacy/2024/12/news-uk-logo-vector.svg', alt: 'News UK' },
  { src: '/clients/tedx.svg',                       alt: 'TEDx' },
  { src: '/legacy/2024/12/nhs.svg',                 alt: 'NHS' },
  { src: '/clients/royal-london.svg',               alt: 'Royal London' },
  { src: '/legacy/2024/12/fireaway-1.svg',          alt: 'Fireaway' },
  { src: '/clients/dcd.svg',                        alt: 'DCD' },
  { src: '/legacy/2024/12/nec_iz789f.svg',          alt: 'NEC' },
];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="item" aria-hidden={ariaHidden || undefined}>
      {LOGOS.map((logo, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 36 }}>
          <img
            className="logo"
            src={logo.src}
            alt={ariaHidden ? '' : logo.alt}
            loading="lazy"
          />
          <span className="dot" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <div className="ticker-wrap" aria-label="Selected clients">
      <div className="ticker">
        <div className="ttrack">
          {/* Four copies — first two compose the loop unit, second two
              satisfy the translateX(-50%) cycle on wide viewports. */}
          <Row />
          <Row ariaHidden />
          <Row ariaHidden />
          <Row ariaHidden />
        </div>
      </div>
    </div>
  );
}
