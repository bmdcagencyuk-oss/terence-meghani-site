import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Database,
  Mail,
  Shield,
  Gauge,
  FileSearch,
  ClipboardList,
  Sparkles,
  Puzzle,
  Code,
} from 'lucide-react';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';
import { WorkCard } from '@/components/case-study/WorkCard';
import servicesData from '@/data/services.json';
import { breadcrumbSchema, faqPageSchema, ldJsonProps, wpOperationsSchema } from '@/lib/schema';

const SERVICE = servicesData.services.find((s) => s.slug === 'wordpress-operations')!;
const SERVICE_INDEX = servicesData.services.findIndex((s) => s.slug === 'wordpress-operations') + 1;

const HERO_STATS = [
  { k: 'Cadence',        v: 'Monthly' },
  { k: 'Audit',          v: '£1,950 fixed' },
  { k: 'Reporting',      v: 'Written, monthly' },
  { k: 'Minimum term',   v: '3 months' },
];

const TIERS = [
  {
    name: 'Boost',
    price: '£1,500',
    cadence: '/ month',
    pitch: 'For businesses with a single WordPress site they need stable, secure, and out of their hair.',
    bullets: [
      'Daily backups with tested restore path',
      'Scheduled core, theme and plugin updates with rollback safety',
      'Uptime and SSL monitoring',
      'Monthly performance and security report',
      'Email deliverability check (SPF / DKIM / DMARC)',
      'Up to 2 hours of monthly engineering time',
    ],
    sla: 'Next-business-day response',
  },
  {
    name: 'Orbit',
    price: '£2,500',
    cadence: '/ month',
    pitch: 'For businesses where the site is core to revenue or operations.',
    bullets: [
      'Everything in Boost',
      'Server-level log analysis and root-cause diagnostics',
      'Database health, query review and table-prefix auditing',
      'WAF, login hardening and header policy',
      'Spam and form-abuse mitigation',
      'Core Web Vitals tuning and performance budgets',
      'Up to 6 hours of monthly engineering time',
      'Quarterly architecture review',
    ],
    sla: 'Same-business-day during UK hours',
    feature: true,
  },
  {
    name: 'Apogee',
    price: '£6,000',
    cadence: '/ month',
    pitch: 'For teams running WordPress at scale, on critical infrastructure, with no tolerance for surprises.',
    bullets: [
      'Everything in Orbit',
      'Defined SLA — response window and uptime target',
      'Generous evening cover: incidents reported before 22:00 UK get a response by 09:00 UK the next morning',
      'Staging environment management and pre-deployment QA',
      'Migration, replatforming or hosting changes included where needed',
      'Up to 12 hours of monthly engineering time',
      'Quarterly executive report (board-pack ready)',
      'Direct line — dedicated Slack or equivalent',
    ],
    sla: 'Defined SLA + evening cover',
  },
];

const CAPABILITIES = [
  {
    icon: FileSearch,
    title: 'Server log diagnostics',
    desc: 'Web server, PHP error and slow-query logs read end-to-end — not glanced at when something breaks.',
  },
  {
    icon: Database,
    title: 'Database health',
    desc: 'Query review, table-prefix sanity, scheduler integrity, autoload bloat — the unsexy work that keeps a site upright.',
  },
  {
    icon: Mail,
    title: 'Email deliverability',
    desc: 'SPF, DKIM and DMARC alignment, authenticated SMTP, reputation monitoring. Forms that arrive, receipts that don\'t bounce.',
  },
  {
    icon: Shield,
    title: 'Security hardening',
    desc: 'File-edit lock, login hardening, header policy, WAF rules — prevention, then containment, then logs.',
  },
  {
    icon: Gauge,
    title: 'Performance tuning',
    desc: 'Core Web Vitals on real devices, caching strategy, image pipeline, plugin-induced query load — measured, not guessed.',
  },
  {
    icon: Activity,
    title: 'Uptime & SSL monitoring',
    desc: 'External monitoring with alerts that don\'t cry wolf. SSL renewal tracked. Domain expiry tracked.',
  },
  {
    icon: ClipboardList,
    title: 'Plugin-load auditing',
    desc: 'Which plugins write on every request, which ones cron themselves to death, which can be retired or consolidated.',
  },
  {
    icon: Puzzle,
    title: 'Update & rollback discipline',
    desc: 'Staged updates with a tested rollback path. No more Friday-afternoon "we\'ll patch and pray".',
  },
  {
    icon: Sparkles,
    title: 'Monthly written review',
    desc: 'A real document — what was found, what was fixed, what\'s coming, where the site stands against benchmarks.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Audit',
    when: 'Week 1',
    body: 'A comprehensive technical audit — logs, config, plugin load, database, scheduler, mail, security, performance. £1,950 fixed-price, deductible against the first three months at Orbit or Apogee. (Boost clients pay the audit separately.)',
  },
  {
    step: '02',
    title: 'Stabilise',
    when: 'Weeks 2–4',
    body: 'The critical issues from the audit are fixed before the retainer kicks in. You don\'t pay an operations fee to inherit someone else\'s mess.',
  },
  {
    step: '03',
    title: 'Operate',
    when: 'Ongoing',
    body: 'Monthly cadence — monitoring, patching, optimisation, response. Always-on for incidents within your tier\'s window.',
  },
  {
    step: '04',
    title: 'Review',
    when: 'Quarterly',
    body: 'A written review covering what was found, what was fixed, what\'s coming, and where the site stands against benchmarks. Apogee gets an executive version suitable for a board pack.',
  },
];

