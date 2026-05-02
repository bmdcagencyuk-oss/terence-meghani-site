import { loadSvgPaths, normalizePoints, sampleOutlinePoints } from './svg-sampler';

export type StageData = {
  /** Float32Array of length particleCount * 3 — xyz triplets in scene coords. */
  positions: Float32Array;
  /** Float32Array of length particleCount * 3 — rgb in 0..1, opacity baked in. */
  colors: Float32Array;
  /** Drift amplitude to apply during this stage's hold (0 = static, 1 = full). */
  holdDrift: number;
};

const SCENE_HEIGHT = 3.6;

/** Hex like '#FF4D17' → [r, g, b] floats in 0..1. */
function hex(c: string): [number, number, number] {
  const v = parseInt(c.replace('#', ''), 16);
  return [((v >> 16) & 0xff) / 255, ((v >> 8) & 0xff) / 255, (v & 0xff) / 255];
}

function fillSolid(arr: Float32Array, rgb: [number, number, number], opacity: number) {
  const r = rgb[0] * opacity;
  const g = rgb[1] * opacity;
  const b = rgb[2] * opacity;
  for (let i = 0; i < arr.length; i += 3) {
    arr[i] = r;
    arr[i + 1] = g;
    arr[i + 2] = b;
  }
}

/**
 * Phase 2: stages 1 (sketch) and 2 (refined emblem) only. Both share point
 * ordering so a particle at index N morphs from its sketch-position to its
 * refined-position 1:1.
 *
 * Spec colours:
 *   Stage 1 — white at 65% opacity; faint, sketchy, below bloom threshold
 *   Stage 2 — rocket-orange #FF4D17 at 90% opacity; red channel above the
 *             bloom threshold so highlights glow
 */
export async function buildGorillaStages(svgUrl: string, particleCount: number) {
  const paths = await loadSvgPaths(svgUrl);
  const raw = sampleOutlinePoints(paths, particleCount);
  const clean = normalizePoints(raw, SCENE_HEIGHT);

  // SVG height is 340.165 logical units → scene height 3.6 → 1 SVG-px ≈
  // 0.0106 scene units. Spec asks for 0-15 SVG-px noise → max ±0.16 scene
  // units perpendicular offset.
  const NOISE_SCENE = 0.16;

  // ---- Stage 2 — refined emblem (clean, rocket-orange) ----
  const refinedPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const p = clean[i] ?? clean[clean.length - 1];
    refinedPositions[i * 3 + 0] = p.x;
    refinedPositions[i * 3 + 1] = p.y;
    refinedPositions[i * 3 + 2] = 0;
  }
  const refinedColors = new Float32Array(particleCount * 3);
  fillSolid(refinedColors, hex('#FF4D17'), 0.9);

  // ---- Stage 1 — sketch (loose, gestural, faint white) ----
  // Same point ordering as refined, with random perpendicular jitter so the
  // outline reads as drawn-by-hand. Tangent estimated from the next sample;
  // across sub-path boundaries the tangent estimate is noisier — that's
  // additive to the sketchy feel.
  const sketchPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const p = clean[i] ?? clean[clean.length - 1];
    const next = clean[(i + 1) % clean.length];
    const dx = next.x - p.x;
    const dy = next.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    // Perpendicular (2D) — rotate tangent 90° CCW.
    const nx = -ty;
    const ny = tx;
    // Heavy-tailed perpendicular offset: most particles stay near the line,
    // a few stray. Range roughly ±NOISE_SCENE/2 with occasional ±NOISE_SCENE.
    const r = Math.random();
    const perp = r < 0.85
      ? (Math.random() - 0.5) * NOISE_SCENE
      : (Math.random() - 0.5) * NOISE_SCENE * 2.2;
    const along = (Math.random() - 0.5) * NOISE_SCENE * 0.4;
    sketchPositions[i * 3 + 0] = p.x + nx * perp + tx * along;
    sketchPositions[i * 3 + 1] = p.y + ny * perp + ty * along;
    sketchPositions[i * 3 + 2] = (Math.random() - 0.5) * NOISE_SCENE * 0.5;
  }
  const sketchColors = new Float32Array(particleCount * 3);
  fillSolid(sketchColors, hex('#FFFFFF'), 0.65);

  const sketch: StageData = {
    positions: sketchPositions,
    colors: sketchColors,
    holdDrift: 1.0, // gentle sketchy breathing while held
  };
  const refined: StageData = {
    positions: refinedPositions,
    colors: refinedColors,
    holdDrift: 0.0, // sharp, static while held
  };

  return { sketch, refined };
}
