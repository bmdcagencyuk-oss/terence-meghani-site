'use client';

import { useEffect, useRef } from 'react';

type GiveLetter = { ch: string; q: string };

const GIVE_LETTERS: GiveLetter[] = [
  { ch: 'G', q: 'Creativity takes courage.|Henri Matisse' },
  { ch: 'i', q: 'Imagination is the beginning of creation.|George Bernard Shaw' },
  { ch: 'v', q: 'The void is where creativity begins.|Rick Rubin' },
  { ch: 'e', q: 'Every artist was first an amateur.|Ralph Waldo Emerson' },
];

const YOUR_LETTERS: GiveLetter[] = [
  { ch: 'y', q: "You can't use up creativity. The more you use, the more you have.|Maya Angelou" },
  { ch: 'o', q: 'Originality is nothing but judicious imitation.|Voltaire' },
  { ch: 'u', q: 'Curiosity is the wick in the candle of learning.|William Arthur Ward' },
  { ch: 'r', q: 'Rules are what the artist breaks.|Man Ray' },
];

const BRAND_LETTERS: GiveLetter[] = [
  { ch: 'b', q: 'A brand is what people say when you leave the room.|Jeff Bezos' },
  { ch: 'r', q: 'Restraint breeds creativity.|Ron Howard' },
  { ch: 'a', q: 'Art is the lie that enables us to realize the truth.|Pablo Picasso' },
  { ch: 'n', q: 'Nothing is original. Steal from anywhere that resonates.|Jim Jarmusch' },
  { ch: 'd', q: 'Design is intelligence made visible.|Alina Wheeler' },
];

const CYCLE_PHRASES = [
  'launches businesses',
  'compounds revenue',
  'wins the room',
  'builds loyalty',
  'stops scrolling',
];

