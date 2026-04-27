import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { PluginCard } from '@/components/plugins/PluginCard';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllPlugins, getVerticals, getPluginsByVertical } from '@/lib/plugins';

const BASE = 'https://terencemeghani.com';
const PAGE_URL = `${BASE}/plugins/`;

export const metadata: Metadata = {
  title: 'Productised WordPress plugins · Terence Meghani',
  description:
    'Six productised WordPress plugins across three verticals — self-storage, agency tooling, and marketing tooling. Built and shipping.',
  alternates: { canonical: '/plugins/' },
  openGraph: {
    title: 'Productised WordPress plugins',
    description:
      'Six WordPress plugins across self-storage, agency tooling, and marketing tooling. Built and shipping.',
    url: PAGE_URL,
    type: 'website',
  },
};

const VERTICAL_BLURB: Record<string, string> = {
  'Self-storage suite':
    'Four plugins that turn a WordPress site into a complete self-storage booking platform — quoting, unit selection, reservation, and direct integration with the Stora platform.',
  'Agency tooling':
    'Engineering for the unglamorous parts of agency work — sign-off cycles, approvals, project hygiene.',
  'Marketing tooling':
    'Lead-generation and prospecting tools for marketing teams who want their WordPress site to do real selling.',
};

function buildSchema() {
  const plugins = getAllPlugins();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}#collection`,
    url: PAGE_URL,
    name: 'Productised WordPress plugins',
    description: 'Six productised WordPress plugins across three verticals.',
    hasPart: plugins.map((p) => ({
      '@type': 'SoftwareApplication',
      name: p.name,
      applicationCategory: 'WordPress Plugin',
      url: `${BASE}/plugins/${p.slug}/`,
      softwareVersion: p.version,
      description: p.tagline,
    })),
  };
}

export default function PluginsIndexPage() {
  const verticals = getVerticals();
  const allPlugins = getAllPlugins();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }}
      />

      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>Plugins</li>
            </ol>
          </nav>

          <div style={{ marginTop: 32 }}>
            <div className="kicker-row">
              <Kicker>Plugins · {allPlugins.length} in the suite</Kicker>
            </div>
            <h1>
              Productised WordPress <em>plugins.</em>
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
              A vertical, an agency tool, and a marketing tool — all built and shipping.
            </p>
            <hr className="hero-rule" aria-hidden="true" />
            <p className="lead" style={{ maxWidth: '60ch' }}>
              What we ship to clients also runs as productised plugins for the wider market.
              Same architecture, same engineering standards. Each plugin is independent;
              within the self-storage suite they compose into a complete operator-grade
              booking platform.
            </p>
          </div>
        </div>
      </section>

      {verticals.map((vertical, vIdx) => {
        const items = getPluginsByVertical(vertical);
        if (items.length === 0) return null;
        const bg = vIdx % 2 === 0 ? 'var(--color-char-2)' : 'var(--color-char)';
        return (
          <section key={vertical} className="section-pad" style={{ background: bg }}>
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <span className="sec-eyebrow"><Kicker>{vertical}</Kicker></span>
                  <h2>
                    {vertical.split(' ').slice(0, -1).join(' ')}{' '}
                    <em>{vertical.split(' ').slice(-1)[0]}</em>
                  </h2>
                  <p style={{ marginTop: 16, color: 'var(--color-fog)', fontSize: 15.5, lineHeight: 1.6, maxWidth: '64ch' }}>
                    {VERTICAL_BLURB[vertical] ?? ''}
                  </p>
                </div>
                <span className="sec-aside">
                  {String(items.length).padStart(2, '0')} · plugin{items.length === 1 ? '' : 's'}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 20,
                }}
              >
                {items.map((p, i) => (
                  <PluginCard key={p.slug} plugin={p} index={allPlugins.indexOf(p)} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <LaunchCTA
        title="Talk plugins"
        body="Want early access, want a bespoke build, or want to know if one of these fits your workflow? Thirty-minute call, no slides, no fluff."
      />
    </>
  );
}
