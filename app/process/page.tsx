import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { breadcrumbSchema, ldJsonProps } from '@/lib/schema';
import { SITE } from '@/lib/site';

const PROCESS_TITLE = 'Process — how engagements actually work';
const PROCESS_DESCRIPTION =
  'From discovery call to handover. The honest description of what happens when you work with Terence Meghani Studio — designed to qualify serious buyers, not impress them.';

export const metadata: Metadata = {
  title: PROCESS_TITLE,
  description: PROCESS_DESCRIPTION,
  alternates: { canonical: '/process/' },
  openGraph: {
    title: 'Process — Terence Meghani Studio',
    description: 'From discovery call to handover. How engagements actually work.',
    url: '/process/',
  },
  twitter: {
    title: 'Process — Terence Meghani Studio',
    description: 'From discovery call to handover. How engagements actually work.',
  },
};

const BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Process', href: '/process/' },
]);

const STEP_ITEMS = [
  {
    name: 'The discovery call',
    description:
      '30 minutes, free, no deck. Figure out whether the studio is the right fit before either side spends more time.',
  },
  {
    name: 'The audit (paid)',
    description:
      'Written diagnosis, fixed fee. £1,950 deductible against first three months of Operations retainer.',
  },
  {
    name: 'The proposal (or the referral)',
    description:
      "Fixed-scope proposal, or referral to a better-fit studio, or honest \"you don't need ongoing work\".",
  },
  {
    name: 'Kickoff',
    description:
      'Within two weeks of proposal acceptance. One-hour onboarding for retainers; 90 minutes for projects.',
  },
  {
    name: 'The work',
    description: 'Monthly written reviews, milestone-based delivery, agreed cadence.',
  },
  {
    name: 'Handover',
    description:
      'Source code, full IP transfer, documentation, transition support. Frictionless handover is the work.',
  },
];

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE.url}/process/`,
  name: 'Process — Terence Meghani Studio',
  description:
    'How engagements with Terence Meghani Studio actually work — from discovery call to handover.',
  url: `${SITE.url}/process/`,
  mainEntity: {
    '@type': 'ItemList',
    name: 'Engagement process',
    itemListElement: STEP_ITEMS.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      description: s.description,
    })),
  },
  isPartOf: { '@id': SITE.ids.website },
  about: { '@id': SITE.ids.studio },
};

const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--f-mono)',
  fontSize: '0.9em',
  padding: '1px 6px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--color-hairline-2)',
  borderRadius: 2,
};

export default function ProcessPage() {
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
              <li>Process</li>
            </ol>
          </nav>
          <div className="kicker-row">
            <Kicker>The honest version</Kicker>
          </div>
          <h1>
            Process — <em>how engagements actually work.</em>
          </h1>
          <hr className="hero-rule" aria-hidden="true" />
          <p className="lead">
            <em>The honest description, not the marketing diagram.</em>
          </p>
        </div>
      </section>

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
              Most studio process pages are abstract: discovery, strategy, design, build, launch.
              Five steps in a colourful diagram. They tell a buyer almost nothing about what
              working with the studio is actually like — and they&rsquo;re identical across every
              studio that has one.
            </p>
            <p>
              This page is the opposite. It describes the actual rhythm of the work — what happens
              in week one, what happens in month three, when I say no, and what I ask for from
              you. It exists to help you decide whether we should work together before either of
              us spends an hour on a discovery call.
            </p>
          </div>
        </div>
      </section>

      {/* Step 1 */}
      <section className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">
              01
            </span>
            <span className="num">Step 1</span>
            <h2>The discovery call</h2>
          </div>
          <div className="prose">
            <p>Thirty minutes. Free. No deck.</p>
            <p>
              You book the call via Calendly. Before the call, I read whatever public surface you
              have — site, LinkedIn, recent press, your existing case studies if you&rsquo;re an
              agency. I come prepared with three or four specific things rather than a generic
              intake template.
            </p>
            <p>
              The call has one purpose: figure out whether the studio is the right fit for the
              problem. Sometimes the answer is &ldquo;no, but here&rsquo;s who is&rdquo; —
              I&rsquo;d rather refer you out than take work I&rsquo;m not the right person for.
              Sometimes the answer is &ldquo;yes, here&rsquo;s what the engagement would look
              like.&rdquo;
            </p>
            <p>
              Either way, you leave the call with a concrete next step. No follow-up sequence, no
              nurture funnel, no &ldquo;let me send some thoughts.&rdquo; The work starts on the
              call or it doesn&rsquo;t.
            </p>
          </div>
        </div>
      </section>

      {/* Step 2 */}
      <section className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">
              02
            </span>
            <span className="num">Step 2</span>
            <h2>The audit (paid)</h2>
          </div>
          <div className="prose">
            <p>
              If we&rsquo;re a fit and the work involves WordPress, the next step is usually a
              paid audit. £1,950 fixed fee. The audit produces a written diagnosis — server logs,
              database health, mail authentication, performance, security posture, and concrete
              recommendations prioritised by impact.
            </p>
            <p>Three things matter about the audit:</p>
            <p>
              The fee is <strong>deductible</strong> against the first three months of an
              Operations retainer at Orbit or Apogee tier. If we move forward, you&rsquo;ve
              effectively prepaid the first chunk of the engagement.
            </p>
            <p>
              The audit is <strong>the deliverable</strong> — not a sales document. The written
              diagnosis is yours regardless of what comes next. Some clients take the audit, fix
              the issues themselves, and come back six months later. That&rsquo;s fine.
            </p>
            <p>
              The audit is <strong>the qualifier</strong>. By the end of it, both of us know
              whether ongoing work makes sense, what tier fits the operational reality, and what
              the realistic outcomes are. No proposal-by-instinct.
            </p>
            <p>
              For brand, plugin development, and AI engagements, the equivalent is a paid scoping
              engagement (typically £750–£1,500) producing a written scope document with
              fixed-price quotes for the actual build. Same logic: the scope is the deliverable,
              the engagement is qualified by it.
            </p>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">
              03
            </span>
            <span className="num">Step 3</span>
            <h2>The proposal (or the referral)</h2>
          </div>
          <div className="prose">
            <p>After the audit, one of three things happens:</p>
            <p>
              <strong>You get a proposal.</strong> Fixed scope, fixed price for project work,
              monthly rate for retainers. No surprise scope creep clauses, no tiered upsell
              structures designed to pressure you into the higher tier. The proposal reflects what
              was discovered in the audit.
            </p>
            <p>
              <strong>You get a referral.</strong> If the audit reveals work I&rsquo;m not the
              right person for — high-volume e-commerce, native mobile, infrastructure work
              outside WordPress — I&rsquo;ll refer you to someone who is. I keep a small list of
              people I trust for specific work types.
            </p>
            <p>
              <strong>
                You get a &ldquo;you don&rsquo;t need ongoing work.&rdquo;
              </strong>{' '}
              Some audits reveal that the site is in fine shape and the client&rsquo;s existing
              in-house team can handle maintenance. In that case, the audit is the engagement. We
              part on good terms.
            </p>
            <p>
              The third outcome is rare but it happens. It&rsquo;s also why the audit is paid
              up-front — if it weren&rsquo;t, the incentive would be to find ongoing work whether
              the client needs it or not.
            </p>
          </div>
        </div>
      </section>

      {/* Step 4 */}
      <section className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">
              04
            </span>
            <span className="num">Step 4</span>
            <h2>Kickoff</h2>
          </div>
          <div className="prose">
            <p>
              If we move forward, kickoff happens within two weeks of proposal acceptance.
            </p>
            <p>
              For retainer work (WordPress Operations, Growth Partnership), kickoff is a one-hour
              onboarding call: access handover, baseline measurement, agreed cadence (most clients
              land on monthly Loom + written review with quarterly in-person if Hertfordshire-based
              or London-adjacent). The first month establishes the rhythm; nothing dramatic should
              happen in month one.
            </p>
            <p>
              For project work (plugin development, brand engagements, AI implementations),
              kickoff is a longer working session — usually 90 minutes — to align on scope detail,
              agree milestones, and surface anything that emerged between audit and signed
              proposal. Project work then runs to its agreed timeline.
            </p>
            <p>
              I don&rsquo;t do &ldquo;discovery week&rdquo; theatre. The audit was the discovery.
              Kickoff is the start of the work.
            </p>
          </div>
        </div>
      </section>

      {/* Step 5 */}
      <section className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">
              05
            </span>
            <span className="num">Step 5</span>
            <h2>The work</h2>
          </div>
          <div className="prose">
            <p>Here&rsquo;s what the rhythm actually looks like, by engagement type:</p>
            <p>
              <strong>Operations retainers</strong> — monthly written review delivered as a PDF
              with a Loom walkthrough. The PDF is structured: what changed this month, what was
              diagnosed and resolved, what&rsquo;s queued for next month, what risks I&rsquo;m
              watching. Boost tier delivers a short summary; Orbit and Apogee deliver progressively
              deeper diagnostics. Apogee includes quarterly in-person reviews where applicable.
            </p>
            <p>
              <strong>Plugin development</strong> — milestone-based with a working preview at each
              milestone. You see the plugin functioning before you sign off on it, not after.
              Documentation and handover ship with the final milestone, not as an afterthought.
            </p>
            <p>
              <strong>Brand engagements</strong> — three rounds of revision built into the scope.
              Beyond three rounds means we&rsquo;re solving the wrong problem and need to pause
              and re-align rather than iterate harder. Most engagements use one or two rounds.
            </p>
            <p>
              <strong>AI &amp; Automation</strong> — split into discovery (understanding your
              voice and team workflows), build (custom GPTs, prompt systems, content ops
              infrastructure), and embedding (training your team to use what was built). The
              embedding phase is non-negotiable — AI tools that aren&rsquo;t adopted are worse
              than no AI tools.
            </p>
            <p>
              Across every engagement: weekly brief written update, response to substantive emails
              within 24 hours, meetings only when meetings are the right format. Most things get
              resolved in writing.
            </p>
          </div>
        </div>
      </section>

      {/* Step 6 */}
      <section className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="stage" aria-hidden="true">
              06
            </span>
            <span className="num">Step 6</span>
            <h2>Handover</h2>
          </div>
          <div className="prose">
            <p>
              Every engagement ends with a structured handover. The format depends on the
              engagement type:
            </p>
            <p>
              For project work: source code in your GitHub, full IP transfer in writing, written
              admin documentation, training videos where useful, a 60-minute live training session
              if requested.
            </p>
            <p>
              For retainers: 30 days of transition support if you&rsquo;re moving the work
              in-house or to another partner. I don&rsquo;t make handover difficult. The
              relationship continues only if it&rsquo;s mutually useful.
            </p>
            <p>
              The studio&rsquo;s reputation is built on what clients say after the engagement
              ends, not during it. Making handover frictionless is the work.
            </p>
          </div>
        </div>
      </section>

      {/* When I say no */}
      <section className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="num">Filters</span>
            <h2>When I say no</h2>
          </div>
          <div className="prose">
            <p>Some honest filters that mean we&rsquo;re probably not the right fit:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 22, margin: 0 }}>
              <li>
                <strong>Adversarial relationships from the start.</strong> If kickoff feels like a
                negotiation rather than a collaboration, it usually doesn&rsquo;t get easier.
              </li>
              <li>
                <strong>&ldquo;Beat the previous quote.&rdquo;</strong> Studios that compete on
                lowest price race each other to bad work. I&rsquo;d rather refer you to someone
                who fits your budget than match a price that doesn&rsquo;t reflect the work.
              </li>
              <li>
                <strong>Demands for guaranteed outcomes I can&rsquo;t actually guarantee.</strong>{' '}
                Conversion rates, traffic numbers, ranking positions — I&rsquo;ll commit to honest
                effort, not arbitrary numbers I can&rsquo;t control.
              </li>
              <li>
                <strong>Clients who fired the last three vendors.</strong> If the same problem
                keeps surfacing across vendors, the problem may be on the client side. Worth a
                candid conversation before signing.
              </li>
              <li>
                <strong>Ethics misalignments.</strong> Specific industries I won&rsquo;t work in,
                specific tactics I won&rsquo;t deploy. We&rsquo;ll surface these in the discovery
                call, not during the engagement.
              </li>
            </ul>
            <p>
              This isn&rsquo;t gatekeeping. It&rsquo;s the honest version of what every studio
              knows but most won&rsquo;t say out loud. If we discover any of these on the
              discovery call, we both save weeks of misalignment.
            </p>
          </div>
        </div>
      </section>

      {/* What I ask for from you */}
      <section className="cs-act alt">
        <div className="wrap">
          <div className="head">
            <span className="num">Asks</span>
            <h2>What I ask for from you</h2>
          </div>
          <div className="prose">
            <p>Three things:</p>
            <p>
              <strong>Direct feedback.</strong> I&rsquo;d rather hear &ldquo;this isn&rsquo;t
              working&rdquo; in week two than discover it in month four. Studios who can&rsquo;t
              take honest feedback aren&rsquo;t worth working with; the same applies in reverse.
            </p>
            <p>
              <strong>Trust on the engineering judgements.</strong> Most clients don&rsquo;t want
              to spend their afternoon learning what <code style={codeStyle}>wp-cron</code> does
              or why your database query log matters. They want the problem solved. Trust the
              judgement, and the relationship works. Question every technical recommendation, and
              we both burn out.
            </p>
            <p>
              <strong>Reasonable response times on review cycles.</strong> If a project stalls
              because feedback takes three weeks per round, the project costs both of us. The
              proposal sets expectations on response cadence; sticking to them keeps engagements
              profitable for me and on-budget for you.
            </p>
            <p>That&rsquo;s it. Everything else, I work with.</p>
          </div>
        </div>
      </section>

      {/* The next step */}
      <section className="cs-act">
        <div className="wrap">
          <div className="head">
            <span className="num">Next</span>
            <h2>The next step</h2>
          </div>
          <div className="prose">
            <p>
              If this page reads like the kind of working relationship you want — direct, honest,
              engineering-led, no theatre — book the discovery call.
            </p>
            <p>
              If anything on this page made you uncomfortable, we&rsquo;re probably not the right
              fit, and I&rsquo;d rather know now than after a contract is signed.
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
