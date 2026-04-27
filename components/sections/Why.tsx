import { Reveal } from './Reveal';

type Row = { text: React.ReactNode };

const AGENCY: Row[] = [
  { text: <>Junior routes through <strong>3 layers</strong> of account management before reaching the person doing the work.</> },
  { text: <>Sixty-slide pitch decks, quarterly retainers, <strong>six-figure minimums</strong>.</> },
  { text: <>Your brief gets <strong>watered down</strong> by committee before a pixel is pushed.</> },
  { text: <>Long onboarding, slow feedback loops, <strong>glacial decisions</strong>.</> },
  { text: <>Strategy deck handed off; execution handed <strong>somewhere else entirely</strong>.</> },
  { text: <>Measured in impressions. Rarely measured in <strong>revenue</strong>.</> },
];

const CARE: Row[] = [
  { text: <>One-developer-shop with a one-line invoice and <strong>no engineering rigour</strong>.</> },
  { text: <>Cheap monthly fee that covers backups and <strong>not much else</strong>.</> },
  { text: <>&ldquo;We&rsquo;ll look at it next week&rdquo; when something <strong>actually breaks</strong>.</> },
  { text: <>&ldquo;Have you tried clearing the cache?&rdquo; as the first response to <strong>every issue</strong>.</> },
  { text: <>Strategy left entirely to you. Execution left to <strong>whoever&rsquo;s cheapest</strong>.</> },
  { text: <>Measured in <strong>uptime alone</strong>, never in revenue.</> },
];

const YOU: Row[] = [
  { text: <>Strategy AND execution AND engineering. One brain. One brief. <strong>Zero handoffs</strong>.</> },
  { text: <>You work with <strong>the person doing the work</strong>. Direct line. Always.</> },
  { text: <>Fixed-fee projects from <strong>£6,500</strong> · operations retainers from <strong>£1,500/mo</strong>.</> },
  { text: <>Your vision <strong>sharpened — not sanded down</strong> — by someone who&rsquo;s done it 60+ times.</> },
  { text: <>Shared files, weekly reviews, <strong>replies under 4 hours</strong>.</> },
  { text: <>Measured in <strong>revenue lift AND engineering quality</strong>. 3× average across 14 tracked launches.</> },
];

export function Why() {
  return (
    <section className="why" id="why">
      <div className="wrap">
        <div className="lbl mono">
          <span className="bar" />
          <span>05 — Why me</span>
        </div>
        <Reveal as="h2" variant="slide-side">
          Better than agencies. Better than care plans.{' '}
          <em>Both, in one studio.</em>
        </Reveal>

        <div className="compare compare--3col">
          <div className="compare-col">
            <div className="header">
              <h3>Big agency</h3>
              <span className="tag">The usual</span>
            </div>
            <ul>
              {AGENCY.map((r, i) => (
                <li key={i}>
                  <span className="ico" aria-hidden="true">✕</span>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
            <div className="foot">
              <span>Average cost</span>
              <span className="val">£80k+</span>
            </div>
          </div>

          <div className="vs vs--small" aria-hidden="true">vs</div>

          <div className="compare-col">
            <div className="header">
              <h3>Care plan / freelancer</h3>
              <span className="tag">The other extreme</span>
            </div>
            <ul>
              {CARE.map((r, i) => (
                <li key={i}>
                  <span className="ico" aria-hidden="true">✕</span>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
            <div className="foot">
              <span>Average cost</span>
              <span className="val">£600/yr that doesn&rsquo;t move the needle</span>
            </div>
          </div>

          <div className="vs vs--small" aria-hidden="true">vs</div>

          <div className="compare-col you">
            <div className="header">
              <h3>With <em>Terence</em></h3>
              <span className="tag">🚀 You&rsquo;re here</span>
            </div>
            <ul>
              {YOU.map((r, i) => (
                <li key={i}>
                  <span className="ico" aria-hidden="true">✓</span>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
            <div className="foot">
              <span>Average investment</span>
              <span className="val">From £6.5k</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
