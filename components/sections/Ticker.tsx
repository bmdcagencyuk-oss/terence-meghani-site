/* eslint-disable @next/next/no-img-element */
const LOGOS = [
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/bbc.svg',                     alt: 'BBC' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/news-uk-logo-vector.svg',     alt: 'News UK' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/tedx.svg',                    alt: 'TEDx' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/nhs.svg',                     alt: 'NHS' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/royal-london.svg',            alt: 'Royal London' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/fireaway-1.svg',              alt: 'Fireaway' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/dcd-data-center-dynamics.svg', alt: 'DCD' },
  { src: 'https://terencemeghani.com/wp-content/uploads/2024/12/nec_iz789f.svg',              alt: 'NEC' },
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
