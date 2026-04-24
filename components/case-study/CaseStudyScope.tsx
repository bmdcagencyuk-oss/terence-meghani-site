import type { CaseStudy } from '@/lib/case-studies';

type Props = { study: CaseStudy };

/**
 * Scope summary panel — rendered inside the Outcome act so even a short
 * outcome paragraph still carries visual weight. Shows services as chips
 * plus a small key/value rail (industry, year, location if present).
 */
export function CaseStudyScope({ study }: Props) {
  return (
    <aside
      style={{
        marginTop: 36,
        padding: '28px 32px',
        background: 'var(--color-char-3)',
        border: '1px solid var(--color-hairline-2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
      aria-label="What was delivered"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-fog)',
          }}
        >
          Scope
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-rocket)',
          }}
        >
          {study.year}
        </span>
      </div>

      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {study.services.map((s) => (
          <li
            key={s}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--color-hairline-2)',
              color: '#fff',
            }}
          >
            {s}
          </li>
        ))}
      </ul>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 20,
          paddingTop: 18,
          borderTop: '1px solid var(--color-hairline-2)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-fog)',
            }}
          >
            Industry
          </span>
          <div style={{ marginTop: 6, color: '#fff', fontSize: 14.5, lineHeight: 1.4 }}>
            {study.industry}
          </div>
        </div>
        {study.location && (
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-fog)',
              }}
            >
              Location
            </span>
            <div style={{ marginTop: 6, color: '#fff', fontSize: 14.5, lineHeight: 1.4 }}>
              {study.location}
            </div>
          </div>
        )}
        {study.market && (
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-fog)',
              }}
            >
              Market
            </span>
            <div style={{ marginTop: 6, color: '#fff', fontSize: 14.5, lineHeight: 1.4 }}>
              {study.market}
            </div>
          </div>
        )}
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-fog)',
            }}
          >
            Tags
          </span>
          <div style={{ marginTop: 6, color: '#fff', fontSize: 14.5, lineHeight: 1.4 }}>
            {study.tags.join(' · ')}
          </div>
        </div>
      </div>
    </aside>
  );
}
