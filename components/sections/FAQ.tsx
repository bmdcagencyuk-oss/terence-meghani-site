import { Reveal } from './Reveal';

type Item = { n: string; q: string; a: React.ReactNode };

const ITEMS: Item[] = [
  {
    n: '01',
    q: 'How quickly can we start?',
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
    a: (
      <>
        There isn&rsquo;t one. Some projects are a focused brand piece; others are ongoing
        marketing partnerships; some are advisory or interim work. I scope around what the problem
        actually needs — no padded retainers, no six-month minimums, no off-the-shelf packages.
        Start with a conversation.
      </>
    ),
  },
  {
    n: '03',
    q: 'Do you work in person or remote?',
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
    a: (
      <>
        Yes — <strong>custom WordPress plugin development</strong> is a core specialism. I build
        bespoke plugins, API integrations, custom admin tooling and AI-powered plugin extensions.
        If there&rsquo;s no off-the-shelf plugin that does what you need — or the existing ones
        are bloated, insecure, or slowing your site — I&rsquo;ll build exactly what you need.
        Performance-first, properly documented, yours to keep.
      </>
    ),
  },
  {
    n: '05',
    q: 'Can you integrate AI into my existing site or workflow?',
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
    q: 'Can I hire you for strategy only — no design?',
    a: (
      <>
        Yes. About a third of engagements are strategy-only — positioning, naming, messaging
        architecture, brand voice. If you already have designers you like, I&rsquo;ll deliver the{' '}
        <em>thinking</em> and hand it over clean for your team to execute.
      </>
    ),
  },
  {
    n: '07',
    q: 'What happens on the discovery call?',
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
    n: '08',
    q: 'Do you keep working after launch?',
    a: (
      <>
        Most clients do continue — usually as a <strong>light monthly retainer</strong> for
        ongoing creative direction, marketing execution, or brand governance as the company
        scales. But there&rsquo;s no obligation: if the project is self-contained, I&rsquo;ll ship
        it and hand it over properly so your team can run with it.
      </>
    ),
  },
  {
    n: '09',
    q: 'How do you price?',
    a: (
      <>
        Every project is quoted <strong>fixed-fee after the discovery call</strong>, based on
        scope and timeline — not hourly, never estimated on the spot. You get a written proposal
        within 48 hours of our call with a clear number, what&rsquo;s included, and what&rsquo;s
        not. No creep, no surprise invoices.
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
          {ITEMS.map((item, i) => (
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
