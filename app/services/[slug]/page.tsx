import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Palette,
  Sparkles,
  Puzzle,
  Code,
  Target,
  Search,
  Gem,
  Type,
  Mic,
  BookOpen,
  FileText,
  Layers,
  Bot,
  Workflow,
  FileCode,
  GraduationCap,
  ShieldCheck,
  LayoutDashboard,
  Plug,
  Braces,
  Rocket,
  Accessibility,
  BarChart3,
  Zap,
  MapPin,
  Link2,
  Gauge,
  MousePointerClick,
  Megaphone,
  Video,
} from 'lucide-react';
import servicesData from '@/data/services.json';
import { getAllServices, getServiceBySlug } from '@/lib/services';
import { getAllCaseStudies } from '@/lib/case-studies';
import { getAllPlugins } from '@/lib/plugins';
import { PluginCard } from '@/components/plugins/PluginCard';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { WorkCard } from '@/components/case-study/WorkCard';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

/** Big icon in the hero visual panel, per-service. */
const SERVICE_ICON: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>> = {
  'brand-identity':                Palette,
  'ai-automation':                 Sparkles,
  'wordpress-plugin-development':  Puzzle,
  'web-development':               Code,
  'ppc-paid-media':                Target,
  'seo-organic-growth':            Search,
  'growth-partnership':            Gem,
};

/** Keyword → icon map for deliverable cards. Falls back to Sparkles. */
const DELIVERABLE_ICON_MAP: Array<[RegExp, React.ComponentType<{ size?: number; strokeWidth?: number }>]> = [
  [/strategy|positioning/i,     Target],
  [/naming|voice|tone/i,         Mic],
  [/logo|visual|identity/i,      Palette],
  [/typograph|type|colour/i,     Type],
  [/guideline|document|policy/i, BookOpen],
  [/gpt|ai-power|brand voice/i,  Bot],
  [/content ops|automation|workflow/i, Workflow],
  [/plugin|wordpress|integration/i, Puzzle],
  [/gutenberg|block/i,           Layers],
  [/api|stripe|hubspot|openai/i, Plug],
  [/admin|dashboard|tooling/i,   LayoutDashboard],
  [/consolidat|refactor/i,       FileCode],
  [/training|team/i,             GraduationCap],
  [/headless|next\.js|react/i,   Braces],
  [/ecommerce|woocommerce|shopify/i, Megaphone],
  [/performance|core web vitals/i, Gauge],
  [/accessibility|wcag/i,        Accessibility],
  [/analytics|tracking|reporting/i, BarChart3],
  [/google ads|meta|linkedin|tiktok/i, Target],
  [/creative|video/i,            Video],
  [/landing page|cro/i,          MousePointerClick],
  [/seo audit|technical seo|link/i, Link2],
  [/local seo|google business/i, MapPin],
  [/editorial|calendar|content strategy/i, FileText],
  [/strategy call|review/i,      Rocket],
  [/priority|turnaround/i,       Zap],
  [/specialist|network/i,        ShieldCheck],
];

function iconFor(label: string) {
  for (const [re, Comp] of DELIVERABLE_ICON_MAP) {
    if (re.test(label)) return Comp;
  }
  return Sparkles;
}

type Deliverable = string | { title: string; desc: string };
type HeroStats = Array<{ k: string; v: string }>;

// Service-specific content: deliverables, process, featured case study slugs,
// service FAQ, launch headline. Copy from message 5.
const SERVICE_CONTENT: Record<
  string,
  {
    deliverables: Deliverable[];
    process?: { step: string; title: string; body: string }[];
    featured?: string[];
    faq?: { q: string; a: string }[];
    launchHeadline: string;
    heroStats?: HeroStats;
    heroClients?: string[];
  }
