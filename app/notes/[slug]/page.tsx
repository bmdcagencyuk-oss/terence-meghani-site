import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import {
  getAllNotes,
  getNoteBySlug,
  getNotesByTag,
  getRecentNotes,
  formatNoteDate,
  formatNoteDateLong,
  type Note,
  type NoteTag,
} from '@/lib/notes';
import {
  articleSchema,
  breadcrumbSchema,
  ldJsonProps,
} from '@/lib/schema';

export function generateStaticParams() {
  return getAllNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: 'Not found' };
  const title = `${note.title} — Notes · Terence Meghani`;
  const description = note.excerpt;
  const url = `/notes/${note.slug}/`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: note.heroImage ? [{ url: note.heroImage, alt: note.heroImageAlt }] : undefined,
    },
    twitter: {
      title,
      description,
    },
  };
}

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

function ReadNextCard({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.slug}/`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '20px 22px',
        background: 'var(--color-char-2)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <span style={{ ...labelMono, color: 'var(--color-fog)' }}>
        {formatNoteDate(note.date)} · {note.readingTime} min
      </span>
      <h4
        style={{
          fontFamily: 'var(--font-display)',
          fontVariationSettings: '"wdth" 90, "opsz" 72',
          fontWeight: 500,
          fontSize: 18,
          lineHeight: 1.3,
          color: '#fff',
          margin: 0,
        }}
      >
        {note.title}
      </h4>
      <p
        style={{
          color: 'var(--color-mist)',
          fontSize: 14,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {note.excerpt}
      </p>
    </Link>
  );
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const primaryTag = note.tags[0];

  // Read-next: three other notes from the same primary tag, falling back to
  // recent notes if there aren't enough siblings in the tag bucket.
  const tagPool = primaryTag
    ? getNotesByTag(primaryTag).filter((n) => n.slug !== note.slug)
    : [];
  const fallback = getRecentNotes(8).filter(
    (n) => n.slug !== note.slug && !tagPool.some((t) => t.slug === n.slug),
  );
  const readNext = [...tagPool, ...fallback].slice(0, 3);

  return (
    <>
      <script {...ldJsonProps(articleSchema(note))} />
      <script
        {...ldJsonProps(
          breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Notes', href: '/notes/' },
            ...(primaryTag
              ? [{ name: primaryTag, href: `/notes/?tag=${primaryTag}` }]
              : []),
            { name: note.title, href: `/notes/${note.slug}/` },
          ]),
        )}
      />

      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href="/notes/">Notes</Link>
              </li>
              {primaryTag && (
                <>
                  <li aria-hidden="true">›</li>
                  <li>
                    <Link href={`/notes/?tag=${primaryTag}`}>{primaryTag}</Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>{note.title}</li>
            </ol>
          </nav>

          <div style={{ marginTop: 32 }}>
            <div className="kicker-row">
              <Kicker>
                {formatNoteDate(note.date)} · {note.readingTime} min read
              </Kicker>
            </div>
            <h1>{note.title}</h1>
            <p
              style={{
                marginTop: 18,
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 1.8vw, 26px)',
                lineHeight: 1.4,
                color: 'var(--color-mist)',
                maxWidth: '60ch',
              }}
            >
              {note.excerpt}
            </p>
            <hr className="hero-rule" aria-hidden="true" />

            <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {note.tags.map((t) => (
                <TagPill key={t} tag={t} />
              ))}
            </div>

            {note.heroImage && (
              <figure
                style={{
                  margin: '36px 0 0',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--color-char)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={note.heroImage}
                  alt={note.heroImageAlt}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </figure>
            )}
          </div>
        </div>
      </section>

      <article className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="prose-note">
            <MDXRemote source={note.body} />
          </div>

          <footer
            style={{
              marginTop: 56,
              paddingTop: 24,
              borderTop: '1px solid var(--color-hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <p style={{ ...labelMono, color: 'var(--color-fog)', margin: 0 }}>
              {note.author} · Published {formatNoteDateLong(note.date)}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ ...labelMono, color: 'var(--color-fog)' }}>Tagged in:</span>
              {note.tags.map((t) => (
                <TagPill key={t} tag={t} />
              ))}
            </div>
          </footer>
        </div>
      </article>

      {readNext.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--color-char)' }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow">
                  <Kicker>Read next</Kicker>
                </span>
                <h2>
                  More <em>from the studio.</em>
                </h2>
              </div>
              <Link
                href="/notes/"
                className="sec-aside"
                style={{ color: 'var(--color-rocket)' }}
              >
                All notes →
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              {readNext.map((n) => (
                <ReadNextCard key={n.slug} note={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      <LaunchCTA
        title="Want to talk?"
        body="Thirty-minute call, no slides, no fluff. The studio reads every enquiry personally."
      />
    </>
  );
}
