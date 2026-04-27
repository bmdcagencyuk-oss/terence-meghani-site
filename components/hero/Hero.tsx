'use client';

import { useEffect, useRef } from 'react';

type CyclePhrase = { text: string; italic?: boolean };

const CYCLE_PHRASES: CyclePhrase[] = [
  { text: 'compounds revenue' },
  { text: 'ships on time' },
  { text: 'outlasts the trend cycle' },
  { text: 'wins the room' },
  { text: 'builds loyalty' },
];

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const megaRef = useRef<HTMLHeadingElement | null>(null);
  const cycleRef = useRef<HTMLSpanElement | null>(null);
  const heroTimeRef = useRef<HTMLSpanElement | null>(null);

  /* Rocket particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#FF4D17', '#FFB800', '#FF6E3D', '#00E1FF', '#7A0FFF'];
    let mx = W / 2;
    let my = H;
    let hasMouse = false;
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) {
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        hasMouse = true;
      } else {
        hasMouse = false;
      }
    };
    window.addEventListener('mousemove', onMouse);

    class Particle {
      x = 0; y = 0;
      vx = 0; vy = 0;
      size = 0;
      life = 0;
      maxLife = 0;
      color = '#fff';
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = H + Math.random() * 40;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        const speed = 1.5 + Math.random() * 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 4 + 1.5;
        this.life = 0;
        this.maxLife = 120 + Math.random() * 100;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        if (hasMouse) {
          const dx = this.x - mx;
          const dy = this.y - my;
          const d = Math.hypot(dx, dy);
          if (d < 140 && d > 0) {
            const force = (1 - d / 140) * 0.8;
            this.vx += (dx / d) * force;
            this.vy += (dy / d) * force;
          }
        }
        this.vx += (Math.random() - 0.5) * 0.15;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02;
        this.vx *= 0.99;
        this.life++;
        this.size *= 0.992;
        if (this.life >= this.maxLife || this.size < 0.4 || this.y < -20) this.reset();
      }
      draw(c: CanvasRenderingContext2D) {
        const alpha = Math.min(1, (1 - this.life / this.maxLife) * 0.9);
        c.globalAlpha = alpha;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = alpha * 0.9;
        c.fillStyle = '#FFFFFF';
        c.beginPath();
        c.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        c.fill();
      }
    }

    // Reduced particle density — the aurora layer carries most of the visual
    // weight now; particles read as subtle exhaust rather than fireworks.
    const COUNT = Math.min(110, Math.floor((W * H) / 12000));
    const particles = Array.from({ length: COUNT }, () => new Particle());
    particles.forEach((p) => { p.life = Math.random() * p.maxLife; });

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'screen';
      for (const p of particles) {
        p.update();
        p.draw(ctx);
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  /* Magnetic headline — non-fuel characters respond to pointer proximity */
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const mega = megaRef.current;
    if (!mega) return;
    const chars = Array.from(mega.querySelectorAll<HTMLElement>('.ch')).filter(
      (el) => !el.closest('.fuel-word'),
    );
    if (!chars.length) return;

    const radius = 220;
    let raf: number | null = null;
    let mx = 0;
    let my = 0;
    const apply = () => {
      chars.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(mx - cx, my - cy);
        const prox = Math.max(0, 1 - d / radius);
        const weight = 400 + prox * 400;
        ch.style.fontVariationSettings = `"wdth" 100, "opsz" 96, "wght" ${Math.round(weight)}`;
      });
      raf = null;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (raf === null) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => chars.forEach((ch) => (ch.style.fontVariationSettings = ''));
    mega.addEventListener('mousemove', onMove);
    mega.addEventListener('mouseleave', onLeave);
    return () => {
      mega.removeEventListener('mousemove', onMove);
      mega.removeEventListener('mouseleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  /* Hero subhead cycling phrase */
  useEffect(() => {
    const rotator = cycleRef.current;
    if (!rotator) return;
    const words = Array.from(rotator.querySelectorAll<HTMLElement>('.rw'));
    if (words.length < 2) return;

    const measure = () => {
      let maxW = 0;
      words.forEach((w) => {
        const savedPos = w.style.position;
        const savedOpacity = w.style.opacity;
        const savedVis = w.style.visibility;
        w.style.position = 'relative';
        w.style.opacity = '0';
        w.style.visibility = 'hidden';
        const width = w.getBoundingClientRect().width;
        w.style.position = savedPos;
        w.style.opacity = savedOpacity;
        w.style.visibility = savedVis;
        if (width > maxW) maxW = width;
      });
      rotator.style.minWidth = `${Math.ceil(maxW)}px`;
    };
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    else setTimeout(measure, 400);
    window.addEventListener('resize', measure);

    let idx = 0;
    const TICK = 2800;
    let interval: number | null = null;
    const advance = () => {
      const current = words[idx];
      idx = (idx + 1) % words.length;
      const next = words[idx];
      current.classList.remove('active');
      current.classList.add('exit');
      next.classList.add('active');
      setTimeout(() => current.classList.remove('exit'), 600);
    };
    const start = () => {
      if (interval === null) interval = window.setInterval(advance, TICK);
    };
    const stop = () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
    };
    start();
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* Live clock */
  useEffect(() => {
    const el = heroTimeRef.current;
    if (!el) return;
    const update = () => {
      const t = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Europe/London',
      });
      el.textContent = `${t} · LDN`;
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);


  return (
    <header className="hero">
      {/* Code-fragment backdrop sits behind the aurora and rocket canvas. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-code-backdrop"
        src="/hero-code-backdrop.svg"
        alt=""
        aria-hidden="true"
      />
      <div className="hero-aurora" aria-hidden="true">
        <span className="aurora-c" />
      </div>
      <canvas className="rocket-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />

      {/* Silverback gorilla — secondary mark watermark, bottom-right behind copy. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-gorilla-watermark"
        src="/brand/emblem-gorilla.svg"
        alt=""
        aria-hidden="true"
      />

      <div className="wrap">
        <div className="hero-top">
          <div className="left">
            <span className="dot" aria-hidden="true" />
            <span className="label">Live from the studio</span>
            <span className="val" ref={heroTimeRef}>—</span>
          </div>
          <div className="spinner" aria-hidden="true">
            <svg viewBox="0 0 96 96">
              <defs>
                <path
                  id="heroRingMini"
                  d="M 48,48 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                />
              </defs>
              <text>
                <textPath href="#heroRingMini">LAUNCH · Q3 2026 · READY · </textPath>
              </text>
            </svg>
            <span className="core">
              <span className="emblem" />
            </span>
          </div>
        </div>

        <div className="hero-center">
          <h1 className="mega" ref={megaRef}>
            <span className="ln ln1">Hertfordshire · London · Est. 2014</span>

            <span className="ln ln-give ln-built">Built to</span>

            <span className="ln ln-fuel">
              <span className="fuel-word" id="fuelWord">
                <span className="ch">C</span>
                <span className="ch">O</span>
                <span className="ch">M</span>
                <span className="ch">P</span>
                <span className="ch">O</span>
                <span className="ch">U</span>
                <span className="ch">N</span>
                <span className="ch">D</span>
              </span>
              <span className="fuel-emblem" aria-hidden="true" />
            </span>
          </h1>

          <p className="hero-sub">
            Brand, code and growth that{' '}
            <span className="hero-cycle" ref={cycleRef}>
              {CYCLE_PHRASES.map((p, i) => (
                <span
                  key={p.text}
                  className={`rw${i === 0 ? ' active' : ''}${p.italic ? ' rw-italic' : ''}`}
                >
                  {p.text}
                </span>
              ))}
            </span>{' '}
            — under one roof.
          </p>
        </div>

        <div className="hero-bottom hero-bottom--simple">
          <a
            href="https://calendly.com/terencemeghani"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta"
            aria-label="Book a discovery call on Calendly"
          >
            <span className="icon" aria-hidden="true">🚀</span>
            <span>Book a<br />discovery call</span>
          </a>
          <a href="#work" className="hero-cta-sec">See the work ↓</a>
          <p className="hero-bottom-note">
            <strong>Studio of one — brand, code, growth.</strong> Strategy and engineering,{' '}
            <span className="hl">wired together, not bolted on.</span>
          </p>
        </div>
      </div>
    </header>
  );
}
