import { Kicker } from '@/components/ui/Kicker';

type Props = { videos: string[]; client: string };

/**
 * Autoplaying muted video reel — matches the live site's WebM/MP4 loops.
 * Hosted videos (webm / mp4 / mov) play inline, muted, looped, and lazy-loaded.
 * Single video: full-width. Multiple: 2-up responsive grid.
 */
export function CaseStudyVideos({ videos, client }: Props) {
  if (!videos.length) return null;
  const single = videos.length === 1;

  return (
    <section className="section-pad" style={{ background: 'var(--color-char)' }}>
      <div className="wrap">
        <Kicker>In motion</Kicker>
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
          Rolling{' '}
          <em
            style={{
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              color: 'var(--color-rocket)',
              fontWeight: 400,
            }}
          >
            footage.
          </em>
        </h2>

        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: single
              ? '1fr'
              : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {videos.map((src, i) => (
            <figure
              key={src + i}
              style={{
                margin: 0,
                aspectRatio: single ? '16 / 9' : '3 / 4',
                background: 'var(--color-char-3)',
                border: '1px solid var(--color-hairline-2)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <video
                src={src}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-label={`${client} — project video ${i + 1} of ${videos.length}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
