import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Terence Meghani — Give your brand fuel.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
        }}
      >
        {/* Top: emblem + name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Simple emblem representation */}
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
            Give your brand
          </div>
          <div
            style={{
              fontSize: 92,
              fontStyle: 'italic',
              color: '#FF4D17',
              lineHeight: 1,
              letterSpacing: -4,
              marginTop: 8,
              display: 'flex',
            }}
          >
            fuel.
          </div>
        </div>

        {/* Bottom */}
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
            Brand consultant &amp; developer
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
      </div>
    ),
    { ...size },
  );
}