> = {
  'brand-identity': {
    heroStats: [
      { k: 'Typical engagement', v: '5–9 weeks' },
      { k: 'Deliverables',       v: '6 modules' },
      { k: 'Reply time',         v: 'Under 4h' },
      { k: 'Ownership',          v: 'You keep it' },
    ],
    heroClients: ['News UK', 'Royal London', 'TEDx', 'Al Jannah'],
    deliverables: [
      { title: 'Brand strategy & positioning', desc: 'Audit, interviews, competitor map — a clear answer for who you are and who you\'re for.' },
      { title: 'Naming & verbal identity',     desc: 'Name exploration, tagline, voice and tone system — the words your brand owns.' },
      { title: 'Logo design & visual system',  desc: 'Primary mark, supporting marks, grids, motion — a system built to flex across touchpoints.' },
      { title: 'Typography & colour palette',  desc: 'Type hierarchy, colour roles, accessibility-checked contrast — tokens, not swatches.' },
      { title: 'Tone of voice guidelines',     desc: 'How you write, how you don\'t, with do/don\'t examples from your actual content.' },
      { title: 'Brand guidelines document',    desc: 'Designed PDF + source files + asset library — everything your team needs to run the brand.' },
    ],
    process: [
      { step: '01', title: 'Discovery', body: 'Audit, interviews, competitor analysis (1–2 weeks)' },
      { step: '02', title: 'Strategy', body: 'Positioning, voice, creative direction (1–2 weeks)' },
      { step: '03', title: 'Design', body: 'Logo, system, applications (2–4 weeks)' },
      { step: '04', title: 'Handover', body: 'Guidelines document, source files, support (1 week)' },
    ],
    featured: ['news-uk', 'al-jannah-villa-marrakech', 'kbmd'],
    faq: [
      { q: 'Can you refresh an existing brand without starting from scratch?', a: 'Yes. Many engagements are refreshes rather than rebuilds — honouring existing equity where it serves you and replacing what no longer does.' },
      { q: 'Do you work with in-house teams as an external direction?', a: 'Often. I can provide creative direction and system architecture while your in-house team executes day-to-day, with check-ins and approvals at key moments.' },
      { q: 'How do brand guidelines get used after handover?', a: 'Guidelines ship as a designed document plus source files. They describe rules, show approved applications, and — where helpful — include ready-to-use templates for common assets.' },
    ],
    launchHeadline: 'brand',
  },
  'ai-automation': {
    heroStats: [
      { k: 'Typical pilot',   v: '3–5 weeks' },
      { k: 'Deliverables',    v: '6 modules' },
      { k: 'Ship cycle',      v: 'Pilot → prod' },
      { k: 'Reply time',      v: 'Under 4h' },
    ],
    heroClients: ['News UK', 'Royal London', 'TEDx'],
    deliverables: [
      { title: 'Custom GPTs trained on brand voice',  desc: 'Voice-trained assistants that write like you and refuse what you\'d refuse — deployed to your team.' },
      { title: 'Content operations automation',       desc: 'Editorial pipelines, draft generation, fact-check checkpoints — human in the loop, not replaced by it.' },
      { title: 'AI-powered WordPress plugins',        desc: 'Gutenberg blocks and admin tooling that call AI endpoints directly from your existing site.' },
      { title: 'Workflow integrations',               desc: 'Zapier, Make, n8n, or native API — whatever route keeps you off brittle glue code.' },
      { title: 'AI strategy & policy documentation',  desc: 'What AI is used for, what it isn\'t, what the guardrails are — written, signed off, shared.' },
      { title: 'Team training & handover',            desc: 'Live sessions + recorded walkthroughs + ongoing support. Your team runs it; I step back.' },
    ],
    process: [
      { step: '01', title: 'Audit', body: 'What work could AI usefully reduce or eliminate?' },
      { step: '02', title: 'Pilot', body: 'Ship one AI workflow, measure, iterate' },
      { step: '03', title: 'Rollout', body: 'Extend to adjacent workflows once proven' },
      { step: '04', title: 'Documentation', body: 'Policies, guardrails, team training' },
    ],
    faq: [
      { q: 'How is this different from just using ChatGPT?', a: 'A consumer ChatGPT account doesn\'t know your brand, your clients, your past work, or your editorial standards. Custom GPTs and brand-trained workflows do.' },
      { q: 'Who owns the custom GPT — you or OpenAI?', a: 'You own the prompts, the training data, and the workflow. OpenAI hosts the model that runs it. Your content stays yours.' },
      { q: 'Can AI plugins work with the Gutenberg block editor?', a: 'Yes — bespoke Gutenberg blocks that call AI endpoints are one of the more popular patterns.' },
    ],
    launchHeadline: 'AI workflow',
  },
  'wordpress-plugin-development': {
    heroStats: [
      { k: 'Typical engagement', v: '4–12 weeks' },
      { k: 'Deliverables',       v: '7 modules' },
      { k: 'Code ownership',     v: 'You keep it' },
      { k: 'Reply time',         v: 'Under 4h' },
    ],
    heroClients: ['DCD Connect', 'Japex', 'Sainsbury\'s'],
    deliverables: [
      { title: 'Custom WordPress plugins',    desc: 'GPL or bespoke licence — purpose-built features your stock plugin library can\'t reach.' },
      { title: 'Gutenberg block development', desc: 'First-class blocks with proper editor UX, dynamic rendering, and inspector controls.' },
      { title: 'WooCommerce extensions',      desc: 'Checkout tweaks, payment integrations, custom product types — shipped, not shoehorned.' },
      { title: 'API integrations',            desc: 'Stripe, HubSpot, OpenAI, Zapier, Make — whatever endpoint your workflow needs.' },
      { title: 'Admin tooling & dashboards',  desc: 'Custom admin screens that turn your WordPress into a proper internal tool for your team.' },
      { title: 'Plugin consolidation',        desc: 'Replace three bloated plugins with one clean one. Faster, safer, documented.' },
      { title: 'AI-extended plugins',         desc: 'Plugins that call GPT from admin, generate drafts, summarise comments — without leaving WP.' },
    ],
    process: [
      { step: '01', title: 'Scope', body: "What's the plugin actually doing, for whom?" },
      { step: '02', title: 'Build', body: 'Incremental, testable commits with staging review' },
      { step: '03', title: 'QA', body: 'On your actual WordPress install, not a sandbox' },
      { step: '04', title: 'Handover', body: 'Full source, documentation, update policy' },
    ],
    faq: [
      { q: 'Who owns the plugin — me or you?', a: 'You do. Source, licence terms, and repository access transfer on final invoice.' },
      { q: 'Do you support plugins after handover?', a: 'Optionally — either ad-hoc or as part of a Growth Partnership retainer. Clean handover is also fine if you\'ve got an internal team.' },
      { q: 'Can you work with my existing plugin that needs fixing/extending?', a: 'Yes. Audit first, then a clear proposal for what\'s worth fixing vs rewriting.' },
      { q: 'Can plugins integrate with AI / OpenAI?', a: 'Yes — plugins that call OpenAI or other LLM APIs from inside WordPress admin are increasingly common, and one of my specialisms.' },
    ],
    launchHeadline: 'plugin',
  },
  'web-development': {
    heroStats: [
      { k: 'Typical engagement', v: '6–14 weeks' },
      { k: 'Deliverables',       v: '7 modules' },
      { k: 'Platform lock',      v: 'None' },
      { k: 'Reply time',         v: 'Under 4h' },
    ],
    heroClients: ['Tulsi Vagjiani', 'Vijay\'s Virasat', 'MHV Clinic'],
    deliverables: [
      { title: 'Next.js / React websites',          desc: 'Modern stack, first-class SEO, server components where they help — not dogma.' },
      { title: 'Headless WordPress',                desc: 'WP as a content source, React on the frontend — editor-friendly, performance-first.' },
      { title: 'Higher-tier WordPress',             desc: 'Elementor Pro, Bricks, or a properly custom theme — when WP is still the right answer.' },
      { title: 'E-commerce',                        desc: 'WooCommerce or Shopify, whichever fits. Proper product architecture, not just a skin.' },
      { title: 'Performance optimisation',          desc: 'Real Core Web Vitals, real lighthouse scores, real faster pages — not vanity numbers.' },
      { title: 'Accessibility compliance',          desc: 'WCAG 2.2 AA as the baseline — keyboard, screen reader, reduced motion all tested.' },
      { title: 'Analytics & conversion tracking',   desc: 'GA4, server events, Plausible — whichever stack. Set up once, not left to rot.' },
    ],
    process: [
      { step: '01', title: 'Discovery', body: 'User journeys, content audit, technical requirements' },
      { step: '02', title: 'Design', body: 'Wireframes, visual design, prototyping (if not already done)' },
      { step: '03', title: 'Build', body: 'Component-driven development with staging reviews' },
      { step: '04', title: 'Launch', body: 'Migration, DNS, final QA, handover' },
    ],
    featured: ['tulsi-vagjiani', 'vijays-virasat', 'mhv-clinic'],
    faq: [
      { q: 'WordPress or Next.js — which should I choose?', a: 'Depends on who updates the site. Content-heavy sites edited by non-developers: WordPress. Performance-critical or app-like sites: Next.js. Both work, the trade-offs are real.' },
      { q: 'How do you handle ongoing maintenance?', a: 'Either as a Growth Partnership retainer, an ad-hoc support agreement, or clean handover to your team. Clean handover is the default.' },
      { q: 'Can you migrate my existing site without downtime?', a: 'Yes. DNS cutover, prerender testing, and a rollback plan are standard parts of the launch process.' },
    ],
    launchHeadline: 'website',
  },
  'ppc-paid-media': {
    heroStats: [
      { k: 'Cadence',       v: 'Monthly' },
      { k: 'Platforms',     v: '4+ channels' },
      { k: 'Reporting',     v: 'Monthly' },
      { k: 'Minimum term',  v: '3 months' },
    ],
    heroClients: ['Fireaway', 'Japex', 'MHV Clinic'],
    deliverables: [
      { title: 'Google Ads',              desc: 'Search, Display, Performance Max, Shopping — structured campaigns, not one mega-campaign.' },
      { title: 'Meta Ads',                desc: 'Facebook + Instagram with creative variants tested weekly, not one ad burning through budget.' },
      { title: 'LinkedIn Ads',            desc: 'For B2B only — tight targeting, high-fidelity creative, real lead cost tracking.' },
      { title: 'TikTok Ads',              desc: 'When your audience is actually there — short-form creative produced or directed in-house.' },
      { title: 'Creative production',     desc: 'Static + short-form video shot to platform spec. Not stock footage with a logo.' },
      { title: 'Landing page optimisation', desc: 'Match-message landing pages with proper conversion tracking and iterative testing.' },
      { title: 'Monthly reporting & review', desc: 'What worked, what didn\'t, what we\'re doing next — in plain English, not dashboards.' },
    ],
    featured: ['fireaway-pizza', 'japex-automotive', 'mhv-clinic'],
    launchHeadline: 'campaign',
  },
  'seo-organic-growth': {
    heroStats: [
      { k: 'Cadence',          v: 'Monthly' },
      { k: 'Audit turnaround', v: '1–2 weeks' },
      { k: 'Reporting',        v: 'Monthly' },
      { k: 'Minimum term',     v: '6 months' },
    ],
    heroClients: ['Fireaway', 'Metro Laundrette', 'DCD Connect'],
    deliverables: [
      { title: 'Technical SEO audits',          desc: 'Crawl, index, schema, hreflang, core-vitals — the full site health picture, prioritised by impact.' },
      { title: 'Content strategy',              desc: 'Keyword mapping to revenue, editorial calendar, brief templates your writers can actually follow.' },
      { title: 'Local SEO',                     desc: 'Google Business Profile, citations, reviews — the unglamorous work that ranks local businesses.' },
      { title: 'Link building',                 desc: 'Editorial, PR, partnerships — links that actually signal quality, not just count.' },
      { title: 'Core Web Vitals optimisation',  desc: 'LCP, INP, CLS — measured on real devices, fixed where it moves the needle.' },
      { title: 'Monthly reporting',             desc: 'What ranks, what moved, what we\'re doing next — quarterly strategy review built in.' },
    ],
    featured: ['fireaway-pizza', 'metro-laundrette-dry-cleaners'],
    launchHeadline: 'organic growth',
  },
  'growth-partnership': {
    deliverables: [
      { title: 'Monthly strategy call (90 min)', desc: 'Priorities, blockers, next month\'s plan — the rhythm every retainer needs.' },
      { title: 'Agreed hours per month',         desc: 'Banked across every practice — brand, AI, plugins, web. Use them where they land hardest.' },
      { title: 'Priority turnaround',            desc: 'Urgent work jumps the queue, typical reply under 4 hours during UK business hours.' },
      { title: 'Quarterly brand & performance review', desc: 'Every three months — what\'s working, what to change, a fresh plan for the next 90 days.' },
      { title: 'Specialist network access',      desc: 'Trusted collaborators (photo, motion, copy) brought in at cost when scope demands.' },
    ],
    launchHeadline: 'partnership',
  },
};

