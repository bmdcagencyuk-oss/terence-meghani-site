/* eslint-disable @next/next/no-img-element */
import { Kicker } from '@/components/ui/Kicker';

type Props = {
  images: string[];
  alt: string;
};

/**
 * Masonry gallery using CSS `columns`. Every image retains its native aspect
 * ratio — no cropping, no "guess the span" rhythmic grid. Columns collapse
 * 3 → 2 → 1 at 960px and 640px via globals.css.
 */
export function CaseStudyGallery({ images, alt }: Props) {
  const rest = images.slice(1); // first image already rendered in the hero
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

        <div className="cs-masonry" style={{ marginTop: 40 }}>
          {rest.map((src, i) => (
            <figure key={src + i} className="cs-masonry-item">
              <img
                src={src}
                alt={i === 0 ? alt : ''}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  background: 'var(--color-char-3)',
                }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
