import { loadSvgPaths, normalizePoints, sampleOutlinePoints } from './svg-sampler';

export type StageData = {
  positions: Float32Array;
  colors: Float32Array;
  /** Drift amplitude during this stage's hold (0 = static, 1 = full sketch breathing). */
  holdDrift: number;
};

export type AllStages = {
  sketch: StageData;
  refined: StageData;
  wireframe: StageData;
  rendered: StageData;
  /** Rocket has just formed at the nav position; non-rocket particles still in site layout. */
  launchStart: StageData;
  /** Rocket has ascended off-screen; non-rocket particles dispersed. */
  launchEnd: StageData;
};

const SCENE_HEIGHT = 3.6;
/** First N particles are the "gorilla emblem cohort" — they form the small
 *  gorilla in the rendered-site nav (Stage 5) and the rocket cluster in the
 *  launch (Stage 6). Other particles fill site content / disperse. */
const NAV_GORILLA_PARTICLES = 800;

type Point = { x: number; y: number };
type RGB = [number, number, number];

function hex(c: string): RGB {
  const v = parseInt(c.replace('#', ''), 16);
  return [((v >> 16) & 0xff) / 255, ((v >> 8) & 0xff) / 255, (v & 0xff) / 255];
}
function scl(c: RGB, k: number): RGB {
  return [c[0] * k, c[1] * k, c[2] * k];
}

function writeColor(arr: Float32Array, idx: number, c: RGB) {
  arr[idx * 3 + 0] = c[0];
  arr[idx * 3 + 1] = c[1];
  arr[idx * 3 + 2] = c[2];
}
function writePos(arr: Float32Array, idx: number, x: number, y: number, z = 0) {
  arr[idx * 3 + 0] = x;
  arr[idx * 3 + 1] = y;
  arr[idx * 3 + 2] = z;
}

// =============================================================================
// Stage 1 — sketch
// =============================================================================
function buildSketchStage(cleanPoints: Point[], particleCount: number): StageData {
  const positions = new Float32Array(particleCount * 3);
  // Spec: 0–15 SVG-px noise → up to ±0.16 scene units (1 svg-px ≈ 0.0106 scene).
  const NOISE = 0.16;
  for (let i = 0; i < particleCount; i++) {
    const p = cleanPoints[i];
    const next = cleanPoints[(i + 1) % cleanPoints.length];
    const dx = next.x - p.x;
    const dy = next.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    const nx = -ty;
    const ny = tx;
    const r = Math.random();
    const perp = r < 0.85
      ? (Math.random() - 0.5) * NOISE
      : (Math.random() - 0.5) * NOISE * 2.2;
    const along = (Math.random() - 0.5) * NOISE * 0.4;
    writePos(
      positions,
      i,
      p.x + nx * perp + tx * along,
      p.y + ny * perp + ty * along,
      (Math.random() - 0.5) * NOISE * 0.5,
    );
  }
  const colors = new Float32Array(particleCount * 3);
  const c = scl(hex('#FFFFFF'), 0.65);
  for (let i = 0; i < particleCount; i++) writeColor(colors, i, c);
  return { positions, colors, holdDrift: 1.0 };
}

// =============================================================================
// Stage 2 — refined emblem
// =============================================================================
function buildRefinedStage(cleanPoints: Point[], particleCount: number): StageData {
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const p = cleanPoints[i];
    writePos(positions, i, p.x, p.y, 0);
  }
  const colors = new Float32Array(particleCount * 3);
  const c = scl(hex('#FF4D17'), 0.9);
  for (let i = 0; i < particleCount; i++) writeColor(colors, i, c);
  return { positions, colors, holdDrift: 0.0 };
}

// Stage 3 (code form) was removed — replaced by a procedural spiral
// compression vortex implemented entirely in the vertex shader. See the
// `uStage3Mode` branch of particle-shaders.ts and the spiral state machine
// in components/hero/MorphingGorilla.tsx.

