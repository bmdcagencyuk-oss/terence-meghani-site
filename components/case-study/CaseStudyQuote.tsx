import type { Testimonial } from '@/lib/case-studies';

type Props = { testimonial: Testimonial; client?: string };

export function CaseStudyQuote({ testimonial, client }: Props) {
  return (
    <section style={{ background: 'var(--color-ink)', padding: 'clamp(60px, 9vw, 120px) 0' }}>
      <div className="wrap" style={{ maxWidth: 900 }}>
        <blockquote
          style={{
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 2.6vw, 36px)',
            lineHeight: 1.3,
            color: '#fff',
          }}
        >
          “{testimonial.text}”
        </blockquote>
        <div style={{ marginTop: 20, color: 'var(--color-mist)' }}>
          — {testimonial.name}
          {client ? ` · ${client}` : ''}
        </div>
      </div>
    </section>
  );
}
