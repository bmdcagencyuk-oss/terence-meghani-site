import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import servicesData from '@/data/services.json';
import { getAllCaseStudies } from '@/lib/case-studies';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { WorkCard } from '@/components/case-study/WorkCard';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

// Service-specific content: deliverables, process, featured case study slugs,
// service FAQ, launch headline. Copy from message 5.
const SERVICE_CONTENT: Record<
  string,
  {
    deliverables: string[];
    process?: { step: string; title: string; body: string }[];
    featured?: string[];
    faq?: { q: string; a: string }[];
    launchHeadline: string;
  }
> = {
  'brand-identity': {
    deliverables: [
      'Brand strategy & positioning',
      'Naming & verbal identity',
      'Logo design & visual system',
      'Typography & colour palette',
      'Tone of voice guidelines',
      'Brand guidelines document',
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
    deliverables: [
      'Custom GPTs trained on brand voice',
      'Content operations automation',
      'AI-powered WordPress plugins',
      'Workflow integrations (Zapier, Make, n8n, native API)',
      'AI strategy & policy documentation',
      'Team training & handover',
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
    deliverables: [
      'Custom WordPress plugins (GPL or bespoke licence)',
      'Gutenberg block development',
      'WooCommerce extensions',
      'API integrations (Stripe, HubSpot, OpenAI, etc.)',
      'Admin tooling & custom dashboards',
      'Plugin consolidation & refactoring',
      'AI-extended plugins',
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
    deliverables: [
      'Next.js / React websites',
      'Headless WordPress (WP as CMS, React on frontend)',
      'High-tier WordPress (Elementor Pro, Bricks, custom themes)',
      'E-commerce (WooCommerce or Shopify)',
      'Performance optimisation',
      'Accessibility compliance (WCAG 2.2 AA)',
      'Analytics & conversion tracking',
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
    deliverables: [
      'Google Ads (Search, Display, Performance Max, Shopping)',
      'Meta Ads (Facebook, Instagram)',
      'LinkedIn Ads',
      'TikTok Ads',
      'Creative production (static + short-form video)',
      'Landing page optimisation',
      'Monthly reporting & strategy review',
    ],
    featured: ['fireaway-pizza', 'japex-automotive', 'mhv-clinic'],
    launchHeadline: 'campaign',
  },
  'seo-organic-growth': {
    deliverables: [
      'Technical SEO audits',
      'Content strategy & editorial calendar',
      'Local SEO (Google Business Profile, citations, reviews)',
      'Link building (editorial, not spammy)',
      'Core Web Vitals optimisation',
      'Monthly reporting',
    ],
    featured: ['fireaway-pizza', 'metro-laundrette-dry-cleaners'],
    launchHeadline: 'organic growth',
  },
  'growth-partnership': {
    deliverables: [
      'Monthly strategy call (90 min)',
      'Agreed hours per month across all practices',
      'Priority turnaround on urgent work',
      'Quarterly brand & performance review',
      'Access to trusted specialist network when needed',
    ],
    launchHeadline: 'partnership',
  },
};

export function generateStaticParams() {
  // growth-partnership's canonical URL is /engage/growth-partnership/, not /services/growth-partnership/
  return servicesData.services
    .filter((s) => s.slug !== 'growth-partnership')
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = servicesData.services.find((x) => x.slug === slug);
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
  const service = servicesData.services.find((s) => s.slug === slug);
  if (!service) notFound();
  const content = SERVICE_CONTENT[slug] ?? { deliverables: [], launchHeadline: 'brief' };

  const allStudies = getAllCaseStudies();
  const featuredStudies = (content.featured ?? [])
    .map((fs) => allStudies.find((s) => s.slug === fs))
    .filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <>
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-rocket transition-colors">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#services" className="hover:text-rocket transition-colors">Services</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-rocket">{service.label}</li>
            </ol>
          </nav>

          <Kicker className="mt-10 text-rocket">
            {service.tier === 'core' ? 'Core service' : 'Also offering'}
          </Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            {service.label}
          </h1>
          <p className="mt-4 font-italic italic text-2xl text-rocket">
            {service.tagline}
          </p>
          <p className="mt-8 max-w-2xl text-lg text-mist leading-relaxed">
            {service.longDescription}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="https://calendly.com/terencemeghani" external variant="primary" size="lg">
              Book a call
            </Button>
            <Button href="/contact/" variant="secondary" size="lg">
              Send a brief
            </Button>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      {content.deliverables.length > 0 && (
        <section className="section-pad bg-char-2">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Kicker>Deliverables</Kicker>
            <h2
              className="mt-6 font-display text-white"
              style={{ fontSize: 'var(--text-display-md)' }}
            >
              What&rsquo;s{' '}
              <em className="font-italic italic text-rocket">included.</em>
            </h2>
            <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {content.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 text-lg text-mist border-b border-hairline-subtle pb-4"
                >
                  <span className="text-rocket shrink-0">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Process */}
      {content.process && (
        <section className="section-pad bg-char">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Kicker>Process</Kicker>
            <h2
              className="mt-6 font-display text-white"
              style={{ fontSize: 'var(--text-display-md)' }}
            >
              How a typical{' '}
              <em className="font-italic italic text-rocket">engagement runs.</em>
            </h2>
            <ol className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.process.map((p) => (
                <li key={p.step} className="border-l-2 border-rocket pl-5">
                  <span className="font-mono text-xs text-rocket tracking-[0.2em]">{p.step}</span>
                  <h3 className="mt-2 font-display text-2xl text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-mist leading-relaxed">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Featured case studies */}
      {featuredStudies.length > 0 && (
        <section className="section-pad bg-char-2">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <Kicker>Featured work</Kicker>
            <h2
              className="mt-6 font-display text-white"
              style={{ fontSize: 'var(--text-display-md)' }}
            >
              Where this{' '}
              <em className="font-italic italic text-rocket">shows up.</em>
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredStudies.map((s) => (
                <WorkCard key={s.slug} study={s} />
              ))}
            </div>
            <Link
              href="/work/"
              className="mt-10 inline-flex items-center gap-2 text-rocket font-mono text-xs uppercase tracking-wider hover:gap-3 transition-all"
            >
              View all 24 projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* Service FAQ */}
      {content.faq && content.faq.length > 0 && (
        <section className="section-pad bg-char">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <Kicker>Questions</Kicker>
            <h2
              className="mt-6 font-display text-white"
              style={{ fontSize: 'var(--text-display-md)' }}
            >
              Answered.
            </h2>
            <dl className="mt-12 divide-y divide-hairline-subtle border-y border-hairline-subtle">
              {content.faq.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="font-display text-xl text-white">{f.q}</dt>
                  <dd className="mt-3 text-mist leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <LaunchCTA headline={content.launchHeadline} />
    </>
  );
}