function deliverableToParts(d: Deliverable) {
  if (typeof d === 'string') return { title: d, desc: '' };
  return d;
}

export function generateStaticParams() {
  // growth-partnership lives at /engage/growth-partnership/.
  // wordpress-operations has its own bespoke page at app/services/wordpress-operations/.
  // Unpublished services are filtered out by getAllServices().
  return getAllServices()
    .filter((s) => s.slug !== 'growth-partnership' && s.slug !== 'wordpress-operations')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return { title: 'Not found' };
  return {
    title: `${s.label} — Terence Meghani`,
    description: s.longDescription,
    keywords: s.keywords,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const content = SERVICE_CONTENT[slug] ?? { deliverables: [], launchHeadline: 'brief' };

  const allStudies = getAllCaseStudies();
  const featuredStudies = (content.featured ?? [])
    .map((fs) => allStudies.find((s) => s.slug === fs))
    .filter((s): s is NonNullable<typeof s> => !!s);

  const HeroIcon = SERVICE_ICON[slug] ?? Sparkles;
  const heroStats = content.heroStats;
  const heroClients = content.heroClients;

  return (
    <>
      <section className="page-hero with-glow grid-texture">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#services">Services</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: 'var(--color-rocket)' }}>{service.label}</li>
            </ol>
          </nav>

          <div
            className="svc-hero-grid"
            data-svc-code={`S/${String((servicesData.services.findIndex((s) => s.slug === slug) ?? 0) + 1).padStart(2, '0')}`}
            style={{ marginTop: 32 }}
          >
            <div>
              <div className="kicker-row">
                <Kicker>
                  {service.tier === 'core' ? 'Core service' : 'Also offering'}
                </Kicker>
              </div>
              <h1>
                {service.label.split(' ').slice(0, -1).join(' ')}{' '}
                <em>{service.label.split(' ').slice(-1)[0]}</em>
              </h1>
              <p
                style={{
                  marginTop: 18,
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px, 2vw, 30px)',
                  lineHeight: 1.25,
                  color: 'var(--color-rocket)',
                  maxWidth: '30ch',
                }}
              >
                {service.tagline}
              </p>
              <hr className="hero-rule" aria-hidden="true" />
              <p className="lead">{service.longDescription}</p>

              <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button href="https://calendly.com/terencemeghani" external variant="primary">
                  Book a call
                </Button>
                <Button href="/contact/" variant="secondary">
                  Send a brief
                </Button>
              </div>
            </div>

            {(heroStats || heroClients) && (
              <aside className="svc-visual" aria-label={`${service.label} at a glance`}>
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
                      S / {String((servicesData.services.findIndex((s) => s.slug === slug) ?? 0) + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="badge-wrap" aria-hidden="true">
                    <span className="spark" />
                    <span className="spark" />
                    <div className="badge">
                      <HeroIcon size={52} strokeWidth={1.6} />
                    </div>
                  </div>
                </div>

                {heroStats && (
                  <div className="stats">
                    {heroStats.map((st) => (
                      <div key={st.k} className="stat">
                        <span className="k">{st.k}</span>
                        <span className="v">{st.v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {heroClients && heroClients.length > 0 && (
                  <div className="clients">
                    <h4>Recent clients</h4>
                    <ul>
                      {heroClients.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      {content.deliverables.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow"><Kicker>Deliverables</Kicker></span>
                <h2>
                  What&rsquo;s <em>included.</em>
                </h2>
              </div>
              <span className="sec-aside">
                {String(content.deliverables.length).padStart(2, '0')} · items
              </span>
            </div>
            <div className="feature-grid">
              {content.deliverables.map((raw, i) => {
                const { title, desc } = deliverableToParts(raw);
                const Icon = iconFor(title);
                return (
                  <article key={title} className="feature-card">
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="title">{title}</span>
                    {desc && <span className="desc">{desc}</span>}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {content.process && (
        <section className="section-pad" style={{ background: 'var(--color-char)' }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow"><Kicker>Process</Kicker></span>
                <h2>
                  How a typical <em>engagement runs.</em>
                </h2>
              </div>
              <span className="sec-aside">
                {String(content.process.length).padStart(2, '0')} · phases
              </span>
            </div>
            <ol className="stepper" style={{ listStyle: 'none', padding: 0 }}>
              {content.process.map((p) => (
                <li key={p.step} className="step">
                  <div className="bullet">{p.step}</div>
                  <h3 className="step-title">{p.title}</h3>
                  <p className="step-body">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Productised plugins — only on the WordPress Plugin Development page */}
      {slug === 'wordpress-plugin-development' && (
        <section className="section-pad" style={{ background: 'var(--color-char-2)' }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="sec-eyebrow"><Kicker>Productised plugins</Kicker></span>
                <h2>
                  Six productised plugins, <em>three verticals.</em>
                </h2>
              </div>
              <Link
                href="/plugins/"
                className="sec-aside"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-rocket)' }}
              >
                View all plugins <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <p style={{ marginTop: -8, marginBottom: 24, color: 'var(--color-fog)', fontSize: 15.5, lineHeight: 1.6, maxWidth: '64ch' }}>
              What we ship to clients also runs as productised plugins for the wider market.
              Same architecture, same engineering standards.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {getAllPlugins().map((p, i) => (
                <PluginCard key={p.slug} plugin={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured case studies */}
      {featuredStudies.length > 0 && (
        <section className="section-pad" style={{ background: slug === 'wordpress-plugin-development' ? 'var(--color-char)' : 'var(--color-char-2)' }}>
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
                View all {allStudies.length} projects <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="cs-related-grid">
              {featuredStudies.map((s) => (
                <WorkCard key={s.slug} study={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service FAQ */}
      {content.faq && content.faq.length > 0 && (
        <section className="section-pad" style={{ background: slug === 'wordpress-plugin-development' ? 'var(--color-char-2)' : 'var(--color-char)' }}>
          <div className="wrap">
            <div className="faq-split">
              <div className="faq-intro">
                <Kicker>Questions</Kicker>
                <h2>
                  Answered, <em>honestly.</em>
                </h2>
                <p>
                  If yours isn&rsquo;t listed, ask it on a discovery call — {' '}
                  thirty minutes, no slides, no fluff.
                </p>
              </div>
              <div className="accordion">
                {content.faq.map((f, i) => (
                  <details key={f.q} open={i === 0}>
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
      )}

      <LaunchCTA headline={content.launchHeadline} />
    </>
  );
}
