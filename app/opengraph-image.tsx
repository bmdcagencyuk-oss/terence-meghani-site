import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const runtime = 'edge';
export const alt = SITE.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default OG card. Renders the studio's tagline + wordmark + gorilla emblem
 * on a dark plinth, used by every page that doesn't override at the route
 * level.
 */
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: SITE.themeColor,
          backgroundImage:
            'radial-gradient(circle at 22% 18%, rgba(122,15,255,0.18) 0%, rgba(255,77,23,0.10) 38%, transparent 70%)',
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Top-left: small wordmark */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 6,
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          TERENCE MEGHANI
        </div>

        {/* Centre: page title (large) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 0.95,
              letterSpacing: -4,
              maxWidth: 940,
            }}
          >
            Studio of one — brand, code, growth.
          </div>
        </div>

        {/* Bottom-left: italic strap (small caps) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              width: 72,
              height: 2,
              backgroundColor: 'rgba(255,255,255,0.18)',
              marginBottom: 6,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.78)',
              textTransform: 'lowercase',
              letterSpacing: 1,
            }}
          >
            Built to compound.
          </div>
        </div>

        {/* Bottom-right: gorilla emblem (white silhouette) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${SITE.url}/brand/emblem-gorilla.svg`}
          alt=""
          width={102}
          height={80}
          style={{
            position: 'absolute',
            right: 80,
            bottom: 70,
            opacity: 0.95,
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
