import type * as THREE from 'three';

type Point = { x: number; y: number };

/**
 * Load an SVG and return its ShapePaths. Browser-only — uses fetch/DOMParser
 * via SVGLoader. Must be called from a client component, after the import
 * resolves.
 */
export async function loadSvgPaths(url: string) {
  const { SVGLoader } = await import('three/examples/jsm/loaders/SVGLoader.js');
  const loader = new SVGLoader();
  return new Promise<ReturnType<typeof loader.parse>['paths']>((resolve, reject) => {
    loader.load(
      url,
      (data) => resolve(data.paths),
      undefined,
      (err) => reject(err),
    );
  });
}

/**
 * Walk every subPath in every ShapePath, weight samples by curve length, and
 * return a flat array of points along all outlines. Total point count will
 * match `totalSamples` (within rounding).
 */
export function sampleOutlinePoints(
  paths: Awaited<ReturnType<typeof loadSvgPaths>>,
  totalSamples: number,
): Point[] {
  type Curve = { curve: THREE.Path; length: number };
  const curves: Curve[] = [];
  let totalLength = 0;

  for (const path of paths) {
    for (const subPath of path.subPaths) {
      // Skip degenerate sub-paths (single MoveTo with no curve segments).
      const length = subPath.getLength();
      if (length <= 0 || !Number.isFinite(length)) continue;
      curves.push({ curve: subPath, length });
      totalLength += length;
    }
  }

  if (totalLength === 0 || curves.length === 0) return [];

  const result: Point[] = [];
  let allocated = 0;
  for (let i = 0; i < curves.length; i++) {
    const { curve, length } = curves[i];
    const isLast = i === curves.length - 1;
    const samples = isLast
      ? Math.max(2, totalSamples - allocated)
      : Math.max(2, Math.round((length / totalLength) * totalSamples));
    allocated += samples;
    // getSpacedPoints(divisions) returns divisions+1 points, evenly spaced
    // along the path length. We want exactly `samples` points.
    const pts = curve.getSpacedPoints(samples - 1);
    for (const p of pts) {
      result.push({ x: p.x, y: p.y });
    }
  }

  // Truncate / pad to exactly totalSamples in case rounding drifted.
  if (result.length > totalSamples) {
    result.length = totalSamples;
  } else {
    while (result.length < totalSamples) {
      result.push(result[result.length % Math.max(1, result.length)]);
    }
  }
  return result;
}

/**
 * Centre points around origin, flip Y (SVG is Y-down, Three.js is Y-up), and
 * scale to the requested target height. Preserves aspect ratio.
 */
export function normalizePoints(points: Point[], targetHeight: number): Point[] {
  if (points.length === 0) return points;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const h = Math.max(maxY - minY, 1e-6);
  const scale = targetHeight / h;
  return points.map((p) => ({
    x: (p.x - cx) * scale,
    y: -(p.y - cy) * scale,
  }));
}
