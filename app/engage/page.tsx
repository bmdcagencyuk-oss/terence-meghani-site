import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';
import { SITE } from '@/lib/site';

const ENGAGE_TITLE = 'Engage — engagement formats & investment';
const ENGAGE_DESCRIPTION =
  "Five ways to work with Terence Meghani Studio: WordPress Operations retainers, Plugin Development projects, AI & Automation builds, Brand & Identity work, and full Growth Partnership. Transparent on what's transparent, honest about what's not.";

export const metadata: Metadata = {
  title: ENGAGE_TITLE,
  description: ENGAGE_DESCRIPTION,
  alternates: { canonical: '/engage/' },
  openGraph: {
    title: 'Engage — Terence Meghani Studio',
    description:
      "Five ways to work with the studio. Pricing where it makes sense; discovery calls where it doesn't.",
    url: '/engage/',
  },
  twitter: {
    title: 'Engage — Terence Meghani Studio',
    description:
      "Five ways to work with the studio. Pricing where it makes sense; discovery calls where it doesn't.",
  },
};

const BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Engage', href: '/engage/' },
]);

const STUDIO_REF = { '@id': SITE.ids.studio };

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE.url}/engage/`,
  name: 'Engage — Terence Meghani Studio',
  description: 'Engagement formats and investment for Terence Meghani Studio.',
  url: `${SITE.url}/engage/`,
  mainEntity: [
    {
      '@type': 'Service',
      name: 'WordPress Operations',
      provider: STUDIO_REF,
      offers: [
        {
          '@type': 'Offer',
          name: 'Boost',
          price: '1500',
          priceCurrency: 'GBP',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '1500',
            priceCurrency: 'GBP',
            billingDuration: 'P1M',
          },
        },
        {
          '@type': 'Offer',
          name: 'Orbit',
          price: '2500',
          priceCurrency: 'GBP',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '2500',
            priceCurrency: 'GBP',
            billingDuration: 'P1M',
          },
        },
        {
          '@type': 'Offer',
          name: 'Apogee',
          price: '6000',
          priceCurrency: 'GBP',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '6000',
            priceCurrency: 'GBP',
            billingDuration: 'P1M',
          },
        },
      ],
    },
    {
      '@type': 'Service',
      name: 'WordPress Plugin Development',
      provider: STUDIO_REF,
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '5000',
          priceCurrency: 'GBP',
        },
      },
    },
    {
      '@type': 'Service',
      name: 'AI & Automation',
      provider: STUDIO_REF,
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '4000',
          priceCurrency: 'GBP',
        },
      },
    },
    {
      '@type': 'Service',
      name: 'Brand & Identity',
      provider: STUDIO_REF,
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '8000',
          priceCurrency: 'GBP',
        },
      },
    },
    {
      '@type': 'Service',
      name: 'Growth Partnership',
      provider: STUDIO_REF,
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          minPrice: '8000',
          priceCurrency: 'GBP',
          billingDuration: 'P1M',
        },
      },
    },
  ],
  isPartOf: { '@id': SITE.ids.website },
  about: STUDIO_REF,
};

const tierH3Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontVariationSettings: '"wdth" 100, "opsz" 48',
  fontWeight: 500,
  fontSize: '22px',
  lineHeight: 1.2,
  letterSpacing: '-0.015em',
  color: '#fff',
  marginTop: 8,
};

const investmentStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--color-rocket)',
  fontWeight: 600,
  marginTop: 4,
  marginBottom: -8,
};

export default function EngagePage() {
  return (
    <>
      <script {...ldJsonProps(BREADCRUMBS)} />
      <script {...ldJsonProps(WEBPAGE_SCHEMA)} />

      <section className="page-hero with-glow-rocket">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">·</li>
              <li>Engage</li>
            </ol>
          </nav>
          <div className="kicker-row">
            <Kicker>How to work together</Kicker>
          </div>
          <h1>
            Engage — <em>engagement formats &amp; investment.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            <em>
              Five ways to work with the studio. Transparent where transparent makes sense;
              honest about why some work needs a conversation first.
            </em>
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap" style={{ maxWidth: 880, marginInline: 'auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              fontSize: 18,
              lineHeight: 1.65,
              color: 'var(--color-mist)',
            }}
          >
            <p>
              Most studio pricing pages give you one of two unhelpful experiences. Either they
              hide every number behind &ldquo;contact us for a custom quote&rdquo; — which
              respects nothing about your time and signals the studio either doesn&rsquo;t know
              what it costs or doesn&rsquo;t trust the buyer to handle the answer. Or they
              over-publish: line-item rate cards for every conceivable variant, which reduces the
              studio to a commodity and trains buyers to shop for the cheapest checkbox.
            </p>
            <p>
              This page does neither. The engagement formats below describe how the studio
              actually works. Where pricing is genuinely fixed and transparent — like the
              WordPress Operations tiers — it&rsquo;s published. Where pricing genuinely depends
              on scope — like brand engagements that vary from a logo refresh to a complete
              rebrand — the page tells you the realistic floor and explains why a discovery call
              is the next step.
            </p>
            <p>
              If you&rsquo;d rather skip ahead to a conversation,{' '}
              <a
                href="https://calendly.com/terencemeghani"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-rocket)', borderBottom: '1px solid currentColor' }}
              >
                book a 30-minute discovery call
              </a>
              . Otherwise, read on.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Operations */}
      <section id="operations" className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">01</span>
            <span className="num">Format 1</span>
            <h2>WordPress Operations — monthly retainer</h2>
          </div>
          <div className="prose">
            <p>
              Engineer-grade ongoing work for WordPress sites where downtime costs money. Monthly
              retainer; no minimum commitment beyond the current month.
            </p>
            <p>Three tiers, public pricing:</p>
            <h3 style={tierH3Style}>Boost — £1,500 / month</h3>
            <p>
              Diagnostic monitoring and reactive engineering for sites that mostly run themselves
              but occasionally don&rsquo;t. Monthly written health summary, response within one
              business day to anything actually broken. Best for sites where the team mostly
              knows what they&rsquo;re doing but wants engineering backup for the moments that
              matter.
            </p>
            <h3 style={tierH3Style}>Orbit — £2,500 / month</h3>
            <p>
              Active operations on a monthly cadence. Server logs, database health,
              deliverability, performance, security — all monitored continuously, fixed before
              they break. Monthly written review with Loom walkthrough. Most clients land here.
            </p>
            <h3 style={tierH3Style}>Apogee — £6,000 / month</h3>
            <p>
              Full-spectrum operational ownership. Quarterly in-person review (where geography
              supports it), written recommendations on infrastructure, content workflow audits,
              AI workflow integration where useful. For sites that are operational infrastructure
              for the business — not just web presence.
            </p>
            <p>
              <strong>Audit prerequisite:</strong> new Operations engagements typically begin
              with the £1,950 audit, deductible against the first three months at Orbit or
              Apogee tier. See the{' '}
              <Link href="/services/wordpress-operations">Operations page</Link> for full audit
              detail.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Plugin Development */}
      <section id="plugin-development" className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">02</span>
            <span className="num">Format 2</span>
            <h2>WordPress Plugin Development — project work</h2>
          </div>
          <div className="prose">
            <p>
              Bespoke WordPress plugins for businesses that have outgrown off-the-shelf
              solutions. Custom Post Types, REST APIs, third-party integrations, AI-extended
              admin tooling, GoCardless and payment integrations, schema-level data architecture.
            </p>
            <p style={investmentStyle}>Investment: from £5,000</p>
            <p>
              Most plugin engagements run £5,000–£25,000 depending on complexity. Pricing depends
              on scope — number of integrations, custom data models, admin UX requirements, GDPR
              architecture, and whether the engagement includes a paid scoping phase before the
              build.
            </p>
            <p>
              The discovery call surfaces what the plugin actually needs to do; from there,
              scoping produces a fixed-price quote for the build itself. No surprise scope creep
              clauses, no tiered upsell pricing.
            </p>
            <p>
              <Link href="/work?practice=plugins">See plugin work in the portfolio</Link> ·{' '}
              <a
                href="https://calendly.com/terencemeghani"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a discovery call
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI & Automation */}
      <section id="ai-automation" className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">03</span>
            <span className="num">Format 3</span>
            <h2>AI &amp; Automation — discovery + build + embedding</h2>
          </div>
          <div className="prose">
            <p>
              Custom GPTs trained on your brand voice. Content operations automation that
              doesn&rsquo;t sound like ChatGPT. AI-powered WordPress plugins that surface in
              admin where your team already works. The work splits into three phases: discovery
              (understanding your voice and team workflows), build (custom GPTs, prompt systems,
              content ops infrastructure), embedding (training your team to actually use what was
              built).
            </p>
            <p style={investmentStyle}>Investment: from £4,000</p>
            <p>
              Smaller engagements (single custom GPT, voice training, basic content automation)
              typically £4,000–£8,000. Multi-system AI infrastructure with embedding and team
              training £15,000–£40,000 depending on team size and content velocity.
            </p>
            <p>
              Most AI engagements fail because the tools aren&rsquo;t adopted. The embedding
              phase is non-negotiable — AI tools that aren&rsquo;t used are worse than no AI
              tools.
            </p>
            <p>
              <Link href="/services/ai-automation">See the AI &amp; Automation page</Link> ·{' '}
              <a
                href="https://calendly.com/terencemeghani"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a discovery call
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Brand & Identity */}
      <section id="brand-identity" className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">04</span>
            <span className="num">Format 4</span>
            <h2>Brand &amp; Identity — strategic project work</h2>
          </div>
          <div className="prose">
            <p>
              Positioning, story, naming, visual systems, voice. Three rounds of revision built
              into the scope. Complete IP transfer at handover.
            </p>
            <p style={investmentStyle}>Investment: from £8,000</p>
            <p>
              Naming and identity refreshes start around £8,000. Full brand systems with
              strategy, naming, visual identity, voice guidelines, and rollout assets typically
              £20,000–£60,000 depending on the complexity of the system and the rollout surface.
            </p>
            <p>
              The studio is twelve years into brand work — News UK, Royal London, NHS, TEDx, BBC,
              alongside dozens of independent businesses. The work is the work, regardless of the
              size of the engagement.
            </p>
            <p>
              <Link href="/work?practice=brand">See brand work in the portfolio</Link> ·{' '}
              <a
                href="https://calendly.com/terencemeghani"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a discovery call
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 5. Growth Partnership */}
      <section id="growth-partnership" className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">05</span>
            <span className="num">Format 5</span>
            <h2>Growth Partnership — all four practices, monthly retainer</h2>
          </div>
          <div className="prose">
            <p>
              For clients wanting Operations + Plugin Development + AI &amp; Automation + Brand
              under a single monthly engagement, Growth Partnership consolidates them. Single
              retainer, single point of contact, integrated quarterly planning across all four
              practices.
            </p>
            <p style={investmentStyle}>Investment: from £8,000 / month</p>
            <p>
              Growth Partnership replaces multiple service-specific retainers with one
              engagement. Pricing reflects the operational savings of single-source delivery (no
              scope arbitration between vendors, no calendar Tetris between agencies, no
              four-way kickoffs).
            </p>
            <p>
              This format isn&rsquo;t for everyone. It works when a business genuinely needs all
              four practices on an ongoing basis — most don&rsquo;t. The discovery call honestly
              surfaces whether Growth Partnership fits or whether a single-practice retainer
              makes more sense.
            </p>
            <p>
              <a
                href="https://calendly.com/terencemeghani"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a discovery call
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* What's not on this page */}
      <section className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="num">Notes</span>
            <h2>What&rsquo;s not on this page</h2>
          </div>
          <div className="prose">
            <p>Three honest notes about what&rsquo;s deliberately absent here:</p>
            <p>
              <strong>The £1,950 audit isn&rsquo;t listed as a separate engagement format.</strong>{' '}
              It&rsquo;s the entry point for Operations work; it lives within the Operations page
              rather than being productised separately. If you came to this page wondering
              whether to start with an audit — yes, that&rsquo;s almost always the right first
              step for ongoing WordPress work.
            </p>
            <p>
              <strong>Web Development isn&rsquo;t listed as a separate practice.</strong> Custom
              WordPress sites and Next.js builds happen, but they&rsquo;re either part of brand
              engagements (where the website is the brand surface) or part of plugin engagements
              (where the plugin sits inside an existing or new WordPress site). Pricing is folded
              into whichever practice the engagement primarily lives in.
            </p>
            <p>
              <strong>SEO and PPC aren&rsquo;t on this page.</strong> SEO benefits accumulate
              through the work the four practices already do — strong Operations means fast
              sites, strong Brand means clear positioning, strong AI means content velocity. PPC
              isn&rsquo;t a service the studio sells.
            </p>
          </div>
        </div>
      </section>

      {/* How this connects */}
      <section className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="num">Onward</span>
            <h2>How this page connects to the rest of the site</h2>
          </div>
          <div className="prose">
            <p>
              If you&rsquo;ve read this far and want to know{' '}
              <strong>how the engagement actually works</strong>, the{' '}
              <Link href="/process/">Process page</Link> describes the rhythm — discovery call →
              audit (or scope) → proposal → kickoff → work → handover.
            </p>
            <p>
              If you want to <strong>see the work itself</strong>, the{' '}
              <Link href="/work/">portfolio</Link> shows 24 case studies; you can{' '}
              <Link href="/work?practice=operations">filter by practice</Link> to focus on
              what&rsquo;s relevant.
            </p>
            <p>
              If you want to <strong>read what clients say</strong>, the{' '}
              <Link href="/reviews/">reviews page</Link> has 67 verified reviews from Trustpilot
              and Facebook.
            </p>
            <p>
              If you want to <strong>start a conversation</strong>, the discovery call is 30
              minutes and free. No deck, no pre-call form, no obligation.
            </p>
            <div style={{ marginTop: 12 }}>
              <Button
                href="https://calendly.com/terencemeghani"
                external
                variant="primary"
              >
                Book a 30-minute discovery call →
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LaunchCTA title="Your project next?" />
    </>
  );
}
