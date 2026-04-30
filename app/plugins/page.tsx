import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { PluginCard } from '@/components/plugins/PluginCard';
import { LeadCaptureForm } from '@/components/plugins/LeadCaptureForm';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllPlugins, getPluginsByVertical } from '@/lib/plugins';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';
import { SITE, absoluteUrl } from '@/lib/site';

const PAGE_URL = absoluteUrl('/plugins/');
const PLUGINS_TITLE =
  'WordPress plugins for self-storage, agencies & marketing';
const PLUGINS_DESCRIPTION =
  'Six productised WordPress plugins built for UK self-storage operators, agencies, and marketers. Free site audits, waitlists for unreleased tools, bespoke builds. Hertfordshire & London. From £6,500.';

// Number of self-storage facilities the suite has shipped against. Set to 0
// to suppress the "the same stack I've shipped for N facilities" clause.
const SELF_STORAGE_FACILITY_COUNT = 0;

export const metadata: Metadata = {
  title: PLUGINS_TITLE,
  description: PLUGINS_DESCRIPTION,
  alternates: { canonical: '/plugins/' },
  openGraph: {
    title: `${PLUGINS_TITLE} — Terence Meghani`,
    description: PLUGINS_DESCRIPTION,
    url: '/plugins/',
    type: 'website',
  },
  twitter: {
    title: `${PLUGINS_TITLE} — Terence Meghani`,
    description: PLUGINS_DESCRIPTION,
  },
};

function buildSchema() {
  const plugins = getAllPlugins();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}#collection`,
    url: PAGE_URL,
    name: 'Productised WordPress plugins',
    description: PLUGINS_DESCRIPTION,
    isPartOf: { '@id': SITE.ids.website },
    hasPart: plugins.map((p) => ({
      '@type': 'SoftwareApplication',
      name: p.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'WordPress',
      url: absoluteUrl(`/plugins/${p.slug}/`),
      softwareVersion: p.version,
      description: p.tagline,
    })),
  };
}

const PLUGINS_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Plugins', href: '/plugins/' },
]);

export default function PluginsIndexPage() {
  const selfStorage = getPluginsByVertical('Self-storage suite');
  const agency = getPluginsByVertical('Agency tooling');
  // Marketing tooling currently only contains Site Audit, which is the hero.
  const marketing = getPluginsByVertical('Marketing tooling').filter(
    (p) => p.slug !== 'site-audit',
  );

  const selfStorageIntro =
    SELF_STORAGE_FACILITY_COUNT > 0
      ? `Four plugins built for UK self-storage operators. Quoting, booking, and native integration with Stora and Kinnovis — the same stack I've shipped for ${SELF_STORAGE_FACILITY_COUNT} facilities.`
      : 'Four plugins built for UK self-storage operators. Quoting, booking, and native integration with Stora and Kinnovis.';

  return (
    <>
      <script {...ldJsonProps(buildSchema())} />
      <script {...ldJsonProps(PLUGINS_BREADCRUMBS)} />

      {/* ======== SITE AUDIT HERO ======== */}
      <section
        id="site-audit-hero"
        className="page-hero with-glow grid-texture"
      >
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>Plugins</li>
            </ol>
          </nav>

          <div style={{ marginTop: 32 }}>
            <div className="kicker-row">
              <Kicker>Free · Available now</Kicker>
            </div>
            <h1>
              Free WordPress site audit — and the plugins{' '}
              <em>built on what it finds.</em>
            </h1>
            <p
              style={{
                marginTop: 18,
                fontFamily: 'var(--font-italic)',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 1.7vw, 24px)',
                lineHeight: 1.4,
                color: 'var(--color-mist)',
                maxWidth: '60ch',
              }}
            >
              Run the audit on your site, get a Core Web Vitals + SEO report by
              email in 90 seconds. The other six plugins solve the problems the
              audit keeps surfacing.
            </p>
            <hr className="hero-rule" aria-hidden="true" />

            <div
              style={{
                marginTop: 22,
                maxWidth: 520,
                padding: 22,
                background: 'var(--color-char-2)',
                border: '1px solid var(--color-rocket)',
                borderRadius: 6,
              }}
            >
              <LeadCaptureForm
                source="Site Audit (free)"
                withUrl
                withName
                submitLabel="Email me the report"
                successMessage="On its way. Check your inbox in the next 90 seconds."
              />
            </div>

            <p
              style={{
                marginTop: 14,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-fog)',
              }}
            >
              Powered by Site Audit ·{' '}
              <Link
                href="/plugins/site-audit/"
                style={{ color: 'var(--color-rocket)' }}
              >
                See the plugin →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ======== SELF-STORAGE SUITE ======== */}
      {selfStorage.length > 0 && (
        <section
          id="self-storage"
          className="section-pad"
          style={{ background: 'var(--color-char-2)' }}
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow">
                  <Kicker>Self-storage suite</Kicker>
                </span>
                <h2>
                  A vertical, <em>not four separate items.</em>
                </h2>
                <p
                  style={{
                    marginTop: 16,
                    color: 'var(--color-fog)',
                    fontSize: 16,
                    lineHeight: 1.6,
                    maxWidth: '64ch',
                  }}
                >
                  {selfStorageIntro}
                </p>
              </div>
              <span className="sec-aside">
                {String(selfStorage.length).padStart(2, '0')} · plugins
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {selfStorage.map((p) => (
                <PluginCard key={p.slug} plugin={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======== AGENCY TOOLING ======== */}
      {agency.length > 0 && (
        <section
          id="agency"
          className="section-pad"
          style={{ background: 'var(--color-char)' }}
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow">
                  <Kicker>Agency tooling</Kicker>
                </span>
                <h2>
                  Engineering for the <em>unglamorous parts.</em>
                </h2>
                <p
                  style={{
                    marginTop: 16,
                    color: 'var(--color-fog)',
                    fontSize: 16,
                    lineHeight: 1.6,
                    maxWidth: '64ch',
                  }}
                >
                  Sign-off cycles, approvals, project hygiene — the recurring
                  agency overhead that bleeds margin.
                </p>
              </div>
              <span className="sec-aside">
                {String(agency.length).padStart(2, '0')} · plugin
                {agency.length === 1 ? '' : 's'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {agency.map((p) => (
                <PluginCard key={p.slug} plugin={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======== MARKETING TOOLING (only if anything besides Site Audit) ======== */}
      {marketing.length > 0 && (
        <section
          id="marketing"
          className="section-pad"
          style={{ background: 'var(--color-char-2)' }}
        >
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow">
                  <Kicker>Marketing tooling</Kicker>
                </span>
                <h2>
                  Lead generation, <em>built into WordPress.</em>
                </h2>
              </div>
              <span className="sec-aside">
                {String(marketing.length).padStart(2, '0')} · plugin
                {marketing.length === 1 ? '' : 's'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {marketing.map((p) => (
                <PluginCard key={p.slug} plugin={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <LaunchCTA
        title="Talk plugins"
        body="Want early access, want a bespoke build, or want to know if one of these fits your workflow? Thirty-minute call, no slides, no fluff."
      />
    </>
  );
}
