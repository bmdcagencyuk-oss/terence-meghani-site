import Link from 'next/link';
import type { Plugin, PluginStatus } from '@/lib/plugins';

const STATUS_TONE: Record<PluginStatus, { fg: string; bg: string; border: string }> = {
  available: {
    fg: 'var(--color-rocket)',
    bg: 'rgba(255, 77, 23, 0.08)',
    border: 'rgba(255, 77, 23, 0.45)',
  },
  'in-production': {
    fg: '#FFB800',
    bg: 'rgba(255, 184, 0, 0.06)',
    border: 'rgba(255, 184, 0, 0.35)',
  },
  beta: {
    fg: '#00E1FF',
    bg: 'rgba(0, 225, 255, 0.06)',
    border: 'rgba(0, 225, 255, 0.35)',
  },
  bespoke: {
    fg: 'var(--color-fog)',
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.18)',
  },
};

type Props = { plugin: Plugin; index?: number };

export function PluginCard({ plugin, index }: Props) {
  const tone = STATUS_TONE[plugin.status];
  return (
    <Link
      href={`/plugins/${plugin.slug}/`}
      className="plugin-card"
      data-cursor="link"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        background: 'var(--color-char-2)',
        color: 'inherit',
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s, background 0.2s',
      }}
    >
      {plugin.heroImage && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            background: 'var(--color-char)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plugin.heroImage}
            alt={plugin.heroImageAlt ?? `${plugin.name} preview`}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '24px 26px 26px',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-rocket)',
            }}
          >
            {typeof index === 'number' ? `P / ${String(index + 1).padStart(2, '0')} · ` : ''}
            {plugin.vertical}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: tone.fg,
              border: `1px solid ${tone.border}`,
              background: tone.bg,
              padding: '2px 8px',
              borderRadius: 999,
            }}
          >
            {plugin.statusLabel}
          </span>
        </div>

        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontVariationSettings: '"wdth" 85, "opsz" 72',
              fontWeight: 600,
              fontSize: 24,
              color: '#fff',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}
          >
            {plugin.name}
          </h3>
          <p
            style={{
              marginTop: 8,
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              fontSize: 16,
              color: 'var(--color-fog)',
              lineHeight: 1.45,
            }}
          >
            {plugin.tagline}
          </p>
        </div>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fog)', letterSpacing: '0.06em' }}>
            v{plugin.version}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-rocket)',
            }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
