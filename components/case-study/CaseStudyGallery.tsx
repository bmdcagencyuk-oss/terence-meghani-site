/* eslint-disable @next/next/no-img-element */
import { Kicker } from '@/components/ui/Kicker';

type Props = {
  images: string[];
  alt: string;
};

/**
 * Rhythmic gallery — 12-col grid with a repeating 6/6/12/4/4/4 span pattern so
 * landscape and portrait crops coexist without guessing intrinsic dimensions.
 * The first image in the array belongs to the hero; we slice it off here.
 *
 *    row 1   [   A (6)   ][   B (6)   ]
 *    row 2   [          C (12)        ]
 *    row 3   [ D (4) ][ E (4) ][ F (4) ]
 *
 * Repeat for every 5 trailing frames. Items auto-fill remaining tracks, and
 * fall back to a single-column stack below 720px.
 */
function spanFor(i: number): { gridColumn: string; aspectRatio: string } {
  const r = i % 5;
  if (r === 0) return { gridColumn: 'span 6', aspectRatio: '4 / 3' };
  if (r === 1) return { gridColumn: 'span 6', aspectRatio: '4 / 3' };
  if (r === 2) return { gridColumn: 'span 12', aspectRatio: '16 / 7' };
  return { gridColumn: 'span 4', aspectRatio: '4 / 5' };
}

export function CaseStudyGallery({ images, alt }: Props) {
  const rest = images.slice(1);
  if (rest.length === 0) return null;

  return (
    <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
      <div className="wrap">
        <Kicker>Selected frames</Kicker>
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
          From the{' '}
          <em
            style={{
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              color: 'var(--color-rocket)',
              fontWeight: 400,
            }}
          >
            project.
          </em>
        </h2>

        <div
          className="cs-gallery-grid"
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 16,
          }}
        >
          {rest.map((src, i) => {
            const span = spanFor(i);
            return (
              <figure
                key={src + i}
                style={{
                  gridColumn: span.gridColumn,
                  aspectRatio: span.aspectRatio,
                  margin: 0,
                  background: 'var(--color-char-3)',
                  border: '1px solid var(--color-hairline-2)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={src}
                  alt={i === 0 ? alt : ''}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
