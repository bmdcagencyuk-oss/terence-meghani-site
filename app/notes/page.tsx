import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import {
  getAllNotes,
  getAllTags,
  formatNoteDate,
  type Note,
  type NoteTag,
} from '@/lib/notes';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';

const NOTES_TITLE = 'Notes — Terence Meghani · Brand & WordPress engineering';
const NOTES_DESCRIPTION =
  'Field notes on brand, WordPress engineering, AI, and operations. From a Hertfordshire studio shipping for News UK, Royal London, NHS, and others.';

export const metadata: Metadata = {
  title: { absolute: NOTES_TITLE },
  description: NOTES_DESCRIPTION,
  alternates: { canonical: '/notes/' },
  openGraph: {
    title: NOTES_TITLE,
    description: NOTES_DESCRIPTION,
    url: '/notes/',
    type: 'website',
  },
  twitter: {
    title: NOTES_TITLE,
    description: NOTES_DESCRIPTION,
  },
};

const NOTES_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Notes', href: '/notes/' },
]);

const labelMono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

function TagPill({ tag }: { tag: NoteTag }) {
  return (
    <Link
      href={`/notes/?tag=${tag}`}
      style={{
        ...labelMono,
        color: 'var(--color-rocket)',
        textDecoration: 'none',
        border: '1px solid rgba(255,77,23,0.35)',
        background: 'rgba(255,77,23,0.06)',
        padding: '3px 9px',
        borderRadius: 999,
      }}
    >
      {tag}
    </Link>
  );
}

function NoteCard({ note }: { note: Note }) {
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
        transition: 'border-color 0.2s, transform 0.2s',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '24px 26px 26px',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ ...labelMono, color: 'var(--color-fog)' }}>
            {formatNoteDate(note.date)}
          </span>
          <span style={{ ...labelMono, color: 'var(--color-fog)' }}>
            {note.readingTime} min read
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {note.tags.map((t) => (
            <TagPill key={t} tag={t} />
          ))}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontVariationSettings: '"wdth" 90, "opsz" 72',
            fontWeight: 500,
            fontSize: 24,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: '#fff',
            margin: 0,
          }}
        >
          <Link
            href={`/notes/${note.slug}/`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {note.title}
          </Link>
        </h3>

        <p style={{ color: 'var(--color-mist)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          {note.excerpt}
        </p>

        <Link
          href={`/notes/${note.slug}/`}
          style={{
            ...labelMono,
            color: 'var(--color-rocket)',
            textDecoration: 'none',
            marginTop: 'auto',
            paddingTop: 12,
            alignSelf: 'flex-start',
          }}
        >
          Read note →
        </Link>
      </div>
    </article>
  );
}

export default function NotesIndexPage() {
  const notes = getAllNotes();
  const tags = getAllTags();
  const count = notes.length;

  return (
    <>
      <script {...ldJsonProps(NOTES_BREADCRUMBS)} />

      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>Notes</li>
            </ol>
          </nav>

          <div style={{ marginTop: 32 }}>
            <div className="kicker-row">
              <Kicker>Notes · {count} published</Kicker>
            </div>
            <h1>
              Field notes from <em>the studio.</em>
            </h1>
            <p
              style={{
                marginTop: 18,
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 1.8vw, 26px)',
                lineHeight: 1.35,
                color: 'var(--color-mist)',
                maxWidth: '52ch',
              }}
            >
              Working notes on brand, engineering, and the messy intersection
              between them.
            </p>
            <hr className="hero-rule" aria-hidden="true" />

            {tags.length > 0 && (
              <nav
                aria-label="Filter notes by tag"
                style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8 }}
              >
                <Link
                  href="/notes/"
                  style={{
                    ...labelMono,
                    color: 'var(--color-fog)',
                    textDecoration: 'none',
                    border: '1px solid var(--color-hairline)',
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  All
                </Link>
                {tags.map((t) => (
                  <Link
                    key={t}
                    href={`/notes/?tag=${t}`}
                    style={{
                      ...labelMono,
                      color: 'var(--color-fog)',
                      textDecoration: 'none',
                      border: '1px solid var(--color-hairline)',
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {t}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          {count === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 1.5vw, 22px)',
                lineHeight: 1.5,
                color: 'var(--color-fog)',
                maxWidth: '52ch',
              }}
            >
              Notes coming soon — first posts publishing end of May 2026.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {notes.map((n) => (
                <NoteCard key={n.slug} note={n} />
              ))}
            </div>
          )}
        </div>
      </section>

      <LaunchCTA
        title="Want to talk?"
        body="Thirty-minute call, no slides, no fluff. The studio reads every enquiry personally."
      />
    </>
  );
}