// =============================================================================
// Stage 4 — wireframe
// =============================================================================
function buildWireframeStage(particleCount: number): StageData {
  // Layout (scene coords, top-down):
  //   nav    : y in [1.4, 1.6],  x in [-1.5, 1.5]
  //   hero   : y in [0.0, 1.3],  x in [-1.5, 1.5]
  //   3 cards: y in [-0.9, -0.1], 3 columns
  //   footer : y in [-1.2, -1.0], x in [-1.5, 1.5]
  type Rect = { x1: number; y1: number; x2: number; y2: number };
  const rects: Rect[] = [
    { x1: -1.5, y1: 1.4, x2: 1.5, y2: 1.6 }, // nav
    { x1: -1.5, y1: 0.0, x2: 1.5, y2: 1.3 }, // hero
    { x1: -1.5, y1: -0.9, x2: -0.567, y2: -0.1 }, // card 1
    { x1: -0.467, y1: -0.9, x2: 0.467, y2: -0.1 }, // card 2
    { x1: 0.567, y1: -0.9, x2: 1.5, y2: -0.1 }, // card 3
    { x1: -1.5, y1: -1.2, x2: 1.5, y2: -1.0 }, // footer
  ];
  const perims = rects.map((r) => 2 * (r.x2 - r.x1 + r.y2 - r.y1));
  const totalPerim = perims.reduce((a, b) => a + b, 0);

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = scl(hex('#FFFFFF'), 0.8);
  const violetColor = scl(hex('#9B3DFF'), 0.7);

  let allocated = 0;
  for (let r = 0; r < rects.length; r++) {
    const rect = rects[r];
    const w = rect.x2 - rect.x1;
    const h = rect.y2 - rect.y1;
    const perim = perims[r];
    const isLast = r === rects.length - 1;
    const samples = isLast
      ? particleCount - allocated
      : Math.round((perim / totalPerim) * particleCount);
    const corners = [0, w, w + h, 2 * w + h];

    for (let i = 0; i < samples; i++) {
      const idx = allocated + i;
      const d = (i / samples) * perim;
      let x: number;
      let y: number;
      if (d < w) {
        x = rect.x1 + d;
        y = rect.y2;
      } else if (d < w + h) {
        x = rect.x2;
        y = rect.y2 - (d - w);
      } else if (d < 2 * w + h) {
        x = rect.x2 - (d - w - h);
        y = rect.y1;
      } else {
        x = rect.x1;
        y = rect.y1 + (d - 2 * w - h);
      }
      x += (Math.random() - 0.5) * 0.014;
      y += (Math.random() - 0.5) * 0.014;
      writePos(positions, idx, x, y, (Math.random() - 0.5) * 0.025);

      // Corner detection — particles within 0.06 of any corner pick up violet.
      let minCornerDist = Infinity;
      for (const c of corners) {
        const a = Math.abs(d - c);
        const dist = Math.min(a, perim - a);
        if (dist < minCornerDist) minCornerDist = dist;
      }
      const isCorner = minCornerDist < 0.06;
      writeColor(colors, idx, isCorner ? violetColor : baseColor);
    }
    allocated += samples;
  }
  return { positions, colors, holdDrift: 0.06 };
}

// =============================================================================
// Stage 5 — rendered site
// =============================================================================
function buildRenderedStage(cleanGorilla: Point[], particleCount: number): StageData {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Nav emblem: NAV_GORILLA_PARTICLES of cleanGorilla, scaled down, positioned
  // top-left of the nav bar.
  const NAV_OFFSET_X = -1.32;
  const NAV_OFFSET_Y = 1.5;
  const NAV_HEIGHT = 0.22;
  const scaleK = NAV_HEIGHT / SCENE_HEIGHT;
  const orangeFull = scl(hex('#FF4D17'), 1.0);
  for (let i = 0; i < NAV_GORILLA_PARTICLES; i++) {
    // Sample uniformly from cleanGorilla (4000 → 800).
    const sourceIdx = Math.floor((i * cleanGorilla.length) / NAV_GORILLA_PARTICLES);
    const p = cleanGorilla[sourceIdx];
    writePos(
      positions,
      i,
      NAV_OFFSET_X + p.x * scaleK,
      NAV_OFFSET_Y + p.y * scaleK,
      0,
    );
    writeColor(colors, i, orangeFull);
  }

  const whiteColor = scl(hex('#E5E7EB'), 0.6);
  const violetColor = scl(hex('#9B3DFF'), 0.45);

  const contentParticles = particleCount - NAV_GORILLA_PARTICLES;
  let idx = NAV_GORILLA_PARTICLES;

  // Hero zone fill: y in [0.0, 1.3], x in [-1.5, 1.5]. ~50% of content.
  const heroCount = Math.floor(contentParticles * 0.5);
  for (let i = 0; i < heroCount && idx < particleCount; i++, idx++) {
    const x = -1.5 + Math.random() * 3.0;
    const y = 0.0 + Math.random() * 1.3;
    writePos(positions, idx, x, y, 0);
    writeColor(colors, idx, Math.random() < 0.18 ? violetColor : whiteColor);
  }

  // Cards: 3 cards × 3 lines each, varying widths suggesting paragraphs.
  const cardCenters = [-1.0335, 0, 1.0335];
  const cardY1 = -0.9;
  const cardY2 = -0.1;
  const cardWidth = 0.85;
  const linesPerCard = 3;
  const cardsTotal = Math.floor(contentParticles * 0.4);
  const particlesPerCard = Math.floor(cardsTotal / 3);
  const particlesPerLine = Math.floor(particlesPerCard / linesPerCard);
  for (let c = 0; c < 3; c++) {
    const cx = cardCenters[c];
    for (let line = 0; line < linesPerCard; line++) {
      const yFrac = (line + 1) / (linesPerCard + 1);
      const lineY = cardY1 + yFrac * (cardY2 - cardY1);
      const lineWidthRatio = 0.45 + Math.random() * 0.4;
      const lineWidth = cardWidth * lineWidthRatio;
      const lineLeft = cx - lineWidth / 2;
      for (let p = 0; p < particlesPerLine && idx < particleCount; p++, idx++) {
        const x = lineLeft + Math.random() * lineWidth;
        const y = lineY + (Math.random() - 0.5) * 0.04;
        writePos(positions, idx, x, y, 0);
        writeColor(colors, idx, whiteColor);
      }
    }
  }

  // Footer: thin band, fills any remaining particles.
  while (idx < particleCount) {
    const x = -1.5 + Math.random() * 3.0;
    const y = -1.1 + (Math.random() - 0.5) * 0.04;
    writePos(positions, idx, x, y, 0);
    writeColor(colors, idx, whiteColor);
    idx++;
  }

  return { positions, colors, holdDrift: 0.05 };
}

