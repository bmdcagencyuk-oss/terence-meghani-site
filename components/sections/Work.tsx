'use client';

import { useEffect, useRef } from 'react';
import { Reveal } from './Reveal';

type Metric = { n: string; k: string };
type Item = {
  idx: string;
  year: string;
  tag: string;
  title: string;
  image: string;
  metrics: Metric[];
};

type CardItem = Item & { href?: string };

// Carousel order: News UK · Kinnovis · Al Jannah · TEDx · Fireaway · Japex ·
// Bettafi · DCD Connect. Bettafi sits at slot 7 because its metrics are
// placeholders; Kinnovis at slot 2 as the new flagship.
const ITEMS: CardItem[] = [
  {
    idx: '01 / 08',
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
    idx: '02 / 08',
    year: '2025',
    tag: 'Self-storage · Plugins',
    title: 'Kinnovis — booking platform',
    image: '/work/kinnovis-hero.svg',
    href: '/work/kinnovis/',
    metrics: [
      { n: '4',     k: 'Plugins' },
      { n: 'Stora', k: 'API' },
      { n: 'Live',  k: 'Q1 2025' },
    ],
  },
  {
    idx: '03 / 08',
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
    idx: '04 / 08',
    year: '2023',
    tag: 'Event · Campaign',
    title: 'TEDx — full campaign',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80&auto=format',
    href: '/work/tedx-university-of-salford/',
    metrics: [
      { n: '2K+',   k: 'Attendees' },
      { n: '+180%', k: 'Ticket sales' },
      { n: '48hr',  k: 'Sell-out' },
    ],
  },
  {
    idx: '05 / 08',
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
  {
    idx: '06 / 08',
    year: '2024',
    tag: 'Automotive · Rebrand',
    title: 'Japex Automotive',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format',
    href: '/work/japex-automotive/',
    metrics: [
      { n: '+52%', k: 'Lead quality' },
      { n: '2',    k: 'Showrooms' },
      { n: '6wk',  k: 'Launch' },
    ],
  },
  {
    idx: '07 / 08',
    year: '2026',
    tag: 'Fintech · Web · Referral',
    title: 'Bettafi — landing & referral',
    image: '/case-studies/bettafi/landing-desktop.jpg',
    href: '/work/bettafi/',
    metrics: [
      { n: 'Live',   k: 'Status' },
      { n: 'Custom', k: 'Referral' },
      { n: 'Q1',     k: 'Launch' },
    ],
  },
  {
    idx: '08 / 08',
    year: '2022',
    tag: 'Public Sector · Comms',
    title: 'DCD Connect',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format',
    href: '/work/dcd-connect/',
    metrics: [
      { n: '14',   k: 'Touchpoints' },
      { n: '+38%', k: 'Recall' },
      { n: '6mo',  k: 'Scope' },
    ],
  },
];

export function Work() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!wrap || !track) return;

    let isDown = false;
    let sX = 0;
    let sL = 0;
    let cS = 0;
    let velocity = 0;
    let lastT = 0;
    let momRaf: number | null = null;
    let snapRaf: number | null = null;
    let maxScroll = 0;

    const RUBBER = 0.35;
    const FRICT = 0.93;
    const SNAP_K = 0.18;
    const MIN_VEL = 0.2;

    const measure = () => {
      maxScroll = Math.max(0, track.scrollWidth - wrap.clientWidth);
    };
    measure();

    const applyRubber = (x: number): number => {
      if (x < 0) return -Math.pow(-x, 0.72);
      if (x > maxScroll) {
        const over = x - maxScroll;
        return maxScroll + Math.pow(over, 0.72);
      }
      return x;
    };

    const updateBar = () => {
      if (!bar) return;
      if (maxScroll <= 0) {
        bar.style.width = '100%';
        bar.style.left = '0';
        return;
      }
      const pct = Math.min(1, Math.max(0, cS / maxScroll));
      const bW = Math.min(100, (wrap.clientWidth / track.scrollWidth) * 100);
      bar.style.width = `${bW}%`;
      bar.style.left = `${pct * (100 - bW)}%`;
    };

    const render = () => {
      track.style.transform = `translate3d(${-applyRubber(cS)}px, 0, 0)`;
      updateBar();
    };
    render();

    const stopLoops = () => {
      if (momRaf) { cancelAnimationFrame(momRaf); momRaf = null; }
      if (snapRaf) { cancelAnimationFrame(snapRaf); snapRaf = null; }
    };

    const startSnap = () => {
      if (snapRaf) return;
      const step = () => {
        const target = cS < 0 ? 0 : maxScroll;
        const d = target - cS;
        if (Math.abs(d) < 0.3) { cS = target; render(); snapRaf = null; return; }
        cS += d * SNAP_K;
        render();
        snapRaf = requestAnimationFrame(step);
      };
      snapRaf = requestAnimationFrame(step);
    };

    const momentum = () => {
      velocity *= FRICT;
      cS -= velocity;
      if (cS < 0 || cS > maxScroll) {
        cS = cS < 0
          ? Math.max(cS, -wrap.clientWidth * 0.25)
          : Math.min(cS, maxScroll + wrap.clientWidth * 0.25);
        velocity *= 0.5;
      }
      render();
      if (Math.abs(velocity) < MIN_VEL) {
        momRaf = null;
        if (cS < 0 || cS > maxScroll) startSnap();
        return;
      }
      momRaf = requestAnimationFrame(momentum);
    };

    const beginDrag = (clientX: number) => {
      isDown = true;
      wrap.classList.add('grabbing');
      sX = clientX;
      sL = cS;
      lastT = performance.now();
      velocity = 0;
      stopLoops();
    };
    const moveDrag = (clientX: number) => {
      if (!isDown) return;
      const delta = (clientX - sX) * 1.3;
      let target = sL - delta;
      if (target < 0) target = target * RUBBER;
      else if (target > maxScroll) target = maxScroll + (target - maxScroll) * RUBBER;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = velocity * 0.6 + ((cS - target) / dt * 16) * 0.4;
      cS = target;
      lastT = now;
      render();
    };
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      wrap.classList.remove('grabbing');
      if (cS < 0 || cS > maxScroll) { velocity = 0; startSnap(); return; }
      if (Math.abs(velocity) > 0.5) momRaf = requestAnimationFrame(momentum);
    };

    const onMd = (e: MouseEvent) => { beginDrag(e.clientX); e.preventDefault(); };
    const onMm = (e: MouseEvent) => { if (isDown) { e.preventDefault(); moveDrag(e.clientX); } };
    const onMu = endDrag;
    const onMl = endDrag;

    const onTs = (e: TouchEvent) => beginDrag(e.touches[0].clientX);
    const onTm = (e: TouchEvent) => moveDrag(e.touches[0].clientX);
    const onTe = endDrag;

    wrap.addEventListener('mousedown', onMd);
    window.addEventListener('mousemove', onMm);
    window.addEventListener('mouseup', onMu);
    window.addEventListener('mouseleave', onMl);

    wrap.addEventListener('touchstart', onTs, { passive: true });
    wrap.addEventListener('touchmove', onTm, { passive: true });
    wrap.addEventListener('touchend', onTe);
    wrap.addEventListener('touchcancel', onTe);

    // Wheel drives horizontal scroll with smooth follow
    let wheelTarget = 0;
    let wheelRaf: number | null = null;
    const wheelStep = () => {
      const d = wheelTarget - cS;
      if (Math.abs(d) < 0.3) { cS = wheelTarget; render(); wheelRaf = null; return; }
      cS += d * 0.16;
      render();
      wheelRaf = requestAnimationFrame(wheelStep);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        stopLoops();
        wheelTarget = Math.max(0, Math.min(maxScroll, (wheelTarget || cS) + e.deltaY));
        if (!wheelRaf) wheelRaf = requestAnimationFrame(wheelStep);
      }
    };
    wrap.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => { measure(); render(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    const t1 = window.setTimeout(onResize, 300);
    const t2 = window.setTimeout(onResize, 1200);

    return () => {
      stopLoops();
      if (wheelRaf) cancelAnimationFrame(wheelRaf);
      wrap.removeEventListener('mousedown', onMd);
      window.removeEventListener('mousemove', onMm);
      window.removeEventListener('mouseup', onMu);
      window.removeEventListener('mouseleave', onMl);
      wrap.removeEventListener('touchstart', onTs);
      wrap.removeEventListener('touchmove', onTm);
      wrap.removeEventListener('touchend', onTe);
      wrap.removeEventListener('touchcancel', onTe);
      wrap.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <section className="work-sec" id="work">
      <div className="wrap">
        <div className="head">
          <Reveal as="h2" variant="tilt">
            Built to be <em>remembered.</em>
          </Reveal>
          <span className="hint">✋ Drag or scroll →</span>
        </div>
      </div>

      <div className="drag-rail-wrap" ref={wrapRef}>
        <div className="drag-rail" ref={trackRef}>
          {ITEMS.map((item) => (
            <a key={item.title} className="wc" href={item.href ?? '#'} data-cc="view">
              <div
                className="v"
                style={{ backgroundImage: `url('${item.image}')` }}
                aria-hidden="true"
              />
              <div className="content">
                <div className="top">
                  <span className="idx">{item.idx}</span>
                  <span className="year">{item.year}</span>
                </div>
                <div>
                  <span className="tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <div className="metrics">
                    {item.metrics.map((m) => (
                      <div className="m" key={m.k}>
                        <div className="n">{m.n}</div>
                        <div className="k">{m.k}</div>
                      </div>
                    ))}
                  </div>
                  <span className="open">Case study ↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="drag-progress">
        <div className="bar" ref={barRef} />
      </div>
    </section>
  );
}
