import { Kicker } from '@/components/ui/Kicker';

export function Manifesto() {
  return (
    <section className="section-pad bg-char-2">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <Kicker>What I believe</Kicker>
        <h2
          className="mt-6 font-display text-white leading-[0.95]"
          style={{ fontSize: 'var(--text-display-lg)' }}
        >
          Good brands aren&rsquo;t built in decks.{' '}
          <em className="not-italic text-rocket font-italic italic">
            They&rsquo;re built in the dozen small decisions
          </em>{' '}
          a team makes between Tuesday and Friday.
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl text-lg text-mist leading-relaxed">
          <p>
            That&rsquo;s why I work first-person. I don&rsquo;t subcontract the thinking.
            Strategy, naming, visual system, voice, code — when you hire me, you get me on
            the work, not a junior running a template.
          </p>
          <p>
            If the brief is bigger than one person can hold, I bring in trusted specialists
            who work the way I do. Consistent throughline, no dilution. The result: brands
            that feel coherent in a boardroom, a pitch deck, and on an unexpected Tuesday
            support email at 4pm.
          </p>
        </div>
      </div>
    </section>
  );
}
