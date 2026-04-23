import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'About — Terence Meghani',
  description:
    'Brand consultant & developer, Hertfordshire & London. Founded Krazy Media at 16, now trading under his own name. Over a decade of work with Royal London, News UK, NHS, TEDx, BBC, and Fireaway.',
};

const STATS = [
  { n: '13+', label: 'Years in business' },
  { n: '100+', label: 'Brands served' },
  { n: '4.9★', label: 'Average on Trustpilot' },
  { n: '6', label: 'Clients of 10+ years' },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <Kicker>About</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            Hi, I&rsquo;m <em className="font-italic italic text-rocket">Terence.</em>
          </h1>
          <p className="mt-4 font-italic italic text-2xl text-mist">
            Brand consultant and developer, based between Hertfordshire and London.
          </p>
          <div className="mt-10 space-y-6 text-lg text-mist leading-relaxed">
            <p>
              I launched my first venture at sixteen. Founded Krazy Media from my bedroom,
              rebranded it to We Krazy, then BMDC — and after more than a decade, brought
              it all under my own name. Along the way I&rsquo;ve been lucky enough to work
              with Royal London, News UK, the NHS, TEDx, the BBC, and Fireaway — and built
              brands for dozens of independent businesses across the UK, Morocco, and
              beyond.
            </p>
            <p>I&rsquo;m a proud dad of two. That keeps the work honest.</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-char-2">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <h2
            className="font-display text-white"
            style={{ fontSize: 'var(--text-display-md)' }}
          >
            What I do.
          </h2>
          <div className="mt-8 space-y-5 text-lg text-mist leading-relaxed">
            <p>I run four practices, all under one studio:</p>
            <p>
              <strong className="text-white">Brand &amp; Identity</strong> — Strategy, naming,
              visual systems, and voice for businesses that want to be remembered.
            </p>
            <p>
              <strong className="text-white">AI &amp; Automation</strong> — Custom GPTs trained
              on your brand voice, content operations automation, and AI-powered WordPress
              plugins. AI that sounds like <em>you</em>, not like every other AI.
            </p>
            <p>
              <strong className="text-white">WordPress Plugin Development</strong> — Bespoke
              plugins, API integrations, Gutenberg blocks, WooCommerce extensions. For
              teams who&rsquo;ve outgrown off-the-shelf.
            </p>
            <p>
              <strong className="text-white">Web Development</strong> — Modern stacks,
              performance-first. Next.js and headless WordPress when needed. Built to last.
            </p>
            <p>
              Plus PPC &amp; Paid Media, SEO &amp; Organic Growth, and an ongoing Growth
              Partnership retainer for businesses that want the full stack.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-char">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <h2
            className="font-display text-white"
            style={{ fontSize: 'var(--text-display-md)' }}
          >
            How I work.
          </h2>
          <div className="mt-8 space-y-5 text-lg text-mist leading-relaxed">
            <p>
              First-person. I don&rsquo;t subcontract the thinking. Every strategy session,
              creative direction call, and key decision involves me directly. I collaborate
              with trusted specialists when scope demands — but the throughline stays
              consistent.
            </p>
            <p>
              Projects start with a paid discovery. Fixed-scope projects are transparently
              quoted, with milestones. Retained work is month-to-month with no minimum term.
            </p>
            <p>You own the work. Source files and code transfer on final invoice. No lock-in.</p>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="border-l-2 border-rocket pl-4">
                <div
                  className="font-display text-rocket leading-none tabular-nums"
                  style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
                >
                  {s.n}
                </div>
                <div className="mt-2 text-sm text-mist">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-4">
            <Button
              href="https://calendly.com/terencemeghani"
              external
              variant="primary"
              size="lg"
            >
              Book a call
            </Button>
            <Button href="/contact/" variant="secondary" size="lg">
              Send a brief
            </Button>
          </div>
        </div>
      </section>

      <LaunchCTA headline="story" />
    </>
  );
}