// =============================================================================
// Stage 6a — launch start (rocket has just formed; non-rocket still in site)
// =============================================================================
function buildLaunchStartStage(stage5: StageData, particleCount: number): StageData {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // 800 particles in rocket form at the nav-emblem position.
  const ROCKET_X = -1.32;
  const ROCKET_Y = 1.5;
  const ROCKET_H = 0.32;
  const ROCKET_W = 0.10;
  const orangeIntense = scl(hex('#FF4D17'), 1.1);
  for (let i = 0; i < NAV_GORILLA_PARTICLES; i++) {
    const t = (i + 0.5) / NAV_GORILLA_PARTICLES;
    const taper = 1 - t * 0.55;
    const localX = (Math.random() - 0.5) * ROCKET_W * taper;
    const localY = (t - 0.5) * ROCKET_H;
    writePos(
      positions,
      i,
      ROCKET_X + localX,
      ROCKET_Y + localY,
      (Math.random() - 0.5) * 0.04,
    );
    writeColor(colors, i, orangeIntense);
  }

  // Non-rocket particles: copy from Stage 5 — they don't move during the
  // initial 1s reshape (Stage 5 → Stage 6a).
  for (let i = NAV_GORILLA_PARTICLES; i < particleCount; i++) {
    positions[i * 3 + 0] = stage5.positions[i * 3 + 0];
    positions[i * 3 + 1] = stage5.positions[i * 3 + 1];
    positions[i * 3 + 2] = stage5.positions[i * 3 + 2];
    colors[i * 3 + 0] = stage5.colors[i * 3 + 0];
    colors[i * 3 + 1] = stage5.colors[i * 3 + 1];
    colors[i * 3 + 2] = stage5.colors[i * 3 + 2];
  }
  return { positions, colors, holdDrift: 0.0 };
}

// =============================================================================
// Stage 6b — launch end (rocket gone, particles dispersed)
// =============================================================================
function buildLaunchEndStage(particleCount: number): StageData {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Rocket — high above the canvas, slightly drifted right during ascent.
  const ROCKET_Y = 4.5;
  const ROCKET_X = -0.95;
  const ROCKET_H = 0.55;
  const ROCKET_W = 0.13;
  const orangeIntense = scl(hex('#FF4D17'), 1.1);
  for (let i = 0; i < NAV_GORILLA_PARTICLES; i++) {
    const t = (i + 0.5) / NAV_GORILLA_PARTICLES;
    const taper = 1 - t * 0.55;
    const localX = (Math.random() - 0.5) * ROCKET_W * taper;
    const localY = (t - 0.5) * ROCKET_H;
    writePos(
      positions,
      i,
      ROCKET_X + localX,
      ROCKET_Y + localY,
      (Math.random() - 0.5) * 0.05,
    );
    writeColor(colors, i, orangeIntense);
  }

  // Dispersed particles — scattered around the canvas in a wide ring,
  // recoloured to fading violet (with a few orange-tinted) so the overall
  // post-launch field reads as ember-cooling rather than crisp graphic.
  const violetDim = scl(hex('#9B3DFF'), 0.32);
  const orangeFade = scl(hex('#FF4D17'), 0.45);
  for (let i = NAV_GORILLA_PARTICLES; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 1.6 + Math.random() * 2.0;
    const x = Math.cos(angle) * r;
    // Bias the dispersal slightly downward so the rocket reads as having
    // pushed the rest of the field "out of the way" upward → outward.
    const y = Math.sin(angle) * r * 0.8 - 0.25;
    writePos(positions, i, x, y, (Math.random() - 0.5) * 1.0);
    writeColor(colors, i, Math.random() < 0.25 ? orangeFade : violetDim);
  }
  return { positions, colors, holdDrift: 0.45 };
}

// =============================================================================
// Public — build all 7 stage entries from a single SVG load.
// =============================================================================
export async function buildAllStages(
  svgUrl: string,
  particleCount: number,
): Promise<AllStages> {
  const paths = await loadSvgPaths(svgUrl);
  const raw = sampleOutlinePoints(paths, particleCount);
  const cleanGorilla = normalizePoints(raw, SCENE_HEIGHT);

  const sketch = buildSketchStage(cleanGorilla, particleCount);
  const refined = buildRefinedStage(cleanGorilla, particleCount);
  const wireframe = buildWireframeStage(particleCount);
  const rendered = buildRenderedStage(cleanGorilla, particleCount);
  const launchStart = buildLaunchStartStage(rendered, particleCount);
  const launchEnd = buildLaunchEndStage(particleCount);

  return { sketch, refined, wireframe, rendered, launchStart, launchEnd };
}
