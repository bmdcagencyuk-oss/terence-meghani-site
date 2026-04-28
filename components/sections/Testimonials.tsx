import Link from 'next/link';
import { Reveal } from './Reveal';

export type TestimonialItem = {
  avatar: string;
  name: string;
  role: string;
  project: string;
  quote: string;
  /** Source platform — used to attribute publisher in JSON-LD Review schema. */
  source: 'Trustpilot' | 'Facebook';
  /** ISO 8601 date for JSON-LD datePublished. */
  datePublished: string;
};

export const TESTIMONIAL_ITEMS: TestimonialItem[] = [
  {
    avatar: 'NP',
    name: 'Neck P.',
    role: 'Web hosting company',
    project: 'Directus CMS integration · 2024 · Trustpilot',
    quote:
      "Terence's team integrated Directus CMS into our site cleanly — performance, UX and reliability all dialled in. A year on, choosing this studio was a game-changer for our web hosting company.",
    source: 'Trustpilot',
    datePublished: '2024-01-06',
  },
  {
    avatar: 'KD',
    name: 'Kinari Dodhia',
    role: 'Swagat Catering',
    project: '10-year client · 2024 · Trustpilot',
    quote:
      'Terry has been working with us for nearly ten years. Website, photography, every issue along the way — he has always been there. Efficient work and the friendliest people to deal with.',
    source: 'Trustpilot',
    datePublished: '2024-01-01',
  },
  {
    avatar: 'TV',
    name: 'Tulsi Vagjiani',
    role: '',
    project: 'Brand & web · 2023 · Trustpilot',
    quote:
      'Total professionalism from website to branding — exceeded everything I expected. I needed a modern, unique twist to match my authentic flamboyant self. The studio did not disappoint.',
    source: 'Trustpilot',
    datePublished: '2023-01-01',
  },
  {
    avatar: 'NA',
    name: 'Nisha Asodia',
    role: 'TEDx University of Salford',
    project: 'Web · 2020 · Facebook',
    quote:
      'We asked Terence to design our TEDx University of Salford website — he delivered an amazing job. A consummate professional. We were impressed enough to bring him back for a second website.',
    source: 'Facebook',
    datePublished: '2020-01-01',
  },
  {
    avatar: 'VR',
    name: 'Vinny Rabadia',
    role: 'Long-term client',
    project: 'Brand + Web · 2017 · Facebook',
    quote:
      "We met Terry during a rebrand — he came to the office, took the time to understand the business. He's been our main point of contact for design, marketing and website maintenance ever since.",
    source: 'Facebook',
    datePublished: '2017-01-01',
  },
  {
    avatar: 'NA',
    name: 'Nazish Akhtar',
    role: 'Senior decision-maker',
    project: 'Web rebuild · 2017 · Facebook',
    quote:
      "As a key decision maker on a website rebuild, I was reluctant about a young company. I'm so pleased we went ahead — extremely reasonable pricing, professional execution, and clear communication throughout.",
    source: 'Facebook',
    datePublished: '2017-01-01',
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
            <Reveal as="span" variant="pop" className="n">4.7 / 5</Reveal>
            <span className="lbl">101+ recommendations · Trustpilot &amp; Facebook</span>
          </div>
        </div>

        <div className="testi-grid">
          {TESTIMONIAL_ITEMS.map((t) => (
            <div key={`${t.name}-${t.datePublished}`} className="testi-card">
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

        <div className="testi-viewall">
          <Link href="/reviews">
            View all 101+ reviews <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