const SCENARIOS = [
  'You\'re paying an agency a monthly fee but only hear from them when something breaks.',
  'Your site has 40+ plugins and nobody knows which ones are essential.',
  'You\'ve had three deliverability scares this year and still don\'t have DMARC set up properly.',
  'You inherited the site from a previous developer who\'s gone silent, and you\'re not entirely sure who still has the admin password.',
  'You can tell me what your hosting bill is, but not what your TTFB is — and you\'re starting to think those are related.',
];

const FAQ = [
  {
    q: 'How is this different from a WordPress care plan?',
    a: 'Care plans run backups and push updates. I diagnose at the engineering level — log analysis, database queries, scheduler state, mail authentication, plugin-induced load. The work happens before things break.',
  },
  {
    q: 'Can you take over a site that wasn\'t built by you?',
    a: 'Yes — most of what I operate I didn\'t originally build. The audit step exists for exactly that reason: I baseline what\'s there, fix the critical issues, and only then start the retainer.',
  },
  {
    q: 'Do I need to move hosting to work with you?',
    a: 'No. I work across most credible UK and EU hosts — shared, VPS, managed WordPress, headless setups. If your hosting is genuinely the bottleneck I\'ll say so during the audit, but I won\'t push a migration as a default.',
  },
  {
    q: 'What happens if something breaks outside business hours?',
    a: 'On Boost, I respond next business day. On Orbit, same business day during UK hours. On Apogee, you get generous evening cover — incidents reported before 22:00 UK get a response by 09:00 UK the next morning. There\'s no true 24/7 on-call; that\'s honest, and it\'s priced accordingly.',
  },
  {
    q: 'What if I need work that exceeds my monthly hours?',
    a: 'Anything over your tier\'s allocation is quoted upfront before it starts. Most months don\'t need extra; when they do, you see the number first.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. Three months minimum to make the audit and stabilisation work pay off, then month-to-month after that. No long lock-ins.',
  },
];

const RELATED = [
  {
    href: '/services/wordpress-plugin-development/',
    icon: Puzzle,
    title: 'WordPress Plugin Development',
    desc: 'Custom plugins, bespoke integrations, AI-extended admin tooling.',
  },
  {
    href: '/services/ai-automation/',
    icon: Sparkles,
    title: 'AI & Automation',
    desc: 'Brand-aware AI workflows and AI inside your WordPress admin.',
  },
  {
    href: '/services/web-development/',
    icon: Code,
    title: 'Web Development',
    desc: 'Higher-tier WordPress, headless and Next.js builds when it\'s time to replatform.',
  },
];

const PAGE_PATH = '/services/wordpress-operations/';
const WP_OPS_TITLE = 'WordPress Operations';
const WP_OPS_DESCRIPTION =
  'Engineer-grade WordPress operations on retainer. Server log diagnostics, database health, deliverability, security, performance. Three tiers from £1,500/month.';

export const metadata: Metadata = {
  title: WP_OPS_TITLE,
  description: WP_OPS_DESCRIPTION,
  keywords: SERVICE.keywords,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: `${WP_OPS_TITLE} — Terence Meghani`,
    description: WP_OPS_DESCRIPTION,
    url: PAGE_PATH,
    type: 'website',
  },
  twitter: {
    title: `${WP_OPS_TITLE} — Terence Meghani`,
    description: WP_OPS_DESCRIPTION,
  },
};

