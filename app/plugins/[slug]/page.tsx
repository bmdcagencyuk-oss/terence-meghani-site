import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { PluginCard } from '@/components/plugins/PluginCard';
import {
  getAllPlugins,
  getPluginBySlug,
  getRelatedPlugins,
  PLUGIN_LONG_FORM,
} from '@/lib/plugins';
import type { PluginStatus } from '@/lib/plugins';
import { breadcrumbSchema, ldJsonProps, pluginSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

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

export function generateStaticParams() {
  return getAllPlugins().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plugin = getPluginBySlug(slug);
  if (!plugin) return { title: 'Not found' };
  const title = `${plugin.name} — ${plugin.vertical} plugin`;
  const description = plugin.tagline;
  const url = `/plugins/${plugin.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — Terence Meghani`,
      description,
      url,
      type: 'website',
    },
    twitter: {
      title: `${title} — Terence Meghani`,
      description,
    },
  };
}

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plugin = getPluginBySlug(slug);
  if (!plugin) notFound();

  const longForm = PLUGIN_LONG_FORM[slug];
  const related = getRelatedPlugins(slug);
  const tone = STATUS_TONE[plugin.status];
  const ctaIsExternal = plugin.ctaHref.startsWith('mailto:') || plugin.ctaHref.startsWith('http');

  return (
    <>
      <script {...ldJsonProps(pluginSchema(plugin, longForm))} />
      <script
        {...ldJsonProps(
          breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Plugins', href: '/plugins/' },
            { name: plugin.name, href: `/plugins/${plugin.slug}/` },
          ]),
        )}
      />

      {/* Hero */}
      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/plugins/">Plugins</Link></li>
              <li aria-hidden="true">›</li>
              <li>{plugin.vertical}</li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>{plugin.name}</li>
            </ol>
          </nav>

          {plugin.heroImage && (
            <figure
              style={{
                margin: '32px 0 0',
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
                src={plugin.heroImage}
                alt={plugin.heroImageAlt ?? `${plugin.name} preview`}
                width={1600}
                height={1000}
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

          {plugin.heroImage && plugin.previewCaption && (
            <p
              style={{
                marginTop: 12,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-fog)',
              }}
            >
              <em
                style={{
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  color: 'var(--color-rocket)',
                  marginRight: 8,
                  fontSize: 13,
                }}
              >
                Preview ·
              </em>
              {plugin.previewCaption}
            </p>
          )}

          <div style={{ marginTop: plugin.heroImage ? 36 : 32 }}>
            <div className="kicker-row">
              <Kicker>{plugin.vertical}</Kicker>
            </div>
            <h1>
              {plugin.name.split(' ').slice(0, -1).join(' ')}{' '}
              <em>{plugin.name.split(' ').slice(-1)[0]}</em>
            </h1>
            <p
              style={{
                marginTop: 18,
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: 'clamp(22px, 2vw, 30px)',
                lineHeight: 1.25,
                color: 'var(--color-rocket)',
                maxWidth: '34ch',
              }}
            >
              {plugin.tagline}
            </p>
            <hr className="hero-rule" aria-hidden="true" />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 18 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: tone.fg,
                  border: `1px solid ${tone.border}`,
                  background: tone.bg,
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                {plugin.statusLabel}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fog)', letterSpacing: '0.06em' }}>
                v{plugin.version}
              </span>
            </div>

            {plugin.note && (
              <p
                style={{
                  marginTop: 22,
                  padding: '12px 14px',
                  borderLeft: '2px solid var(--color-rocket)',
                  background: 'rgba(255,255,255,0.02)',
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  color: 'var(--color-fog)',
                  maxWidth: '64ch',
                  fontSize: 15,
                }}
              >
                {plugin.note}
              </p>
            )}

            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Button href={plugin.ctaHref} external={ctaIsExternal} variant="primary">
                {plugin.ctaLabel}
              </Button>
              <Button href="/plugins/" variant="secondary">
                All plugins
              </Button>
            </div>
          </div>
        </div>
      </section>

      {longForm && (
        <>
          {/* What it does */}
          <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <span className="sec-eyebrow"><Kicker>What it does</Kicker></span>
                  <h2>
                    The job it&rsquo;s <em>built for.</em>
                  </h2>
                </div>
                <span className="sec-aside">01 · overview</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: '70ch', color: 'var(--color-fog)', fontSize: 17, lineHeight: 1.65 }}>
                {longForm.whatItDoes.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Who it's for */}
          <section className="section-pad" style={{ background: 'var(--color-char)' }}>
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <span className="sec-eyebrow"><Kicker>Who it&rsquo;s for</Kicker></span>
                  <h2>
                    The kind of team this <em>fits.</em>
                  </h2>
                </div>
                <span className="sec-aside">02 · audience</span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px, 1.6vw, 26px)',
                  lineHeight: 1.5,
                  color: '#fff',
                  maxWidth: '70ch',
                }}
              >
                {longForm.whoItsFor}
              </p>
            </div>
          </section>

          {/* Capabilities */}
          <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <span className="sec-eyebrow"><Kicker>Key capabilities</Kicker></span>
                  <h2>
                    What&rsquo;s <em>under the hood.</em>
                  </h2>
                </div>
                <span className="sec-aside">{String(longForm.capabilities.length).padStart(2, '0')} · features</span>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 12,
                  maxWidth: '90ch',
                }}
              >
                {longForm.capabilities.map((c, i) => (
                  <li
                    key={c}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '36px 1fr',
                      gap: 12,
                      padding: '14px 0',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      color: 'var(--color-fog)',
                      fontSize: 15,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.16em',
                        color: 'var(--color-rocket)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* CTA block */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div
            style={{
              border: '1px solid var(--color-rocket)',
              background: 'rgba(255, 77, 23, 0.05)',
              padding: '32px 30px',
              borderRadius: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-rocket)',
              }}
            >
              Next step
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontVariationSettings: '"wdth" 85, "opsz" 72',
                fontWeight: 600,
                fontSize: 28,
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {plugin.ctaLabel}
            </h3>
            <p style={{ color: 'var(--color-fog)', fontSize: 15.5, lineHeight: 1.6 }}>
              {plugin.status === 'available'
                ? 'Available for licensing now. Get in touch and I’ll send you the details.'
                : plugin.status === 'beta'
                  ? 'Currently in beta with a small group of operators. Waitlist guarantees access at GA launch.'
                  : plugin.status === 'bespoke'
                    ? 'This plugin was built for one client. If you need something similar, the WordPress Plugin Development service is the route.'
                    : 'Joining the waitlist gets you early access ahead of the public launch — and shapes the launch feature set.'}
            </p>
            <Button href={plugin.ctaHref} external={ctaIsExternal} variant="primary">
              {plugin.ctaLabel}
            </Button>
          </div>
        </div>
      </section>

      {/* Related plugins in same vertical */}
      {related.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow"><Kicker>Other plugins</Kicker></span>
                <h2>
                  More in the <em>{plugin.vertical}.</em>
                </h2>
              </div>
              <Link
                href="/plugins/"
                className="sec-aside"
                style={{ color: 'var(--color-rocket)' }}
              >
                Back to all plugins →
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {related.map((p) => (
                <PluginCard key={p.slug} plugin={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA strip — implementation handoff */}
      <section
        className="section-pad"
        style={{ background: 'var(--color-char-2)', paddingTop: 48, paddingBottom: 64 }}
      >
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              padding: '24px 28px',
              border: '1px solid var(--color-rocket)',
              borderRadius: 6,
              background: 'rgba(255, 77, 23, 0.05)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontVariationSettings: '"wdth" 90, "opsz" 72',
                fontWeight: 500,
                fontSize: 22,
                color: '#fff',
                lineHeight: 1.3,
                margin: 0,
                maxWidth: '52ch',
              }}
            >
              Want this implemented for you?{' '}
              <em
                style={{
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  color: 'var(--color-rocket)',
                }}
              >
                Book a 30-min call.
              </em>
            </p>
            <Button
              href="https://calendly.com/terencemeghani"
              external
              variant="primary"
            >
              Book a 30-min call →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
