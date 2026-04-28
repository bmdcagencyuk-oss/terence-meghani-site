/* eslint-disable @next/next/no-img-element */
// Five logos sourced from Wayback during the WP-asset migration. The original
// set also held TEDx, Royal London, and DCD logos which weren't archived;
// re-add those entries when the SVGs are available locally.
const LOGOS = [
  { src: '/legacy/2024/12/bbc.svg',                 alt: 'BBC' },
  { src: '/legacy/2024/12/news-uk-logo-vector.svg', alt: 'News UK' },
  { src: '/legacy/2024/12/nhs.svg',                 alt: 'NHS' },
  { src: '/legacy/2024/12/fireaway-1.svg',          alt: 'Fireaway' },
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
    <div className="ticker" aria-label="Selected clients">
      <div className="ttrack">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}
