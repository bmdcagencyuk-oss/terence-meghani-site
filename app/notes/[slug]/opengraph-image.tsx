import { ImageResponse } from 'next/og';
import { getAllNotes, getNoteBySlug } from '@/lib/notes';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Notes — Terence Meghani Studio';

export function generateImageMetadata() {
  return getAllNotes().map((n) => ({ id: n.slug, alt: n.title, contentType, size }));
}

export function generateStaticParams() {
  return getAllNotes().map((n) => ({ slug: n.slug }));
}

export default async function NoteOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  const title = note?.title ?? 'Notes';

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
            'radial-gradient(circle at 18% 20%, rgba(255,77,23,0.22) 0%, rgba(122,15,255,0.10) 40%, transparent 72%)',
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 6,
            color: 'rgba(255,255,255,0.78)',
            textTransform: 'uppercase',
          }}
        >
          Notes · Terence Meghani Studio
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              width: 80,
              height: 4,
              backgroundColor: '#FF4D17',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 78,
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer wordmark */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 20,
          }}
        >
          <div style={{ display: 'flex', letterSpacing: 4, fontWeight: 600 }}>
            TERENCEMEGHANI.COM
          </div>
          <div
            style={{
              display: 'flex',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Built to compound.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
