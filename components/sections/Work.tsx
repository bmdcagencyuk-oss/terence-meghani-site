import Link from 'next/link';
import { Reveal } from './Reveal';

type Metric = { n: string; k: string };
type Item = {
  year: string;
  tag: string;
  title: string;
  image: string;
  href: string;
  metrics: Metric[];
};

// Four flagship case studies — order matters and is set by editorial brief.
const ITEMS: Item[] = [
  {
    year: '2023',
    tag: 'Editorial · Digital',
    title: 'News UK — masthead system',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80&auto=format',
    href: '/work/news-uk/',
    metrics: [
      { n: '6',    k: 'Titles unified' },
      { n: '+22%', k: 'Engagement' },
      { n: '12wk', k: 'Rollout' },
    ],
  },
  {
    year: '2025',
    tag: 'Self-storage · Plugins',
    title: 'Kinnovis — booking platform',
    image: '/work/kinnovis-hero.svg',
    href: '/work/kinnovis/',
    metrics: [
      { n: '4',     k: 'Plugins' },
      { n: 'Stora', k: 'API' },
      { n: 'Live',  k: 'Production' },
    ],
  },
  {
    year: '2024',
    tag: 'Hospitality · Identity',
    title: 'Al Jannah Villa Marrakech',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format',
    href: '/work/al-jannah-villa-marrakech/',
    metrics: [
      { n: '+340%', k: 'Bookings' },
      { n: '4.9★',  k: 'Guest rating' },
      { n: '18',    k: 'Touchpoints' },
    ],
  },
  {
    year: '2024',
    tag: 'F&B · Packaging',
    title: 'Fireaway Pizza — rebrand',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format',
    href: '/work/fireaway-pizza/',
    metrics: [
      { n: '+3.4×', k: 'Store footfall' },
      { n: '120',   k: 'Locations' },
      { n: '8wk',   k: 'Rollout' },
    ],
  },
];

export function Work() {
  return (
    <section className="work-sec" id="work">
      <div className="wrap">
        <div className="head">
          <Reveal as="h2" variant="tilt">
            Built to be <em>remembered.</em>
          </Reveal>
        </div>

        <div className="work-grid">
          {ITEMS.map((item) => (
            <Link key={item.title} className="wc" href={item.href} data-cc="view">
              <div
                className="v"
                style={{ backgroundImage: `url('${item.image}')` }}
                aria-hidden="true"
              />
              <div className="content">
                <div className="top">
                  <span className="year">{item.year}</span>
                  <span className="tag">{item.tag}</span>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <div className="metrics">
                    {item.metrics.map((m) => (
                      <div className="m" key={m.k}>
                        <div className="n">{m.n}</div>
                        <div className="k">{m.k}</div>
                      </div>
                    ))}
                  </div>
                  <span className="open">Case study →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="work-viewall">
          <Link href="/work">
            View all 12 case studies <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
