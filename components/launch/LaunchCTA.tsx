type Props = {
  headline?: 'brand' | 'work' | 'growth' | string;
};

const HEADLINES: Record<string, string> = {
  brand: 'Ready to launch?',
  work: 'Your project next?',
  growth: "Let's scale it together.",
};

export function LaunchCTA({ headline = 'brand' }: Props) {
  const title = HEADLINES[headline] ?? headline;
  return (
    <section className="launch">
      <div className="wrap">
        <h2>{title}</h2>
        <p className="subtext">
          <strong>Thirty-minute discovery call.</strong> No slides, no fluff —
          leave with a concrete next step whether we work together or not.
        </p>
        <div className="cta-wrap">
          <a
            href="https://calendly.com/terencemeghani"
            target="_blank"
            rel="noopener noreferrer"
            className="go"
            data-cc="go"
            aria-label="Book a discovery call via Calendly"
          >
            <span className="big" aria-hidden="true">🚀</span>
            <span>
              Book via
              <br />
              Calendly
            </span>
          </a>
        </div>
        <a href="mailto:hello@terencemeghani.com" className="secondary">
          ✉ Or email hello@terencemeghani.com
        </a>
      </div>
    </section>
  );
}