const STICKERS = [
  { x: '6%',  y: '18%', rot: -6, kind: 'chip',    label: '★ 4.9 · 100+ happy clients' },
  { x: '80%', y: '16%', rot: 8,  kind: 'tape',    label: 'EST. 2014' },
  { x: '4%',  y: '52%', rot: -4, kind: 'polaroid', photo: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80&auto=format', label: 'Al Jannah / Marrakech' },
  { x: '75%', y: '50%', rot: 6,  kind: 'badge',   n: '3×',  l: 'Revenue lift' },
  { x: '20%', y: '78%', rot: -3, kind: 'quote',   text: 'Not a deck handoff — a partner.', who: 'Sarah K. · F&B founder' },
  { x: '62%', y: '78%', rot: 4,  kind: 'chip violet', label: 'BBC · TEDx · NHS' },
  { x: '86%', y: '80%', rot: -8, kind: 'badge violet', n: '60+', l: 'Brands shipped' },
] as const;

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const megaRef = useRef<HTMLHeadingElement | null>(null);
  const cycleRef = useRef<HTMLSpanElement | null>(null);
  const stickerFieldRef = useRef<HTMLDivElement | null>(null);
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

    const COUNT = Math.min(220, Math.floor((W * H) / 6500));
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

  /* Letter-quote popup — hover any letter in "Give your brand" */
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const mega = megaRef.current;
    if (!mega) return;
    const parent = mega.querySelector<HTMLElement>('.ln-give');
    const letters = mega.querySelectorAll<HTMLElement>('.ln-give .ch[data-q]');
    if (!parent || !letters.length) return;

    const pop = document.createElement('div');
    pop.className = 'q-pop';
    pop.innerHTML = '<span class="q-text"></span><span class="q-auth"></span>';
    document.body.appendChild(pop);
    const textEl = pop.querySelector<HTMLElement>('.q-text')!;
    const authEl = pop.querySelector<HTMLElement>('.q-auth')!;

    let hideTimer: number | null = null;
    const POP_WIDTH = 260;
    const EDGE_PAD = 20;

    const show = (letter: HTMLElement) => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      const parts = (letter.dataset.q || '').split('|');
      textEl.textContent = `“${parts[0] ?? ''}”`;
      authEl.textContent = `— ${parts[1] ?? ''}`;
      const r = letter.getBoundingClientRect();
      let x = r.left + r.width / 2;
      x = Math.max(POP_WIDTH / 2 + EDGE_PAD, Math.min(window.innerWidth - POP_WIDTH / 2 - EDGE_PAD, x));
      pop.style.left = `${x}px`;
      pop.style.top = `${r.top}px`;
      const arrowOffset = r.left + r.width / 2 - x;
      pop.style.setProperty('--arrow-x', `${arrowOffset}px`);
      pop.classList.add('visible');
    };
    const hide = () => {
      hideTimer = window.setTimeout(() => pop.classList.remove('visible'), 60);
    };
    letters.forEach((l) => l.addEventListener('mouseenter', () => show(l)));
    parent.addEventListener('mouseleave', hide);
    return () => {
      letters.forEach((l) => l.removeEventListener('mouseenter', () => show(l)));
      parent.removeEventListener('mouseleave', hide);
      if (hideTimer) clearTimeout(hideTimer);
      pop.remove();
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

  /* Stickers physics (drag + bounce + collisions) */
  useEffect(() => {
    const field = stickerFieldRef.current;
    if (!field) return;
    const els = Array.from(field.querySelectorAll<HTMLElement>('.sticker'));
    if (!els.length) return;

    const parsePos = (s: string, container: number, el: number): number => {
      if (s.endsWith('%')) return (parseFloat(s) / 100) * container - el / 2;
      return parseFloat(s);
    };

    type Body = {
      el: HTMLElement;
      w: number;
      h: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      dragging: boolean;
      collidedAt: number;
    };

    const bodies: Body[] = els.map((el) => {
      el.style.visibility = 'hidden';
      el.style.transform = 'translate(0,0)';
      const r = el.getBoundingClientRect();
      const cr = field.getBoundingClientRect();
      el.style.visibility = '';
      const a = Math.random() * Math.PI * 2;
      const s = 0.16 + Math.random() * 0.12;
      return {
        el,
        w: r.width,
        h: r.height,
        x: Math.max(0, Math.min(cr.width - r.width, parsePos(el.dataset.x || '50%', cr.width, r.width))),
        y: Math.max(0, Math.min(cr.height - r.height, parsePos(el.dataset.y || '50%', cr.height, r.height))),
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        rot: parseFloat(el.dataset.rot || '0'),
        dragging: false,
        collidedAt: 0,
      };
    });

    const apply = (b: Body) => {
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rot}deg)`;
    };
    bodies.forEach(apply);

    let raf = 0;
    const step = () => {
      const cRect = field.getBoundingClientRect();
      const cW = cRect.width;
      const cH = cRect.height;
      for (const b of bodies) {
        if (b.dragging) continue;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > 1.5) {
          b.vx *= 0.96;
          b.vy *= 0.96;
        } else {
          const min = 0.2;
          if (speed < min) {
            const a = Math.atan2(b.vy, b.vx);
            b.vx = Math.cos(a) * min;
            b.vy = Math.sin(a) * min;
          }
        }
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vx * 0.1;
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); b.rot += (Math.random() - 0.5) * 4; }
        if (b.x + b.w > cW) { b.x = cW - b.w; b.vx = -Math.abs(b.vx); b.rot += (Math.random() - 0.5) * 4; }
        if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); b.rot += (Math.random() - 0.5) * 4; }
        if (b.y + b.h > cH) { b.y = cH - b.h; b.vy = -Math.abs(b.vy); b.rot += (Math.random() - 0.5) * 4; }
      }

      const now = performance.now();
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const c = bodies[j];
          if (a.x < c.x + c.w && a.x + a.w > c.x && a.y < c.y + c.h && a.y + a.h > c.y) {
            const dx = (c.x + c.w / 2) - (a.x + a.w / 2);
            const dy = (c.y + c.h / 2) - (a.y + a.h / 2);
            const oX = (a.w + c.w) / 2 - Math.abs(dx);
            const oY = (a.h + c.h) / 2 - Math.abs(dy);
            if (oX < oY) {
              const sep = oX / 2 + 0.5;
              if (dx > 0) { if (!a.dragging) a.x -= sep; if (!c.dragging) c.x += sep; }
              else { if (!a.dragging) a.x += sep; if (!c.dragging) c.x -= sep; }
              const d = 0.85;
              if (!a.dragging && !c.dragging) { const t = a.vx; a.vx = c.vx * d; c.vx = t * d; }
              else if (a.dragging) { c.vx = (c.vx - a.vx * 2) * -0.7; }
              else if (c.dragging) { a.vx = (a.vx - c.vx * 2) * -0.7; }
            } else {
              const sep = oY / 2 + 0.5;
              if (dy > 0) { if (!a.dragging) a.y -= sep; if (!c.dragging) c.y += sep; }
              else { if (!a.dragging) a.y += sep; if (!c.dragging) c.y -= sep; }
              const d = 0.85;
              if (!a.dragging && !c.dragging) { const t = a.vy; a.vy = c.vy * d; c.vy = t * d; }
              else if (a.dragging) { c.vy = (c.vy - a.vy * 2) * -0.7; }
              else if (c.dragging) { a.vy = (a.vy - c.vy * 2) * -0.7; }
            }
            a.rot += (Math.random() - 0.5) * 4;
            c.rot += (Math.random() - 0.5) * 4;
            if (now - a.collidedAt > 300) {
              a.el.classList.add('colliding');
              a.collidedAt = now;
              setTimeout(() => a.el.classList.remove('colliding'), 250);
            }
            if (now - c.collidedAt > 300) {
              c.el.classList.add('colliding');
              c.collidedAt = now;
              setTimeout(() => c.el.classList.remove('colliding'), 250);
            }
          }
        }
      }
      for (const b of bodies) apply(b);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const cleanups: Array<() => void> = [];
    bodies.forEach((b) => {
      let startX = 0;
      let startY = 0;
      let oX = 0;
      let oY = 0;
      let lX = 0;
      let lY = 0;
      let lT = 0;
      const down = (cx: number, cy: number, e?: Event) => {
        b.dragging = true;
        b.el.classList.add('grabbing');
        document.body.classList.add('cc-grabbing');
        bodies.forEach((o) => (o.el.style.zIndex = ''));
        b.el.style.zIndex = '30';
        startX = cx;
        startY = cy;
        oX = b.x;
        oY = b.y;
        lX = cx;
        lY = cy;
        lT = performance.now();
        if (e && 'preventDefault' in e) e.preventDefault();
      };
      const move = (cx: number, cy: number) => {
        if (!b.dragging) return;
        b.x = oX + (cx - startX);
        b.y = oY + (cy - startY);
        const n = performance.now();
        const dt = Math.max(1, n - lT);
        b.vx = ((cx - lX) / dt) * 16;
        b.vy = ((cy - lY) / dt) * 16;
        lX = cx;
        lY = cy;
        lT = n;
      };
      const up = () => {
        if (!b.dragging) return;
        b.dragging = false;
        b.el.classList.remove('grabbing');
        document.body.classList.remove('cc-grabbing');
      };
      const onMd = (e: MouseEvent) => down(e.clientX, e.clientY, e);
      const onMm = (e: MouseEvent) => move(e.clientX, e.clientY);
      const onMu = () => up();
      const onTs = (e: TouchEvent) => down(e.touches[0].clientX, e.touches[0].clientY);
      const onTm = (e: TouchEvent) => {
        if (b.dragging) {
          e.preventDefault();
          move(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const onTe = () => up();
      b.el.addEventListener('mousedown', onMd);
      window.addEventListener('mousemove', onMm);
      window.addEventListener('mouseup', onMu);
      b.el.addEventListener('touchstart', onTs, { passive: true });
      window.addEventListener('touchmove', onTm, { passive: false });
      window.addEventListener('touchend', onTe);
      cleanups.push(() => {
        b.el.removeEventListener('mousedown', onMd);
        window.removeEventListener('mousemove', onMm);
        window.removeEventListener('mouseup', onMu);
        b.el.removeEventListener('touchstart', onTs);
        window.removeEventListener('touchmove', onTm);
        window.removeEventListener('touchend', onTe);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  /* Count-up stats */
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.hero [data-cnt]');
    nodes.forEach((el) => {
      const t = parseInt(el.dataset.cnt || '0', 10);
      const dur = 1800;
      const start = performance.now();
      const step = (tm: number) => {
        const p = Math.min(1, (tm - start) / dur);
        el.textContent = String(Math.round(t * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, []);

  return (
    <header className="hero">
      <canvas className="rocket-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />

      <div className="stickers" ref={stickerFieldRef} aria-hidden="true">
        {STICKERS.map((s, i) => (
          <div
            key={i}
            className="sticker"
            data-cc="drag"
            data-x={s.x}
            data-y={s.y}
            data-rot={s.rot}
          >
            {s.kind === 'chip' && <div className="sk-chip">{s.label}</div>}
            {s.kind === 'chip violet' && <div className="sk-chip violet">{s.label}</div>}
            {s.kind === 'tape' && <div className="sk-tape">{s.label}</div>}
            {s.kind === 'polaroid' && (
              <div className="sk-polaroid">
                <div className="photo" style={{ backgroundImage: `url('${s.photo}')` }} />
                <div className="label">
                  <em>{s.label.split(' / ')[0]}</em> / {s.label.split(' / ')[1]}
                </div>
              </div>
            )}
            {s.kind === 'badge' && (
              <div className="sk-badge">
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            )}
            {s.kind === 'badge violet' && (
              <div className="sk-badge violet">
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            )}
            {s.kind === 'quote' && (
              <div className="sk-quote">
                <p>{s.text}</p>
                <div className="who">{s.who}</div>
              </div>
            )}
          </div>
        ))}
      </div>

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

            <span className="ln ln-give">
              {GIVE_LETTERS.map((l, i) => (
                <span key={`g-${i}`} className="ch" data-q={l.q}>
                  {l.ch}
                </span>
              ))}
              <span className="sp">&nbsp;</span>
              {YOUR_LETTERS.map((l, i) => (
                <span key={`y-${i}`} className="ch" data-q={l.q}>
                  {l.ch}
                </span>
              ))}
              <span className="sp">&nbsp;</span>
              {BRAND_LETTERS.map((l, i) => (
                <span key={`b-${i}`} className="ch" data-q={l.q}>
                  {l.ch}
                </span>
              ))}
            </span>

            <span className="ln ln-fuel">
              <span className="fuel-word" id="fuelWord">
                <span className="ch">F</span>
                <span className="ch">U</span>
                <span className="ch">E</span>
                <span className="ch">L</span>
              </span>
              <span className="fuel-emblem" aria-hidden="true" />
            </span>
          </h1>

          <p className="hero-sub">
            Branding that{' '}
            <span className="hero-cycle" ref={cycleRef}>
              {CYCLE_PHRASES.map((p, i) => (
                <span key={p} className={`rw${i === 0 ? ' active' : ''}`}>
                  {p}
                </span>
              ))}
            </span>{' '}
            — not another polite logo.
          </p>
        </div>

        <div className="hero-bottom">
          <div className="data-panel">
            <div className="dp-head">
              <span>{'// LAUNCH STATS'}</span>
              <span aria-hidden="true">●</span>
            </div>
            <div className="dp-row"><span className="k">Clients</span><span className="bar" style={{ ['--fill' as keyof React.CSSProperties]: '92%' } as React.CSSProperties} /><span className="v" data-cnt="68">00</span></div>
            <div className="dp-row"><span className="k">Projects</span><span className="bar" style={{ ['--fill' as keyof React.CSSProperties]: '84%' } as React.CSSProperties} /><span className="v" data-cnt="142">000</span></div>
            <div className="dp-row"><span className="k">Years</span><span className="bar" style={{ ['--fill' as keyof React.CSSProperties]: '75%' } as React.CSSProperties} /><span className="v" data-cnt="10">00</span></div>
            <div className="dp-row"><span className="k">NPS</span><span className="bar" style={{ ['--fill' as keyof React.CSSProperties]: '98%' } as React.CSSProperties} /><span className="v" data-cnt="72">00</span></div>
            <div className="dp-row"><span className="k">Reply time</span><span className="bar" style={{ ['--fill' as keyof React.CSSProperties]: '95%' } as React.CSSProperties} /><span className="v">&lt;4h</span></div>
          </div>

          <div className="hero-cta-wrap">
            <a
              href="https://calendly.com/terencemeghani"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta"
              data-cc="go"
              aria-label="Book a discovery call on Calendly"
            >
              <span className="icon" aria-hidden="true">🚀</span>
              <span>Book a<br />discovery call</span>
            </a>
            <a href="#work" className="hero-cta-sec">See the work ↓</a>
          </div>

          <div className="rt">
            <p>
              <strong>One brain. Ten years.</strong> Strategy, identity, growth —{' '}
              <span className="hl">wired together, not bolted on.</span>
            </p>
            <span className="meta">
              <span className="d" aria-hidden="true" />
              Replies · &lt; 4h · Q3 slots open
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
