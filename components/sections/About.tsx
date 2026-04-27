/* eslint-disable @next/next/no-img-element */
import { Reveal } from './Reveal';

export function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="lbl mono">
          <span className="bar" />
          <span>01 — About Terence</span>
        </div>

        <div className="grid">
          <div className="portrait">
            <span className="badge">Hertfordshire</span>
            <span className="sunburst" aria-hidden="true" />
            <span className="hero-cape" aria-hidden="true" />
            <img
              src="https://terencemeghani.com/wp-content/uploads/2026/01/grok-image-1d260190-3cb6-4438-9038-a92ceca011e8.png"
              alt="Terence Meghani — brand consultant, Hertfordshire & London"
            />
            <span className="streaks" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </span>
            <span className="sparks" aria-hidden="true">
              <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
            </span>
            <span className="hero-badge" aria-hidden="true">
              <span className="dot" />On the case
            </span>
            <span className="kapow" aria-hidden="true">
              <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                <polygon
                  points="100,6 120,38 156,28 148,64 186,72 160,98 188,128 150,132 158,170 122,158 108,192 92,162 56,180 60,140 22,134 46,104 18,76 54,68 44,32 80,42"
                  fill="#FF4D17"
                  stroke="#0A0A0B"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
              KA<br />POW!
            </span>
            <span className="signature">
              <span className="emblem" />
            </span>
          </div>

          <div>
            <Reveal as="h2" variant="slide-up">
              One brain. <em>Twelve years.</em> Your brand, unmistakable.
            </Reveal>
            <div className="body">
              <p>
                <strong>
                  Twelve years of building brands and shipping code, based between
                  Hertfordshire and London.
                </strong>{' '}
                Studio of one — brand, code, growth, all from the same brain.
              </p>
              <p>
                For more than a decade I&rsquo;ve built brands for scrappy startups and
                global names (BBC, News UK, Royal London, NHS, TEDx) — with the same
                close, personal approach to each.
              </p>
              <p>
                My work spans four practices most studios split across four teams:{' '}
                <strong>WordPress Operations</strong>,{' '}
                <strong>custom plugin development</strong>,{' '}
                <strong>AI and automation</strong>, and{' '}
                <strong>strategy-led brand work</strong>. One brain joining those dots means
                faster decisions, sharper output, and{' '}
                <span className="hl">brand, code and engineering</span> pulling in the same
                direction.
              </p>
              <p>
                Big agencies route you through account managers. I don&rsquo;t. You work with the
                person doing the work — based in Watford, delivering across London and worldwide.
                Most engagements start with a thirty-minute call.
              </p>
            </div>
            <div className="mini-stats">
              <div className="ms">
                <Reveal as="div" variant="pop" className="n">12+</Reveal>
                <div className="l">Years building</div>
              </div>
              <div className="ms">
                <Reveal as="div" variant="pop" className="n">100+</Reveal>
                <div className="l">Projects shipped</div>
              </div>
              <div className="ms">
                <Reveal as="div" variant="pop" className="n">3×</Reveal>
                <div className="l">Avg revenue lift</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
