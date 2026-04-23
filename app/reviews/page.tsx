import type { Metadata } from 'next';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';
import { getAllTestimonials } from '@/lib/case-studies';
import { reviewsSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Reviews — 4.9★ on Trustpilot',
  description:
    "20 verified reviews from clients including News UK, Vijay's Virasat, Tulsi Vagjiani, and La Royale Banqueting Suites. Verified Trustpilot reviews, no edits.",
};

export default function ReviewsPage() {
  const testimonials = getAllTestimonials();
  // Sort by date descending
  const sorted = [...testimonials].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema(testimonials)) }}
      />
      <section className="pt-32 pb-12 bg-char">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <Kicker>Reviews</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            4.9★ on Trustpilot.{' '}
            <em className="font-italic italic text-rocket">37 reviews.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-mist">
            Showing the most recent {sorted.length} of 37 verified reviews. All were
            originally posted to Trustpilot for BMDC (the studio&rsquo;s former name) and
            carry across to Terence Meghani.
          </p>
          <a
            href="https://www.trustpilot.com/review/bmdc.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-rocket font-mono text-xs uppercase tracking-wider hover:gap-3 transition-all"
          >
            View on Trustpilot ↗
          </a>
        </div>
      </section>

      <section className="pb-20 bg-char">
        <div className="mx-auto max-w-5xl px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((t) => (
            <article
              key={t.id}
              className="bg-char-2 border border-hairline-subtle rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="text-rocket font-mono">{'★'.repeat(t.stars)}</span>
                <time className="font-mono text-[10px] uppercase tracking-wider text-fog">
                  {t.date}
                </time>
              </div>
              <h2 className="mt-4 font-display text-xl text-white">{t.title}</h2>
              <p className="mt-3 text-mist leading-relaxed whitespace-pre-line flex-1">
                {t.text}
              </p>
              <footer className="mt-5 pt-4 border-t border-hairline-subtle font-mono text-[10px] uppercase tracking-wider text-fog">
                — {t.name} · {t.country}
              </footer>
            </article>
          ))}
        </div>
      </section>

      <LaunchCTA headline="next review" />
    </>
  );
}
