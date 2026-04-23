import type { Testimonial } from '@/lib/case-studies';

export function CaseStudyQuote({
  testimonial,
  client,
}: {
  testimonial: Testimonial;
  client: string;
}) {
  const primarySentence = testimonial.text.split('\n')[0];
  return (
    <section className="section-pad bg-char-2">
      <figure className="mx-auto max-w-4xl px-6 lg:px-12 text-center">
        <blockquote
          className="font-italic italic text-white leading-snug"
          style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
        >
          &ldquo;{primarySentence}&rdquo;
        </blockquote>
        <figcaption className="mt-8 font-mono text-xs uppercase tracking-wider text-fog">
          — {testimonial.name}, {client} ·{' '}
          <span className="text-rocket">{'★'.repeat(testimonial.stars)}</span>{' '}
          <a
            href={`https://www.trustpilot.com/review/terencemeghani.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rocket transition-colors"
          >
            on Trustpilot ↗
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
