/* eslint-disable @next/next/no-img-element */
import { Kicker } from '@/components/ui/Kicker';

type Props = {
  images: string[];
  alt: string;
};

/**
 * Image gallery for a case-study detail page.
 * Renders the full reel minus the first image (already used as the hero).
 * First image in each "row" after the lead spans full-width; the rest tile
 * in a dense auto-fill grid so portrait + landscape crops coexist cleanly.
 */
export function CaseStudyGallery({ images, alt }: Props) {
  const rest = images.slice(1);
  if (rest.length === 0) return null;

  // First trailing image is the feature — full-width, taller.
  const [feature, ...tiles] = rest;

  return (
    <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
      <div className="wrap">
        <Kicker>Gallery</Kicker>
        <h2
          style={{
            marginTop: 14,
            fontFamily: 'var(--font-display)',
            fontVariationSettings: '"wdth" 100, "opsz" 72',
            fontWeight: 500,
            fontSize: 'var(--text-display-md)',
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          Selected{' '}
          <em
            style={{
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              color: 'var(--color-rocket)',
              fontWeight: 400,
            }}
          >
            frames.
          </em>
        </h2>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {feature && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                background: 'var(--color-char-3)',
                border: '1px solid var(--color-hairline-2)',
                overflow: 'hidden',
              }}
            >
              <img
                src={feature}
                alt={alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          )}

          {tiles.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {tiles.map((src, i) => (
                <div
                  key={src + i}
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 5',
                    background: 'var(--color-char-3)',
                    border: '1px solid var(--color-hairline-2)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
