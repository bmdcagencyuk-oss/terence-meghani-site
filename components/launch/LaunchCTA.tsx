type Props = {
  /**
   * Single noun appended to "your X?" — e.g. "brand", "website", "campaign".
   * Use simple nouns only; for fully custom copy pass `title` instead.
   */
  headline?: string;
  /** Full H2 override. Use this when `your X?` doesn't read naturally. */
  title?: string;
  /** Replace the body copy under the H2. */
  body?: string;
};

const DEFAULT_BODY =
  'Thirty-minute discovery call. No slides, no fluff — leave with a concrete next step whether we work together or not.';

/**
 * Compact launch CTA used at the foot of every internal page.
 * Reuses the v23 launch aesthetic (ring CTA, flame trail, exhaust,
 * launchpad) without the home-page countdown / starfield.
 */
export function LaunchCTA({ headline, title, body = DEFAULT_BODY }: Props) {
  // Resolve the H2 — prefer explicit title, then headline noun, then default.
  const heading: { lead: string; accent: string } = title
    ? splitTitle(title)
    : headline
      ? { lead: 'Ready to launch your', accent: `${headline}?` }
      : { lead: 'Ready to', accent: 'launch?' };

  return (
    <section className="launch" aria-label="Ready to launch">
      <div className="wrap">
        <h2>
          {heading.lead}{' '}<em>{heading.accent}</em>
        </h2>
        <p className="subtext">{body}</p>

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

/**
 * Italicise the trailing word of the title for the rocket-orange accent.
 * Falls back to the whole string in italic if it's only one word.
 */
function splitTitle(title: string): { lead: string; accent: string } {
  const trimmed = title.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace === -1) return { lead: '', accent: trimmed };
  return {
    lead: trimmed.slice(0, lastSpace),
    accent: trimmed.slice(lastSpace + 1),
  };
}