const WP_OPS_SCHEMA = wpOperationsSchema({
  url: PAGE_PATH,
  description: WP_OPS_DESCRIPTION,
  tiers: TIERS.map((tier) => ({
    name: tier.name,
    price: Number(tier.price.replace(/[£,]/g, '')),
    pitch: tier.pitch,
  })),
});

const WP_OPS_FAQ_SCHEMA = faqPageSchema(
  FAQ.map((f) => ({ q: f.q, aPlain: f.a })),
);

const WP_OPS_BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/#services' },
  { name: 'WordPress Operations', href: PAGE_PATH },
]);

export default function WordPressOperationsPage() {
  const projectCount = getAllCaseStudies().length;
  const pedagogy = getCaseStudyBySlug('pedagogy-club');

  return (
    <>
      <script {...ldJsonProps(WP_OPS_SCHEMA)} />
      <script {...ldJsonProps(WP_OPS_FAQ_SCHEMA)} />
      <script {...ldJsonProps(WP_OPS_BREADCRUMBS)} />

      {/* Hero */}
      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#services">Services</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>WordPress Operations</li>
            </ol>
          </nav>

          <div className="svc-hero-grid" data-svc-code={`S/${String(SERVICE_INDEX).padStart(2, '0')}`} style={{ marginTop: 32 }}>
            <div>
              <div className="kicker-row">
                <Kicker>Core service · New</Kicker>
              </div>
              <h1>
                WordPress <em>Operations</em>
              </h1>
              <p
                style={{
                  marginTop: 18,
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px, 2vw, 30px)',
                  lineHeight: 1.25,
                  color: 'var(--color-rocket)',
                  maxWidth: '32ch',
                }}
              >
                {SERVICE.tagline}
              </p>
              <hr className="hero-rule" aria-hidden="true" />
              <p className="lead">
                Most WordPress &ldquo;care plans&rdquo; run a backup, push updates, and call it a day.
                That&rsquo;s not what this is. I operate a portfolio of WordPress sites the way an
                SRE team operates production — server logs, database health, scheduler integrity,
                email deliverability, plugin load, security posture — diagnosed monthly, written
                up properly, fixed before they become outages. Three tiers, defined response
                windows, and a written review every quarter.
              </p>

              <p
                style={{
                  marginTop: 20,
                  padding: '14px 16px',
                  borderLeft: '2px solid var(--color-rocket)',
                  background: 'rgba(255,255,255,0.02)',
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  color: 'var(--color-fog)',
                  maxWidth: '60ch',
                }}
              >
                Who this isn&rsquo;t for: if your monthly hosting bill is under £30, this isn&rsquo;t
                for you — and that&rsquo;s not a value judgement, it&rsquo;s a fit one.
              </p>

              <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button href="https://calendly.com/terencemeghani" external variant="primary">
                  Book a technical audit
                </Button>
                <Button href="#tiers" variant="secondary">
                  See the three tiers
                </Button>
              </div>
            </div>

            <aside className="svc-visual" aria-label="WordPress Operations at a glance">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--color-fog)',
                    }}
                  >
                    At a glance
                  </span>
                  <div
                    style={{
                      marginTop: 6,
                      fontFamily: 'var(--font-display)',
                      fontVariationSettings: '"wdth" 85, "opsz" 72',
                      fontWeight: 600,
                      fontSize: 22,
                      color: '#fff',
                      letterSpacing: '-0.02em',
                      maxWidth: '20ch',
                      lineHeight: 1.1,
                    }}
                  >
                    S / {String(SERVICE_INDEX).padStart(2, '0')}
                  </div>
                </div>
                <div className="badge-wrap" aria-hidden="true">
                  <span className="spark" />
                  <span className="spark" />
                  <div className="badge">
                    <Activity size={52} strokeWidth={1.6} />
                  </div>
                </div>
              </div>

              <div className="stats">
                {HERO_STATS.map((st) => (
                  <div key={st.k} className="stat">
                    <span className="k">{st.k}</span>
                    <span className="v">{st.v}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* The distinction */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>The distinction</Kicker></span>
              <h2>
                Not a <em>care plan.</em>
              </h2>
            </div>
            <span className="sec-aside">02 · context</span>
          </div>

          <div className="wpops-distinction-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: '1.0625rem', lineHeight: 1.65, color: 'var(--color-fog)' }}>
              <p>
                Most WordPress care plans look the same on the inside: an automated backup,
                an automated update run, an uptime ping, a PDF that nobody reads. The
                economics of £49-a-month operations don&rsquo;t allow for anything more — and
                the buyer doesn&rsquo;t know to ask for anything more, until the day the site
                stops sending receipts and nobody can say why.
              </p>
              <p>
                The sites I look after are diagnosed at a different level. Scheduler
                integrity. Slow-query logs. Authenticated SMTP and DMARC alignment.
                Plugin-induced query load. Table-prefix mismatches in Action Scheduler.
                Mail that&rsquo;s technically being sent but never reaching the inbox.
                Database autoload bloat that nobody noticed because the symptoms looked
                like &ldquo;the host is slow today.&rdquo;
              </p>
              <p>
                That&rsquo;s the work. This is the retainer that productises it — three
                tiers, monthly written reviews, defined response windows, no surprises.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Cron jobs silently failing for weeks',
                'Plugins writing to the database on every page request',
                'Outbound mail without DMARC alignment',
                'Malformed SQL in widget options',
                'Action Scheduler tables on the wrong prefix',
                'autoload bloat masquerading as “slow hosting”',
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    letterSpacing: '0.04em',
                    color: 'var(--color-fog)',
                    paddingLeft: 18,
                    position: 'relative',
                  }}
                >
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, color: 'var(--color-rocket)' }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Three tiers */}
      <section id="tiers" className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Three tiers</Kicker></span>
              <h2>
                Sized to the level of <em>attention you need.</em>
              </h2>
            </div>
            <span className="sec-aside">03 · pricing</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              marginTop: 8,
            }}
          >
            {TIERS.map((tier) => (
              <article
                key={tier.name}
                style={{
                  position: 'relative',
                  border: tier.feature
                    ? '1px solid var(--color-rocket)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: tier.feature ? 'rgba(255,107,53,0.04)' : 'rgba(255,255,255,0.015)',
                  padding: '28px 26px 30px',
                  borderRadius: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {tier.feature && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: 26,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-rocket)',
                      background: 'var(--color-char)',
                      padding: '2px 10px',
                    }}
                  >
                    Most chosen
                  </span>
                )}
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--color-rocket)',
                    }}
                  >
                    {tier.name}
                  </span>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontVariationSettings: '"wdth" 85, "opsz" 72',
                        fontWeight: 600,
                        fontSize: 38,
                        color: '#fff',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      from {tier.price}
                    </span>
                    <span style={{ color: 'var(--color-fog)', fontSize: 14 }}>{tier.cadence}</span>
                  </div>
                  <p
                    style={{
                      marginTop: 14,
                      fontFamily: 'var(--font-italic)',
                      fontStyle: 'italic',
                      color: 'var(--color-fog)',
                      lineHeight: 1.45,
                    }}
                  >
                    {tier.pitch}
                  </p>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--color-fog)', fontSize: 14, lineHeight: 1.5 }}>
                  {tier.bullets.map((b) => (
                    <li key={b} style={{ paddingLeft: 16, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--color-rocket)' }}>·</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 14,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    color: 'var(--color-rocket)',
                  }}
                >
                  SLA · {tier.sla}
                </div>
              </article>
            ))}
          </div>

          <p
            style={{
              marginTop: 28,
              fontSize: 14,
              color: 'var(--color-fog)',
              lineHeight: 1.6,
              maxWidth: '70ch',
            }}
          >
            Every engagement starts with a fixed-price <strong style={{ color: '#fff' }}>£1,950 technical audit</strong>{' '}
            (Step 01). On Orbit and Apogee that audit fee is deductible against your first three
            months of retainer. Boost clients pay the audit separately — keeping the entry retainer
            honest about what fits inside two hours a month.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Capabilities</Kicker></span>
              <h2>
                What&rsquo;s <em>covered.</em>
              </h2>
            </div>
            <span className="sec-aside">{String(CAPABILITIES.length).padStart(2, '0')} · disciplines</span>
          </div>

          <div className="feature-grid">
            {CAPABILITIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <article key={c.title} className="feature-card">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="title">{c.title}</span>
                  <span className="desc">{c.desc}</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Process</Kicker></span>
              <h2>
                How an engagement <em>runs.</em>
              </h2>
            </div>
            <span className="sec-aside">{String(PROCESS.length).padStart(2, '0')} · phases</span>
          </div>
          <ol className="stepper" style={{ listStyle: 'none', padding: 0 }}>
            {PROCESS.map((p) => (
              <li key={p.step} className="step">
                <div className="bullet">{p.step}</div>
                <h3 className="step-title">
                  {p.title}
                  <span
                    style={{
                      marginLeft: 10,
                      fontFamily: 'var(--font-italic)',
                      fontStyle: 'italic',
                      fontSize: '0.85em',
                      color: 'var(--color-rocket)',
                      fontWeight: 400,
                    }}
                  >
                    {p.when}
                  </span>
                </h3>
                <p className="step-body">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured cases */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Featured work</Kicker></span>
              <h2>
                Where this <em>shows up.</em>
              </h2>
            </div>
            <Link
              href="/work/"
              className="sec-aside"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-rocket)' }}
            >
              View all {projectCount} projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="cs-related-grid">
            {pedagogy && <WorkCard study={pedagogy} />}
            {[1, 2].map((i) => (
              <article
                key={`tbc-${i}`}
                style={{
                  border: '1px dashed rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 320,
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--color-rocket)',
                  }}
                >
                  Case study · TBC
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontVariationSettings: '"wdth" 85, "opsz" 72',
                      fontWeight: 600,
                      fontSize: 24,
                      color: '#fff',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    Coming soon.
                  </h3>
                  <p style={{ marginTop: 10, color: 'var(--color-fog)', fontSize: 14, lineHeight: 1.55 }}>
                    Operations write-ups in the queue — anonymised where the client
                    requires it, named where they don&rsquo;t.
                  </p>
                </div>
                <Link
                  href="/work/"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-rocket)',
                  }}
                >
                  Browse the rest →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios — "Sound like you?" */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Sound like you?</Kicker></span>
              <h2>
                Five honest <em>tells.</em>
              </h2>
            </div>
            <span className="sec-aside">07 · self-qualify</span>
          </div>

          <ol
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: 14,
              maxWidth: '78ch',
            }}
          >
            {SCENARIOS.map((s, i) => (
              <li
                key={s}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr',
                  gap: 18,
                  alignItems: 'baseline',
                  padding: '18px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: 'var(--color-rocket)',
                  }}
                >
                  T-{String(SCENARIOS.length - i).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-italic)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(18px, 1.5vw, 22px)',
                    color: '#fff',
                    lineHeight: 1.45,
                  }}
                >
                  {s}
                </span>
              </li>
            ))}
          </ol>

          <p style={{ marginTop: 28, color: 'var(--color-fog)', fontSize: 14, maxWidth: '60ch' }}>
            If two or more of those landed, the audit&rsquo;s the place to start.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-intro">
              <Kicker>Questions</Kicker>
              <h2>
                Answered, <em>honestly.</em>
              </h2>
              <p>
                If yours isn&rsquo;t listed, ask it on a discovery call — thirty minutes,
                no slides, no fluff.
              </p>
            </div>
            <div className="accordion">
              {FAQ.map((f, i) => (
                <details key={f.q} name="wpops-faq" open={i === 0}>
                  <summary>
                    <span className="q">{f.q}</span>
                    <span className="plus" aria-hidden="true">+</span>
                  </summary>
                  <div className="a">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="section-pad" style={{ background: 'var(--color-char)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-eyebrow"><Kicker>Related services</Kicker></span>
              <h2>
                The natural <em>progression.</em>
              </h2>
            </div>
            <span className="sec-aside">09 · cross-sell</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {RELATED.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    padding: '28px 26px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.015)',
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <Icon size={22} strokeWidth={1.6} color="var(--color-rocket)" />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontVariationSettings: '"wdth" 85, "opsz" 72',
                      fontWeight: 600,
                      fontSize: 20,
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p style={{ color: 'var(--color-fog)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
                    {r.desc}
                  </p>
                  <span
                    style={{
                      marginTop: 'auto',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-rocket)',
                    }}
                  >
                    Learn more →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <LaunchCTA
        title="Book a technical audit"
        body="The audit is the entry point; the retainer is the destination. Thirty-minute discovery call first if you'd rather scope it before booking. £1,950 fixed-price, deductible against your first three months at Orbit or Apogee."
      />
    </>
  );
}
