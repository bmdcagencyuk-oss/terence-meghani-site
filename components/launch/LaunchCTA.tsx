type Props = {
  headline?: string;
};

/**
 * Compact launch CTA used at the foot of every internal page.
 * Uses the v23 launch aesthetic (ink background, rocket glow,
 * ring CTA) but without the home-page countdown/starfield.
 */
export function LaunchCTA({ headline = 'brand' }: Props) {
  return (
    <section className="launch" aria-label="Ready to launch">
      <div className="wrap">
        <h2>
          Ready to launch your{' '}
          <em>{headline}?</em>
        </h2>
        <p className="subtext">
          <strong>Thirty-minute discovery call.</strong> No slides, no fluff — leave with a
          concrete next step whether we work together or not.
        </p>

        <div className="cta-wrap">
          <svg
            className="cta-ring"
            viewBox="0 0 296 296"
            width="296"
            height="296"
            aria-hidden="true"
          >
            <defs>
              <path
                id="launchCtaRingPath"
                d="M 148,148 m -128,0 a 128,128 0 1,1 256,0 a 128,128 0 1,1 -256,0"
              />
            </defs>
            <text>
              <textPath href="#launchCtaRingPath">
                BOOK A DISCOVERY CALL · 30 MIN · FREE · NO DECK ·{' '}
              </textPath>
            </text>
          </svg>
          <a
            href="https://calendly.com/terencemeghani"
            target="_blank"
            rel="noopener noreferrer"
            className="go"
            data-cc="go"
            aria-label="Book a discovery call via Calendly"
          >
            <span className="trail" aria-hidden="true" />
            <span className="big" aria-hidden="true">🚀</span>
            <span>
              Book via
              <br />
              Calendly
            </span>
          </a>
          <span className="exhaust" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </span>
        </div>

        <a href="mailto:hello@terencemeghani.com" className="secondary">
          ✉ Or email hello@terencemeghani.com
        </a>
      </div>

      <div className="launchpad" aria-hidden="true">
        <div className="glow" />
        <div className="ticks">
          <span className="mark" />
          <span className="mark tall" />
          <span className="lbl">LP · 01</span>
          <span className="mark tall" />
          <span className="mark" />
        </div>
      </div>
    </section>
  );
}
