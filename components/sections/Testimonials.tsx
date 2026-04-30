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
    avatar: 'M',
    name: 'Mu',
    role: 'Senior comms · global news media',
    project: 'Brand · 2023',
    quote:
      'Have worked with Terri and the team for over a decade. Brought them in to help reset cyber messaging and awareness for the biggest global news media provider in the world! Amazing job! Then went on to do the same for Sainsbury\u2019s. Brilliant effort all round. Thank you.',
    source: 'Trustpilot',
    datePublished: '2023-01-01',
  },
  {
    avatar: 'VN',
    name: 'Vishal Narbheram',
    role: 'Founder',
    project: 'Web · 2024',
    quote:
      'I was looking to have a website built from scratch and had over 30 companies reach out to take on the project but Terence stood out from the crowd, he\u2019s polite, respectful, response times are speedy and the way he speaks about his work is so passionate I couldn\u2019t not work with him on this project. Terence was so accommodating, professional, reliable and most importantly patient that it made the whole process fun\u2026 yes actually FUN!',
    source: 'Trustpilot',
    datePublished: '2024-01-01',
  },
  {
    avatar: 'TV',
    name: 'Tulsi Vagjiani',
    role: 'Speaker · author',
    project: 'Brand + Web · 2023',
    quote:
      'I received total professionalism from this company. From the website to the branding, it exceeded beyond my expectations. The guidance I received towards my needs were met and explained thoroughly. I needed a modern, unique twist to my website to match my authentic flamboyant self! They did not disappoint!!',
    source: 'Trustpilot',
    datePublished: '2023-01-01',
  },
  {
    avatar: 'DD',
    name: 'Diagnostic Dynamics Ltd',
    role: 'Director',
    project: 'Brand + Web · 2024',
    quote:
      'From the very first consultation to the final delivery, every aspect of their service was nothing short of exceptional. Every element of the design was meticulously thought out and executed, from colour schemes and typography to layout and user experience. If you\u2019re looking for a design company that combines creativity, professionalism, and a genuine commitment to excellence, look no further than Terence Meghani. They are a true gem in the industry.',
    source: 'Trustpilot',
    datePublished: '2024-01-01',
  },
  {
    avatar: 'A',
    name: 'Angie',
    role: 'Long-standing client',
    project: 'Operations · 10-year client',
    quote:
      'Having worked with Krazy Media (known as Terence Meghani) for the past ten years, Terence has consistently listened to my ideas and fulfilled my requests. To keep my website up to date and in line with current trends, will always contact me first. It\u2019s never too much trouble for him to fix whatever problems I have. Terence, thank you.',
    source: 'Trustpilot',
    datePublished: '2024-01-01',
  },
  {
    avatar: 'NP',
    name: 'Neck P.',
    role: 'Web hosting business',
    project: 'Plugin Dev + Web · 2024',
    quote:
      'The Terence Meghani team\u2019s expertise in web development is truly commendable. They seamlessly integrated the Directus CMS, ensuring that our website not only looks stunning but also functions flawlessly. Their proactive communication and responsiveness have fostered a strong and positive working relationship. As we celebrate our one-year anniversary of working together, I can confidently say that choosing Terence Meghani was a game-changer for our web hosting company.',
    source: 'Trustpilot',
    datePublished: '2024-01-01',
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
