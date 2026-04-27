import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Terence Meghani — Built to compound.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SITE = 'https://terencemeghani.com';

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
          backgroundColor: '#242627',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(122,15,255,0.18) 0%, rgba(255,77,23,0.08) 40%, transparent 70%)',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Top: emblem + name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 62,
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF4D17',
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            ★
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: 3,
              color: 'white',
            }}
          >
            TERENCE MEGHANI
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 500,
              color: 'white',
              lineHeight: 1,
              letterSpacing: -4,
              display: 'flex',
            }}
          >
            Built to
          </div>
          <div
            style={{
              fontSize: 124,
              fontWeight: 700,
              color: '#FF4D17',
              lineHeight: 1,
              letterSpacing: -5,
              marginTop: 12,
              display: 'flex',
            }}
          >
            COMPOUND.
          </div>
        </div>

        {/* Bottom-left: tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              width: 80,
              height: 2,
              backgroundColor: 'rgba(255,255,255,0.16)',
              marginBottom: 8,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.75)',
              fontStyle: 'italic',
            }}
          >
            Studio of one — brand, code, growth.
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 3,
              color: 'rgba(255,255,255,0.52)',
              marginTop: 4,
            }}
          >
            HERTFORDSHIRE · LONDON
          </div>
        </div>

        {/* Bottom-right: silverback emblem */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${SITE}/brand/emblem-gorilla.svg`}
          alt=""
          width={102}
          height={80}
          style={{
            position: 'absolute',
            right: 80,
            bottom: 80,
            opacity: 0.92,
            filter: 'grayscale(1)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
