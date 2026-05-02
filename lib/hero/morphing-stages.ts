import { loadSvgPaths, normalizePoints, sampleOutlinePoints } from './svg-sampler';

export type StageData = {
  /** Float32Array of length particleCount * 3 — xyz triplets. */
  positions: Float32Array;
  /** Float32Array of length particleCount * 3 — rgb triplets in 0..1. */
  colors: Float32Array;
};

const SCENE_HEIGHT = 3.6;

/** Hex like '#FFAABB' → [r, g, b] floats in 0..1. */
function hex(c: string): [number, number, number] {
  const v = parseInt(c.replace('#', ''), 16);
  return [((v >> 16) & 0xff) / 255, ((v >> 8) & 0xff) / 255, (v & 0xff) / 255];
}

function fillSolid(arr: Float32Array, rgb: [number, number, number]) {
  for (let i = 0; i < arr.length; i += 3) {
    arr[i] = rgb[0];
    arr[i + 1] = rgb[1];
    arr[i + 2] = rgb[2];
  }
}

/**
 * Phase 2: only stages 1 (sketch) and 2 (refined emblem) are implemented.
 * Both share the same particle count and ordering, so a particle at index N
 * morphs from its sketch-position to its refined-position 1:1.
 */
export async function buildGorillaStages(svgUrl: string, particleCount: number) {
  const paths = await loadSvgPaths(svgUrl);
  const raw = sampleOutlinePoints(paths, particleCount);
  const clean = normalizePoints(raw, SCENE_HEIGHT);

  // ---- Stage 2 — refined emblem (clean silhouette) ----
  const refinedPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const p = clean[i] ?? clean[clean.length - 1];
    refinedPositions[i * 3 + 0] = p.x;
    refinedPositions[i * 3 + 1] = p.y;
    refinedPositions[i * 3 + 2] = 0;
  }
  const refinedColors = new Float32Array(particleCount * 3);
  fillSolid(refinedColors, hex('#E8DDFF')); // cool violet-white
  // Dust ~12% of the particles with rocket-orange so the emblem reads as a
  // brand mark rather than a generic white silhouette.
  const accent = hex('#FF7A33');
  for (let i = 0; i < particleCount; i++) {
    if ((i * 7919) % 100 < 12) {
      refinedColors[i * 3 + 0] = accent[0];
      refinedColors[i * 3 + 1] = accent[1];
      refinedColors[i * 3 + 2] = accent[2];
    }
  }

  // ---- Stage 1 — sketch (loose, gestural) ----
  // Same point ordering as refined, with random perpendicular jitter so the
  // outline reads as drawn-by-hand rather than vector-precise. Tangent is
  // estimated from neighbouring samples; across sub-path boundaries the
  // tangent estimate drifts slightly which only adds to the sketchy feel.
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
    // Heavy-tailed offset: most particles stay near the line, a few stray.
    const r = Math.random();
    const heavy = r < 0.85 ? (Math.random() - 0.5) * 0.18 : (Math.random() - 0.5) * 0.42;
    const along = (Math.random() - 0.5) * 0.08;
    sketchPositions[i * 3 + 0] = p.x + nx * heavy + tx * along;
    sketchPositions[i * 3 + 1] = p.y + ny * heavy + ty * along;
    sketchPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  const sketchColors = new Float32Array(particleCount * 3);
  fillSolid(sketchColors, hex('#FFE0B0')); // warm graphite-on-paper

  const sketch: StageData = { positions: sketchPositions, colors: sketchColors };
  const refined: StageData = { positions: refinedPositions, colors: refinedColors };

  return { sketch, refined };
}
