import Link from 'next/link';
import type { Plugin, PluginStatus } from '@/lib/plugins';
import { WaitlistButton } from './WaitlistButton';

const CALENDLY = 'https://calendly.com/terencemeghani';

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

type Props = { plugin: Plugin };

const labelMono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

function PrimaryCTA({ plugin }: { plugin: Plugin }) {
  switch (plugin.status) {
    case 'in-production':
      return <WaitlistButton pluginName={plugin.name} label="Join waitlist" />;
    case 'beta':
      return (
        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Book demo
        </a>
      );
    case 'bespoke':
      return (
        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Talk to me
        </a>
      );
    case 'available':
    default:
      return (
        <Link href={plugin.ctaHref || `/plugins/${plugin.slug}/`} className="btn btn-primary">
          {plugin.ctaLabel || 'Install'}
        </Link>
      );
  }
}

export function PluginCard({ plugin }: Props) {
  const tone = STATUS_TONE[plugin.status];
  const detailHref = `/plugins/${plugin.slug}/`;
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        background: 'var(--color-char-2)',
        overflow: 'hidden',
      }}
    >
      {plugin.heroImage && (
        <Link
          href={detailHref}
          aria-label={`${plugin.name} preview — open detail`}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            background: 'var(--color-char)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            display: 'block',
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
        </Link>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px 24px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span
            style={{
              ...labelMono,
              color: tone.fg,
              border: `1px solid ${tone.border}`,
              background: tone.bg,
              padding: '3px 9px',
              borderRadius: 999,
            }}
          >
            {plugin.statusLabel}
          </span>
          <span style={{ ...labelMono, color: 'var(--color-fog)' }}>
            {plugin.price ?? `v${plugin.version}`}
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
            <Link href={detailHref} style={{ color: 'inherit', textDecoration: 'none' }}>
              {plugin.name}
            </Link>
          </h3>
          <p
            style={{
              marginTop: 6,
              fontSize: 15,
              color: '#fff',
              lineHeight: 1.45,
            }}
          >
            {plugin.tagline}
          </p>
          {plugin.whoItsFor && (
            <p
              style={{
                marginTop: 8,
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--color-fog)',
                lineHeight: 1.45,
              }}
            >
              For: {plugin.whoItsFor}
            </p>
          )}
        </div>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <PrimaryCTA plugin={plugin} />
          <Link
            href={detailHref}
            style={{
              ...labelMono,
              color: 'var(--color-rocket)',
              textDecoration: 'none',
              alignSelf: 'flex-start',
            }}
          >
            Docs →
          </Link>
        </div>
      </div>
    </article>
  );
}
