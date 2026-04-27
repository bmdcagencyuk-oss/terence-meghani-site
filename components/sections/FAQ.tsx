import { Reveal } from './Reveal';

export type FAQItem = { n: string; q: string; aPlain: string; a: React.ReactNode };

// Plain-text answers feed FAQPage JSON-LD via FAQ_ITEMS export. Rich JSX answers
// drive the on-page accordion.
export const FAQ_ITEMS: FAQItem[] = [
  {
    n: '01',
    q: 'How quickly can we start?',
    aPlain:
      "I take on a small number of engagements at a time so communication stays direct and the work gets the attention it deserves. We'll have a call, understand what you actually need, and agree a start date that works for both sides — never a pressured deadline.",
    a: (
      <>
        I take on a small number of engagements at a time so communication stays direct and the
        work gets the attention it deserves. We&rsquo;ll have a call, understand what you actually
        need, and agree a start date that works for both sides — never a pressured deadline.
      </>
    ),
  },
  {
    n: '02',
    q: "What's the minimum engagement?",
    aPlain:
      "There isn't one. Some projects are a focused brand piece; others are ongoing operations retainers; some are advisory or interim work. I scope around what the problem actually needs — no padded retainers, no six-month minimums, no off-the-shelf packages. Start with a conversation.",
    a: (
      <>
        There isn&rsquo;t one. Some projects are a focused brand piece; others are ongoing
        operations retainers; some are advisory or interim work. I scope around what the problem
        actually needs — no padded retainers, no six-month minimums, no off-the-shelf packages.
        Start with a conversation.
      </>
    ),
  },
  {
    n: '03',
    q: 'Do you work in person or remote?',
    aPlain:
      "Both. I'm based between Hertfordshire and London and happy to come to your office for kickoffs, presentations, and big decision moments. The working week happens async — shared Figma, Loom updates, weekly calls. Clients outside the UK work with me entirely remote.",
    a: (
      <>
        Both. I&rsquo;m based between <strong>Hertfordshire and London</strong> and happy to come
        to your office for kickoffs, presentations, and big decision moments. The working week
        happens async — shared Figma, Loom updates, weekly calls. Clients outside the UK work with
        me entirely remote.
      </>
    ),
  },
  {
    n: '04',
    q: 'Do you build WordPress plugins from scratch?',
    aPlain:
      "Yes — custom WordPress plugin development is a core specialism. I build bespoke plugins, API integrations, custom admin tooling and AI-powered plugin extensions. I also ship six productised plugins of my own. If there's no off-the-shelf plugin that does what you need — or the existing ones are bloated, insecure, or slowing your site — I'll build exactly what you need. Performance-first, properly documented, yours to keep.",
    a: (
      <>
        Yes — <strong>custom WordPress plugin development</strong> is a core specialism. I build
        bespoke plugins, API integrations, custom admin tooling and AI-powered plugin extensions.
        I also ship <strong>six productised plugins</strong> of my own. If there&rsquo;s no
        off-the-shelf plugin that does what you need — or the existing ones are bloated, insecure,
        or slowing your site — I&rsquo;ll build exactly what you need. Performance-first, properly
        documented, yours to keep.
      </>
    ),
  },
  {
    n: '05',
    q: 'Can you integrate AI into my existing site or workflow?',
    aPlain:
      "Yes. AI & automation work ranges from custom GPTs trained on your brand voice, to content-operations automations, to AI-powered WordPress plugins that slot directly into your site. The goal is the same every time: AI that sounds like your brand — not ChatGPT.",
    a: (
      <>
        Yes. <strong>AI &amp; automation</strong> work ranges from custom GPTs trained on your
        brand voice, to content-operations automations, to AI-powered WordPress plugins that slot
        directly into your site. The goal is the same every time: AI that sounds like your brand —{' '}
        <em>not ChatGPT</em>.
      </>
    ),
  },
  {
    n: '06',
    q: "Can you take over a WordPress site that wasn't built by you?",
    aPlain:
      "Yes — most of the sites I operate I didn't build. WordPress Operations starts with a £1,950 fixed-price audit so I can baseline what's there, fix the critical issues, and only then start the retainer. You don't pay an operations fee to inherit someone else's mess. The audit fee is deductible against the first three months of retainer at Orbit or Apogee tier.",
    a: (
      <>
        Yes — most of the sites I operate I didn&rsquo;t build. <strong>WordPress Operations</strong>{' '}
        starts with a <strong>£1,950 fixed-price audit</strong> so I can baseline what&rsquo;s
        there, fix the critical issues, and only then start the retainer. You don&rsquo;t pay an
        operations fee to inherit someone else&rsquo;s mess. The audit fee is deductible against
        the first three months of retainer at Orbit or Apogee tier.
      </>
    ),
  },
  {
    n: '07',
    q: 'How does WordPress Operations differ from a "care plan"?',
    aPlain:
      'Care plans run backups and push updates. WordPress Operations diagnoses at the engineering level — server logs, database health, scheduler integrity, mail authentication, plugin-induced load. The work happens before things break. Tiers from £1,500/month (Boost) through £6,000/month (Apogee), depending on the level of attention your site warrants.',
    a: (
      <>
        Care plans run backups and push updates. <strong>WordPress Operations</strong> diagnoses
        at the engineering level — server logs, database health, scheduler integrity, mail
        authentication, plugin-induced load. The work happens <em>before</em> things break. Tiers
        from <strong>£1,500/month</strong> (Boost) through <strong>£6,000/month</strong> (Apogee),
        depending on the level of attention your site warrants.
      </>
    ),
  },
  {
    n: '08',
    q: 'Can I hire you for strategy only — no design?',
    aPlain:
      "Yes. About a third of engagements are strategy-only — positioning, naming, messaging architecture, brand voice. If you already have designers you like, I'll deliver the thinking and hand it over clean for your team to execute.",
    a: (
      <>
        Yes. About a third of engagements are strategy-only — positioning, naming, messaging
        architecture, brand voice. If you already have designers you like, I&rsquo;ll deliver the{' '}
        <em>thinking</em> and hand it over clean for your team to execute.
      </>
    ),
  },
  {
    n: '09',
    q: 'What happens on the discovery call?',
    aPlain:
      "No slides. No fluff. 30 minutes split three ways: you tell me what's going on (10 min), I ask the questions that usually unblock things (10 min), we land on a concrete next step (10 min) — whether that's working together, a referral, or just a clearer picture of the problem. Often the last one is most useful.",
    a: (
      <>
        <strong>No slides. No fluff.</strong> 30 minutes split three ways: you tell me what&rsquo;s
        going on (10 min), I ask the questions that usually unblock things (10 min), we land on a
        concrete next step (10 min) — whether that&rsquo;s working together, a referral, or just a
        clearer picture of the problem. Often the last one is most useful.
      </>
    ),
  },
  {
    n: '10',
    q: 'How do you price?',
    aPlain:
      'Brand and plugin engagements are quoted fixed-fee after the discovery call, based on scope and timeline — never hourly, never estimated on the spot. WordPress Operations is monthly retainer with three published tiers (Boost £1,500 / Orbit £2,500 / Apogee £6,000). Either way you get a written proposal within 48 hours of our call. No creep, no surprise invoices.',
    a: (
      <>
        Brand and plugin engagements are quoted <strong>fixed-fee after the discovery call</strong>,
        based on scope and timeline — never hourly, never estimated on the spot. WordPress
        Operations is monthly retainer with three published tiers (<strong>Boost £1,500</strong> /{' '}
        <strong>Orbit £2,500</strong> / <strong>Apogee £6,000</strong>). Either way you get a
        written proposal within 48 hours of our call. No creep, no surprise invoices.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="head">
          <div>
            <div className="lbl">
              <span className="bar" />
              <span>07 — Questions, honestly answered</span>
            </div>
            <Reveal as="h2" variant="slide-down" className="mt-5">
              Before you <em>book.</em>
            </Reveal>
          </div>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <details className="faq-item" key={item.n} open={i === 0}>
              <summary>
                <span className="n">{item.n}</span>
                <span className="q">{item.q}</span>
                <span className="plus" aria-hidden="true">+</span>
              </summary>
              <div className="a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
