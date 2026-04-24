import { Reveal } from './Reveal';

type Item = {
  avatar: string;
  name: string;
  role: string;
  project: string;
  quote: string;
};

const ITEMS: Item[] = [
  {
    avatar: 'S',
    name: 'Sarah K.',
    role: 'Founder · Independent F&B brand',
    project: 'Rebrand · 2024',
    quote:
      'Terence treated our rebrand like it was his own company. Not a deck handoff — a partner. Our bookings tripled in six months.',
  },
  {
    avatar: 'M',
    name: 'Marcus T.',
    role: 'CMO · SaaS startup (Series A)',
    project: 'Brand identity · 2024',
    quote:
      "Sharper in a thirty-minute call than the three agencies we'd paid before him. We hired him that afternoon.",
  },
  {
    avatar: 'A',
    name: 'Ayo B.',
    role: 'Director · Hospitality group',
    project: 'Identity + Digital · 2023',
    quote:
      'What he ships is 30% of it — what you learn working with him is the other 70%. Every session felt like a masterclass.',
  },
  {
    avatar: 'D',
    name: 'Dr. Jane P.',
    role: 'Head of Marketing · Royal London',
    project: 'Campaign · 2022',
    quote:
      'He called out a positioning gap on day one that three internal workshops had missed. The rest was momentum.',
  },
  {
    avatar: 'R',
    name: 'Raj M.',
    role: 'COO · DTC beauty brand',
    project: 'Brand sprint · 2025',
    quote:
      'Budget, deadline, and brand moved together in the same direction for the first time in years. That alone was worth it.',
  },
  {
    avatar: 'L',
    name: 'Laura H.',
    role: 'Founder · Brand Week London',
    project: 'Identity + Event · 2024',
    quote:
      "We've worked with agencies from London, NYC, Berlin. Terence delivered the sharpest work at a fraction of the time and cost.",
  },
];

export function Testimonials() {
  return (
    <section className="testi-sec" id="testimonials">
      <div className="wrap">
        <div className="head">
          <Reveal as="h2" variant="scale">
            Words from <em>the room.</em>
          </Reveal>
          <div className="rating">
            <span className="stars" aria-hidden="true">★★★★★</span>
            <Reveal as="span" variant="pop" className="n">4.9 / 5</Reveal>
            <span className="lbl">100+ happy clients · Google &amp; Clutch</span>
          </div>
        </div>

        <div className="testi-grid">
          {ITEMS.map((t) => (
            <div key={t.name} className="testi-card">
              <span className="qmark" aria-hidden="true">&ldquo;</span>
              <blockquote>{t.quote}</blockquote>
              <span className="stars" aria-label="Five star rating">★★★★★</span>
              <div className="author">
                <div className="avatar" aria-hidden="true">{t.avatar}</div>
                <div className="who">
                  <strong>{t.name}</strong>
                  {t.role}
                  <span className="proj">{t.project}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testi-note">
          <strong>NOTE</strong> — Testimonial content is <strong>placeholder</strong> for the
          preview. Swap in real quotes from your Google / Clutch / LinkedIn reviews before launch.
        </div>
      </div>
    </section>
  );
}
