import type { Testimonial } from '@/lib/case-studies';

type Props = { testimonial: Testimonial; client?: string };

export function CaseStudyQuote({ testimonial, client }: Props) {
  return (
    <section className="cs-quote">
      <div className="wrap">
        <div className="inner">
          <blockquote>{testimonial.text}</blockquote>
          <div className="who">
            — {testimonial.name}
            {client ? ` · ${client}` : ''}
          </div>
        </div>
      </div>
    </section>
  );
}
